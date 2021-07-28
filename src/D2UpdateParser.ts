import {
  ContentItemPublicContract,
  SearchContentWithTextParams,
} from 'bungie-api-ts/content';
import BungieContentAPIController from './BungieContentAPIController';
import BungieNewsArticle from './BungieNewsArticle';
import HtmlToWikiTranslator from './HtmlToWikiTranslator';
import { BungieContentAPI } from './interfaces/BungieContentAPI';
import { WikiTranslator } from './interfaces/WikiTranslator';

const contentService: BungieContentAPI = BungieContentAPIController.getInstance();

/**
 * The Destiny 2 Update Parser turns a D2 update into a mediawiki page
 */
class D2UpdateParser {
  static main() {
    this.getNewsContent()
      .then((newsArticles) => {
        const d2PatchArticles = newsArticles.filter(this.isDestiny2Patch.bind(this));
        console.log(d2PatchArticles.map((article) => article.getTitle()));
      });
  }

  public buildWikiArticle(article: BungieNewsArticle): string {
    const markup = D2UpdateParser.getWikiMarkup(article);
    return markup;
  }

  private static getWikiMarkup(article: BungieNewsArticle): string {
    const html = article.getContent();
    const translator: WikiTranslator = new HtmlToWikiTranslator(html);
    const markup = translator.translate();
    return markup;
  }

  static async getNewsContent(): Promise<BungieNewsArticle[]> {
    let fullResults: ContentItemPublicContract[] = [];

    let pageNumber = 1;
    let hasMorePages = true;
    const maxPageDepth = 5;
    do {
      try {
        // eslint-disable-next-line no-await-in-loop
        const search = await this.searchNewsContentPage(pageNumber);
        fullResults = fullResults.concat(search.results);
        hasMorePages = search.hasMore;
      } finally {
        console.log(pageNumber);
        pageNumber += 1;
      }
    } while (hasMorePages && pageNumber <= maxPageDepth);

    return fullResults.map((article) => new BungieNewsArticle(article));
  }

  static async searchNewsContentPage(pageNumber: number) {
    const params: SearchContentWithTextParams = {
      locale: 'en',
      ctype: 'News',
      currentpage: pageNumber,
    };
    // eslint-disable-next-line no-await-in-loop
    // const serverResponse = await searchContentWithText($http, params);
    const serverResponse = await contentService.searchContentWithText(params);
    const response = serverResponse.Response;
    return response;
  }

  /**
   * @param article
   * @returns true if article is a D2 Patch Article
   */
  static isDestiny2Patch(article: BungieNewsArticle) {
    return article.getArticleBanner().includes('Update');
  }
}

D2UpdateParser.main();
