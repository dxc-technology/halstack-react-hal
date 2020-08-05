import React, { useState, useMemo, useCallback } from "react";
import { DxcInput } from "@dxc-technology/halstack-react";
import { HalApiCaller } from "@dxc-technology/halstack-client";

import styled from "styled-components";

const addFilterParams = (url, value, propertyName) => {
  return `${url}${url.includes("?") ? "&" : "?"}${propertyName}=${value}`;
};

const HalAutocomplete = ({
  propertyName,
  url,
  asyncHeadersHandler,
  headers,
  autocompleteOptions,
  value,
  ...childProps
}) => {
  const getSuggestionsFromAPI = useCallback(async () => {
    const asyncHeadears = asyncHeadersHandler ? await asyncHeadersHandler() : {};
    const response = await HalApiCaller.get({
      url: addFilterParams(url, value, propertyName),
      headers: { ...headers, ...asyncHeadears },
    });
    return response?.halResource?.getItems()
      ? response.halResource
          .getItems()
          .filter((item) => item?.summary?.[propertyName])
          .map((item) => item.summary[propertyName])
      : [];
  }, [propertyName, url, value]);

  return (
    <DxcHalAutocompleteContainer>
      <DxcInput {...childProps} value={value} autocompleteOptions={getSuggestionsFromAPI} />
    </DxcHalAutocompleteContainer>
  );
};
const DxcHalAutocompleteContainer = styled.div``;

export default HalAutocomplete;
