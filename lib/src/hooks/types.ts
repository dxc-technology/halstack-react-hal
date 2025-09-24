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

type InteractionType = Record<string, unknown> & {
  rel: string;
  href: string;
};

type OptionsProperty = {
  key: string;
  schema: Record<string, unknown>;
};

type PropertyType = {
  key: string;
  value: unknown;
};

type HalInteractionType = InteractionType & {
  getSchemaProperties: () => OptionsProperty[];
  getSchemaProperty: (key: string) => OptionsProperty | null;
  hasProperty: (property: string) => boolean;
  getRequiredProperties: () => string[];
  isPropertyRequired: (key: string) => boolean;
  addSchemaProperties: (properties: OptionsProperty[]) => void;
  addSchemaProperty: (property: OptionsProperty, schema: Record<string, unknown>) => void;
};

type HalItemType = {
  href: string;
  summary?: unknown;
  title: string;
  name: string;
};

type LinkType = Record<string, unknown> & {
  rel: string;
};

type HalPropertyType = PropertyType & {
  isRequired: () => boolean;
  getSchema: () => OptionsProperty | null;
  existsInInteraction: (rel: string) => boolean;
};

type ItemType = Record<string, unknown> & {
  href: string;
};

type OptionsType = {
  links: InteractionType[];
  properties?: OptionsProperty[];
  title: string;
  required?: string[];
};

export type HalResourceType = {
  resourceRepresentation?: unknown;
  getTitle: () => string;
  getInteractions: () => HalInteractionType[];
  getInteraction: (rel: string) => HalInteractionType;
  getItems: () => HalItemType[];
  getItem: (index: number) => HalItemType | null;
  getLinks: () => LinkType[];
  getLink: (rel: string) => LinkType | null;
  getProperties: () => HalPropertyType[];
  getProperty: (key: string) => HalPropertyType | null;
  getSchemaProperties: () => OptionsProperty[];
  getSchemaProperty: (key: string) => OptionsProperty | null;
  getRequiredProperties: () => string[];

  addLink: (link: LinkType) => void;
  addLinks: (links: LinkType[]) => void;
  addItem: (item: ItemType) => void;
  addItems: (items: ItemType[]) => void;
  addProperty: (property: PropertyType) => void;
  addProperties: (properties: PropertyType[]) => void;

  addOptionsProperties: (properties: OptionsProperty[]) => void;
  addOptionsProperty: (property: OptionsProperty) => void;
  addTitle: (title: string) => void;
  addInteraction: (interaction: InteractionType) => void;
  addOptions: (options: OptionsType[]) => void;
};

export type Interactions = Record<string, unknown>;

/**
 * Array with the following stateful variables.
 *    - resource: HalResource
 *    - requestStatus: 'idle' | 'fetching' | 'resolved' | 'rejected' | 'interaction'
 *    - requestError: ErrorResponse
 *    - resourceInteractions: object. This is an object containing as many entries as interactions (_options.links) are available in the HAL resource.
 *      Each entry has the rel value of the interaction as a key, and a function that you can execute passing a payload as a parameter.
 */
export type UseHalResourceResponse = [
  HalResourceType | undefined,
  RequestStatus,
  ErrorResponse | undefined,
  Interactions | undefined
];
