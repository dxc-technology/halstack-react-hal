import React, { useEffect, useState } from "react";
import { DxcResultsetTable, DxcSpinner, DxcTable } from "@dxc-technology/halstack-react";
import { HalApiCaller } from "@dxc-technology/halstack-client";
import styled from "styled-components";

const HalTableItem = ({ column, item }) => {
  return column.onClickItemFunction ? (
    <LinkItem
      onClick={() => {
        column.onClickItemFunction(item);
      }}
    >
      {item.summary[column.displayProperty]}
    </LinkItem>
  ) : column.mapFunction ? (
    column.mapFunction(item)
  ) : (
    item.summary[column.displayProperty]
  );
};

const useCollection = (collectionUrl, asyncHeadersHandler, headers, columns) => {
  const [isLoading, changeIsLoading] = useState(true);
  const [error, changeError] = useState(null);
  const [collectionItems, changeCollectionItems] = useState([]);

  useEffect(() => {
    const getRowsFromAPI = async () => {
      changeIsLoading(true);
      try {
        const asyncHeadears = asyncHeadersHandler ? await asyncHeadersHandler() : {};
        const response = await HalApiCaller.get({
          url: collectionUrl,
          headers: { ...headers, ...asyncHeadears },
        });
        const result = response?.halResource?.getItems()
          ? response.halResource.getItems().map((item) =>
              columns.map((column) => ({
                displayValue: <HalTableItem column={column} item={item} />,
              }))
            )
          : [];

        changeCollectionItems(result);
        changeIsLoading(false);
      } catch (err) {
        changeIsLoading(false);
        changeError("Error fetching table data.");
      }
    };

    getRowsFromAPI();
  }, [collectionUrl, columns, asyncHeadersHandler, headers]);

  return {
    isLoading,
    collectionItems,
    error,
  };
};

const HalTable = ({ collectionUrl, asyncHeadersHandler, headers, columns, ...childProps }) => {
  const [resultSetTableColumns, setResultSetTableColumns] = useState([]);
  const { isLoading, collectionItems, error } = useCollection(
    collectionUrl,
    asyncHeadersHandler,
    headers,
    columns
  );

  useEffect(() => {
    if (columns.length > 0) {
      setResultSetTableColumns(
        columns.map((column) => ({ displayValue: column.header, isSortable: column.sortProperty }))
      );
    }
  }, [columns]);

  return (
    <HalTableContainer>
      {(isLoading || error) && (
        <DxcTable>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={`th-${column.header}`}>{column.header}</th>
              ))}
            </tr>
          </thead>
        </DxcTable>
      )}
      {isLoading ? (
        <LoadingContainer>
          <DxcSpinner margin="xxlarge" label="Fetching data" />
        </LoadingContainer>
      ) : error ? (
        <MessageContainer error>{error}</MessageContainer>
      ) : !collectionItems.length ? (
        <MessageContainer>There are no items in this list.</MessageContainer>
      ) : (
        <DxcResultsetTable {...childProps} columns={resultSetTableColumns} rows={collectionItems} />
      )}
    </HalTableContainer>
  );
};

const HalTableContainer = styled.div``;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  margin-top: 10px;
  background: ${({ error }) => (error ? "#fff4f4" : "#f8f8f8")};
  color: ${({ error }) => (error ? "#cb4242" : "#888888")};
`;

const LinkItem = styled.a`
  text-decoration: none;
  color: #666666;
  cursor: pointer;
`;

export default HalTable;
