
# React HAL Components

## HAL Table Component

| Name      | Type          | Default | Description                                                                                                                                        |
| :-------- | :------------ | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| colletionUrl | `string` | Null | The message-body is the data bytes transmitted assoiciated with a http response. `Required`                                                                 |
| headers | `JSON Object` | Null | Contains the http headers to be sent along with the requests to the collectionUrl. `Optional`      |
| itemsPerPage  | `number`      | 5    | The amount of items to be displayed per page. Will be used to calculate the `_start` and `_num` query parameters that will be sent to the collection for pagination. `Optional`|
| columns | `array<obj>`  | []    | Array of objects specifying the columns to be displayed in the table. Each object has:<br> - <b>header</b>: Column label to be place at the table header.<br> - <b>property</b>: The name of the property in the items summary to be rendered for this column in the table.<br> - <b>onClickItemFunction</b>: Callback function that will be executed when the user clicks an item in that column. The collection item will be passed to this function when executed.<br> - <b>mapFunction</b>: Callback function that must return the value to be rendered in that column for a specific item. The item will be passed to this function as a parameter.

