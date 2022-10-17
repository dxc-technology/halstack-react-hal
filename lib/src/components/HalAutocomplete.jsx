import React, { useCallback } from "react";
import { DxcTextInput } from "@dxc-technology/halstack-react";
import { HalApiCaller } from "@dxc-technology/halstack-client";

const addFilterParams = (url, value, propertyName) =>
  `${url}${url.includes("?") ? "&" : "?"}${propertyName}=${value}`;

const HalAutocomplete = ({ propertyName, url, asyncHeadersHandler, headers, ...childProps }) => {
  const getSuggestionsFromAPI = useCallback(
    async (newValue) => {
      const asyncHeadears = asyncHeadersHandler ? await asyncHeadersHandler() : {};
      const response = await HalApiCaller.get({
        url: newValue ? addFilterParams(url, newValue, propertyName) : url,
        headers: { ...headers, ...asyncHeadears },
      });

      return response?.halResource?.getItems()
        ? response.halResource.getItems().map((item) => item.summary[propertyName])
        : [];
    },
    [propertyName, url, asyncHeadersHandler, headers]
  );

  return <DxcTextInput {...childProps} suggestions={getSuggestionsFromAPI} />;
};

export default HalAutocomplete;
