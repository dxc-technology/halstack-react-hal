import { fireEvent, render, waitFor } from "@testing-library/react";
import HalAutocomplete from "../components/HalAutocomplete";
import { HalApiCaller } from "@dxc-technology/halstack-client";

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

  test("HalAutocomplete renders empty without collectionUrl", async () => {
    const { queryByRole } = render(
      <HalAutocomplete propertyName="baseCompany" label="Company name" />
    );
    const list = queryByRole("listbox");
    expect(list).not.toBeTruthy();
  });

  test("HalAutocomplete calls asyncHeadersHandler", async () => {
    const mockAsyncHeadersHandler = jest.fn();

    render(
      <HalAutocomplete
        collectionUrl="http://localhost:3000/response"
        propertyName="baseCompany"
        label="Company name"
        asyncHeadersHandler={mockAsyncHeadersHandler}
      />
    );

    await waitFor(() => expect(mockAsyncHeadersHandler).toHaveBeenCalled());

    expect(mockAsyncHeadersHandler).toHaveBeenCalledTimes(1);
  });
});

describe("HalAutocomplete component URL handling tests", () => {
  test("API call adds '&' if URL includes '?'", async () => {
    const mockedGet = jest.fn();
    HalApiCaller.get = mockedGet.mockResolvedValue({
      halResource: { getItems: () => [{ summary: { baseCompany: "Test Company" } }] },
    });

    const { getByRole } = render(
      <HalAutocomplete
        collectionUrl="http://example.com?existing=true"
        propertyName="baseCompany"
        label="Company"
      />
    );

    const input = getByRole("combobox");
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.focus(input);

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "http://example.com?existing=true&baseCompany=test",
        })
      );
    });
  });

  test("API call adds '?' if URL does not include '?'", async () => {
    const mockedGet = jest.fn();
    HalApiCaller.get = mockedGet.mockResolvedValue({
      halResource: { getItems: () => [{ summary: { baseCompany: "Test Company" } }] },
    });

    const { getByRole } = render(
      <HalAutocomplete
        collectionUrl="http://example.com"
        propertyName="baseCompany"
        label="Company"
      />
    );

    const input = getByRole("combobox");
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.focus(input);

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "http://example.com?baseCompany=test",
        })
      );
    });
  });
});
