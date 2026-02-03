import { fireEvent, render, waitFor } from "@testing-library/react";
import HalTable from "../components/HalTable";

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("HalTable component tests", () => {
  test("HalTable renders with correct content", async () => {
    const halTable = render(
      <HalTable
        collectionUrl="http://localhost:3000/response"
        columns={[
          {
            header: "identifier",
            displayProperty: "identifier",
            sortProperty: "identifier",
          },
          {
            header: "Company Name",
            displayProperty: "baseCompany",
            sortProperty: "baseCompany",
          },
        ]}
      />
    );
    await waitFor(() => expect(halTable.getByText("trewqasdfgyhujikolpyt")).toBeTruthy());
    await waitFor(() => expect(halTable.getByText("Company Name")).toBeTruthy());
  });
  test("HalTable renders with custom content", async () => {
    const halTable = render(
      <HalTable
        collectionUrl="http://localhost:3000/response"
        columns={[
          {
            header: "identifier",
            displayProperty: "identifier",
            sortProperty: "identifier",
            mapFunction: (item) => `id-${item.summary.identifier}`,
          },
          {
            header: "Company Name",
            displayProperty: "baseCompany",
            sortProperty: "baseCompany",
          },
        ]}
      />
    );
    await waitFor(() => expect(halTable.getByText("id-trewqasdfgyhujikolpyt")).toBeTruthy());
    await waitFor(() => expect(halTable.getByText("id-trewqasdfgyhujikolpyt")).toBeTruthy());
  });
  test("HalTable onClickItemFunction is called correctly", async () => {
    const onCellClick = jest.fn();
    const { getByText } = render(
      <HalTable
        collectionUrl="http://localhost:3000/response"
        columns={[
          {
            header: "identifier",
            displayProperty: "identifier",
            sortProperty: "identifier",
            onClickItemFunction: (item) => onCellClick(item.summary.identifier),
          },
          {
            header: "baseCompany",
            displayProperty: "baseCompany",
            sortProperty: "baseCompany",
          },
        ]}
      />
    );
    await waitFor(() => expect(getByText("trewqasdfgyhujikolpyt")).toBeTruthy());
    fireEvent.click(getByText("trewqasdfgyhujikolpyt"));
    expect(onCellClick).toHaveBeenCalledWith("trewqasdfgyhujikolpyt");
  });
  test("HalTable is not including paginator when itemsPerPage exceeds total", async () => {
    const onCellClick = jest.fn();
    const { queryByText } = render(
      <HalTable
        collectionUrl="http://localhost:3000/response"
        columns={[
          {
            header: "identifier",
            displayProperty: "identifier",
            sortProperty: "identifier",
            onClickItemFunction: (item) => onCellClick(item.summary.identifier),
          },
          {
            header: "baseCompany",
            displayProperty: "baseCompany",
            sortProperty: "baseCompany",
          },
        ]}
        itemsPerPage={100}
      />
    );
    await waitFor(() => expect(queryByText("Go to page:")).toBeFalsy());
  });
  test("HalTable is including paginator by default", async () => {
    const onCellClick = jest.fn();
    const { getByText } = render(
      <HalTable
        collectionUrl="http://localhost:3000/response"
        columns={[
          {
            header: "Company",
            displayProperty: "baseCompany",
            sortProperty: "baseCompany",
          },
          {
            header: "Year",
            displayProperty: "underwritingYear",
            sortProperty: "underwritingYear",
            onClickItemFunction: (value) => console.log(value),
          },
          {
            header: "Id",
            displayProperty: "identifier",
            sortProperty: "identifier",
            mapFunction: (item) => `test-${item.summary.identifier}`,
          },
        ]}
      />
    );
    await waitFor(() => {
      expect(getByText("1 to 5 of 10")).toBeTruthy();
    });
  });
});

test("HalTable is rendering error on fetch fail.", async () => {
  const onCellClick = jest.fn();
  const { getByText } = render(
    <HalTable
      collectionUrl="http://error"
      columns={[
        {
          header: "identifier",
          displayProperty: "identifier",
          sortProperty: "identifier",
          onClickItemFunction: (item) => onCellClick(item.summary.identifier),
        },
        {
          header: "baseCompany",
          displayProperty: "baseCompany",
          sortProperty: "baseCompany",
        },
      ]}
    />
  );
  await waitFor(() => expect(getByText("Error fetching table data.")).toBeTruthy(), {
    timeout: 5000,
  });
});
