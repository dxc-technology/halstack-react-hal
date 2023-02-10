export type ErrorResponse = {
  status: number;
  message: string;
  toString: () => string;
  body: object;
};

export type UseHalResource = {
  /**
   * The URL of the resource.
   */
  url: string;
  /**
   * Contains the HTTP headers to be sent along with the HTTP requests to the URL indicated in the url prop.
   */
  headers?: object;
  /**
   * Async function that will be executed right before every HTTP request in order to retrieve dynamic headers.
   * It must return a promise that resolves into an object with the keys and values of the headers.
   * These headers will be merged with the ones indicated in the headers prop.
   */
  asyncHeadersHandler?: () => Promise<object>;
};

export type RequestStatus = "idle" | "fetching" | "resolved" | "rejected" | "interaction";

/**
 * Array with the following stateful variables.
 *    - resource: HalResource
 *    - requestStatus: 'idle' | 'fetching' | 'resolved' | 'rejected' | 'interaction'
 *    - requestError: string
 *    - resourceInteractions: Object
 */
export type UseHalResourceResponse = [any, RequestStatus, ErrorResponse, object];
