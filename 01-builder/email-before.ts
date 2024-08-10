function sendEmail(content: string, email: string) {
  console.log(`Sending email to ${email} with content: ${content}`);
}

function sendEmail1(email: string) {
  const content = `
  <html>
    <header>
      <title>Email 1</title>
    </header>
    <body>
      Content 1
    </body>
    <footer>
      default footer
    </footer>
  </html>
  `;

  sendEmail(content, email);
}

function sendEmail2(email: string) {
  const content = `
  <html>
    <header>
      <title>Email 1</title>
    </header>
    <body>
      Content 1
    </body>
    <footer>
      default footer
    </footer>
  </html>
  `;

  sendEmail(content, email);
}

sendEmail1('k@g.c');

// Imagine more than fives functions like theses. With styles, headers and footers equals.