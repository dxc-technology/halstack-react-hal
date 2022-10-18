import React from "react";
import { HalTable, HalAutocomplete } from "@dxc-technology/halstack-react-hal";
import {
  DxcApplicationLayout,
  DxcInset,
  DxcHeading,
} from "@dxc-technology/halstack-react";

export default () => {
  return (
    <DxcApplicationLayout>
      <DxcApplicationLayout.Main>
        <DxcInset space="2rem">
          <DxcHeading level={2} text="HalTable example" />
          <HalTable
            collectionUrl={"http://your-api/users"}
            columns={[
              {
                header: "Email",
                displayProperty: "email",
                sortProperty: "email",
              },
              {
                header: "Phone number",
                displayProperty: "phone_number",
                onClickItemFunction: (value) => console.log(value),
              },
              {
                header: "Username",
                displayProperty: "username",
                mapFunction: (item) => `test-${item.summary.username}`,
              },
            ]}
          />
        </DxcInset>
        <DxcInset space="2rem">
          <DxcHeading level={2} text="HalAutocomplete example" />
          <HalAutocomplete
            url="http://your-api/users"
            propertyName="username"
            label="Username"
          />
        </DxcInset>
      </DxcApplicationLayout.Main>
    </DxcApplicationLayout>
  );
};
