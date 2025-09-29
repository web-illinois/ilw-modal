import { expect, test } from "@playwright/test";
import { axeTestFunction } from "@illinois-toolkit/ilw-core";

test.describe("modal interactive tests", () => {

    test("basic modal should not have accessibility issues when closed", async ({page}, testInfo) => {
        const result = await axeTestFunction(page, testInfo, "./samples/interaction.html");
        expect(result).toBeTruthy();
    });

    test("opened modal should not have accessibility issues", async ({page}, testInfo) => {
        await page.goto("./samples/interaction.html");

        // Open the first modal
        await page.click('button[data-modal-target="modal-basic"]');

        // Wait for the backdrop to become visible (opacity transition)
        await page.waitForFunction(() => {
            const modal = document.querySelector('ilw-modal[open]');
            if (!modal?.shadowRoot) return false;
            const backdrop = modal.shadowRoot.querySelector('.backdrop');
            return backdrop && getComputedStyle(backdrop).opacity === '1';
        });

        const result = await axeTestFunction(page, testInfo);
        expect(result).toBeTruthy();
    });

    test("focus should move into modal when opened", async ({page}) => {
        await page.goto("./samples/interaction.html");

        const triggerButton = page.locator('button[data-modal-target="modal-basic"]');
        await triggerButton.click();

        // Wait for modal transition
        await page.waitForFunction(() => {
            const modal = document.querySelector('ilw-modal[open]');
            if (!modal?.shadowRoot) return false;
            const backdrop = modal.shadowRoot.querySelector('.backdrop');
            return backdrop && getComputedStyle(backdrop).opacity === '1';
        });

        await page.waitForTimeout(100);

        const focusedElement = await page.evaluate(() => {
            const modal = document.querySelector('ilw-modal[open]');
            return modal?.shadowRoot?.activeElement?.className || 'not-in-modal';
        });

        // The className includes size classes, so check if it contains 'modal'
        expect(focusedElement).toContain('modal');
    });

    test("Escape key should close modal", async ({page}) => {
        await page.goto("./samples/interaction.html");

        await page.click('button[data-modal-target="modal-basic"]');

        // Wait for modal to be fully open
        await page.waitForFunction(() => {
            const modal = document.querySelector('ilw-modal[open]');
            if (!modal?.shadowRoot) return false;
            const backdrop = modal.shadowRoot.querySelector('.backdrop');
            return backdrop && getComputedStyle(backdrop).opacity === '1';
        });

        await page.keyboard.press('Escape');
        await page.waitForTimeout(400); // Wait for close transition (0.3s + buffer)

        const isOpen = await page.locator('ilw-modal[open]').count();
        expect(isOpen).toBe(0);
    });

    test("focus should return to trigger button after closing", async ({page}) => {
        await page.goto("./samples/interaction.html");

        const triggerButton = page.locator('button[data-modal-target="modal-basic"]').first();
        await triggerButton.click();

        // Wait for modal to be fully open
        await page.waitForFunction(() => {
            const modal = document.querySelector('ilw-modal[open]');
            if (!modal?.shadowRoot) return false;
            const backdrop = modal.shadowRoot.querySelector('.backdrop');
            return backdrop && getComputedStyle(backdrop).opacity === '1';
        });

        // Close modal with Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400); // Wait for close transition

        // Check focus returned to trigger
        const isFocused = await triggerButton.evaluate((el) => el === document.activeElement);
        expect(isFocused).toBe(true);
    });

    test("Tab key should cycle through focusable elements in modal", async ({page}) => {
        await page.goto("./samples/interaction.html");

        await page.click('button[data-modal-target="modal-form"]');

        // Wait for modal to be fully open
        await page.waitForFunction(() => {
            const modal = document.querySelector('ilw-modal[open]');
            if (!modal?.shadowRoot) return false;
            const backdrop = modal.shadowRoot.querySelector('.backdrop');
            return backdrop && getComputedStyle(backdrop).opacity === '1';
        });

        // Tab through elements
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Focus should still be within the modal (trapped)
        const modalStillOpen = await page.locator('ilw-modal[open]').count();
        expect(modalStillOpen).toBe(1);
    });

    test("clicking close button should close modal", async ({page}) => {
        await page.goto("./samples/interaction.html");

        await page.click('button[data-modal-target="modal-basic"]');

        // Wait for modal to be fully open
        await page.waitForFunction(() => {
            const modal = document.querySelector('ilw-modal[open]');
            if (!modal?.shadowRoot) return false;
            const backdrop = modal.shadowRoot.querySelector('.backdrop');
            return backdrop && getComputedStyle(backdrop).opacity === '1';
        });

        // Click close button in shadow DOM
        await page.evaluate(() => {
            const modal = document.querySelector('ilw-modal[open]');
            const closeBtn = modal?.shadowRoot?.querySelector('.close-btn') as HTMLElement;
            closeBtn?.click();
        });

        await page.waitForTimeout(400); // Wait for close transition
        const isOpen = await page.locator('ilw-modal[open]').count();
        expect(isOpen).toBe(0);
    });
});