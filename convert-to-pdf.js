const fs = require('fs');
const puppeteer = require('puppeteer');

async function convertMarkdownToPDF() {
  try {
    // Read the markdown file
    const markdownContent = fs.readFileSync('COACH_MANUAL.md', 'utf8');
    
    // Convert markdown to HTML (simple conversion)
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Lineup Builder - Coach Manual</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        h1 {
          color: #2563eb;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 10px;
        }
        h2 {
          color: #1e40af;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        h3 {
          color: #1e40af;
          margin-top: 25px;
          margin-bottom: 10px;
        }
        code {
          background-color: #f3f4f6;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', monospace;
        }
        pre {
          background-color: #f3f4f6;
          padding: 15px;
          border-radius: 5px;
          overflow-x: auto;
        }
        blockquote {
          border-left: 4px solid #2563eb;
          margin: 0;
          padding-left: 20px;
          color: #6b7280;
        }
        ul, ol {
          margin-bottom: 15px;
        }
        li {
          margin-bottom: 5px;
        }
        strong {
          color: #1f2937;
        }
        em {
          color: #6b7280;
        }
        hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 30px 0;
        }
        .emoji {
          font-size: 1.2em;
        }
      </style>
    </head>
    <body>
      ${markdownContent
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/`(.*?)`/gim, '<code>$1</code>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/^(\d+)\. (.*$)/gim, '<li>$1. $2</li>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/^(?!<[h|l])/gim, '<p>')
        .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
        .replace(/<\/ul>\s*<ul>/gim, '')
        .replace(/---/gim, '<hr>')
        .replace(/⚾/gim, '<span class="emoji">⚾</span>')
        .replace(/🏠/gim, '<span class="emoji">🏠</span>')
        .replace(/👥/gim, '<span class="emoji">👥</span>')
        .replace(/🎯/gim, '<span class="emoji">🎯</span>')
        .replace(/🏆/gim, '<span class="emoji">🏆</span>')
        .replace(/🥎/gim, '<span class="emoji">🥎</span>')
        .replace(/<\/p><p><\/p>/gim, '')
        .replace(/<p><\/p>/gim, '')
        .replace(/<p>(<h[1-6]>)/gim, '$1')
        .replace(/(<\/h[1-6]>)<\/p>/gim, '$1')
        .replace(/<p>(<ul>)/gim, '$1')
        .replace(/(<\/ul>)<\/p>/gim, '$1')
        .replace(/<p>(<li>)/gim, '$1')
        .replace(/(<\/li>)<\/p>/gim, '$1')
        .replace(/<p>(<hr>)/gim, '$1')
        .replace(/(<\/hr>)<\/p>/gim, '$1')
        .replace(/<p>(<code>)/gim, '$1')
        .replace(/(<\/code>)<\/p>/gim, '$1')
        .replace(/<p>(<strong>)/gim, '$1')
        .replace(/(<\/strong>)<\/p>/gim, '$1')
        .replace(/<p>(<em>)/gim, '$1')
        .replace(/(<\/em>)<\/p>/gim, '$1')
      }
    </body>
    </html>
    `;
    
    // Launch browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set content and generate PDF
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    // Save PDF
    fs.writeFileSync('COACH_MANUAL.pdf', pdf);
    
    await browser.close();
    
    console.log('✅ PDF created successfully: COACH_MANUAL.pdf');
    
  } catch (error) {
    console.error('❌ Error creating PDF:', error);
  }
}

convertMarkdownToPDF();
