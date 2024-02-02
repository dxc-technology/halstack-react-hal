/**
 * Info:
 * 1. 'import' statements
 * 2. Component Definition 
 *  are added manually to the generated code
 * */

import {
  DxcBox,
  DxcDateInput,
  DxcFlex,
  DxcInset,
  DxcNumberInput,
  DxcSelect,
  DxcTextInput,
} from "@dxc-technology/halstack-react";

import { HalForm } from "@dxc-technology/halstack-react-hal";

const authHeaders = {};

const apiEndpoint =  "";

const UXPinGeneratedCode = () => (
  <HalForm apiEndpoint={apiEndpoint} authHeaders={authHeaders} selfManagedSave={true}>
    <DxcBox>
      <DxcInset space="2rem">
        <DxcFlex direction="column">
          <DxcFlex gap="2rem" direction="row">
            <DxcTextInput
              label="Status"
              helperText="Status of the offer"
              placeholder="Status"
              name="contract:proposition_status"
            />
            <DxcNumberInput
              label="Premium"
              helperText="Premium payable at the start of term"
              placeholder="0.00"
              name="contract:total_premium"
            />
          </DxcFlex>
          <DxcFlex gap="2rem">
            <DxcDateInput
              label="Contract Signature Date"
              helperText="Helper text"
              placeholder={true}
              name="contract:signature_date"
              format="yyyy-MM-dd"
            />
            <DxcSelect
              label="Contract Language"
              placeholder="Choose a Language"
              name="contract:language"
              helperText="Contract documents are generated in selected language"              
            />
          </DxcFlex>          
        </DxcFlex>
      </DxcInset>
    </DxcBox>
  </HalForm>
);

export default UXPinGeneratedCode;
