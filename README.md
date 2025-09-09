# Halstack React HAL 

Halstack React HAL is an npm library of reusable React components. It brings together two different responsibilities:

- Consuming HAL REST APIs implemented following the [DXC API Guidelines](https://developer.dxc.com/apis).

- Rendering these API resources as UI components that are compliant with the [DXC UX Guidelines](https://developer.dxc.com/halstack/10/overview/introduction/).

We have other libraries that will help you handling these responsibilities individually ([Halstack Client](https://github.com/dxc-technology/halstack-client) / [Halstack React](https://github.com/dxc-technology/halstack-react)). Halstack React HAL uses them under the hood, but it is a higher level abstraction that puts both responsibilities together using the most common association patterns.

For example, collection resources are often associated with tables, and there are a lot of semantics in the standards described by the DXC API guidelines for collections (sorting, paginating...) that could be associated with UI interactions (clicking a table header for sorting, clicking pages for paginating)

## Usage

Halstack React HAL is distributed as an npm library. In order to use it in an existing project, you must install it first. You also need to install styled-components and Halstack React CDK, which are peer dependencies.

```bash
npm install @dxc-technology/halstack-react-hal styled-components @dxc-technology/halstack-react
```

The library provides the following components and hooks to be used in your React application:

Components

- [HalTable](#haltable-component)
- [HalAutocomplete](#halautocomplete-component)

Hooks

- [useHalResource](#usehalresource-hook)

### HalTable Component

#### HalTable Props

| Name                                         | Default     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :------------------------------------------- | :---------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| collectionUrl: `string`                      |             | The URL of the collection resource to be used for the table. `Required`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| headers: `object`                            |             | Contains the HTTP headers to be sent along with the HTTP requests to the collectionUrl. `Optional`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| itemsPerPage: `number`                       | `5`         | The amount of items to be displayed per page. Will be used to calculate the `_start` and `_num` query parameters that will be sent to the collection for pagination. `Optional`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| asyncHeadersHandler: `() => Promise<object>` |             | Async function that will be executed right before every HTTP request in order to retrieve dynamic headers. It must return a promise that resolves into an object with the keys and values of the headers. These headers will be merged with the ones indicated in the `headers` prop. `Optional`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| columns: `Column[]`                          | `[]`        | Array of objects specifying the columns to be displayed in the table. Each Column object has:<br> - <b>header</b>: Column label to be placed at the table header.<br> - <b>displayProperty</b>: The name of the property in the items summary to be rendered for this column in the table.<br> - <b>sortProperty</b>: The name of the property in the items summary to be used for sorting the table.<br> - <b>onClickItemFunction</b>: Callback function that will be executed when the user clicks an item in that column. The collection item will be passed to this function when executed.<br> - <b>mapFunction</b>: Callback function that must return the value to be rendered in that column for a specific item. The item will be passed to this function as a parameter. |
| hidePaginator: `boolean`                     | `false`     | If true, paginator will not be displayed. `Optional`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| mode: `"default" \| "reduced"`               | `"default"` | Determines the visual style and layout of the table:<br> - `"default"`: Standard table size.<br> - `"reduced"`: More compact table with less spacing, suitable for high-density information. `Optional`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

#### HalTable Example

```JSX
import React from "react";
import { HalTable } from "@dxc-technology/halstack-react-hal";

export default () => (
  <HalTable
    collectionUrl={"https://..."}
    columns={[
      {
        header: "Username",
        displayProperty: "username",
        sortProperty: "username"
      },
      {
        header: "Status",
        displayProperty: "status",
      },
      {
        header: "Enabled",
        displayProperty: "enabled",
      },
    ]}
  />
);
```

### HalAutocomplete Component

#### HalAutocomplete Props

| Name                                         | Default | Description                                                                                                                                                                                                                                                                                      |
| :------------------------------------------- | :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| collectionUrl: `string`                      |         | The URL of the collection resource to be used for the suggestions. `Required`                                                                                                                                                                                                                    |
| headers: `object`                            |         | Contains the HTTP headers to be sent along with the HTTP requests to the collectionUrl. `Optional`                                                                                                                                                                                               |
| asyncHeadersHandler: `() => Promise<object>` |         | Async function that will be executed right before every HTTP request in order to retrieve dynamic headers. It must return a promise that resolves into an object with the keys and values of the headers. These headers will be merged with the ones indicated in the `headers` prop. `Optional` |
| propertyName: `string`                       |         | Name of the property to be used for filtering the data.                                                                                                                                                                                                                                          |

In addition to these component-specific properties you will also have all the properties of the Text Input component that can be found on [its site](https://developer.dxc.com/halstack/8/components/text-input/#props).

#### HalAutocomplete Example

```JSX
import React, { useState } from "react";
import { HalAutocomplete } from "@dxc-technology/halstack-react-hal";

export default () => {
  const [autocompleteValue, changeAutocompleteValue] = useState("");
  const onChange = ({ newValue }) => {
    changeAutocompleteValue(newValue);
  };

  return (
    <HalAutocomplete
      collectionUrl="https://..."
      propertyName="full-name"
      label="Full Name"
      onChange={onChange}
      value={autocompleteValue}
    />
  );
};
```

### useHalResource Hook

#### useHalResource Parameters

| Name                                         | Default | Description                                                                                                                                                                                                                                                                                      |
| :------------------------------------------- | :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url: `string`                                |         | The URL of the resource. `Required`                                                                                                                                                                                                                                                              |
| headers: `object`                            |         | Contains the HTTP headers to be sent along with the HTTP requests to the URL indicated in the `url` prop. `Optional`                                                                                                                                                                             |
| asyncHeadersHandler: `() => Promise<object>` |         | Async function that will be executed right before every HTTP request in order to retrieve dynamic headers. It must return a promise that resolves into an object with the keys and values of the headers. These headers will be merged with the ones indicated in the `headers` prop. `Optional` |

#### useHalResource Return Array

The return value of this hook is an array with the following stateful variables. The property names in this table are just a reference, and you will need to identify them by item position. The table is sorted by item position within the array.

| Name                                                                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :----------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| resource: `HalResource`                                                                    | A [Halstack Client's HalResource](https://github.com/dxc-technology/halstack-client#halresource-object) instance of the resource behind the `url` parameter.<ul><li> It will be `null` until the resource is fetched.</li><li> It will be automatically refreshed if the execution of an interaction handler responds with an instance of the same resource.</li></ul>                                                                                                                                                                                                                                                                                                                    |
| requestStatus: `'idle'` \| `'fetching'` \| `'resolved'` \| `'rejected'` \| `'interaction'` | The status of the HTTP request to the `url` parameter.<ul><li> `'idle'` before the request is triggered</li><li> `'fetching'` after the request is triggered and the before we get a response.</li><li> `'resolved'` after getting a successful response. Only if it contains a HAL resource.</li><li> `'rejected'` after getting an error response. Or if response doesn't contain a HAL resource.</li><li> `'interaction'` during the execution of an interaction handler.</li></ul>                                                                                                                                                                                                    |
| requestError: `ErrorResponse`                                                              | The error object in case the request gets rejected. It will be `null` before getting the response or if the response is successful and contains a HAL resource.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| resourceInteractions: `object`                                                             | This is an object containing as many entries as interactions (`_options.links`) are available in the HAL resource. Each entry has the `rel` value of the interaction as a key, and a function that you can execute passing a payload as a parameter. Executing one of these functions will: <ul><li>Make the HTTP request associated to the given interaction.</li><li>Change the `requestStatus` to `'interaction'`, and then back to `'resolved'` (even when the request fails).</li><li>Update the `resource` if the request responds with a new representation of the same resource.</li><li>Return a promise, so that you can handle the resolution or rejection manually.</li></ul> |

#### useHalResource Example

```JSX
import React from "react";
import { useHalResource } from "@dxc-technology/halstack-react-hal";

export default () => {
  const [
    resource,
    requestStatus,
    requestError,
    resourceInteractions,
  ] = useHalResource({
    url: "https://...",
  });

  return <div>{requestStatus}</div>;
};
```

## Contributing

Before opening new issues or pull requests, please refer to [CONTRIBUTING.MD](https://github.com/dxc-technology/halstack-react-hal/blob/master/CONTRIBUTING.md).

## Development Setup

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

The project is divided in two main folders. One is for the actual library, and the other one is a React application using the library.

### Project

Install the dependencies for the library and the example project.

```bash
npm install
```

### Library

Contained in the `lib` folder.

Run the build process updating the bundled files inside the dist folder.

```bash
nx build halstack-react-hal #`npx nx build halstack-react-hal` if nx is not recognized as a command.
```

To run the tests you need to serve the mock API first

```bash
nx serve-test halstack-react-hal #`npx nx serve-test halstack-react-hal` if nx is not recognized as a command.
```

and then you can run the tests.

```bash
nx test halstack-react-hal #`npx nx test halstack-react-hal` if nx is not recognized as a command.
```

### Example Application

Contained in the `app` folder.

Start the application.

```bash
nx serve app #`npx nx serve app` if nx is not recognized as a command.
```

Now, anytime you make a change to the library or the app, `nx` will live-reload your local dev server so you can iterate on your component in real-time.
