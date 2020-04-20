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
- [Table](#hal-table-component)

Hooks
- [Use HAL Resource](#use-hal-resource-hook)
- [Use HAL Collection](#use-hal-collection-hook)

 
### HAL Table Component

| Name      | Type          | Default | Description                                                                                                                                        |
| :-------- | :------------ | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| colletionUrl | `string` | Null | The message-body is the data bytes transmitted assoiciated with a http response. `Required`                                                                 |
| headers | `JSON Object` | Null | Contains the http headers to be sent along with the requests to the collectionUrl. `Optional`      |
| itemsPerPage  | `number`      | 5    | The amount of items to be displayed per page. Will be used to calculate the `_start` and `_num` query parameters that will be sent to the collection for pagination. `Optional`|
| columns | `array<obj>`  | []    | Array of objects specifying the columns to be displayed in the table. Each object has:<br> - <b>header</b>: Column label to be place at the table header.<br> - <b>property</b>: The name of the property in the items summary to be rendered for this column in the table.<br> - <b>onClickItemFunction</b>: Callback function that will be executed when the user clicks an item in that column. The collection item will be passed to this function when executed.<br> - <b>mapFunction</b>: Callback function that must return the value to be rendered in that column for a specific item. The item will be passed to this function as a parameter.

### Use HAL Resource Hook
ToDo: useHalResource Docs

### Use HAL Collection Hook
ToDo: useHalCollection Docs


## Contributing

Before opening new issues or pull requests, please refer to [CONTRIBUTING.MD](https://github.dxc.com/DIaaS/diaas-react-cdk/blob/master/CONTRIBUTING.md).

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
