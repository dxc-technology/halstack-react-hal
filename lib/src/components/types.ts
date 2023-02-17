import { DxcTextInput } from "@dxc-technology/halstack-react";

type Column = {
  /**
   * Column label to be place at the table header.
   */
  header: string;
  /**
   * The name of the property in the items summary to be rendered for this column in the table.
   */
  displayProperty: string;
  /**
   * The name of the property in the items summary to be used for sorting the table.
   */
  sortProperty: string;
  /**
   * Callback function that will be executed when the user clicks an item in that column. 
   * The collection item will be passed to this function when executed.
   */
  onClickItemFunction?: (item: any) => void;
  /**
   * Callback function that must return the value to be rendered in that column for a specific item. 
   * The item will be passed to this function as a parameter.
   */
  mapFunction?: (item: any) => string;
};

export type HalTableProps = {
  /**
   * The URL of the collection resource to be used for the table.
   */
  collectionUrl: string;
  /**
   * Contains the HTTP headers to be sent along with the HTTP requests to the collectionUrl.
   */
  headers?: object;
  /**
   * The amount of items to be displayed per page.
   * Will be used to calculate the _start and _num query parameters that will be sent to the collection for pagination.
   */
  itemsPerPage?: number;
  /**
   * Async function that will be executed right before every HTTP request in order to retrieve dynamic headers.
   * It must return a promise that resolves into an object with the keys and values of the headers.
   * These headers will be merged with the ones indicated in the headers prop.
   */
  asyncHeadersHandler?: () => Promise<object>;
  /**
   * Array of objects specifying the columns to be displayed in the table.
   */
  columns: Column[];
};

export type HalAutocompleteProps = React.ComponentProps<typeof DxcTextInput> & {
  /**
   * The URL of the collection resource to be used for the table.
   */
  collectionUrl: string;
  /**
   * Contains the HTTP headers to be sent along with the HTTP requests to the collectionUrl.
   */
  headers?: object;
  /**
   * Async function that will be executed right before every HTTP request in order to retrieve dynamic headers.
   * It must return a promise that resolves into an object with the keys and values of the headers.
   * These headers will be merged with the ones indicated in the headers prop.
   */
  asyncHeadersHandler?: () => Promise<object>;
  /**
   * Name of the property to be used for filtering the data.
   */
  propertyName: string;
};
