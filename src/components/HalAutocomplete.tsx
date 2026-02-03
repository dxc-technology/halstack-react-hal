import React from "react";
import { DxcTextInput } from "@dxc-technology/halstack-react";
import { HalApiCaller } from "@dxc-technology/halstack-client";
import { HalAutocompleteProps } from "./types";

const addFilterParams = (url: string, value: string, propertyName: string) =>
  `${url}${url.includes("?") ? "&" : "?"}${propertyName}=${value}`;

const HalAutocomplete = ({
  collectionUrl,
  headers,
  asyncHeadersHandler,
  propertyName,
  ...childProps
}: HalAutocompleteProps): JSX.Element => {
  const getSuggestionsFromAPI = React.useCallback(
    async (value: string): Promise<string[]> => {
      const asyncHeadears = asyncHeadersHandler ? await asyncHeadersHandler() : {};
      const response = await HalApiCaller.get({
        url: value ? addFilterParams(collectionUrl, value, propertyName) : collectionUrl,
        headers: { ...headers, ...asyncHeadears },
      });

      return response?.halResource?.getItems()
        ? response.halResource.getItems().map((item) => item.summary[propertyName])
        : [];
    },
    [propertyName, collectionUrl, asyncHeadersHandler, headers]
  );

  return <DxcTextInput {...childProps} suggestions={getSuggestionsFromAPI} />;
};

export default HalAutocomplete;
