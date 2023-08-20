
export let userCart = null;

// shows messages to the user
function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('success', 'error');
    toast.classList.add(type);
    toast.style.visibility = 'visible';
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.visibility = 'hidden';
    }, 3000);
}


// get the customer ID from the front-end
function getCustomerId() {
    console.log('customer ID from front-end: ', document.getElementById('customerId').getAttribute('data-customer-id'));
    const custId = document.getElementById('customerId').getAttribute('data-customer-id');
    const parsedCustId = parseInt(custId);
    return parsedCustId;
}

// use AWS Lambda to query for special items
function getSpecialItems() {
    return fetch('https://jw6nvn3hrifhjwhpzygsakhyy40kiebn.lambda-url.us-east-2.on.aws/')
        .then(response => response.json())
        .then(data => {
            console.log('Received special items:', data);
            return data; // Ensure to return the data here
        })
        .catch(error => {
            console.error('An error occurred:', error);
            // Handle the error as needed
        });
}

// use AWS Lambda to create a new cart
function createCart(specialItems) {
    const route = 'https://hvib3wp6dias2e5tv57odsczze0sfccd.lambda-url.us-east-2.on.aws/';
    const customer = getCustomerId();
    const products = specialItems.line_items;
    const body = {
        productIds: products,
        customerId: customer,
    };

    return fetch(route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then(console.log('sending this body to the backend'))
        .then(console.log(body))
        .then(response => response.json())
        .then(data =>
            data.data.id, // Extract the cart ID
        )
        .catch(error => {
            console.error('An error occurred:', error);
            throw error;
        });
}

// use AWS lambda to get cart details for a specific cart ID
function getCartDetails(cartId) {
    return fetch(`https://a2ysk2apvcbnsswevz6wvdc3g40sssoi.lambda-url.us-east-2.on.aws/?cartId=${cartId}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => {
            console.error('An error occurred:', error);
        });
}

// use AWS Lambda to delete a cart
const emptyCart = async () => {
    const url = `https://jvak4lbbfntfpuybh5qkvh4svm0wkwps.lambda-url.us-east-2.on.aws/?cartId=${userCart}`;

    const options = {
        method: 'DELETE',
    };

    try {
        const response = await fetch(url, options);
        if (response.status === 200) {
            showToast('Cart deleted successfully!', 'success');
        } else {
            showToast('Failed to delete cart.', 'error');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        showToast('An error occurred. Please try again later.', 'error');
    }
};

const parsedID = getCustomerId();

// respond to button clicks in the UI
document.addEventListener('DOMContentLoaded', () => {
    const addAllToCartBtn = document.getElementById('addAllToCartBtn');
    const emptyCartBtn = document.getElementById('emptyCartBtn');

    if (emptyCartBtn) {
        emptyCartBtn.addEventListener('click', async () => {
            try {
                await emptyCart();

                showToast('Cart has been emptied successfully!', 'success');
                const cartDetails = await getCartDetails(userCart);

                // window.CartDrawer.updateContent(cartDetails);
                // window.utils.api.cart.CartPreview.updateContent(cartDetails);
            } catch (error) {
                console.error('An error occurred:', error);
                showToast('An error occurred. Please try again later.', 'error');
            }
        });
    }


    if (addAllToCartBtn) {
        addAllToCartBtn.addEventListener('click', async () => {
            try {
                const specialItems = await getSpecialItems();
                const cartItems = {
                    line_items: specialItems.map(item => ({
                        quantity: 1,
                        product_id: item,
                    })),
                };

                const cartId = await createCart(cartItems);
                userCart = cartId;
                console.log('cartId:', cartId);
                console.log(window);
                showToast('Items added to cart successfully!', 'success');
                const cartDetails = await getCartDetails(cartId);
                console.log(window.stencilUtils);
                window.stencilUtils.api.cart.update(userCart);
                console.log('received cart details:', cartDetails);
                console.log('Customer ID:', cartDetails.data.customer_id);
                console.log('Number of items in cart:', cartDetails.data.line_items.physical_items.length);
                console.log('Cart amount:', cartDetails.data.cart_amount);
            } catch (error) {
                console.error('An error occurred:', error);
                showToast('An error occurred. Please try again later.', 'error');
            }
        });
    }
});

