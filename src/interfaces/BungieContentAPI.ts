import { ContentTypeDescription } from 'bungie-api-ts/content';
import {
  ContentItemPublicContract,
  GetContentByIdParams,
  GetContentByTagAndTypeParams,
  GetContentTypeParams,
  SearchContentWithTextParams,
  SearchHelpArticlesParams,
  SearchResultOfContentItemPublicContract,
  ServerResponse,
} from 'bungie-api-ts/content';

export interface BungieContentAPI {
  getContentType(
    params: GetContentTypeParams
  ): Promise<ServerResponse<ContentTypeDescription>>;

  getContentById(
    params: GetContentByIdParams
  ): Promise<ServerResponse<ContentItemPublicContract>>

  getContentByTagAndType(
    params: GetContentByTagAndTypeParams
  ): Promise<ServerResponse<ContentItemPublicContract>>

  searchContentWithText(
    params: SearchContentWithTextParams
  ): Promise<ServerResponse<SearchResultOfContentItemPublicContract>>

  searchContentByTagAndType(
    params: SearchContentWithTextParams
  ): Promise<ServerResponse<SearchResultOfContentItemPublicContract>>

  searchHelpArticles(
    params: SearchHelpArticlesParams
  ): Promise<ServerResponse<object>>
}
