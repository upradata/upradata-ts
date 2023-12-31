export default ApiClient;
/**
 * @module ApiClient
 * @version 3.0.78
 */
/**
 * Manages low level client-server communications, parameter marshalling, etc. There should not be any need for an
 * application to use this class directly - the *Api and model classes provide the public API for the service. The
 * contents of this file should be regarded as internal but are documented for completeness.
 * @alias module:ApiClient
 * @class
 */
// declare function F(): this;
declare class ApiClient {
    /**
     * The base URL against which to resolve every API call's (relative) path.
     * @type {String}
     * @default https://server.api.mailchimp.com/3.0
     */
    basePath: string;
    /**
     * The API configuration settings object
     * @type {Config}
     * @default {}
     */
    config: Config;
    /**
     * The default HTTP headers to be included for all API calls.
     * @type {Array.<String>}
     * @default {}
     */
    defaultHeaders: Array<string>;
    /**
     * The default HTTP timeout for all API calls.
     * @type {Number}
     * @default 60000
     */
    timeout: number;
    /**
     * If set to false an additional timestamp parameter is added to all API GET calls to
     * prevent browser caching
     * @type {Boolean}
     * @default true
     */
    cache: boolean;
    /**
     * If set to true, the client will save the cookies from each server
     * response, and return them in the next request.
     * @default false
     */
    enableCookies: boolean;
    agent: any;
    /**
   * The default API client implementation.
   * @type {AccountExport}
   */
    accountExport: AccountExport;
    /**
   * The default API client implementation.
   * @type {AccountExports}
   */
    accountExports: AccountExports;
    /**
   * The default API client implementation.
   * @type {ActivityFeed}
   */
    activityFeed: ActivityFeed;
    /**
   * The default API client implementation.
   * @type {AuthorizedApps}
   */
    authorizedApps: AuthorizedApps;
    /**
   * The default API client implementation.
   * @type {Automations}
   */
    automations: Automations;
    /**
   * The default API client implementation.
   * @type {BatchWebhooks}
   */
    batchWebhooks: BatchWebhooks;
    /**
   * The default API client implementation.
   * @type {Batches}
   */
    batches: Batches;
    /**
   * The default API client implementation.
   * @type {CampaignFolders}
   */
    campaignFolders: CampaignFolders;
    /**
   * The default API client implementation.
   * @type {Campaigns}
   */
    campaigns: Campaigns;
    /**
   * The default API client implementation.
   * @type {PinConnectedSitesg}
   */
    connectedSites: PinConnectedSitesg;
    /**
   * The default API client implementation.
   * @type {Conversations}
   */
    conversations: Conversations;
    /**
   * The default API client implementation.
   * @type {CustomerJourneys}
   */
    customerJourneys: CustomerJourneys;
    /**
   * The default API client implementation.
   * @type {Ecommerce}
   */
    ecommerce: Ecommerce;
    /**
   * The default API client implementation.
   * @type {FacebookAds}
   */
    facebookAds: FacebookAds;
    /**
   * The default API client implementation.
   * @type {FileManager}
   */
    fileManager: FileManager;
    /**
   * The default API client implementation.
   * @type {LandingPages}
   */
    landingPages: LandingPages;
    /**
   * The default API client implementation.
   * @type {Lists}
   */
    lists: Lists;
    /**
    * The default API client implementation.
    * @type {Ping}
    */
    ping: Ping;
    /**
   * The default API client implementation.
   * @type {Reporting}
   */
    reporting: Reporting;
    /**
   * The default API client implementation.
   * @type {Reports}
   */
    reports: Reports;
    /**
   * The default API client implementation.
   * @type {Root}
   */
    root: Root;
    /**
   * The default API client implementation.
   * @type {SearchCampaigns}
   */
    searchCampaigns: SearchCampaigns;
    /**
   * The default API client implementation.
   * @type {SearchMembers}
   */
    searchMembers: SearchMembers;
    /**
   * The default API client implementation.
   * @type {Surveys}
   */
    Surveys: Surveys;
    /**
   * The default API client implementation.
   * @type {TemplateFolders}
   */
    templateFolders: TemplateFolders;
    /**
   * The default API client implementation.
   * @type {Templates}
   */
    templates: Templates;
    /**
   * The default API client implementation.
   * @type {VerifiedDomains}
   */
    verifiedDomains: VerifiedDomains;
    /**
     * Sets the API configuration settings object.
     * @param config {Config} The configuration object
     */
    setConfig(config?: Config): void;
    /**
     * Returns a string representation for an actual parameter.
     * @param param The actual parameter.
     * @returns {String} The string representation of <code>param</code>.
     */
    paramToString(param: any): string;
    /**
     * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
     * NOTE: query parameters are not handled here.
     * @param {String} path The path to append to the base URL.
     * @param {Object} pathParams The parameter values to append.
     * @returns {String} The encoded path with parameter values substituted.
     */
    buildUrl(path: string, pathParams: any): string;
    /**
     * Checks whether the given content type represents JSON.<br>
     * JSON content type examples:<br>
     * <ul>
     * <li>application/json</li>
     * <li>application/json; charset=UTF8</li>
     * <li>APPLICATION/JSON</li>
     * </ul>
     * @param {String} contentType The MIME content type to check.
     * @returns {Boolean} <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
     */
    isJsonMime(contentType: string): boolean;
    /**
     * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
     * @param {Array.<String>} contentTypes
     * @returns {String} The chosen content type, preferring JSON.
     */
    jsonPreferredMime(contentTypes: Array<string>): string;
    /**
     * Checks whether the given parameter value represents file-like content.
     * @param param The parameter to check.
     * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
     */
    isFileParam(param: any): boolean;
    /**
     * Normalizes parameter values:
     * <ul>
     * <li>remove nils</li>
     * <li>keep files and arrays</li>
     * <li>format to string with `paramToString` for other cases</li>
     * </ul>
     * @param {Object.<String, Object>} params The parameters as object properties.
     * @returns {Object.<String, Object>} normalized parameters.
     */
    normalizeParams(params: any): any;
    /**
     * Builds a string representation of an array-type actual parameter, according to the given collection format.
     * @param {Array} param An array parameter.
     * @param {ApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
     * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
     * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
     */
    buildCollectionParam(param: any[], collectionFormat: ApiClient.CollectionFormatEnum): string | any[];
    /**
     * Deserializes an HTTP response body into a value of the specified type.
     * @param {Object} response A SuperAgent response object.
     * @param {(String|Array.<String>|Object.<String, Object>|Function)} returnType The type to return. Pass a string for simple types
     * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
     * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
     * all properties on <code>data<code> will be converted to this type.
     * @returns A value of the specified type.
     */
    deserialize(response: any, returnType: (string | Array<string> | any | Function)): any;
    /**
     * Invokes the REST service using the supplied settings and parameters.
     * @param {String} path The base URL to invoke.
     * @param {String} httpMethod The HTTP method to use.
     * @param {Object.<String, String>} pathParams A map of path parameters and their values.
     * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
     * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
     * @param {Object.<String, Object>} formParams A map of form parameters and their values.
     * @param {Object} bodyParam The value to pass as the request body.
     * @param {Array.<String>} authNames An array of authentication type names.
     * @param {Array.<String>} contentTypes An array of request MIME types.
     * @param {Array.<String>} accepts An array of acceptable response MIME types.
     * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the
     * constructor for a complex type.
     * @returns {Promise} A {@link https://www.promisejs.org/|Promise} object.
     */
    callApi(path: string, httpMethod: string, pathParams: any, queryParams: any, headerParams: any, formParams: any, bodyParam: any, authNames: Array<string>, contentTypes: Array<string>, accepts: Array<string>, returnType: (string | any[] | ObjectFunction)): Promise<any>;
}
declare namespace F {
    namespace CollectionFormatEnum {
        const CSV: string;
        const SSV: string;
        const TSV: string;
        const PIPES: string;
        const MULTI: string;
    }
    /**
     * *
     */
    type CollectionFormatEnum = string;
    /**
     * Parses an ISO-8601 string representation of a date value.
     * @param {String} str The date value as a string.
     * @returns {Date} The parsed date object.
     */
    function parseDate(str: string): Date;
    /**
     * Converts a value to the specified type.
     * @param {(String|Object)} data The data to convert, as a string or object.
     * @param {(String|Array.<String>|Object.<String, Object>|Function)} type The type to return. Pass a string for simple types
     * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
     * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
     * all properties on <code>data<code> will be converted to this type.
     * @returns An instance of the specified type or null or undefined if data is null or undefined.
     */
    function convertToType(data: any, type: any): any;
    /**
     * Constructs a new map or array model from REST data.
     * @param data {Object|Array} The REST data.
     * @param obj {Object|Array} The target object or array.
     */
    function constructFromObject(data: any, obj: any, itemType: any): void;
    const instance: F;
}
import { Config } from "./types";
import AccountExport from "./api/AccountExportApi";
import AccountExports from "./api/AccountExportsApi";
import ActivityFeed from "./api/ActivityFeedApi";
import AuthorizedApps from "./api/AuthorizedAppsApi";
import Automations from "./api/AutomationsApi";
import BatchWebhooks from "./api/BatchWebhooksApi";
import Batches from "./api/BatchesApi";
import CampaignFolders from "./api/CampaignFoldersApi";
import Campaigns from "./api/CampaignsApi";
import Conversations from "./api/ConversationsApi";
import CustomerJourneys from "./api/CustomerJourneysApi";
import Ecommerce from "./api/EcommerceApi";
import FacebookAds from "./api/FacebookAdsApi";
import FileManager from "./api/FileManagerApi";
import LandingPages from "./api/LandingPagesApi";
import Lists from "./api/ListsApi";
import Ping from "./api/PingApi";
import Reporting from "./api/ReportingApi";
import Reports from "./api/ReportsApi";
import Root from "./api/RootApi";
import SearchCampaigns from "./api/SearchCampaignsApi";
import SearchMembers from "./api/SearchMembersApi";
import Surveys from "./api/SurveysApi";
import TemplateFolders from "./api/TemplateFoldersApi";
import Templates from "./api/TemplatesApi";
import VerifiedDomains from "./api/VerifiedDomainsApi";
