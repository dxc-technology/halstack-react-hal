import React, { useState, useEffect } from "react";
import { DxcHalTable, useHalResource } from "@diaas/diaas-react-hal-components";

export default () => {
  const [user, userStatus, userError, userHandlers] = useHalResource({
    url:
      "https://bgqrqjl2t2.execute-api.us-west-1.amazonaws.com/dev/realms/us-east-1_wCPANetpN/users/asdasdasd"
  });

  return (
    <div>
      <div>{userStatus}</div>
      <DxcHalTable
        colletionUrl={
          "https://bgqrqjl2t2.execute-api.us-west-1.amazonaws.com/dev/realms/us-east-1_wCPANetpN/users"
        }
        columns={[
          {
            header: "Username",
            property: "username"
          },
          {
            header: "Status",
            property: "status"
          },
          {
            header: "Enabled",
            property: "enabled"
          },
          {
            header: "Created",
            property: "created_date"
          },
          {
            header: "Updated",
            property: "last_modified_date"
          }
        ]}
      >
        {userStatus}
      </DxcHalTable>
    </div>
  );
};
