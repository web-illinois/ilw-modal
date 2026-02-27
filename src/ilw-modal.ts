import { LitElement, html, unsafeCSS, PropertyValues, CSSResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
// @ts-ignore
import styles from './ilw-modal.styles.css?inline';
import './ilw-modal.css';

@customElement('ilw-modal')
export default class Modal extends LitElement {
    @property({ type: String, attribute: true })
    theme: string = '';

    @property({ type: Boolean, reflect: true })
    open: boolean = false;

    @property({ type: String, attribute: true })
    size: string = 'medium';

    @property({ type: String, attribute: true })
    align: string = '';

    @property({ type: String, attribute: true })
    override id: string = 'modal';

    @state()
    private _hasGraphic: boolean = false;

    private _focusableElements: Element[] = [];
    private _firstFocusable: Element | null = null;
    private _lastFocusable: Element | null = null;
    private _activeTrigger: Element | null = null;

    private static _scrollLockCount = 0;

    private _prevHtmlOverflow: string | null = null;
    private _prevBodyOverflow: string | null = null;
    private _prevBodyPaddingRight: string | null = null;

    private _lockPageScroll() {
        if (Modal._scrollLockCount === 0) {
            const html = document.documentElement;
            const body = document.body;

            this._prevHtmlOverflow = html.style.overflow;
            this._prevBodyOverflow = body.style.overflow;
            this._prevBodyPaddingRight = body.style.paddingRight;

            // Prevent layout shift when scrollbar disappears
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            if (scrollbarWidth > 0) {
                body.style.paddingRight = `${scrollbarWidth}px`;
            }

            html.style.overflow = 'hidden';
            body.style.overflow = 'hidden';
        }

        Modal._scrollLockCount++;
    }

    private _unlockPageScroll() {
        Modal._scrollLockCount = Math.max(0, Modal._scrollLockCount - 1);

        if (Modal._scrollLockCount === 0) {
            const html = document.documentElement;
            const body = document.body;

            html.style.overflow = this._prevHtmlOverflow ?? '';
            body.style.overflow = this._prevBodyOverflow ?? '';
            body.style.paddingRight = this._prevBodyPaddingRight ?? '';

            this._prevHtmlOverflow = null;
            this._prevBodyOverflow = null;
            this._prevBodyPaddingRight = null;
        }
    }

    static override get styles(): CSSResult {
        return unsafeCSS(styles);
    }

    constructor() {
        super();
    }

    protected override firstUpdated(changedProps: PropertyValues): void {
        super.firstUpdated(changedProps);
        this.updateComplete.then(() => this._slotsChanged());
    }

    protected override updated(changedProps: PropertyValues): void {
        super.updated(changedProps);

        if (changedProps.has('open')) {
            if (this.open) {
                this._lockPageScroll();
                this._setInitialFocus();
                document.addEventListener('keydown', this._handleKeydown);
            } else {
                this._unlockPageScroll();
                document.removeEventListener('keydown', this._handleKeydown);

                if (this._activeTrigger && this._activeTrigger instanceof HTMLElement) {
                    this._activeTrigger.focus();
                    this._activeTrigger = null;
                }
            }
        }
    }

    override connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener('click', this.handleExternalTrigger);
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.open) this._unlockPageScroll(); // Ensure scroll is unlocked if component is removed while open
        document.removeEventListener('click', this.handleExternalTrigger);
        document.removeEventListener('keydown', this._handleKeydown);
    }

    private handleExternalTrigger = (event: Event): void => {
        const target = (event.target as Element)?.closest('[data-modal-target]');
        if (target && target.getAttribute('data-modal-target') === this.id) {
            this._activeTrigger = target;
            this.open = true;
            requestAnimationFrame(() => this._setInitialFocus());
        }
    };

    public closeModal(): void {
        this.open = false;
    }

    private _slotsChanged = (): void => {
        const slot = this.shadowRoot?.querySelector("slot[name=image]") as HTMLSlotElement;
        if (slot) {
            const hasImage = slot.assignedElements().length > 0;
            if (hasImage !== this._hasGraphic) {
                this._hasGraphic = hasImage;
            }
        }
    }

    private _setInitialFocus(): void {
        const modalContainer = this.shadowRoot?.querySelector('.modal') as HTMLElement;
        if (modalContainer) {
            // Ensure it's focusable
            modalContainer.setAttribute('tabindex', '-1');
            modalContainer.focus({ preventScroll: true });
        }

        // Collect focusable elements
        const shadowFocusables = Array.from(
            this.shadowRoot?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) || []
        );

        const slots = this.shadowRoot?.querySelectorAll('slot') || [];
        let lightFocusables: Element[] = [];

        slots.forEach((slot: HTMLSlotElement) => {
            const assignedElements = slot.assignedElements({ flatten: true }) || [];

            assignedElements.forEach((el: Element) => {
                if (el.hasAttribute('autofocus') && el instanceof HTMLElement) {
                    el.focus();
                    return;
                }

                if (el.matches('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')) {
                    lightFocusables.push(el);
                }

                lightFocusables.push(...Array.from(el.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )));
            });
        });

        const allFocusables = [...lightFocusables, ...shadowFocusables];

        // Move close buttons to end
        const closeButtons = allFocusables.filter((el: Element) =>
            el.classList.contains('close-btn')
        );
        this._focusableElements = allFocusables
            .filter((el: Element) => !el.classList.contains('close-btn'))
            .concat(closeButtons);

        this._firstFocusable = this._focusableElements[0] || null;
        this._lastFocusable = this._focusableElements[this._focusableElements.length - 1] || null;
    }

    private _handleKeydown = (e: KeyboardEvent): void => {
        if (!this.open || this._focusableElements.length === 0) return;

        const activeElement = this.shadowRoot?.activeElement || document.activeElement;

        switch (e.key) {
            case 'Escape':
                this.closeModal();
                break;

            case 'Tab':
                e.preventDefault();
                const currentIndex = this._focusableElements.indexOf(activeElement as Element);

                if (currentIndex === -1) {
                    // Fallback if focus is not in list
                    if (this._firstFocusable instanceof HTMLElement) {
                        this._firstFocusable.focus();
                    }
                    return;
                }

                if (e.shiftKey) {
                    const prevIndex = (currentIndex - 1 + this._focusableElements.length) % this._focusableElements.length;
                    const prevElement = this._focusableElements[prevIndex];
                    if (prevElement instanceof HTMLElement) {
                        prevElement.focus();
                    }
                } else {
                    const nextIndex = (currentIndex + 1) % this._focusableElements.length;
                    const nextElement = this._focusableElements[nextIndex];
                    if (nextElement instanceof HTMLElement) {
                        nextElement.focus();
                    }
                }
                break;
        }
    };

    protected override render() {
        return html`
            <div class="backdrop" @click=${this.closeModal} aria-hidden=${!this.open}>
                <div class="modal ${this.size} ${this.align}" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" tabindex="-1" aria-modal="true" @click=${(e: Event) => e.stopPropagation()}>

                    <!-- Title -->
                    <div class="modal-header" id="modal-title">
                        <slot name="title"></slot>
                    </div>

                    <!-- Image -->
                    <div class="modal-image ${this._hasGraphic ? '' : 'hidden'}">
                        <slot name="image" @slotchange=${this._slotsChanged}></slot>
                    </div>

                    <!-- Main body content -->
                    <div class="modal-body" id="modal-description">
                        <slot></slot>
                    </div>

                    <!-- Close button -->
                    <button class="close-btn" @click=${this.closeModal} aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.26 51.26">
                            <path fill="currentColor" d="m37.84 32.94-7.63-7.63 7.63-7.63a3.24 3.24 0 0 0-4.58-4.58l-7.63 7.63L18 13.1a3.24 3.24 0 0 0-4.58 4.58L21 25.31l-7.62 7.63A3.24 3.24 0 1 0 18 37.52l7.63-7.63 7.63 7.63a3.24 3.24 0 0 0 4.58-4.58Z"/>
                        </svg>
                    </button>

                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'ilw-modal': Modal;
    }
}
