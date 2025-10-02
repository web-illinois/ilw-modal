import { expect, test, describe } from "vitest";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "../src/ilw-modal";
import type Modal from "../src/ilw-modal";

describe("ilw-modal - Rendering", () => {
    test("renders modal component", async () => {
        const { container } = await render(html`
            <ilw-modal id="test-modal">
                <h2 slot="title">Test Title</h2>
                <p>Test content</p>
            </ilw-modal>
        `);

        const modal = container.querySelector('ilw-modal') as Modal;
        expect(modal).toBeTruthy();
    });

    test("renders slotted title content", async () => {
        const { container } = await render(html`
            <ilw-modal id="test-modal">
                <h2 slot="title">Test Title</h2>
            </ilw-modal>
        `);

        const modal = container.querySelector('ilw-modal') as Modal;
        const titleSlot = modal.querySelector('[slot="title"]');
        expect(titleSlot?.textContent).toBe('Test Title');
    });

    test("renders slotted body content", async () => {
        const { container } = await render(html`
            <ilw-modal id="test-modal">
                <p>Body content here</p>
            </ilw-modal>
        `);

        const modal = container.querySelector('ilw-modal') as Modal;
        const bodyContent = modal.querySelector('p');
        expect(bodyContent?.textContent).toBe('Body content here');
    });


    test("renders slotted image content", async () => {
        const { container } = await render(html`
            <ilw-modal id="test-modal">
                <img src="test.jpg" alt="Test" slot="image">
            </ilw-modal>
        `);

        const modal = container.querySelector('ilw-modal') as Modal;
        const image = modal.querySelector('[slot="image"]');
        expect(image).toBeTruthy();
        expect(image?.tagName).toBe('IMG');
    });


    test("hides image container when no image provided", async () => {
        const { container } = await render(html`
            <ilw-modal id="test-modal">
                <h2 slot="title">Test</h2>
            </ilw-modal>
        `);

        const modal = container.querySelector('ilw-modal') as Modal;
        await modal.updateComplete;

        const modalImage = modal.shadowRoot?.querySelector('.modal-image');
        expect(modalImage?.classList.contains('hidden')).toBe(true);
    });

    test("shows image container when image is provided", async () => {
        const { container } = await render(html`
            <ilw-modal id="test-modal">
                <img src="https://picsum.photos/570/300" alt="Test" slot="image">
                <h2 slot="title">Test</h2>
            </ilw-modal>
        `);

        const modal = container.querySelector('ilw-modal') as Modal;
        await modal.updateComplete;

        // Wait for slot change to be detected
        await new Promise(resolve => setTimeout(resolve, 100));
        await modal.updateComplete;

        const modalImage = modal.shadowRoot?.querySelector('.modal-image');
        expect(modalImage?.classList.contains('hidden')).toBe(false);
    });
});