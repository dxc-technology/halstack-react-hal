/**
 * Info:
 * 1. 'import' statements
 * 2. Component Definition
 * 3. 'type' attribute in DXC Components are added manually to the generated code (this is a violation of intrinsic prop assignment)
 * therefore we need to solve this before anything else
 * */

import {
  DxcBox,
  DxcDateInput,
  DxcFlex,
  DxcInset,
  DxcNumberInput,
  DxcSelect,
} from "@dxc-technology/halstack-react";

import { HalForm } from "@dxc-technology/halstack-react-hal";

const authHeaders = {};

const apiEndpoint = "";

const UXPinGeneratedCode = () => (
  <HalForm apiEndpoint={apiEndpoint} authHeaders={authHeaders} selfManagedSave={true}>
    <DxcBox>
      <DxcInset space="2rem">
        <DxcFlex direction="column">
          <DxcFlex gap="2rem">
            <DxcDateInput
              label="Contract Signature Date"
              helperText="Helper text"
              placeholder={true}
              name="contract:signature_date"
              format="yyyy-MM-dd"
              type="DxcDateInput"
            />
            <DxcSelect
              label="Contract Language"
              placeholder="Choose a Language"
              name="contract:language"
              helperText="Contract documents are generated in selected language"
              type="DxcSelect"
            />
          </DxcFlex>
          <DxcFlex gap="2rem" direction="row">
            <DxcNumberInput
              label="Premium"
              helperText="Premium payable at the start of term"
              placeholder="0.00"
              name="contract:total_premium"
              type="DxcNumberInput"
            />
          </DxcFlex>
        </DxcFlex>
      </DxcInset>
    </DxcBox>
  </HalForm>
);

export default UXPinGeneratedCode;
