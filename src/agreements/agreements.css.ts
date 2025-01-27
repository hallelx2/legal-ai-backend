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
    --code-background: #f3f4f6;
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

  /* Agreement Container */
  .agreement-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
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

  /* Section Styling with Markdown Support */
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

  /* Markdown Content Styling */
  .section-content {
    font-size: 14px;
    line-height: 1.8;
  }

  /* Typography for Markdown */
  .section-content h1,
  .section-content h2,
  .section-content h3,
  .section-content h4,
  .section-content h5,
  .section-content h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
    color: var(--text-color);
  }

  .section-content h1 { font-size: 1.8em; }
  .section-content h2 { font-size: 1.6em; }
  .section-content h3 { font-size: 1.4em; }
  .section-content h4 { font-size: 1.2em; }
  .section-content h5 { font-size: 1.1em; }
  .section-content h6 { font-size: 1em; }

  .section-content p {
    margin-bottom: 1em;
  }

  /* Lists in Markdown */
  .section-content ul,
  .section-content ol {
    margin-left: 1.5em;
    margin-bottom: 1em;
    padding-left: 1em;
  }

  .section-content li {
    margin-bottom: 0.5em;
  }

  /* Code Blocks in Markdown */
  .section-content pre,
  .section-content code {
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    background-color: var(--code-background);
    border-radius: 4px;
  }

  .section-content code {
    padding: 0.2em 0.4em;
    font-size: 0.9em;
  }

  .section-content pre {
    padding: 1em;
    margin: 1em 0;
    overflow-x: auto;
  }

  .section-content pre code {
    padding: 0;
    background: none;
  }

  /* Blockquotes in Markdown */
  .section-content blockquote {
    margin: 1em 0;
    padding-left: 1em;
    border-left: 4px solid var(--border-color);
    color: #6b7280;
  }

  /* Links in Markdown */
  .section-content a {
    color: var(--primary-color);
    text-decoration: none;
  }

  .section-content a:hover {
    text-decoration: underline;
  }

  /* Tables in Markdown */
  .section-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
  }

  .section-content th,
  .section-content td {
    padding: 12px;
    border: 1px solid var(--border-color);
    text-align: left;
  }

  .section-content th {
    background-color: var(--code-background);
    font-weight: 500;
  }

  /* Horizontal Rule in Markdown */
  .section-content hr {
    margin: 2em 0;
    border: none;
    border-top: 1px solid var(--border-color);
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

  /* Print Optimization */
  @media print {
    body {
      padding: 20px;
    }

    .section {
      break-inside: avoid;
    }

    .signature-section {
      break-before: auto;
      margin-top: 40px;
    }

    @page {
      margin: 2cm;
    }
  }
</style>
`;
