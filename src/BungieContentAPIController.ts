import axios, { AxiosInstance } from "axios";
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
import { BungieContentAPI } from "./interfaces/BungieContentAPI";

export default class BungieContentAPIController implements BungieContentAPI {
  private BUNGIE = 'https://www.bungie.net/Platform';

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
      baseURL: this.BUNGIE,
      headers: {
        'x-api-key': ConfigService.getConfig().bungieApiKey,
        'User-Agent': 'D2UpdateParser',
      },
    });
  }

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

    return this.$http<SearchResultOfContentItemPublicContract>(config);
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

  private async $http<T>(config: HttpClientConfig): Promise<ServerResponse<T>> {
    const {
      method,
      url,
      params,
    } = config;
    return this.getClient()
      .request({ method, url, params })
      .then((axiosResponse) => axiosResponse.data as ServerResponse<T>);
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
