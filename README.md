# ilw-modal

Links: **[ilw-modal in Builder](https://builder3.toolkit.illinois.edu/component/ilw-modal/index.html)** | 
[Illinois Web Theme](https://webtheme.illinois.edu/) | 
[Toolkit Development](https://github.com/web-illinois/toolkit-management)

## Overview

The Illinois theme component ilw-modal provides a modal dialog box that is displayed on top of the current page. It is used to display information or prompt the user for input without navigating away from the current page.

The default color background color is white, there is also a gray option for the background.

The default size for the modal is medium, there is also a small and large option.

There is a close button in the top right corner of the modal. The modal can be closed by clicking the close button or by clicking outside the modal.

There is a slot for the modal title, body, and an optional image.

To trigger the modal, place a button or link with the attribute `data-modal-target` and the id of the modal you want to open.

### Attributes
* size: Default is ```medium```: width = 50%, other options are  ```small```: width = 35% and ```large```: width = 75%.

* theme: Default is white background. Other themes available are ```gray```.

## Code Example For Button Triggering Modal

```html
<button class="ilw-button" data-modal-target="modal-id">Open Modal</button>

<a href="javascript:void(0)" class="ilw-button" data-modal-target="modal-id" role="button">Open Modal</a>
```
## Code Example For Modal

```html
<ilw-modal id="modal-id" size="small">
    <h2 slot="title">Small Modal</h2>
    <div slot="body">This is a small modal.</div>
</ilw-modal>

<ilw-modal id="modal-id1" size="medium">
    <h2 slot="title">Medium Modal</h2>
    <div slot="body">This is a medium modal.</div>
</ilw-modal>

<ilw-modal id="modal-id2" size="large">
    <h2 slot="title">Large Modal</h2>
    <div slot="body">This is a large modal.</div>
</ilw-modal>
```

## Accessibility Notes and Use

Consider accessibility, both for building the component and for its use:

- Is there sufficient color contrast?
- Can the component be fully understood without colors?
- Does the component need alt text or ARIA roles?
- Can the component be navigated with a keyboard? Is the tab order correct?
- Are focusable elements interactive, and interactive elements focusable?
- Are form fields, figures, fieldsets and other interactive elements labelled?

## External References

https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/