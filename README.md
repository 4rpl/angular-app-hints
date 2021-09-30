[![npm version](https://badge.fury.io/js/angular-app-hints.svg)](https://badge.fury.io/js/angular-app-hints) [![Downloads](https://img.shields.io/npm/dm/angular-app-hints.svg)](https://www.npmjs.com/package/angular-app-hints) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/4rpl/angular-app-hints/master/LICENSE.md)


# Angular App Hints
Walkthrough/hints mode for Angular Applications.

## Demo
TODO

## Installation
```
npm i angular-app-hints --save
```

## Requirements
TODO

## Usage
All interaction is carried out through `AngularAppHintsService`.

### AngularAppHintsService
- `setConfig(config: Partial<AngularAppHintsConfig>): void`: sets a common configuration. See defalut values in <a href="#types">Types section</a>.
- `setPath(path: Path): void`: sets a path for next walkthrough.
- `go(): void`: starts the walkthrough.
- `close(): void`: closes the walkthrough.

### Types

#### AngularAppHintsConfig
|Property|Type|Default Value|
|-|-|-|
|`nextText`|string|`'Next'`|
|`prevText`|string|`'Previous'`|
|`closeText`|string|`'Close'`|
|`closeText`|string|`'Close'`|
|`closeOnEscape`|boolean|`true`|
|`enableAnimations`|boolean|`true`|
|`scrollIntoViewOptions`|ScrollIntoViewOptions|`{ behavior: 'smooth', block: 'center', inline: 'center' }`|

#### Path
```typescript
type Path = PathElement[];
```

#### PathElement
|Property|Required|Type|Description|
|-|-|-|-|
|`selector`|Yes|string|CSS selector for focus a HTML element. If the selector detect more than one, only the first occurence will be chosen|
|`message`|Yes|string|Your description text. Allows html markup|
|`disableClose`|No|boolean|Describes if user can close walkthrough on this step|
|`style.padding`|No|number|`padding` of the focus in px|
|`style.borderRadius`|No|number|`borderRadius` of the focus in px|

### Styling
|Name|Element|
|-|-|
|`.angular-app-hints__menu`|Message dialog window container|
|`.angular-app-hints__shadow`|Focus|
|`.angular-app-hints__menu-inner`|Message dialog window|
|`.angular-app-hints__message`|Message text|
|`.angular-app-hints__button`|Message dialog buttons|
|`.angular-app-hints__prev-button`|Prevoius button|
|`.angular-app-hints__next-button`|Next button|
|`.angular-app-hints__close-button`|Close button|
|`.angular-app-hints__container-animations`|Describes animations if `enableAnimations` turned on. Works with `.angular-app-hints__shadow` and `.angular-app-hints__menu`|


### Basic Example
```typescript
export class MyComponent {

  constructor(
    private hintService: AngularAppHintsService,
  ) { }

  public start(): void {
    this.hintService.setPath([{
      selector: '.my-class-1',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    }, {
      selector: '.my-class-2',
      message: 'Donec blandit elementum eleifend',
    }]);
    this.hintService.go();
  }
}
```
