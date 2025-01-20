import { fireEvent, render, waitFor } from "@testing-library/react";
import HalTable from "../components/HalTable";

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
});
