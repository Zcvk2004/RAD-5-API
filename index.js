let allProducts = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');

    // Show loader before fetching
    loader.style.display = 'block';

    // Fetch product data from the API
    fetch('https://fakestoreapi.com/products')
        .then(res => {
            if (!res.ok) {
                throw new Error('Could not fetch resource');
            }
            return res.json();
        })
        .then(data => {
            allProducts = data;
            displayProducts(data);
            loader.style.display = 'none'; // Hide loader once products are loaded
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('info').innerHTML = '<p>Sorry, there was an error loading the products. Please try again later.</p>';
            loader.style.display = 'none'; // Hide loader on error
        });

    // Set up event listeners for modal close button
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == document.getElementById('cart-modal')) {
            closeModal();
        }
    });
});

function displayProducts(products) {
    const productsContent = document.getElementById('info');
    productsContent.innerHTML = ''; // Clear existing content

    // Create and display product cards
    products.forEach(product => {
        const productContent = document.createElement('div');
        productContent.className = 'product-card';
        productContent.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h2 class="product-title">${product.title}</h2>
            <p class="product-description">${product.description}</p>
            <p class="product-price">Price: $${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        `;
        productsContent.appendChild(productContent);
    });

    // Add event listeners to all buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => 
        button.addEventListener('click', addToCart)
    );
}

function addToCart(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const product = allProducts.find(p => p.id === productId);

    if (product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1; // Increase quantity if already in cart
        } else {
            cart.push({ ...product, quantity: 1 }); // Add new product to cart
        }
        updateCartCount(); // Update cart count
        alert(`${product.title} has been added to your cart!`); // Show alert
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = ''; // Clear previous cart content
    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <span>${item.title} (x${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="delete-from-cart-btn" data-id="${item.id}">Delete</button>
        `;
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity; // Calculate total price
    });

    cartTotal.textContent = total.toFixed(2); // Update total in modal

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-from-cart-btn').forEach(button => 
        button.addEventListener('click', deleteFromCart)
    );
}

function deleteFromCart(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));

    // Remove the item from the cart array
    cart = cart.filter(item => item.id !== productId);

    // Update the cart count and modal after deletion
    updateCartCount();
    updateCartModal();

    fetch(`https://fakestoreapi.com/products/6`, {
        method: 'DELETE',
        body: JSON.stringify({ productId }) // Sending the product ID to delete
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Failed to delete item from API');
        }
        console.log(`Product ${productId} deleted from the server`);
    })
    .catch(error => {
        console.error('Error deleting product:', error);
    });
}

function deleteCart() {
    // Confirm deletion from the user
    if (confirm("Are you sure you want to clear the cart? This action cannot be undone.")) {
        // Perform the DELETE request to the API
        fetch('https://fakestoreapi.com/carts/6', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Include any necessary authentication headers
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to delete cart');
            }
            // Clear the cart array and update the UI
            cart = []; // Clear the cart array in your JavaScript
            updateCartCount(); // Update cart count in the icon
            updateCartModal(); // Refresh the cart modal to show it's empty
            alert("Your cart has been cleared successfully.");
        })
        .catch(error => {
            console.error('Error:', error);
            alert("There was an error clearing the cart. Please try again.");
        });
    }
}

function openModal() {
    updateCartModal(); // Refresh the cart modal with current items
    document.getElementById('cart-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('cart-modal').style.display = 'none';
}

// method for put//
fetch('https://fakestoreapi.com/carts/7',{
    method:"PUT",
    body:JSON.stringify(
        {
            userId:3,
            date:2019-12-10,
            products:[{productId:1,quantity:3}]
        }
    )
})
    .then(res=>res.json())
    .then(json=>console.log(json))

fetch('https://fakestoreapi.com/carts/7',{
    method:"PATCH",
    body:JSON.stringify(
        {
            userId:3,
            date:2019-12-10,
            products:[{productId:1,quantity:3}]
        }
    )
})
    .then(res=>res.json())
    .then(json=>console.log(json))