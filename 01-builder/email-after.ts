class HTMLAsTextBuilder {
  private html: string = '';
  private title: string = '';
  private header: string = '';
  private body: string = '';
  private footer: string = '';

  private get defaultFooter(): string {
    return `<footer>default footer</footer>`;
  }

  setTitle(title: string): HTMLAsTextBuilder {
    this.title = title;
    return this.setHeader();
  }

  private setHeader(): HTMLAsTextBuilder {
    this.header = `<header><title>${this.title}</title></header>`;
    return this;
  }

  addBody(content: string): HTMLAsTextBuilder {
    this.body += content;
    return this;
  }

  setFooter(footer: string): HTMLAsTextBuilder {
    this.footer = `<footer>${footer}</footer>`;
    return this;
  }

  setDefaultFooter(): HTMLAsTextBuilder {
    this.footer = this.defaultFooter;
    return this;
  }

  build(): string {
    this.html += '<html>'+this.header+`<body>${this.body}</body>`+this.footer+'</html>';
    return this.html;
  }
}

function sendEmail(content: string, email: string) {
  console.log(`Sending email to ${email} with content: ${content}`);
}

function sendEmail1(email: string) {
  const content = new HTMLAsTextBuilder()
    .setTitle('Email 1')
    .addBody('Content 1')
    .addBody('\nContent 1.1')
    .setDefaultFooter()
    .build();

  sendEmail(content, email);
}

function sendEmail2(email: string) {
  const content = new HTMLAsTextBuilder()
    .setTitle('Email 2')
    .addBody('Content 2')
    .setFooter('Custom footer')
    .build();

  sendEmail(content, email);
}

sendEmail1('k@g.c');