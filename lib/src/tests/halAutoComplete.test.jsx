import { fireEvent, render, waitFor } from "@testing-library/react";
import HalAutocomplete from "../components/HalAutocomplete";

// Mocking DOMRect for Radix Primitive Popover
global.globalThis = global;
global.DOMRect = {
  fromRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 }),
};
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
describe("HalAutocomplete component tests", () => {
  test("HalAutocomplete renders with correct options", async () => {
    const { getByRole, getByText } = render(
      <HalAutocomplete
        collectionUrl="http://localhost:3000/response"
        propertyName="baseCompany"
        label="Company name"
      />
    );
    const input = getByRole("combobox");
    fireEvent.focus(input);
    const list = getByRole("listbox");
    expect(list).toBeTruthy();
    await waitFor(() => expect(getByText("CGU AUTO PA / SCOB mandatory")).toBeTruthy());
  });
});
