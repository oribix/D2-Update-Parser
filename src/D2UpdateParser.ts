import axios from 'axios';
import {
  ContentItemPublicContract,
  HttpClientConfig,
  SearchContentWithTextParams,
  SearchResultOfContentItemPublicContract,
  ServerResponse,
} from 'bungie-api-ts/content';
import { HttpClient } from 'bungie-api-ts/http';

function searchContentWithText(
  client: HttpClient,
  searchContentWithTextParams: SearchContentWithTextParams,
): Promise<ServerResponse<SearchResultOfContentItemPublicContract>> {
  const { locale } = searchContentWithTextParams;
  const config: HttpClientConfig = {
    method: 'GET',
    url: `https://www.bungie.net/Platform/Content/Search/${locale}/`,
    params: searchContentWithTextParams,
  };

  return client(config) as Promise<ServerResponse<SearchResultOfContentItemPublicContract>>;
}

const apiKey = '6d3d2a8abedb4c408e5d1b3df089e828';

async function $http(config: HttpClientConfig) {
  return axios({
    method: config.method,
    url: config.url,
    headers: {
      'x-api-key': apiKey,
      'User-Agent': 'D2UpdateParser',
    },
    params: config.params,
  }).then((axiosResponse) => axiosResponse.data);
}

/**
 * The Destiny 2 Update Parser turns a D2 update into a mediawiki page
 */
class D2UpdateParser {
  static main() {
    this.getNewsContent()
      .then((newsArticles) => {
        const d2PatchArticles = newsArticles.filter(
          (article) => this.isDestiny2Patch(article),
        );
        console.log(d2PatchArticles.map((article) => article.properties.Title));
      });
  }

  static async getNewsContent() {
    let fullResults: ContentItemPublicContract[] = [];

    let pageNumber = 46;
    let hasMorePages = true;
    const pageLimit = 50;
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
    } while (hasMorePages && pageNumber <= pageLimit);

    return fullResults;
  }

  static async searchNewsContentPage(pageNumber: number) {
    const params: SearchContentWithTextParams = {
      locale: 'en',
      ctype: 'News',
      currentpage: pageNumber,
    };
    // eslint-disable-next-line no-await-in-loop
    const serverResponse = await searchContentWithText($http, params);
    const response = serverResponse.Response;
    return response;
  }

  /**
   * @param article
   * @returns true if article is a D2 Patch Article
   */
  static isDestiny2Patch(article: ContentItemPublicContract) {
    return this.getArticleBanner(article).includes('Update');
  }

  /**
   * @param article
   * @returns article banner image path
   */
  static getArticleBanner(article: ContentItemPublicContract): string {
    return article.properties.ArticleBanner.toString();
  }

  /**
   * 
   * @param article 
   * @returns article html content
   */
  static getArticleContent(article: ContentItemPublicContract): string {
    return article.properties.Content.toString();
  }
}

D2UpdateParser.main();
