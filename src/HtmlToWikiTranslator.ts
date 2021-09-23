import axios, { AxiosResponse } from 'axios';
import { WikiTranslator } from './interfaces/WikiTranslator';

export default class HtmlToWikiTranslator implements WikiTranslator {
  private html: string;

  private static endpoint = 'https://www.mediawiki.org/api/rest_v1/transform/html/to/wikitext';

  constructor(html: string) {
    this.html = html;
  }

  async translate(): Promise<string> {
    const response: AxiosResponse<string> = await axios({
      method: 'POST',
      url: HtmlToWikiTranslator.endpoint,
      data: { html: this.getHtml() },
    });
    return response.data;
  }

  private getHtml(): string {
    return this.html;
  }
}
