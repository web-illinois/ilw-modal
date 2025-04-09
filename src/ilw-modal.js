import { LitElement, html, unsafeCSS } from "lit";
import styles from './ilw-modal.styles.css?inline';
import './ilw-modal.css';

class Modal extends LitElement {

    static get properties() {
        return {
            theme: { type: String, attribute: true },
            open: { type: Boolean, reflect: true },
            size: { type: String, attribute: true },
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
        this._hasGraphic = false;
    }

    /**
     * Tracks the number of graphic elements in the card, so we can
     * hide the graphics container if there's no graphics.
     *
     * @private
     */
    _slotsChanged() {
        const images = this.shadowRoot.querySelector("slot[name=image]");
        if (images.assignedElements().length > 0) {
            this._hasGraphic = true;
            return;
        }
        this._hasGraphic = false;
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
    <div class="modal ${this.size}" role="dialog" aria-labelledby="modal-title" aria-modal="true" @click=${e => e.stopPropagation()}>
    <div class="modal-header">
          <div class="modal-image ${this._hasGraphic ? '' : 'hidden'}">
          <slot name="image" @slotchange=${this._slotsChanged}></slot>
    </div>
        <h2 id="modal-title"><slot name="title"></slot></h2>
        <button class="close-btn" @click=${this.closeModal} aria-label="Close modal">&times;</button>
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