import React, { useState, useEffect } from "react";
import { DxcSpinner, DxcTable, DxcPaginator } from "@dxc-technology/halstack-react";
import axios from "axios";
import styled from "styled-components";
import arrowUp from "./arrow_upward-24px_wht.svg";
import arrowDown from "./arrow_downward-24px_wht.svg";
import bothArrows from "./unfold_more-24px_wht.svg";

const addPageParams = ({ collectionUrl, page, itemsPerPage, sortColumn }) => {
  return `${collectionUrl}${collectionUrl.includes("?") ? "&" : "?"}_start=${
    (page - 1) * itemsPerPage + 1
  }&_num=${itemsPerPage}${sortColumn ? `&_sort=${sortColumn}` : ``}`;
};

const useCollection = (collectionUrl, asyncHeadersHandler, headers = {}, itemsPerPage) => {
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
        const response = await axios({
          method: "get",
          url: addPageParams({ collectionUrl, page, itemsPerPage, sortColumn }),
          headers: { ...headers, ...asyncHeadears },
        });
        const links = response.data?._links;
        changeIsLoading(false);
        changeTotalCollectionItems(response.data?._count);
        changeNavigationFunctions({
          next: () => {
            changePage(page + 1);
          },
          previous: () => {
            changePage(page - 1);
          },
          first: () => {
            changePage(1);
          },
          last: (page) => {
            changePage(page);
          },
          sort: (column) => {
            changePage(1);
            changeSortColumn(column);
          },
        });
        var result = links?.item || [];
        // if item is an object convert to an array.
        if (!Array.isArray(result)) {
          result = [result];
        }
        changeCollectionItems(result);
        // changeCollectionItems(links?.item || []);
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
  const { next, previous, first, last, sort } = navigationFunctions;

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
    <DxcHALTableContainer>
      <DxcTable>
        <HeaderRow>
          {columns.map((column) => (
            <TableHeader>
              <HeaderContainer onClick={() => sortByColumn(column.sortProperty)}>
                <TitleDiv isSortable={column.sortProperty}>{column.header}</TitleDiv>
                {column.sortProperty && (
                  <SortIcon src={getIconForSortableColumn(column.sortProperty)} />
                )}
              </HeaderContainer>
            </TableHeader>
          ))}
        </HeaderRow>
        <TableRowGroup>
          {!isLoading &&
            collectionItems.length > 0 &&
            collectionItems.map((collectionItem) => (
              <tr>
                {columns.map((columnProperty) => (
                  <td>
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
        !collectionItems.length && <EmptyTableRow>There are no items in this list.</EmptyTableRow>
      )}
      {!error && totalCollectionItems > 0 && (
        <DxcPaginator
          totalItems={totalCollectionItems}
          itemsPerPage={itemsPerPage}
          currentPage={page}
          nextFunction={next}
          prevFunction={previous}
          firstFunction={first}
          lastFunction={last}
        />
      )}
      {error && <ErrorContainer>{error}</ErrorContainer>}
    </DxcHALTableContainer>
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

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff4f4;
  text-transform: uppercase;
  color: #cb4242;
  padding: 50px;
  margin-top: 10px;
`;

const DxcHALTableContainer = styled.div`
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
const EmptyTableRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f8f8;
  text-transform: uppercase;
  color: #888888;
  padding: 50px;
  margin-top: 10px;
`;

export default HalTable;
