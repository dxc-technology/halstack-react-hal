# Assure HAL React Components

Assure HAL React Components is an npm library of reusable React components. It brings together two different responsibilities:

- Consuming HAL REST APIs implemented following the [DXC API Guidelines](https://developer.dxc.com/apis).

- Rendering these API resources as UI components that are compliant with the [DXC UX Guidelines](https://developer.dxc.com/design/principles).

We have other libraries that will help you handling these responsibilities individually ([Halstack Client](https://github.com/dxc-technology/dxc-halstack-client) / [Assure React CDK](https://github.dxc.com/DIaaS/diaas-react-cdk)). Assure HAL React Components uses them under the hood, but it's a higher level abstraction that puts both responsibilities together using the most common association patterns.

For example, collection resources are often associated with tables, and there are a lot of semantics in the standards described by the DXC API guidelines for collections (sorting, paginating...) that could be associated with UI interactions (clicking a table header for sorting, clicking pages for paginating)

## Usage

Assure HAL React Components is distributed as an npm library. In order to use it in an existing project, you must install it first:

```bash
npm install @diaas/diaas-react-hal-components
```

The library provides the following components and hooks to be used in your React application:

Components

- [HalTable](#haltable-component)

Hooks

- [useHalResource](#usehalresource-hook)

### HalTable Component

#### Hal Table Usage

```JSX
import { HalTable } from "@diaas/diaas-react-hal-components";
```

#### Hal Table Props

| Name                                    | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :-------------------------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| colletionUrl: `string`                  |         | The URL of the collection resource to be used for the table. `Required`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| headers: `Object`                       |         | Contains the http headers to be sent along with the http requests to the collectionUrl. `Optional`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| asyncHeadersHandler: `()=>Promise<obj>` |         | Async function that will be executed right before every http request in order to retrieve dynamic headers. It must return a promise that resolves into an object with the keys and values of the headers. These headers will be merged with the ones indicated in the `headers` prop.`Optional`                                                                                                                                                                                                                                                                                                                                                          |
| itemsPerPage: `number`                  | 5       | The amount of items to be displayed per page. Will be used to calculate the `_start` and `_num` query parameters that will be sent to the collection for pagination. `Optional`                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| columns: `array<obj>`                   | []      | Array of objects specifying the columns to be displayed in the table. Each object has:<br> - <b>header</b>: Column label to be place at the table header.<br> - <b>displayProperty</b>: The name of the property in the items summary to be rendered for this column in the table.<br>  - <b>sortProperty</b>: The name of the property in the items summary to be used for sorting the table.<br> - <b>onClickItemFunction</b>: Callback function that will be executed when the user clicks an item in that column. The collection item will be passed to this function when executed.<br> - <b>mapFunction</b>: Callback function that must return the value to be rendered in that column for a specific item. The item will be passed to this function as a parameter. |

#### HAL Table Example

```JSX
import React from "react";
import { HalTable } from "@diaas/diaas-react-hal-components";

export default () => {
  return (
    <HalTable
      colletionUrl={"https://..."}
      columns={[
        {
          header: "Username",
          displayProperty: "username",
          sortProperty: "username"
        },
        {
          header: "Status",
          property: "status",
        },
        {
          header: "Enabled",
          property: "enabled",
        },
      ]}
    ></HalTable>
  );
};
```

### useHalResource Hook

#### useHalResource Usage

```JSX
import { useHalResource } from "@diaas/diaas-react-hal-components";
```

#### useHalResource Parameters

| Name                                    | Default | Description                                                                                                                                                                                                                                                                                     |
| :-------------------------------------- | :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url: `string`                           |         | The URL of the resource. `Required`                                                                                                                                                                                                                                                             |
| headers: `Object`                       |         | Contains the http headers to be sent along with the http requests to the url indicated in the `url` prop. `Optional`                                                                                                                                                                            |
| asyncHeadersHandler: `()=>Promise<obj>` |         | Async function that will be executed right before every http request in order to retrieve dynamic headers. It must return a promise that resolves into an object with the keys and values of the headers. These headers will be merged with the ones indicated in the `headers` prop.`Optional` |

#### useHalResource return array

The return value of this hook is an array with the following stateful variables. The property names in this table are just a reference, and you will need to identify them by item position. The table is sorted by item position within the array.

| Name                                                                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :----------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| resource: `HalResource`                                                                    | A [Halstack Client's HalResource](https://github.com/dxc-technology/dxc-halstack-client#halresource-object) instance of the resource behind the `url` parameter.<ul><li> It will be `null` until the resource is fetched.</li><li> It will be automatically refreshed if the execution of an interaction handler responds with an instance of the same resource.</li></ul>                                                                                                                                                                                         |
| requestStatus: `'idle'` \| `'fetching'` \| `'resolved'` \| `'rejected'` \| `'interaction'` | The status of the http request to the `url` parameter.<ul><li> `'idle'` before the request is triggered</li><li> `'fetching'` after the request is triggered and the before we get a response.</li><li> `'resolved'` after getting a successful response. Only if it contains a HAL resource.</li><li> `'rejected'` after getting an error response. Or if response doesn't contain a HAL resource.</li><li> `'interaction'` during the execution of an interaction handler.</li></ul> |
| requestError: `string`                                                                     | The error message in case the request gets rejected. It will be `null` before getting the response or if the response is successful and contains a HAL resource.                                                                                                                                                                                                                                                                                                                                                               |
| resourceInteractions: `HalInteraction`                                                                     | This is [Halstack Client's HalInteraction](https://github.com/dxc-technology/dxc-halstack-client#halinteraction-object) instance containing as many entries as interactions (_options.links) are available in the HAL resource. Each entry has the rel of the interaction as a key, and is a function that you can execute passing a payload as a parameter. Executing one of these functions will: <ul><li>Make the http request associated to the given interaction.</li><li>Change the `requestStatus` to `'interaction'`, and then back to `'resolved'` (even when the request fails).</li><li>Update the `resource` if the request responds with a new representation of the same resource.</li><li>Return a promise, so that you can handle the resolution or rejection manually.</li></ul>                                                                                                                                                                                                                                                                                                                                                           |

#### useHalResource example

```JSX
import React from "react";
import { useHalResource } from "@diaas/diaas-react-hal-components";

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

Before opening new issues or pull requests, please refer to [CONTRIBUTING.MD](https://github.dxc.com/DIaaS/diaas-react-hal-components/blob/master/CONTRIBUTING.md).

## Development Setup

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

The project is divided in two main folders. One is for the actual library, and the other one is a React application using the library.

### Library

Contained in the `lib` folder.

```bash
cd lib
```

Install the library dependencies.

```bash
npm install
```

Run the build process into `dist` folder, detecting and automatically building changes in src.

```bash
npm run build:watch # or 'npm run build' if there is no need to watch for changes
```

### Example Application

Contained in the `app` folder.

```bash
cd app # from the root folder
```

Install the application dependencies. The Assure React CDK dependency is linked to the local `lib` folder. This one must have been previously built.

```bash
npm install
```

Start the application.

```bash
npm start # runs create-react-app dev server
```

Now, anytime you make a change to the library or the app, `create-react-app` will live-reload your local dev server so you can iterate on your component in real-time.

## Running the tests
