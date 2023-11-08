import { HalTable, HalAutocomplete } from '@dxc-technology/halstack-react-hal';
import {
  DxcApplicationLayout,
  DxcInset,
  DxcHeading,
  DxcFlex,
} from '@dxc-technology/halstack-react';

function App() {
  return (
    <DxcApplicationLayout>
      <DxcApplicationLayout.Main>
        <DxcInset space="2rem">
          <DxcFlex direction="column" gap="4rem">
            <DxcFlex direction="column" gap="2rem">
              <DxcHeading level={2} text="HalTable example" />
              <HalTable
                collectionUrl={'http://your-api/users'}
                columns={[
                  {
                    header: 'Email',
                    displayProperty: 'email',
                    sortProperty: 'email',
                  },
                  {
                    header: 'Phone Number',
                    displayProperty: 'phone_number',
                    sortProperty: 'phone_number',
                    onClickItemFunction: (value) => console.log(value),
                  },
                  {
                    header: 'Username',
                    displayProperty: 'username',
                    sortProperty: 'username',
                    mapFunction: (item) => `test-${item.summary.username}`,
                  },
                ]}
              />
            </DxcFlex>
            <DxcFlex direction="column" gap="2rem">
              <DxcHeading level={2} text="HalAutocomplete example" />
              <HalAutocomplete
                collectionUrl="http://your-api/users"
                propertyName="username"
                label="Username"
              />
            </DxcFlex>
          </DxcFlex>
        </DxcInset>
      </DxcApplicationLayout.Main>
    </DxcApplicationLayout>
  );
}

export default App;
