import axios, { AxiosInstance } from 'axios';
import { ServerResponse } from 'bungie-api-ts/common';
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
  getContentType,
  getContentById,
  getContentByTagAndType,
  searchContentWithText,
  searchContentByTagAndType,
  SearchContentByTagAndTypeParams,
  searchHelpArticles,
} from 'bungie-api-ts/content';
import ConfigService from './ConfigService.js';
import { BungieContentAPI } from './interfaces/BungieContentAPI';

export default class BungieContentAPIController implements BungieContentAPI {
  /**
   * httprequest client
   */
  private client: AxiosInstance;

  /**
   * singleton pattern instance
   */
  private static instance: BungieContentAPIController;

  private constructor() {
    this.client = axios.create({
      // baseURL: this.BUNGIE,
      headers: {
        'x-api-key': ConfigService.getConfig().bungieApiKey,
        'User-Agent': 'D2UpdateParser',
      },
    });
  }

  getContentType(
    params: GetContentTypeParams,
  ): Promise<ServerResponse<ContentTypeDescription>> {
    return getContentType(this.$http.bind(this), params);
  }

  getContentById(
    params: GetContentByIdParams,
  ): Promise<ServerResponse<ContentItemPublicContract>> {
    return getContentById(this.$http.bind(this), params);
  }

  getContentByTagAndType(
    params: GetContentByTagAndTypeParams,
  ): Promise<ServerResponse<ContentItemPublicContract>> {
    return getContentByTagAndType(this.$http.bind(this), params);
  }

  searchContentWithText(
    params: SearchContentWithTextParams,
  ): Promise<ServerResponse<SearchResultOfContentItemPublicContract>> {
    return searchContentWithText(this.$http.bind(this), params);
  }

  searchContentByTagAndType(
    params: SearchContentByTagAndTypeParams,
  ): Promise<ServerResponse<SearchResultOfContentItemPublicContract>> {
    return searchContentByTagAndType(this.$http.bind(this), params);
  }

  searchHelpArticles(
    params: SearchHelpArticlesParams,
  ): Promise<ServerResponse<object>> {
    return searchHelpArticles(this.$http.bind(this), params);
  }

  /** Http Client */
  private async $http(config: HttpClientConfig) {
    const client = this.getClient();
    const axiosResponse = await client.request({
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.body,
    });
    return axiosResponse.data;
  }

  /**
   * @returns instance of API Controller
   */
  public static getInstance(): BungieContentAPIController {
    if (!BungieContentAPIController.instance) {
      BungieContentAPIController.instance = new BungieContentAPIController();
    }

    return BungieContentAPIController.instance;
  }

  private getClient(): AxiosInstance {
    return this.client;
  }
}
