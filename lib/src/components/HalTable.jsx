import React, { useState, useEffect } from "react";
import { DxcSpinner, DxcTable, DxcPaginator } from "@dxc-technology/halstack-react";
import { HalApiCaller } from "@dxc-technology/halstack-client";
import styled from "styled-components";
import arrowUp from "./arrow_upward-24px_wht.svg";
import arrowDown from "./arrow_downward-24px_wht.svg";
import bothArrows from "./unfold_more-24px_wht.svg";

const addPageParams = ({ collectionUrl, page, itemsPerPage, sortColumn }) => {
  return `${collectionUrl}${collectionUrl.includes("?") ? "&" : "?"}_start=${
    (page - 1) * itemsPerPage + 1
  }&_num=${itemsPerPage}${sortColumn ? `&_sort=${sortColumn}` : ``}`;
};

const useCollection = (collectionUrl, asyncHeadersHandler, headers, itemsPerPage) => {
  const [isLoading, changeIsLoading] = useState(true);
  const [navigationFunctions, changeNavigationFunctions] = useState({});
  const [page, changePage] = useState(1);
  const [error, changeError] = useState(null);
  const [collectionItems, changeCollectionItems] = useState([]);
  const [totalCollectionItems, changeTotalCollectionItems] = useState(null);
  const [sortColumn, changeSortColumn] = useState("");

  useEffect(() => {
    const fetchList = async () => {
      changeIsLoading(true);
      try {
        const asyncHeadears = asyncHeadersHandler ? await asyncHeadersHandler() : {};
        const response = await HalApiCaller.get({
          url: addPageParams({ collectionUrl, page, itemsPerPage, sortColumn }),
          headers: { ...headers, ...asyncHeadears },
        });
        changeIsLoading(false);
        changeTotalCollectionItems(
          response.body?._count || response.body?._links?._count || undefined
        );
        changeNavigationFunctions({
          onPageChange: (newPage) => {
            changePage(newPage);
          },
          sort: (column) => {
            changePage(1);
            changeSortColumn(column);
          },
        });
        const result = response?.halResource?.getItems();
        // if item is an object convert to an array.
        if (!Array.isArray(result)) {
          result = [result];
        }
        changeCollectionItems(result);
      } catch (err) {
        changeIsLoading(false);
        changeError("Error fetching table data.");
      }
    };

    fetchList();
  }, [collectionUrl, asyncHeadersHandler, headers, page, itemsPerPage, sortColumn]);

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

const HalTable = ({ collectionUrl, asyncHeadersHandler, headers, columns, itemsPerPage = 5 }) => {
  const {
    isLoading,
    navigationFunctions,
    page,
    collectionItems,
    totalCollectionItems,
    error,
    sortColumn,
  } = useCollection(collectionUrl, asyncHeadersHandler, headers, itemsPerPage);
  const { onPageChange, sort } = navigationFunctions;

  const getCellInfo = (listItem, columnProperty) => {
    const propertyValue = listItem.summary[columnProperty.displayProperty];
    const propertyStringValue =
      propertyValue === true ? "Yes" : propertyValue === false ? "No" : propertyValue;
    return columnProperty.mapFunction ? columnProperty.mapFunction(listItem) : propertyStringValue;
  };

  const sortByColumn = (property) => {
    if (property) {
      return property === sortColumn ? sort(`-${property}`) : sort(property);
    }
  };

  const getIconForSortableColumn = (property) => {
    return property === sortColumn
      ? arrowUp
      : `-${property}` === sortColumn
      ? arrowDown
      : bothArrows;
  };

  return (
    <HalTableContainer>
      <DxcTable>
        <HeaderRow>
          <tr>
            {columns.map((column) => (
              <TableHeader key={`th-${column.header}`}>
                <HeaderContainer onClick={() => sortByColumn(column.sortProperty)}>
                  <TitleDiv isSortable={column.sortProperty}>{column.header}</TitleDiv>
                  {column.sortProperty && (
                    <SortIcon src={getIconForSortableColumn(column.sortProperty)} />
                  )}
                </HeaderContainer>
              </TableHeader>
            ))}
          </tr>
        </HeaderRow>
        <TableRowGroup>
          {!isLoading &&
            collectionItems.length > 0 &&
            collectionItems.map((collectionItem, i) => (
              <tr key={`tr-${i}`}>
                {columns.map((columnProperty) => (
                  <td key={`tr-${i}-${columnProperty.displayProperty}`}>
                    {(columnProperty.onClickItemFunction && (
                      <LinkRow
                        onClick={() => {
                          columnProperty.onClickItemFunction(collectionItem);
                        }}
                      >
                        {getCellInfo(collectionItem, columnProperty)}
                      </LinkRow>
                    )) ||
                      getCellInfo(collectionItem, columnProperty)}
                  </td>
                ))}
              </tr>
            ))}
        </TableRowGroup>
      </DxcTable>
      {isLoading ? (
        <LoadingContainer>
          <DxcSpinner margin="xxlarge" label="Fetching data" />
        </LoadingContainer>
      ) : (
        !error &&
        !collectionItems.length && (
          <MessageContainer>There are no items in this list.</MessageContainer>
        )
      )}
      {!error && totalCollectionItems > 0 && (
        <DxcPaginator
          totalItems={totalCollectionItems}
          itemsPerPage={itemsPerPage}
          currentPage={page}
          showGoToPage={true}
          onPageChange={onPageChange}
        />
      )}
      {error && <MessageContainer error>{error}</MessageContainer>}
    </HalTableContainer>
  );
};
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
`;

const TitleDiv = styled.div`
  cursor: ${(props) => (props.isSortable && "pointer") || "default"};
`;

const SortIcon = styled.img`
  top: 409px;
  left: 390px;
  height: 14px;
  cursor: pointer;
`;

const TableHeader = styled.th``;

const LinkRow = styled.a`
  text-decoration: none;
  color: #666666;
  cursor: pointer;
`;
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

const HalTableContainer = styled.div`
  > table:nth-child(1) {
    width: 100%;
    position: relative;
  }
`;

const TableRowGroup = styled.tbody`
  > div:nth-child(1) {
    position: absolute;
    left: calc(50% - 68.5px);
    bottom: calc(50% - 68.5px - 30px);
  }
`;

const HeaderRow = styled.thead`
  height: 60px;
`;

export default HalTable;
