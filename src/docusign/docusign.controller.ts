import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DocusignService } from './docusign.service';
import { CreateDocusignDto } from './dto/create-docusign.dto';
import { UpdateDocusignDto } from './dto/update-docusign.dto';
import { AuthToken } from './auth-token-schema';

export class CodeDto{
  code :string;
  user_id:string
}

export class ConnectedDTO{
  connected:boolean
}



@Controller('docusign')
export class DocusignController {
  constructor(private readonly docusignService: DocusignService) {}

  @Post("create")
  create(@Body() body: CodeDto):Promise<AuthToken> {
    return this.docusignService.createToken(body);
  }

  @Post("refresh")
  refresh(@Body() body: CodeDto) {
    return this.docusignService.refreshAccessToken(body);
  }

  @Get('token/:id')
  async getTokenConnected(@Param('id') id: string): Promise<ConnectedDTO> {
    console.log(id)
    const token =await this.docusignService.getActiveTokenForUser(id)
    console.log(token)
    if(!token) return {connected:false}
    return {connected:true}
  }

  
}
