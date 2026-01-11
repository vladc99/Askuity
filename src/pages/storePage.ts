import { BasePage } from "./BasePage.ts";

class StorePage extends BasePage {
  // variables for the page
  //for easy change later if needed
  url: string = "https://automation-interview.vercel.app/";
  async getFilterBySize() { return $$("span.checkmark"); }
  async getProductsFound() { return $("p*=Product(s) found"); }

  product_card: string = "div[tabindex]";
  async getProductsCards() { return $$(this.product_card); }

  async cartButton() { return $('div[title="Products in cart quantity"]') }
  async cartCloseButton() { return $("span=X"); }

  async getProductsInCart() { return $$('//div[button[@title="remove product from cart"]]'); }
  async clearCartButton() { return $$("button[title='remove product from cart']"); }

  async getQuantityOfProductInCart() { return $$("p*=Quantity"); }

  async getEmptyCartMessage() { return $("p*=Add some products in the cart"); }
  async getSubtotalOfCartText() { return $('p*=SUBTOTAL'); }


  // functions for the page
  async open() {
    await browser.url(this.url);
    await super.waitForPageLoad();
  }

  async clickFilterBySize(size: string) {
    let filterFound = false;
    //get all the filters and check if the size is the same as the one passed as parameter
    for (const filter of await this.getFilterBySize()) {
      if (await filter.getText() === size) {
        //click on the filter
        await super.waitAndClick(filter);
        filterFound = true;
        break;
      }
    }
    if (!filterFound) {
      throw new Error(`Filter ${size} not found`);
    }
    await super.waitForPageLoad();
  }

  //this method returns the number of products found without text
  async getNumberOfProductsFound() {
    await super.waitForPageLoad();
    const productsFound = await this.getProductsFound();
    //remove all non-numeric characters and convert to number (int)
    return parseInt((await productsFound.getText()).replace(/\D/g, ''));
  }

  async addSpecificProductToCart(name: string) {
    //wait for the page to load (I like to do this for every action to be sure the page is loaded)
    await super.waitForPageLoad();

    //get all the products cards and check for the specific product
    const productsCards = await this.getProductsCards();
    let productFound = false;

    //loop through all product cards until the right card is found and add it to the cart
    for (const product of productsCards) {
      if ((await product.$("p").getText()).toLowerCase() === name.toLowerCase()) {
        await this.waitAndClick(product.$("button"));
        productFound = true;
        break;
      }
    }
    //if the product is not found, throw an error
    if (!productFound) {
      throw new Error(`Product ${name} not found`);
    }

    //wait for the page to load after adding the product
    await super.waitForPageLoad();
    //close the cart after adding the product
    const closeCart = await this.cartCloseButton();
    await super.waitAndClick(closeCart);
    //once again this is probably not needed but I like to be sure the page is loaded
    await super.waitForPageLoad();
  }

  async openCart() {
    await super.waitForPageLoad();
    const cartButton = await this.cartButton();
    await super.waitAndClick(cartButton);
    await super.waitForPageLoad();
  }
  async getNumberOfDistinctProductsInCart() {
    //this wait is not needed but I like to be sure the page is loaded
    await super.waitForPageLoad();
    //open the cart
    await this.openCart();

    const distinctProductsInCart = await this.getProductsInCart();

    super.waitForPageLoad();
    await super.waitAndClick(await this.cartCloseButton());
    await super.waitForPageLoad();
    return distinctProductsInCart.length;
  }


  //this method adds the quantity to the product in the cart
  //it's very simple to reuse this method for other products if needed
  async addQuantityToProductCart(productName: string, quantity: number) {
    await super.waitForPageLoad();
    //a little bit of data validation just in case I reuse this method later
    if (quantity <= 0) {
      throw new Error(`Quantity must be greater than 0`);
    }

    await this.openCart();
    await super.waitForPageLoad();
    //get all the products in the cart
    const cartItems = await this.getProductsInCart();
    let productFound = false;

    //loop through all the products in the cart until the right product is found and add the quantity
    for (const product of cartItems) {
      if ((await product.$("p").getText()).toLowerCase() === productName.toLowerCase()) {
        //add the quantity to the product
        for (let i = 0; i < quantity; i++) {
          await super.waitAndClick(product.$("button=+"));
        }
        productFound = true;
        break;
      }
    }
    if (!productFound) {
      throw new Error(`Product ${productName} not found`);
    }

    await super.waitAndClick(await this.cartCloseButton());
    //once again this is probably not needed but I like to be sure the page is loaded
    await super.waitForPageLoad();
  }

  //this method will count all the products in the cart
  async getTotalNumberOfProductsInCart() {
    await super.waitForPageLoad();

    //open the cart
    await this.openCart();
    await super.waitForPageLoad();  

    //get all the products in the cart
    const cartItems = await this.getQuantityOfProductInCart();

    let total = 0;
    for (const product of cartItems) {
      // skip the first line of the text that has a description as it can have numbers 
      let quantityText = await product.getText();
      let temp = quantityText.split("\n");
      quantityText = temp[1];

      total += parseInt(temp[1].replace(/\D/g, ''));
    }

    //a small data validation
    if (total <= 0) {
      throw new Error(`Total number of products in cart is 0`);
    }

    //close the cart
    await super.waitAndClick(await this.cartCloseButton());
    await super.waitForPageLoad();
    
    return total;
  }

  async getSubtotalOfCart() {
    await super.waitForPageLoad();
    //open the cart
    await this.openCart();
    await super.waitForPageLoad();

    //first find the div with the text SUBTOTAL
    const subtotalDiv = (await this.getSubtotalOfCartText()).parentElement();
    //then find the p tag inside the div that contains the price
    const subtotalText = await subtotalDiv.$("p*=$");
    //then get the text of the p tag and convert it to a number
    const subtotal = parseFloat((await subtotalText.getText()).replace(/\$/g, ''));
   
    //close the cart
    await super.waitAndClick(await this.cartCloseButton());
    await super.waitForPageLoad();

    return subtotal;
  }

  //this method clears the cart
  async clearCart() {
    await super.waitForPageLoad();
    //open the cart
    await this.openCart();
    await super.waitForPageLoad();

    const clearCartButton = await this.clearCartButton();

    for (const button of clearCartButton) {
      await super.waitAndClick(button);
    }

    await super.waitAndClick(await this.cartCloseButton());
    await super.waitForPageLoad();
  }

  //this method validates if the cart is empty
  //it always opens the cart and closes so it can be reused in other tests
  async isCartEmpty() {
    await super.waitForPageLoad();
    //open the cart
    await this.openCart();
    await super.waitForPageLoad();

    const emptyCartMessage = await this.getEmptyCartMessage();
    let isEmpty = await emptyCartMessage.isDisplayed();

    //close the cart
    await super.waitAndClick(await this.cartCloseButton());

    await super.waitForPageLoad();
    return isEmpty;
  }
}

export default new StorePage();
