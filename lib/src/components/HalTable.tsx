import React, { useState, useEffect } from "react";
import {
  DxcSpinner,
  DxcTable,
  DxcPaginator,
  DxcFlex,
  DxcTypography,
} from "@dxc-technology/halstack-react";
import { HalApiCaller } from "@dxc-technology/halstack-client";
import styled from "styled-components";
import icons from "./Icons";
import { HalTableProps } from "./types";

const addPageParams = ({ collectionUrl, page, itemsPerPage, sortColumn, handlePagination }) => {
  let url = collectionUrl;
  if (handlePagination) {
    url += `${url.includes("?") ? "&" : "?"}_start=${
      (page - 1) * itemsPerPage + 1
    }&_num=${itemsPerPage}`;
  }
  if (sortColumn) {
    url += `&_sort=${sortColumn}`;
  }
  return url;
};

type NavigationFunctions = {
  onPageChange: (newPage: number) => void;
  sort: (column: string) => void;
};
const useCollection = (
  collectionUrl,
  asyncHeadersHandler,
  headers,
  itemsPerPage,
  handlePagination
) => {
  const [isLoading, changeIsLoading] = useState(true);
  const [navigationFunctions, changeNavigationFunctions] = useState<NavigationFunctions>({
    onPageChange: () => {},
    sort: () => {},
  });
  const [page, changePage] = useState(1);
  const [error, changeError] = useState("");
  const [collectionItems, changeCollectionItems] = useState([]);
  const [totalCollectionItems, changeTotalCollectionItems] = useState(0);
  const [sortColumn, changeSortColumn] = useState("");

  useEffect(() => {
    const fetchList = async () => {
      changeIsLoading(true);
      try {
        const asyncHeadears = asyncHeadersHandler ? await asyncHeadersHandler() : {};
        const response = await HalApiCaller.get({
          url: addPageParams({ collectionUrl, page, itemsPerPage, sortColumn, handlePagination }),
          headers: { ...headers, ...asyncHeadears },
        });
        changeIsLoading(false);
        changeTotalCollectionItems(response.body?._count || response.body?._links?._count || 0);
        changeNavigationFunctions({
          onPageChange: (newPage) => {
            changePage(newPage);
          },
          sort: (column) => {
            changePage(1);
            changeSortColumn(column);
          },
        });

        let result = response?.halResource?.getItems();
        // if item is an object convert to an array.
        if (!Array.isArray(result)) result = [result];

        changeCollectionItems(result);
      } catch (err) {
        changeIsLoading(false);
        changeError("Error fetching table data.");
      }
    };

    fetchList();
  }, [
    collectionUrl,
    asyncHeadersHandler,
    headers,
    page,
    itemsPerPage,
    handlePagination,
    sortColumn,
  ]);

  return {
    isLoading,
    navigationFunctions,
    page,
    collectionItems,
    totalCollectionItems,
    error,
    sortColumn,
  };
};

const getIconForSortableColumn = (property, sortColumn) =>
  property === sortColumn
    ? icons.arrowUp
    : `-${property}` === sortColumn
    ? icons.arrowDown
    : icons.bothArrows;

const sortByColumn = (property, sort, sortColumn) => {
  if (property) return property === sortColumn ? sort(`-${property}`) : sort(property);
};

const getCellInfo = (listItem, columnProperty) => {
  const propertyValue = listItem.summary[columnProperty.displayProperty];
  const propertyStringValue =
    propertyValue === true ? "Yes" : propertyValue === false ? "No" : propertyValue;
  return columnProperty.mapFunction ? columnProperty.mapFunction(listItem) : propertyStringValue;
};

const HalTable = ({
  collectionUrl,
  asyncHeadersHandler,
  headers,
  hidePaginator = false,
  columns,
  itemsPerPage = 5,
  mode = "default",
}: HalTableProps): JSX.Element => {
  const {
    isLoading,
    navigationFunctions,
    page,
    collectionItems,
    totalCollectionItems,
    error,
    sortColumn,
  } = useCollection(collectionUrl, asyncHeadersHandler, headers, itemsPerPage, !hidePaginator);
  const { onPageChange, sort } = navigationFunctions;

  return (
    <>
      <DxcTable mode={mode}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={`tableHeader_${column.header}`}
                aria-sort={
                  column.sortProperty === sortColumn
                    ? "ascending"
                    : `-${column.sortProperty}` === sortColumn
                    ? "descending"
                    : "none"
                }
              >
                <HeaderContainer
                  role={column.sortProperty ? "button" : undefined}
                  onClick={() => sortByColumn(column.sortProperty, sort, sortColumn)}
                  tabIndex={column.sortProperty ? 0 : -1}
                  isSortable={column.sortProperty ? true : false}
                >
                  <span>{column.header}</span>
                  {column.sortProperty && (
                    <SortIcon>{getIconForSortableColumn(column.sortProperty, sortColumn)}</SortIcon>
                  )}
                </HeaderContainer>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!isLoading &&
            collectionItems.length > 0 &&
            collectionItems.map((collectionItem, i) => (
              <tr key={`tr-${i}`}>
                {columns.map((columnProperty) => (
                  <td key={`tr-${i}-${columnProperty.displayProperty}`}>
                    {columnProperty.onClickItemFunction ? (
                      <LinkRow
                        onClick={() => {
                          columnProperty.onClickItemFunction(collectionItem);
                        }}
                      >
                        {getCellInfo(collectionItem, columnProperty)}
                      </LinkRow>
                    ) : (
                      getCellInfo(collectionItem, columnProperty)
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </DxcTable>
      {isLoading ? (
        <DxcFlex justifyContent="center">
          <DxcSpinner margin="xxlarge" label="Fetching data" />
        </DxcFlex>
      ) : (
        !error &&
        !collectionItems.length && (
          <MessageContainer>
            <DxcTypography color="#888888">There are no items in this list.</DxcTypography>
          </MessageContainer>
        )
      )}
      {!error && !hidePaginator && totalCollectionItems > 0 && (
        <DxcPaginator
          totalItems={totalCollectionItems}
          itemsPerPage={itemsPerPage}
          currentPage={page}
          showGoToPage={true}
          onPageChange={onPageChange}
        />
      )}
      {error && (
        <MessageContainer hasError={true}>
          <DxcTypography color="#d0011b">{error}</DxcTypography>
        </MessageContainer>
      )}
    </>
  );
};

const HeaderContainer = styled.div<{ isSortable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.theme.headerTextAlign === "center"
      ? "center"
      : props.theme.headerTextAlign === "right"
      ? "flex-end"
      : "flex-start"};
  gap: 8px;
  width: fit-content;
  border: 1px solid transparent;
  border-radius: 2px;
  padding: 3px;
  cursor: ${(props) => (props.isSortable ? "pointer" : "default")};

  ${(props) =>
    props.isSortable &&
    `&:focus {
      outline: #0095ff solid 2px;
    }`}
`;

const SortIcon = styled.span`
  display: flex;
  color: ${(props) => props.theme.sortIconColor};

  svg {
    height: 14px;
    width: 14px;
  }
`;

const LinkRow = styled.a`
  text-decoration: none;
  color: #666666;
  cursor: pointer;
`;

const MessageContainer = styled.div<{ hasError?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  margin-top: 10px;
  background: ${({ hasError }) => (hasError ? "#FFF5F6" : "#f8f8f8")};
`;

export default HalTable;
