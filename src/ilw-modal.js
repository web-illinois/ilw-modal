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
    }

    firstUpdated() {
        this.updateComplete.then(() => this._slotsChanged());
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

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this.handleExternalTrigger);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this.handleExternalTrigger);
    }

    handleExternalTrigger = (event) => {
        const target = event.target.closest('[data-modal-target]');
        if (target && target.getAttribute('data-modal-target') === this.id) {
            this.open = true;
        }
    };

    closeModal() {
        this.open = false;
    }

    render() {
        return html`
            <div class="backdrop" @click=${this.closeModal} aria-hidden=${!this.open}>
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