import { WikiTranslator } from './interfaces/WikiTranslator';

export default class HtmlToWikiTranslator implements WikiTranslator {
  private html: string;

  constructor(html: string) {
    this.html = html;
  }

  translate(): string {
    return this.getHtml();
  }

  private getHtml(): string {
    return this.html;
  }
}