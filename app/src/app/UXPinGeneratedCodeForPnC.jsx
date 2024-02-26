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
  Accept: 'application/hal+json, application/json',
  'Accept-Language': 'en',
  Authorization: 'Bearer eyJraWQiOiI0QnJ3U2I5bncxZzlmeU5ZdkdmR0VkdStKdVMxSkNodzZcL3FxWWViQ1ljWT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlYzQzNGUwNS1hMjdjLTQwYTQtYWYxOS02NDIyZTJiYzliYmQiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0xLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMV9remlZeFdrVVEiLCJjbGllbnRfaWQiOiIzcWNyNmJ2anIxMmQyaDM0ZWpvaThrczEzbiIsIm9yaWdpbl9qdGkiOiJkOGQzMDIyOC02NTYyLTRmNDItYTkwNC0xY2EzNDc2NTBmYTYiLCJldmVudF9pZCI6ImY5YWNkNzc0LTc5YjAtNDFhNS1iNmM0LWIyMjUxNjAyNTYyNiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MDg1MjM4MTMsImV4cCI6MTcwODUyNzQxMywiaWF0IjoxNzA4NTIzODEzLCJqdGkiOiJiZWRjMmFhNy01ZGMxLTQ1NzYtYmM0ZS01NjYzNmJiOGE5MjEiLCJ1c2VybmFtZSI6InB0dXNlciJ9.Ak8VDqe00CVxZtibR3csZ-VMuw2OB5NnjQRM2AC2rC-rnn2NT1Ha0M0oU9P16oBm8ZjZmN2mH1z4g1S-loGwBT9BKw4jdoFdXSuotyIyYXk-Zhu6StoTnypzpFHFpL1eQNnLg0ThaZLZC2s910DxEyPHjgi16_DZ5EGERZAKsLn6l4HJFFe5S0U0FU6IiByzwyGvSFcqQspHgElPQqs9rCcayg5fIE-EaWWDURc-gGZ-BGvC561ZePE4TqR9BTpCm-uu53I3Ydf1ydnZ0jP0kkCLRVntThM_bulkImw9HRDaOL0rBf8SzN0iA2ivy1pWKs4dVC-jzHcsDriqgaRqmQ',
  'Content-Type': 'application/json',
  'X-Csc-User-Id': 'ptuser'
};

const apiEndpoint =
  "https://alb-external.sandbox-1012.hub-51.sandbox.assure.dxc.com/pointin-wc-quotes/policies/V0NWMDAxOTI0NjAwMDAwNTAwU0M=";

const UXPinGeneratedCodeForPnC = () => (
  <DxcFlex gap="3rem" direction="column">
    <HalForm apiEndpoint={apiEndpoint} authHeaders={authHeaders} selfManagedSave={true}>
      <DxcGrid templateColumns={["repeat(3, 1fr)"]} gap="1rem">
        <DxcSelect
          label="Legal Entity"
          placeholder="Choose a legal entity"
          name="legalEntity"
          helperText="Type of the entity"
        />
       
      </DxcGrid>
    </HalForm>
  </DxcFlex>
);

export default UXPinGeneratedCodeForPnC;
