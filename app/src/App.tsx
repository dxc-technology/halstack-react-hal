import { HalTable, HalAutocomplete } from "@dxc-technology/halstack-react-hal";
import { DxcApplicationLayout, DxcInset, DxcHeading, DxcFlex } from "@dxc-technology/halstack-react";
import React from "react";

function App() {
  return (
    <DxcApplicationLayout>
      <DxcApplicationLayout.Main>
        <DxcInset space="2rem">
          <DxcFlex direction="column" gap="4rem">
            <DxcFlex direction="column" gap="2rem">
              <DxcHeading level={2} text="HalTable example" />
              <HalTable
                mode="reduced"
                collectionUrl={"http://localhost:3000/response"}
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
            </DxcFlex>
            <DxcFlex direction="column" gap="2rem">
              <DxcHeading level={2} text="HalAutocomplete example" />
              <HalAutocomplete
                collectionUrl="http://localhost:3000/response"
                propertyName="identifier"
                label="Identifier"
              />
            </DxcFlex>
          </DxcFlex>
        </DxcInset>
      </DxcApplicationLayout.Main>
    </DxcApplicationLayout>
  );
}

export default App;
