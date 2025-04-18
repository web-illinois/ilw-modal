# ilw-modal

Links: **[ilw-modal in Builder](https://builder3.toolkit.illinois.edu/component/ilw-modal/index.html)** | 
[Illinois Web Theme](https://webtheme.illinois.edu/) | 
[Toolkit Development](https://github.com/web-illinois/toolkit-management)

## Overview

The Illinois theme component ilw-modal provides a modal dialog box that is displayed on top of the current page. It is used to display information or prompt the user for input without navigating away from the current page.

The default color background color is white, there is also a gray option for the background.

The default size for the modal is medium, there is also a small and large option.

Text alignment is left by default, but can be changed to center.

There is a close button in the top right corner of the modal. The modal can be closed by clicking the close button or by clicking outside the modal.

There is a slot for the modal title, body, and an optional image.

To trigger the modal, place a button or link with the attribute `data-modal-target` and the id of the modal you want to open.

### Attributes
* id: The id of the modal is required. This is used to trigger the modal from a button or link. The default is `modal`.  The ID must be unique on the page.

* size: Default is ```medium```: width = 50%, other options are  ```small```: width = 35% and ```large```: width = 1200px.

* theme: Default is white background. Other theme available is ```gray```.

* align: Default is left. Other option is ```center```.

## Code Example for Button Triggering the Modal

```html
<button class="ilw-button" data-modal-target="modal">Open Modal</button>

<a href="javascript:void(0)" class="ilw-button" data-modal-target="modal" role="button">Open Modal</a>
```
## Code Example for Modal

```html
<ilw-modal size="small" theme="gray" align="center" id="modal">
    <img src="https://picsum.photos/570/300" alt="" slot="image">
    <h2 slot="title">Apply to the College</h2>
    <div style="margin-bottom: 1rem;">Congratulations! You've taken the first step to becoming a student of the College of Education.
        The application process is different for undergraduate and graduate studies.</div>
    <button class="ilw-button">Undergraduate Degree</button>
    <button class="ilw-button">Graduate Degree and Transcriptable Credential</button>
    <button class="ilw-button">Non-Degree Credential</button>
</ilw-modal>

<ilw-modal id="modal-id" size="medium">
    <img src="https://picsum.photos/700/400" alt="" slot="image">
    <h2 slot="title">Medium Modal</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lectus velit, feugiat in lacinia eget, tristique ut orci. Phasellus ut egestas tellus. In hac habitasse platea dictumst.</p>
    <form>
        <label for="email">Enter your email</label>
        <div class="form-row">
            <input type="email" id="email" name="email" required>
            <button class="ilw-button" type="submit">Submit</button>
        </div>
    </form>
</ilw-modal>

<ilw-modal id="modal-id1" size="large">
    <img src="https://picsum.photos/1200/500" alt="" slot="image">
    <h2 slot="title">Large Modal</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lectus velit, feugiat in lacinia eget, tristique ut orci. Phasellus ut egestas tellus. In hac habitasse platea dictumst.</p>
    <form>
        <label for="email">Enter your email</label>
        <div class="form-row">
            <input type="email" id="email" name="email" required>
            <button class="ilw-button" type="submit">Submit</button>
        </div>
    </form>
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