import React, { useState, useEffect } from "react";
import { DxcSpinner, DxcTable, DxcPaginator } from "@diaas/dxc-react-cdk";
import axios from "axios";
import styled from "styled-components";

const addPageParams = ({ collectionUrl, page, itemsPerPage }) => {
  return `${collectionUrl}${
    collectionUrl.includes("?") ? "&" : "?"
  }_start=${(page - 1) * itemsPerPage + 1}&_num=${itemsPerPage}`;
};

const useCollection = (
  collectionUrl,
  asyncHeadersHandler,
  headers = {},
  itemsPerPage
) => {
  const [isLoading, changeIsLoading] = useState(true);
  const [navigationFunctions, changeNavigationFunctions] = useState({});
  const [page, changePage] = useState(1);
  const [error, changeError] = useState(null);
  const [collectionItems, changeCollectionItems] = useState([]);
  const [totalCollectionItems, changeTotalCollectionItems] = useState(null);

  useEffect(() => {
    const fetchList = async () => {
      changeIsLoading(true);
      try {
        const asyncHeadears = asyncHeadersHandler
          ? await asyncHeadersHandler()
          : {};
        const response = await axios({
          method: "get",
          url: addPageParams({ collectionUrl, page, itemsPerPage }),
          headers: { ...headers, ...asyncHeadears }
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
          last: page => {
            changePage(page);
          }
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
  }, [collectionUrl,asyncHeadersHandler, headers, page, itemsPerPage]);

  return {
    isLoading,
    navigationFunctions,
    page,
    collectionItems,
    totalCollectionItems,
    error
  };
};

const HalTable = ({
  colletionUrl,
  asyncHeadersHandler,
  headers,
  columns,
  itemsPerPage = 5
}) => {
  const {
    isLoading,
    navigationFunctions,
    page,
    collectionItems,
    totalCollectionItems,
    error
  } = useCollection(colletionUrl, asyncHeadersHandler, headers, itemsPerPage);
  const { next, previous, first, last } = navigationFunctions;

  const getCellInfo = (listItem, columnProperty) => {
    const propertyValue = listItem.summary[columnProperty.property];
    const propertyStringValue =
      propertyValue === true
        ? "Yes"
        : propertyValue === false
        ? "No"
        : propertyValue;
    return columnProperty.mapFunction
      ? columnProperty.mapFunction(listItem)
      : propertyStringValue;
  };

  return (
    <DxcHALTableContainer>
      <DxcTable>
        <HeaderRow>
          {columns.map(column => (
            <th>{column.header}</th>
          ))}
        </HeaderRow>
        <TableRowGroup>
          {!isLoading &&
            collectionItems.length > 0 &&
            collectionItems.map(collectionItem => (
              <tr>
                {columns.map(columnProperty => (
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
        !collectionItems.length && (
          <EmptyTableRow>There are no items in this list.</EmptyTableRow>
        )
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
