export class BasePage {
    //this method waits for the page to load and then clicks on the element for both $$ and $
    async waitAndClick(element: WebdriverIO.Element | ReturnType<typeof $>) {
        try {
            //wait for the page to load
            await this.waitForPageLoad();
            const el = element as WebdriverIO.Element;
            await el.waitForDisplayed();
            //wait for the element to be clickable
            await el.waitForClickable();
            //click on the element
            await el.click();
            console.warn(`Clicked on element: ${el.selector}`);
            //wait for the page to load after the click
            await this.waitForPageLoad();
        } catch (error) {
            console.error(`Click and wait failed: ${error instanceof Error ? error.message : String(error)}`);
            throw new Error(`Click and wait failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async waitForPageLoad() {
        try {
            // Wait for document readyState to be complete
            await browser.waitUntil(
                async () => {
                    const readyState = await browser.execute(() => {
                        return document.readyState;
                    });
                    return readyState === "complete";
                },
                {
                    timeoutMsg: `Page did not load within Timeout set in configs`,
                });

            // Wait for DOM to stabilize after updates (e.g., after clicks)
            // Check that the page content hasn't changed for a brief period
            await browser.waitUntil(
                async () => {
                    const bodyLength1 = await browser.execute(() => document.body.innerHTML.length);
                    await browser.pause(100);
                    const bodyLength2 = await browser.execute(() => document.body.innerHTML.length);
                    return bodyLength1 === bodyLength2;
                },
                {
                    timeoutMsg: `Page did not stabilize after update within timeout`,
                });
        } catch (error) {
            console.error(`Page load check failed: ${error instanceof Error ? error.message : String(error)}`);
            throw new Error(`Page load check failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}