import axios from "axios";
import { ServerResponse } from "bungie-api-ts/common";
import {
  GetContentTypeParams,
  GetContentByIdParams,
  ContentItemPublicContract,
  GetContentByTagAndTypeParams,
  SearchContentWithTextParams,
  SearchResultOfContentItemPublicContract,
  SearchHelpArticlesParams,
  ContentTypeDescription,
  HttpClientConfig,
} from "bungie-api-ts/content";
import ConfigService from "./ConfigService";
import { BungieContentService } from "./interfaces/BungieContentService";

export default class BungieContentAPIController implements BungieContentService {
  private static BUNGIE = 'https://www.bungie.net/Platform';

  getContentType(
    params: GetContentTypeParams,
  ): Promise<ServerResponse<ContentTypeDescription>> {
    throw new Error("Method not implemented.");
  }

  getContentById(
    params: GetContentByIdParams,
  ): Promise<ServerResponse<ContentItemPublicContract>> {
    throw new Error("Method not implemented.");
  }

  getContentByTagAndType(
    params: GetContentByTagAndTypeParams,
  ): Promise<ServerResponse<ContentItemPublicContract>> {
    throw new Error("Method not implemented.");
  }

  searchContentWithText(
    params: SearchContentWithTextParams,
  ): Promise<ServerResponse<SearchResultOfContentItemPublicContract>> {
    const { locale } = params;
    const config: HttpClientConfig = {
      method: 'GET',
      url: `/Content/Search/${locale}/`,
      params,
    };

    return BungieContentAPIController
      .$http(config) as
        Promise<ServerResponse<SearchResultOfContentItemPublicContract>>;
  }

  searchContentByTagAndType(
    params: SearchContentWithTextParams,
  ): Promise<ServerResponse<SearchResultOfContentItemPublicContract>> {
    throw new Error("Method not implemented.");
  }

  searchHelpArticles(
    params: SearchHelpArticlesParams,
  ): Promise<ServerResponse<object>> {
    throw new Error("Method not implemented.");
  }

  private static async $http(config: HttpClientConfig): Promise<any> {
    return axios({
      method: config.method,
      url: config.url,
      headers: {
        'x-api-key': ConfigService.getConfig().bungieApiKey,
        'User-Agent': 'D2UpdateParser',
      },
      params: config.params,
      baseURL: this.BUNGIE,
    }).then((axiosResponse) => axiosResponse.data);
  }
}
