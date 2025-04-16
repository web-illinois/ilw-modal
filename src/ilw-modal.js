import { LitElement, html, unsafeCSS } from "lit";
import styles from './ilw-modal.styles.css?inline';
import './ilw-modal.css';

class Modal extends LitElement {

    static get properties() {
        return {
            theme: { type: String, attribute: true },
            open: { type: Boolean, reflect: true },
            size: { type: String, attribute: true },
            align: { type: String, attribute: true },
            _hasGraphic: { state: true, type: Boolean }
        };
    }

    static get styles() {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
        this.theme = '';
        this.open = false;
        this.size = 'medium';
        this.align = '';
        this._hasGraphic = false;

        this._focusableElements = [];
        this._firstFocusable = null;
        this._lastFocusable = null;
        this._activeTrigger = null;
    }

    firstUpdated() {
        this.updateComplete.then(() => this._slotsChanged());
    }

    updated(changedProps) {
        if (changedProps.has('open')) {
            if (this.open) {
                this._setInitialFocus();
                document.addEventListener('keydown', this._handleKeydown);
            } else {
                document.removeEventListener('keydown', this._handleKeydown);
                if (this._activeTrigger) {
                    this._activeTrigger.focus();
                    this._activeTrigger = null;
                }
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this.handleExternalTrigger);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this.handleExternalTrigger);
        document.removeEventListener('keydown', this._handleKeydown);
    }

    handleExternalTrigger = (event) => {
        const target = event.target.closest('[data-modal-target]');
        if (target && target.getAttribute('data-modal-target') === this.id) {
            this._activeTrigger = target;
            this.open = true;
            requestAnimationFrame(() => this._setInitialFocus());
        }
    };

    closeModal() {
        this.open = false;
    }

    _slotsChanged = () => {
        const slot = this.shadowRoot.querySelector("slot[name=image]");
        if (slot) {
            const hasImage = slot.assignedElements().length > 0;
            if (hasImage !== this._hasGraphic) {
                this._hasGraphic = hasImage;
            }
        }
    }

    _setInitialFocus() {
        const shadowFocusables = this.shadowRoot.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const slots = this.shadowRoot.querySelectorAll('slot');
        let lightFocusables = [];

        slots.forEach(slot => {
            const assignedElements = slot.assignedElements({ flatten: true }) || [];

            assignedElements.forEach(el => {
                // If an autofocus element is present, use it and return early
                if (el.hasAttribute('autofocus')) {
                    el.focus();
                    return;
                }

                // Include the element itself if it’s focusable
                if (el.matches('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')) {
                    lightFocusables.push(el);
                }

                // Include all focusable descendants
                lightFocusables.push(...el.querySelectorAll(
                  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                ));
            });
        });

        const allFocusables = [...lightFocusables, ...shadowFocusables];

        // Move close buttons to the end of the list
        const closeButtons = allFocusables.filter(el => el.classList.contains('close-btn'));
        this._focusableElements = allFocusables.filter(el => !el.classList.contains('close-btn')).concat(closeButtons);

        this._firstFocusable = this._focusableElements[0];
        this._lastFocusable = this._focusableElements[this._focusableElements.length - 1];

        // If nothing is currently focused, set initial focus
        if (!document.activeElement || document.activeElement === document.body) {
            if (this._firstFocusable) {
                this._firstFocusable.focus();
            } else {
                // Fallback: focus the modal container if no focusables found
                const modalContainer = this.shadowRoot.querySelector('.modal');
                if (modalContainer) {
                    modalContainer.setAttribute('tabindex', '-1');
                    modalContainer.focus({ preventScroll: true });
                }
            }
        }
    }


    _handleKeydown = (e) => {
        if (!this.open || this._focusableElements.length === 0) return;

        const activeElement = this.shadowRoot.activeElement || document.activeElement;

        switch (e.key) {
            case 'Escape':
                this.closeModal();
                break;

            case 'Tab':
                e.preventDefault();
                const currentIndex = this._focusableElements.indexOf(activeElement);

                if (currentIndex === -1) {
                    // Fallback if focus is not in list
                    this._firstFocusable.focus();
                    return;
                }

                if (e.shiftKey) {
                    const prevIndex = (currentIndex - 1 + this._focusableElements.length) % this._focusableElements.length;
                    this._focusableElements[prevIndex].focus();
                } else {
                    const nextIndex = (currentIndex + 1) % this._focusableElements.length;
                    this._focusableElements[nextIndex].focus();
                }
                break;
        }
    };


    render() {
        return html`
            <div class="backdrop" tabindex="-1" @click=${this.closeModal} aria-hidden=${!this.open}>
                <div class="modal ${this.size} ${this.align}" role="dialog" aria-labelledby="modal-title" aria-modal="true" @click=${e => e.stopPropagation()}>

                    <div class="modal-image ${this._hasGraphic ? '' : 'hidden'}">
                        <slot name="image" @slotchange=${this._slotsChanged}></slot>
                        <button class="close-btn" @click=${this.closeModal} aria-label="Close modal"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.26 51.26">
                            <path fill="currentColor" d="m37.84 32.94-7.63-7.63 7.63-7.63a3.24 3.24 0 0 0-4.58-4.58l-7.63 7.63L18 13.1a3.24 3.24 0 0 0-4.58 4.58L21 25.31l-7.62 7.63A3.24 3.24 0 1 0 18 37.52l7.63-7.63 7.63 7.63a3.24 3.24 0 0 0 4.58-4.58Z"/>
                        </svg></button>
                    </div>

                    <div class="modal-header ${this._hasGraphic ? 'with-image' : ''}">
                        <h2 id="modal-title"><slot name="title"></slot></h2>
                        ${!this._hasGraphic ? html`
                            <button class="close-btn" @click=${this.closeModal} aria-label="Close modal">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.26 51.26">
                                    <path fill="currentColor" d="m37.84 32.94-7.63-7.63 7.63-7.63a3.24 3.24 0 0 0-4.58-4.58l-7.63 7.63L18 13.1a3.24 3.24 0 0 0-4.58 4.58L21 25.31l-7.62 7.63A3.24 3.24 0 1 0 18 37.52l7.63-7.63 7.63 7.63a3.24 3.24 0 0 0 4.58-4.58Z"/>
                                </svg>
                            </button>
                        ` : ''}
                    </div>

                    <div class="modal-body">
                        <slot></slot>
                    </div>

                </div>
            </div>
        `;
    }
}

customElements.define('ilw-modal', Modal);
