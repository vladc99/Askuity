import { expect } from "@wdio/globals";
import StorePage from "../pages/storePage";

//this can be changed to a utils file later
const testdata = await import("../Testdata/testdata.json");

describe("Automation Challenge", () => {
  it("Open WebPage and validate title", async () => {
    await StorePage.open();
    expect(await browser.getTitle()).toStrictEqual(
      "Typescript React Shopping cart"
    );
  });
  it("Filter by Size", async () => {
    console.warn("=========Filtering by Size=========");
    await StorePage.clickFilterBySize("XS");
    console.warn("=========Filtered by Size XS=========");
    await StorePage.clickFilterBySize("ML");
    console.warn("=========Filtered by Size ML=========");
  });
  it("Verify Filter Results", async () => {
    console.warn("=========Verifying Filter Results=========");
    const productCards = await StorePage.getProductsCards();
    console.warn("Product Cards: ", productCards.length);
    const productsFound = await StorePage.getNumberOfProductsFound();
    expect(productCards.length).toBe(productsFound);
    console.warn("=========Filter Results Verified=========");
  });
  it("Add specific product to cart", async () => {
    console.warn("=========Adding specific product to cart=========");
    //uncheck the filters
    await StorePage.clickFilterBySize("XS");
    await StorePage.clickFilterBySize("ML");

    //add the products to the cart
    await StorePage.addSpecificProductToCart("Blue T-Shirt");
    await StorePage.addSpecificProductToCart("Black T-Shirt with white stripes");
    console.warn("=========Product added to cart=========");
  });
  it("Open Cart and validate products", async () => {
    console.warn("=========Opening Cart and validating products=========");
    //validate the number of items in the cart
    const numberOfDistinctProductsInCart = await StorePage.getNumberOfDistinctProductsInCart();
    expect(numberOfDistinctProductsInCart).toBe(2);
    console.warn("=========Cart validated=========");
  });
  it("Update Blue T-Shirt quantity", async () => {
    console.warn("=========Updating Blue T-Shirt quantity=========");
    //first count the number of items in the cart
    //update the quantity of the Blue T-Shirt
    await StorePage.addQuantityToProductCart("Blue T-Shirt", 2);
    console.warn("=========Blue T-Shirt quantity updated=========");
  });
  it("Check if the total of products in the cart has been updated", async () => {
    console.warn("=========Checking if the total of products in the cart has been updated=========");
    const totalNumberOfProductsInCart = await StorePage.getTotalNumberOfProductsInCart();
    expect(totalNumberOfProductsInCart).toBe(4);
    console.warn("=========Total of products in the cart has been updated=========");
  });
  it("Validate the total price of the cart", async () => {
    console.warn("=========Validating the total price of the cart=========");
    let totalPrice = 0;
    let blueTShirtPrice = testdata.products[0]["Blue T-Shirt"].price;
    let blackTShirtPrice = testdata.products[0]["Black T-Shirt with white stripes"].price;
    totalPrice = blueTShirtPrice * 3 + blackTShirtPrice;

    const totalPriceOfCart = await StorePage.getSubtotalOfCart();
    expect(totalPriceOfCart).toBe(totalPrice);
    console.warn("=========Total price of the cart validated=========");
    });
  it("Clear the cart", async () => {
    console.warn("=========Clearing the cart=========");
    await StorePage.clearCart();
    console.warn("=========Cart cleared=========");
  });
  it("Validate the cart is empty", async () => {
    console.warn("=========Validating the cart is empty=========");
    //validate the number of distinct products in the cart is 0
    const numberOfDistinctProductsInCart = await StorePage.getNumberOfDistinctProductsInCart();
    expect(numberOfDistinctProductsInCart).toBe(0);

    //validate the total price of the cart is 0
    const totalPriceOfCart = await StorePage.getSubtotalOfCart();
    expect(totalPriceOfCart).toBe(0);

    //validate that the empty cart message is displayed
    expect(await StorePage.isCartEmpty()).toBe(true);
    console.warn("=========Cart is empty=========");
    });
});