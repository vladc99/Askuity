# WebdriverIO E2E Test Framework

This project contains end-to-end tests written using WebdriverIO.

## My Website

- Check out <a href="https://vlad-resume.web.app/" target="_blank" style="font-weight: bold">My Website</a>
> [!NOTE]
> The website is optimized for desktop but it works on mobile too


## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (which includes npm)

## Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/vladc99/Askuity
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd Askuity
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

## Running the Tests

To run the tests, execute the following command from the root of the project:

```bash
npm run wdio
```

This command will start the WebdriverIO test runner, which will execute the spec files located in the `src/specs` directory.

## Test Case(s)

1.  Shopping Cart Logic & Validation
    1.  Navigate to the Application
    2.  Filter by Size (XS & ML)
    3.  Verify the number of products (on the grid) is correct
    4.  Add Items to cart
    5.  Verify Cart State (by checking the number of DISTINCT items)
    6.  Update Quantity of one of the product (By hitting the + sign twice)
    7.  Verify Updated Cart
    8.  Validate Pricing by manually calculating and checking the displayed cart total
    9.  Clear the Cart of all the products
    10. Verify the Cart is Empty

> [!NOTE]
> The next ones are not automated, but could be good test cases

2.  Checkout Validation
    1.  Navigate to the Application
    2.  Add Items to cart
    3.  Verify Cart State (by checking the number of DISTINCT items)
    4.  Update Quantity of one of the product (By hitting the + sign twice)
    5.  Verify Updated Cart
    6.  Validate Pricing by manually calculating and checking the displayed cart total
    7.  Validate the checkout price is showing the correct price

3.  Validate that the *correct* items are displayed for each size
    1.  Navigate to the Application
    2.  Filter by Size
    3.  Verify that the correct items are displayed in the grid

4.  Validate the free Shipping tag
    1.  Navigate to the Application
    2.  Verify that all the *required* items have the "Free Shipping" tag attached to them

5.  Check for maxium ammounts
    1.  Navigate to the Application
    2.  Add Items to cart
    3.  Update Quantity of one of the product (By hitting the +) to something like 100 items
    4.  Make sure the website doesn't let you purchase this many when pressing checkout

## Notes

With more time I would've added a few more features

1.  Screenshots
2.  Allure Report
3.  Enviroment file
4.  Better log reporting