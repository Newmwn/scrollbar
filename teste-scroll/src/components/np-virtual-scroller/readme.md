# np-virtual-scroller

<!-- Auto Generated Below -->

## Properties

| Property                    | Attribute                 | Description                                                                                                                                                                                                | Type                                         | Default              |
| --------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | -------------------- |
| `bufferItems`               | `bufferitems`             | Extra items to be rendered after and before the visible items                                                                                                                                              | `number`                                     | `10`                 |
| `customAutoFlowStyle`       | `customautoflowstyle`     | Custom Grid Auto Flow Style                                                                                                                                                                                | `string`                                     | `null`               |
| `customGridTemplateStyle`   | `customgridtemplatestyle` | Custom Grid Template Style                                                                                                                                                                                 | `string`                                     | `null`               |
| `direction`                 | `direction`               | the direction of the virtuall scroller                                                                                                                                                                     | `Direction.Horizontal \| Direction.Vertical` | `Direction.Vertical` |
| `elemFocusClass`            | `elemfocusclass`          | if this element is given, then it will receive the focus class                                                                                                                                             | `string`                                     | `undefined`          |
| `elemToFocus`               | `elemtofocus`             | The element to give focus to                                                                                                                                                                               | `string`                                     | `undefined`          |
| `extraKeyNavIndex`          | `extrakeynavindex`        | Used when there are items in the virtuall scroller that aren't view port items, so to make the key nav work (temporary fix)                                                                                | `number`                                     | `0`                  |
| `focusFirstItem`            | `focusfirstitem`          | If true, focus on the first item on the list                                                                                                                                                               | `boolean`                                    | `false`              |
| `gap`                       | `gap`                     |                                                                                                                                                                                                            | `number`                                     | `12`                 |
| `identifiers`               | --                        | Array of unique Identifiers for comparation between items, This is used to optimize the list performance when adding, removing or changing the position of list items                                      | `any[]`                                      | `['id']`             |
| `isResizable`               | `isresizable`             | if set to true, virtual scroller will listen to resize events, this is usefull because when there are more visible items we need more items need to be rendered, so that the scroller continues being fast | `boolean`                                    | `false`              |
| `itemContainerStyles`       | `itemcontainerstyles`     | Styles to be applied to the item container                                                                                                                                                                 | `any`                                        | `{}`                 |
| `itemTemplate` _(required)_ | `itemtemplate`            | this callback will emit the index of the list item to be rendered                                                                                                                                          | `any`                                        | `undefined`          |
| `itemsPerGroup`             | `itemspergroup`           | In case of direction === 'vertical', this will be the number of collumns. In case of direction === 'horizontal', this will be the number of rows                                                           | `number`                                     | `1`                  |
| `keyboardNavigation`        | `keyboardnavigation`      | if true, list navigation via keyboard will be available                                                                                                                                                    | `boolean`                                    | `true`               |
| `resizeDelay`               | `resizedelay`             | The amout of delay time to be applied in the throtle funciton on list resize events                                                                                                                        | `number`                                     | `100`                |
| `scrollDelay`               | `scrolldelay`             | The amout of delay time to be applied in the throtle funciton on list scroll events                                                                                                                        | `number`                                     | `100`                |
| `tabNavigation`             | `tabnavigation`           | if true, list navigation via tab will be available                                                                                                                                                         | `boolean`                                    | `false`              |
| `viewPortItemStyles`        | `viewportitemstyles`      | Styles to be applied to the item wrapper                                                                                                                                                                   | `any`                                        | `{}`                 |
| `viewPortItems`             | --                        | The list of items that will populate the virtual scroll list                                                                                                                                               | `any[]`                                      | `[]`                 |

## Events

| Event                     | Description                                             | Type               |
| ------------------------- | ------------------------------------------------------- | ------------------ |
| `scrollEvent`             | Called whenever the user is scrolling                   | `CustomEvent<any>` |
| `scrollHeightChangeEvent` | Called when the height of the virtuall scroller changes | `CustomEvent<any>` |
| `scrollStartEvent`        | Called when the user starts scrolling                   | `CustomEvent<any>` |
| `scrollStopEvent`         | Called when the user stops scrolling                    | `CustomEvent<any>` |

## Methods

### `addEventListeners(focusFirstItem?: boolean) => Promise<void>`

#### Parameters

| Name             | Type      | Description |
| ---------------- | --------- | ----------- |
| `focusFirstItem` | `boolean` |             |

#### Returns

Type: `Promise<void>`

### `getKeyNav() => Promise<NpVirtualKeyNav>`

#### Returns

Type: `Promise<NpVirtualKeyNav>`

### `removeEventListeners() => Promise<void>`

#### Returns

Type: `Promise<void>`

### `scrollInto(item: any, scrollingBehavior?: "smooth" | "instant" | "auto") => Promise<void>`

This function let's us automatically scroll to an item in the list

#### Parameters

| Name                | Type                              | Description |
| ------------------- | --------------------------------- | ----------- |
| `item`              | `any`                             |             |
| `scrollingBehavior` | `"auto" \| "smooth" \| "instant"` |             |

#### Returns

Type: `Promise<void>`

### `scrollToIndex(index?: number, scrollingBehavior?: "smooth" | "instant" | "auto", itemIndex?: number) => Promise<void>`

This function let's us automatically scroll to an item in the list via index

#### Parameters

| Name                | Type                              | Description |
| ------------------- | --------------------------------- | ----------- |
| `index`             | `number`                          |             |
| `scrollingBehavior` | `"auto" \| "smooth" \| "instant"` |             |
| `itemIndex`         | `number`                          |             |

#### Returns

Type: `Promise<void>`

### `scrollToNextItem(scrollingBehavior?: "smooth" | "instant" | "auto", extraValue?: number) => Promise<void>`

This function scroll to the next item thats hidden

#### Parameters

| Name                | Type                              | Description |
| ------------------- | --------------------------------- | ----------- |
| `scrollingBehavior` | `"auto" \| "smooth" \| "instant"` |             |
| `extraValue`        | `number`                          |             |

#### Returns

Type: `Promise<void>`

### `scrollToPosition(scrollPosition?: number, scrollingBehavior?: "smooth" | "instant" | "auto") => Promise<void>`

This function let's us automatically scroll to a position in the list

#### Parameters

| Name                | Type                              | Description |
| ------------------- | --------------------------------- | ----------- |
| `scrollPosition`    | `number`                          |             |
| `scrollingBehavior` | `"auto" \| "smooth" \| "instant"` |             |

#### Returns

Type: `Promise<void>`

### `scrollToPreviousItem(scrollingBehavior?: "smooth" | "instant" | "auto", extraValue?: number) => Promise<void>`

This function scroll to the previous item thats hidden

#### Parameters

| Name                | Type                              | Description |
| ------------------- | --------------------------------- | ----------- |
| `scrollingBehavior` | `"auto" \| "smooth" \| "instant"` |             |
| `extraValue`        | `number`                          |             |

#### Returns

Type: `Promise<void>`

---

_Built with [StencilJS](https://stenciljs.com/)_
