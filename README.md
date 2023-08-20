# Special Item Project

## Overview
This custom template introduces an "Add All To Cart" and an "Empty Cart" button if the user is on the Special Items category page. When the user clicks "Add All to Cart" all of the Special Items (there is only one) will be added to a new cart. The user may delete the cart by clicking the "Empty Cart" button. I had a few problems to work around. First, I didn't want to expose my API keys in the front end. Typically in this case I would be using my own Node/Express.js server to handle these types of API calls, but that felt beyond the scope of the task at hand. I decided to implement AWS Lambda functions to make these API calls for security's sake. When the User clicks the button to add all to cart, the AWS Lambda function for createCart() is called, and a new cartID is returned. This cartID can be tested using Postman to return the proper cart contents. When the user empties the cart, the cartId is used to destroy the cart object. At this point I would update the state in the UI. I haven't had much experience with Handlebar templates, and could not get the state of the cart to update in the UI. I would typically use React to update state in the UI. Toast notification notify the user that items were added or deleted from the cart, and if a customer is logged in, a banner displaying their name and email address is shown.

## Features Implemented
- Creation of a Special Item product and category.
- Hover effect to display the second product image.
- "Add All To Cart" button to add the product to the cart.
- Notification for successful product addition.
- "Remove All Items" button to clear the cart and notify the user.
- Display of customer details banner when logged in.

## Technologies Used
- HTML
- CSS
- JavaScript
- Bigcommerce Storefront API
- Handlebars for customer data rendering
- AWS for serverless API calls

## Contact
If you have any questions or feedback, feel free to reach out to me at ryanemmons@fastmail.com
