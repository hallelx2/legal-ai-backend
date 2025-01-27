import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { btoa, atob } from 'buffer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthToken } from './auth-token-schema';
import { CodeDto } from './docusign.controller';
import { AgreementsService } from 'src/agreements/agreements.service';
import * as docusign from 'docusign-esign';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Agreement } from 'src/agreements/schemas/agreement.schemas';

@Injectable()
export class DocusignService {
  constructor(
    @InjectModel(AuthToken.name)
    private authTokenModel: Model<AuthToken>,
    private agreementService: AgreementsService,
  ) {}

  private readonly CLIENT_ID = process.env.DOCUSIGN_CLIENT_ID;
  private readonly CLIENT_SECRET = process.env.DOCUSIGN_CLIENT_SECRET;
  private readonly REDIRECT_URI = process.env.DOCUSIGN_REDIRECT_URI;
  private readonly AUTH_SERVER = 'demo.docusign.net';

  private readonly logger = new Logger(DocusignService.name);

  async createToken(CodeDto: CodeDto) {
    const authorization = btoa(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`);
    try {
      const response = await fetch(
        `https://account-d.docusign.com/oauth/token`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authorization}`,
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            code: CodeDto.code,
          }),
        },
      );
      console.log(response);

      if (!response.ok) {
        throw new Error('code expired');
      }
      const data = await response.json();
      return await this.saveTokens(
        CodeDto.user_id,
        data.access_token,
        data.refresh_token,
        data.expires_in,
      );
    } catch (error) {
      throw new Error(error);
      console.log(error);
    }
  }

  async saveTokens(
    userId: string,
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
  ): Promise<AuthToken> {
    // Remove existing tokens for the user
    console.log(userId, accessToken, refreshToken);

    await this.authTokenModel.deleteMany({ userId });

    // Create new token entry
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const tokenEntry = new this.authTokenModel({
      userId,
      accessToken,
      refreshToken,
      expiresAt,
    });

    return tokenEntry.save();
  }

  async refreshAccessToken(CodeDto: CodeDto): Promise<AuthToken | null> {
    const existingToken = await this.authTokenModel.findOne({
      refreshToken: CodeDto.code,
    });

    if (!existingToken) {
      return null;
    }

    // Here you would typically call your authentication provider's token refresh endpoint
    // This is a placeholder for that logic
    const data = await this.fetchNewTokensFromProvider(CodeDto.code);
    if (!data) return null;
    return this.saveTokens(
      CodeDto.user_id,
      data.access_token,
      data.refresh_token,
      data.expires_in,
    );
  }

  private async fetchNewTokensFromProvider(refreshToken: string) {
    // Implement actual token refresh logic with your authentication provider
    // This is where you'd make an HTTP request to get new tokens
    // Returns an object with { accessToken, refreshToken, expiresIn }
    const authorization = btoa(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`);
    console.log('Authorization: ', authorization);
    try {
      const response = await fetch(
        `https://account-d.docusign.com/oauth/token`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authorization}`,
          },
          body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          }),
        },
      );
      if (!response.ok) {
        throw new Error('');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getActiveTokenForUser(userId: string): Promise<AuthToken | null> {
    try {
      const activeToken = await this.authTokenModel.findOne({
        userId,
        expiresAt: { $gt: new Date() },
      });

      if (!activeToken) {
        const existingToken = await this.authTokenModel.findOne({ userId });
        const newToken = await this.refreshAccessToken({
          code: existingToken.refreshToken,
          user_id: existingToken.userId,
        });
        return newToken;
      }
      return await activeToken;
    } catch (error) {
      return null;
    }
  }
  async sendAgreementForSignature(userId: string, agreementId: string) {
    this.logger.log(
      `Starting agreement signature process for Agreement ID: ${agreementId}, User ID: ${userId}`,
    );

    try {
      // Step 1: Get and validate agreement
      let agreement: Agreement;
      try {
        agreement =
          await this.agreementService.findAgreementByUserIdAndAgreementId(
            userId,
            agreementId,
          );
        if (!agreement) {
          this.logger.error(
            `Agreement not found - ID: ${agreementId}, User ID: ${userId}`,
          );
          throw new NotFoundException('Agreement not found');
        }
        this.logger.debug(`Agreement found successfully: ${agreement.name}`);
      } catch (error) {
        this.logger.error(
          `Error fetching agreement: ${error.message}`,
          error.stack,
        );
        throw new BadRequestException(
          `Error fetching agreement: ${error.message}`,
        );
      }

      // Step 2: Get and validate DocuSign token
      let token: AuthToken;
      try {
        token = await this.getActiveTokenForUser(userId);
        if (!token) {
          this.logger.error(`DocuSign token not found for User ID: ${userId}`);

          throw new BadRequestException('User not connected to DocuSign');
        }
        console.log(token);
        this.logger.debug(
          `DocuSign token retrieved successfully for user ${userId}`,
        );
      } catch (error) {
        this.logger.error(
          `Error getting DocuSign token: ${error.message}`,
          error.stack,
        );
        throw new BadRequestException(
          `DocuSign authentication error: ${error.message}`,
        );
      }

      // Step 3: Create temporary file
      const tempFilePath = path.join(
        process.cwd(),
        'temp',
        `agreement-${agreementId}.html`,
      );

      try {
        await fs.mkdir(path.dirname(tempFilePath), { recursive: true });
        await fs.writeFile(tempFilePath, agreement.htmlContent);
        this.logger.debug(
          `Temporary file created successfully at: ${tempFilePath}`,
        );
      } catch (error) {
        this.logger.error(
          `Error creating temporary file: ${error.message}`,
          error.stack,
        );
        throw new BadRequestException(
          `Failed to create temporary file: ${error.message}`,
        );
      }

      try {
        // Step 4: Initialize DocuSign API client
        let accountId: string;
        try {
          const apiClient = new docusign.ApiClient();
          apiClient.setBasePath(`https://${this.AUTH_SERVER}/restapi`);
          apiClient.addDefaultHeader(
            'Authorization',
            `Bearer ${token.accessToken}`,
          );
          console.log(token);
          console.log(apiClient);

          const userInfo = await apiClient.getUserInfo(token.accessToken);
          accountId = userInfo.accounts[0].accountId;
          this.logger.debug(
            `DocuSign API client initialized, Account ID: ${accountId}`,
          );
        } catch (error) {
          this.logger.error(
            `Error initializing DocuSign client: ${error.message}`,
            error.stack,
          );
          throw new BadRequestException(
            `DocuSign initialization error: ${error.message}`,
          );
        }

        // Step 5: Prepare envelope
        // Step 5: Prepare envelope
        let envelopeDefinition;
        try {
          const fileContent = await fs.readFile(tempFilePath);
          const documentBase64 = fileContent.toString('base64');

          // Log signer emails
          const signerEmails = agreement.signatureLocations.map(
            (location) => location.email,
          );
          this.logger.debug(`Signer emails: ${signerEmails.join(', ')}`);

          envelopeDefinition = {
            emailSubject: `Please sign: ${agreement.name}`,
            documents: [
              {
                documentBase64,
                name: agreement.name,
                fileExtension: 'html',
                documentId: '1',
              },
            ],
            recipients: {
              signers: agreement.signatureLocations.map((location, index) => {
                this.logger.debug(
                  `Adding signer: ${location.email}, Role: ${location.role}`,
                );
                return {
                  email: location.email.toString(),
                  name: location.role.toString(),
                  recipientId: (index + 1).toString(),
                  routingOrder: (index + 1).toString(),
                  tabs: {
                    signHereTabs: [
                      {
                        documentId: '1',
                        pageNumber: '2',
                        xPosition: location.x.toString(),
                        yPosition: location.y.toString(),
                      },
                    ],
                  },
                };
              }),
            },
            status: 'sent',
          };
          console.log(envelopeDefinition.recipients);
          this.logger.debug('Envelope definition created successfully');
        } catch (error) {
          this.logger.error(
            `Error preparing envelope: ${error.message}`,
            error.stack,
          );
          throw new BadRequestException(
            `Failed to prepare DocuSign envelope: ${error.message}`,
          );
        }

        const apiClient = new docusign.ApiClient();
          apiClient.setBasePath(`https://${this.AUTH_SERVER}/restapi`);
          apiClient.addDefaultHeader(
            'Authorization',
            `Bearer ${token.accessToken}`,
          );
        // Sending the Envelope
        let envelopesApi = new docusign.EnvelopesApi(apiClient);
        let results = null;

        try {
          results = await envelopesApi.createEnvelope(accountId, {
            envelopeDefinition: envelopeDefinition,
          });
        } catch (error) {
          console.error(error);
        }


        // // Step 6: Send envelope
        // let result;
        // try {
        //   const response = await fetch(
        //     `https://${this.AUTH_SERVER}/restapi/v2.1/accounts/${accountId}/envelopes`,
        //     {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${token.accessToken}`,
        //       },
        //       body: JSON.stringify({ envelopeDefinition }),
        //     },
        //   );

        //   if (!response.ok) {
        //     const errorBody = await response.text();
        //     this.logger.error(
        //       `DocuSign API error: ${response.status} ${response.statusText}`,
        //       {
        //         status: response.status,
        //         statusText: response.statusText,
        //         body: errorBody,
        //       },
        //     );
        //     throw new Error(
        //       `DocuSign API error: ${response.status} ${response.statusText} - ${errorBody}`,
        //     );
        //   }

        //   result = await response.json();
        //   this.logger.debug(
        //     `Envelope sent successfully, Envelope ID: ${result.envelopeId}`,
        //   );

        //   // Step 6.1: Retrieve and log recipient information
        //   const recipients = await this.getEnvelopeRecipients(
        //     accountId,
        //     result.envelopeId,
        //     token.accessToken,
        //   );

        //   console.log(recipients);
        //   // Log signer emails
        //   if (recipients.signers) {
        //     const signerEmails = recipients.signers.map(
        //       (signer) => signer.email,
        //     );
        //     this.logger.debug(`Signer emails: ${signerEmails.join(', ')}`);
        //   }

        //   // Log CC emails
        //   if (recipients.carbonCopies) {
        //     const ccEmails = recipients.carbonCopies.map((cc) => cc.email);
        //     this.logger.debug(`CC emails: ${ccEmails.join(', ')}`);
        //   }
        // } catch (error) {
        //   this.logger.error(
        //     `Error sending envelope: ${error.message}`,
        //     error.stack,
        //   );
        //   throw new BadRequestException(
        //     `Failed to send DocuSign envelope: ${error.message}`,
        //   );
        // }

        // Step 7: Update agreement status
        try {
          await this.agreementService.updateAgreementStatus(
            agreementId,
            'sent_for_signature',
          );
          await this.agreementService.updateDocuSignInfo(agreementId, {
            envelopeId: results.envelopeId,
            status: results.status,
          });
          this.logger.debug(`Agreement status updated successfully`);
        } catch (error) {
          this.logger.error(
            `Error updating agreement status: ${error.message}`,
            error.stack,
          );
          throw new BadRequestException(
            `Failed to update agreement status: ${error.message}`,
          );
        }

        this.logger.log(
          `Agreement signing process completed successfully for Agreement ID: ${agreementId}`,
        );
        return {
          agreementId,
          envelopeId: results.envelopeId,
          status: results.status,
        };
      } finally {
        // Clean up temp file
        try {
          await fs.unlink(tempFilePath);
          this.logger.debug(`Temporary file cleaned up successfully`);
        } catch (error) {
          this.logger.warn(
            `Failed to clean up temporary file: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Agreement signing process failed for Agreement ID: ${agreementId}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to send agreement via DocuSign: ${error.message}`,
      );
    }
  }
  private async getEnvelopeRecipients(
    accountId: string,
    envelopeId: string,
    accessToken: string,
  ): Promise<docusign.Recipients> {
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(`https://${this.AUTH_SERVER}/restapi`);
    apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);

    const envelopesApi = new docusign.EnvelopesApi(apiClient);

    try {
      const recipients = await envelopesApi.listRecipients(
        accountId,
        envelopeId,
      );
      this.logger.debug(
        `Envelope recipients retrieved successfully for envelope ${envelopeId}`,
      );
      return recipients;
    } catch (error) {
      this.logger.error(
        `Error retrieving envelope recipients: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to retrieve envelope recipients: ${error.message}`,
      );
    }
  }
}
