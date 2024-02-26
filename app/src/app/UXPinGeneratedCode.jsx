/**
 * Info:
 * 1. 'import' statements
 * 2. Component Definition
 *  are added manually to the generated code
 * */

import {
  DxcDateInput,
  DxcFlex,
  DxcGrid,
  DxcRadioGroup,
  DxcSelect,
  DxcTextInput,
  DxcTextarea,
} from "@dxc-technology/halstack-react";

import { HalForm } from "@dxc-technology/halstack-react-hal";

const authHeaders = {
 
};

const apiEndpoint =
  "";

const UXPinGeneratedCode = () => (
  <DxcFlex gap="3rem" direction="column">
    <HalForm apiEndpoint={apiEndpoint} authHeaders={authHeaders} selfManagedSave={true}>
      <DxcGrid templateColumns={["repeat(3, 1fr)"]} gap="1rem">
        <DxcRadioGroup
          label="Title"
          options={[{}]}
          name="person:person_title"
          stacking="row"
          helperText="Must match official identification documents"
        />
        <DxcTextInput
          label="Family Name"
          helperText="Must match official identification documents"
          placeholder="Enter family name"
          name="person:last_name"
        />
        <DxcTextInput
          label="First Name"
          helperText="Must match official identification documents"
          placeholder="Enter first name"
          name="person:first_name"
        />
        <DxcSelect
          label="Professional  Status"
          placeholder="Choose a title"
          name="person:professional_status"
          helperText="Prefix to Insured's name"
        />
        <DxcDateInput
          label="Date of Birth"
          helperText="Legal age for insured is above 10 years"
          placeholder={true}
          name="person:birth_date"
        />
        <DxcTextarea
          label="Insured Display ID"
          helperText="This is how Insured ID will appear on documents"
          placeholder=""
          name="person:display_id"
        />
      </DxcGrid>
    </HalForm>
  </DxcFlex>
);

export default UXPinGeneratedCode;
