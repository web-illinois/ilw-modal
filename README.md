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
## Code Examples

```html
<ilw-modal></ilw-modal>
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
