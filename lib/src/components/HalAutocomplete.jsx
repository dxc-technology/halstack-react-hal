import React, { useCallback } from "react";
import { DxcTextInput } from "@dxc-technology/halstack-react";
import { HalApiCaller } from "@dxc-technology/halstack-client";

const HalAutocomplete = ({ propertyName, url, asyncHeadersHandler, headers, ...childProps }) => {
  const getSuggestionsFromAPI = useCallback(async () => {
    const asyncHeadears = asyncHeadersHandler ? await asyncHeadersHandler() : {};
    const response = await HalApiCaller.get({
      url: url,
      headers: { ...headers, ...asyncHeadears },
    });
    return response?.halResource?.getItems()
      ? response.halResource
          .getItems()
          .filter((item) => item?.summary?.[propertyName])
          .map((item) => item.summary[propertyName])
      : [];
  }, [propertyName, url, asyncHeadersHandler, headers]);

  return <DxcTextInput {...childProps} suggestions={getSuggestionsFromAPI} />;
};

export default HalAutocomplete;
