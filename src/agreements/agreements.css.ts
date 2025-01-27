export const agreementCss = `
 <style>
    /* Modern, Professional Typography */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    :root {
      --primary-color: #2563eb;
      --text-color: #1f2937;
      --border-color: #e5e7eb;
      --background-color: #ffffff;
      --section-background: #f9fafb;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: var(--text-color);
      background: var(--background-color);
      font-size: 14px;
      padding: 40px;
    }

    /* Header Styling */
    .agreement-header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--border-color);
    }

    .agreement-header h1 {
      font-size: 28px;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 10px;
    }

    .agreement-meta {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #6b7280;
      margin-top: 20px;
    }

    /* Section Styling */
    .section {
      margin-bottom: 30px;
      padding: 25px;
      background: var(--section-background);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .section h2 {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-color);
    }

    .section-content {
      font-size: 14px;
      line-height: 1.8;
    }

    .section-content p {
      margin-bottom: 15px;
    }

    /* List Styling */
    .section-content ul, .section-content ol {
      margin-left: 20px;
      margin-bottom: 15px;
    }

    .section-content li {
      margin-bottom: 8px;
    }

    /* Table Styling */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    th, td {
      padding: 12px;
      border: 1px solid var(--border-color);
      text-align: left;
    }

    th {
      background-color: #f3f4f6;
      font-weight: 500;
    }

    /* Signature Section */
    .signature-section {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid var(--border-color);
    }

    .signature-container {
      position: relative;
      margin-top: 30px;
      padding: 20px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
    }

    .signature-line {
      width: 200px;
      height: 1px;
      background-color: var(--text-color);
      margin: 10px 0;
    }

    .signature-details {
      font-size: 12px;
      color: #6b7280;
    }

    /* Footer */
    .document-footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }

    /* Page Numbers */
    @page {
      @bottom-center {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 10px;
        color: #6b7280;
      }
    }

    /* Print Optimization */
    @media print {
      body {
        padding: 20px;
      }

      .section {
        break-inside: avoid;
      }

      .signature-section {
        break-before: always;
      }
    }
  </style>
`;
