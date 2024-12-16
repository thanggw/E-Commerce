const URL = 'http://localhost:8082/';
let currentPage = 0;  // Start from page 0
const pageSize = 12;  // Display 12 products per page

$(document).ready(function () {
    // Call the function to fetch products for the first time when the page loads
    getAllProducts(currentPage);

    // Handle event when the user clicks "Next Page" button
    $('#nextPageBtn').on('click', function () {
        currentPage++;
        getAllProducts(currentPage);
    });

    // Handle event when the user clicks "Previous Page" button
    $('#prevPageBtn').on('click', function () {
        if (currentPage > 0) {
            currentPage--;
            getAllProducts(currentPage);
        }
    });
});

const colorMap4 = {
    "Red": "#FF0000",       // Red
    "Blue": "#0000FF",      // Blue
    "Yellow": "#FFFF00",    // Yellow
    "Green": "#008000",     // Green
    "Orange": "#FFA500",    // Orange
    "Purple": "#800080",    // Purple
    "Pink": "#FFC0CB",      // Pink
    "Brown": "#A52A2A",     // Brown
    "Black": "#000000",     // Black
    "White": "#FFFFFF",     // White
    "Gray": "#808080",      // Gray
    "Violet": "#EE82EE"     // Violet
};

function getAllProducts(page) {
    $.ajax({
        url: `${URL}api/products/all-products?page=${page}&size=${pageSize}`,
        type: 'GET',
        success: function (response) {
            let productDtos = response.content;

            // Check if no products are returned
            if (!productDtos || productDtos.length === 0) {
                $('#all-products-container').html('<p>No more products found.</p>');
                $('#nextPageBtn').hide();
                return;
            }

            // Clear old products before displaying new ones
            let productContainer = $('#all-products-container');
            productContainer.empty();

            // Display the list of products
            for (let product of productDtos) {
                let productHTML = `
                    <div class="product" data-product-id="${product.id}">
                        <div class="product-image">
                            <img src="${product.imageUrls[0]}" alt="${product.name}" id="main-image-${product.id}">
                        </div>
                        <h3 id="product_name">${product.name}</h3>
                        <p id="product_price">$${product.price}</p>
                        <div class="product-colors">
                            ${product.colors.map((color, index) => `
                                <span 
                                    class="color-dot" 
                                    style="background-color: ${colorMap4[color.name] || 'gray'};"
                                    data-image="${product.imageUrls[index] || product.imageUrl}"
                                    onmouseover="changeImage(${product.id}, '${product.imageUrls[index] || product.imageUrl}')"
                                ></span>
                            `).join('')}
                        </div>
                        <div class="rating">
                            ★★★★☆
                        </div>
                        <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                    </div>`;
                productContainer.append(productHTML);

                // Add click event to each product
                $('.product').on('click', function () {
                    let productId = $(this).data('product-id');
                    // Redirect to product detail page
                    window.location.href = `/guests/detail?productId=${productId}`;
                });
            }

            // Handle display of "Previous Page" and "Next Page" buttons
            $('#prevPageBtn').toggle(page > 0);
            $('#nextPageBtn').toggle(productDtos.length === pageSize);
        },
        error: function (error) {
            console.error('Error fetching products:', error);
        }
    });
}

function changeImage(productId, imageUrl) {
    $(`#main-image-${productId}`).attr('src', imageUrl);
}

document.addEventListener("DOMContentLoaded", function() {
    getUserProfile(); // Fetch user information from backend
});

function getUserProfile() {
    $.ajax({
        url: URL + 'api/users/profile',
        type: 'GET',
        success: function(response) {
            if (response.code === 200 && response.data) {
                const dropdownMenu = document.querySelector('.dropdown-menu');

                // Change dropdown menu content to "Profile" and "Logout"
                dropdownMenu.innerHTML = `
                        <a href="http://localhost:8082/guests/profile">Profile</a>
                        <a href="http://localhost:8082/guests/order">Orders</a>
                        <a href="http://localhost:8082/guests/login" id="logout">Logout</a>
                    `;

                // Display user information (prefer full name if available, otherwise display username)
                const usernameSpan = document.getElementById('span1');
                const fullName = (response.data.firstName && response.data.lastName)
                    ? `${response.data.firstName} ${response.data.lastName}`
                    : response.data.username;

                usernameSpan.textContent = fullName;

                // Handle logout event
                document.getElementById('logout').addEventListener('click', function() {
                    alert("You have logged out!");
                    dropdownMenu.innerHTML = `
                            <a href="#">Login</a>
                            <a href="#">Register</a>
                        `;
                    usernameSpan.textContent = "Profile";
                });
            }
        },
        error: function(error) {
            console.error('Error fetching user profile:', error);
        }
    });
}

$(document).ready(function () {
    // When the page loads, call getCart
    getCart();
});

function getCart() {
    console.log("Refreshing cart...");
    let userId = localStorage.getItem("userId");

    if (!userId) {
        console.error('User ID not found in localStorage');
        return;
    }

    $.ajax({
        url: URL + `api/carts/${userId}`,
        type: 'GET',
        success: function (response) {
            console.log("Cart fetched successfully:", response);
            let cartItems = response.items;
            let cartItemsContainer = $('#cart-items');
            cartItemsContainer.empty();

            let totalQuantity = 0;
            let totalPrice = 0;

            if (!cartItems || cartItems.length === 0) {
                cartItemsContainer.html('<p>Your cart is empty.</p>');
            } else {
                cartItems.forEach(item => {
                    let cartItemHTML = `
                        <div class="cart-item">
                            <img src="${item.productImage}" alt="${item.productName}">
                            <div>
                                <h4>${item.productName}</h4>
                                <p>Quantity: ${item.productQuantity}</p>
                                <p>Price: ${item.productPrice}.000 VND</p>
                            </div>
                            <div>
                                <p>Total: ${item.productQuantity * item.productPrice}.000 VND</p>
                                <button onclick="removeItem(${userId}, ${item.productId})">Remove</button>
                            </div>
                        </div>`;
                    cartItemsContainer.append(cartItemHTML);

                    totalQuantity += item.productQuantity;
                    totalPrice += item.productQuantity * item.productPrice;
                });

                $('#total-quantity').text(`Total quantity: ${totalQuantity}`);
                $('#total-price').text(`Total price: ${totalPrice}.000 VND`);
            }
        },
        error: function (error) {
            console.error('Error fetching cart:', error);
        }
    });
}

function removeItem(userId, productId) {
    console.log("Removing product:", productId, "from user:", userId);
    $.ajax({
        url: URL + `api/carts/${userId}/remove/${productId}`,
        type: 'DELETE',
        success: function () {
            getCart();
        },
        error: function (error) {
            console.error('Error deleting item:', error);
        }
    });
}
