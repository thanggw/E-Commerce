document.addEventListener("DOMContentLoaded", function() {
    getUserProfile(); // Fetch user profile from backend
});

const urlBase4 = "http://localhost:8082/";

function getUserProfile() {
    $.ajax({
        url: urlBase4 + 'api/users/profile',
        type: 'GET',
        success: function(response) {
            if (response.code === 200 && response.data) {
                const dropdownMenu = document.querySelector('.dropdown-menu');

                // Update the dropdown menu to show "Information" and "Logout"
                dropdownMenu.innerHTML = `
                        <a href="http://localhost:8082/guests/profile">Information</a>
                        <a href="http://localhost:8082/guests/order" >Orders</a>
                        <a href="http://localhost:8082/guests/login" id="logout">Logout</a>
                    `;

                // Display user information (prioritize full name if available, otherwise show username)
                const usernameSpan = document.getElementById('span1');
                const fullName = (response.data.firstName && response.data.lastName)
                    ? `${response.data.firstName} ${response.data.lastName}`
                    : response.data.username;

                usernameSpan.textContent = fullName;

                // Handle logout event
                document.getElementById('logout').addEventListener('click', function (event) {
                    // Ngăn điều hướng mặc định của liên kết
                    event.preventDefault();

                    Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to continue to buy items!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, Log out!"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Hiển thị thông báo thành công
                            Swal.fire({
                                title: "Logged out!",
                                text: "Your account has been logged out.",
                                icon: "success"
                            }).then(() => {
                                // Sau khi SweetAlert hoàn tất, điều hướng về trang login
                                window.location.href = "http://localhost:8082/guests/login";
                            });

                            // Thay đổi giao diện về trạng thái chưa đăng nhập
                            const dropdownMenu = document.querySelector('.dropdown-menu');
                            dropdownMenu.innerHTML = `
                <a href="#">Login</a>
                <a href="#">Register</a>
            `;

                            const usernameSpan = document.getElementById('span1');
                            usernameSpan.textContent = "Information";
                        }
                    });
                });

            }
        },
        error: function(error) {
            console.error('Error fetching user profile:', error);
        }
    });
}

// Function to fetch and display all orders
async function fetchAndDisplayOrders(userId) {
    const apiUrl = `/api/orders/${userId}`; // API endpoint

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Unable to fetch order information");
        }

        const orders = await response.json();

        const orderList = document.getElementById('order-list');
        orderList.innerHTML = ''; // Clear old content

        if (orders.length === 0) {
            orderList.innerHTML = '<p>No orders found.</p>';
            return;
        }

        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');

            orderCard.innerHTML = `
    <div class="order-header">
        <div class="order-id"><i class="fas fa-receipt"></i> Order ID: ${order.orderId}</div>
        <div class="order-status"><i class="fas fa-info-circle"></i> Status: ${order.orderStatus}</div>
    </div>
    <div class="info-section">
        <div class="section-title"><i class="fas fa-shipping-fast"></i> Shipping Information</div>
        <div class="info-row">
            <div class="info-label"><i class="fas fa-user"></i> Recipient:</div>
            <div class="info-content">${order.recipientName}</div>
        </div>
        <div class="info-row">
            <div class="info-label"><i class="fas fa-phone"></i> Phone:</div>
            <div class="info-content">${order.recipientPhone}</div>
        </div>
        <div class="info-row">
            <div class="info-label"><i class="fas fa-map-marker-alt"></i> Address:</div>
            <div class="info-content">${order.recipientAddress}</div>
        </div>
        <div class="info-row">
            <div class="info-label"><i class="fas fa-calendar-alt"></i> Estimated Delivery Date:</div>
            <div class="info-content">${order.expectedDeliveryDate}</div>
        </div>
        <div class="tracking-info">
            <div class="tracking-number"><i class="fas fa-barcode"></i> Tracking ID: ${order.trackingId}</div>
        </div>
    </div>
    <div class="info-section">
        <div class="section-title"><i class="fas fa-credit-card"></i> Payment Information</div>
        <div class="info-row">
            <div class="info-label"><i class="fas fa-money-bill"></i> Total Price:</div>
            <div class="info-content">${order.totalPrice} $</div>
        </div>
        <div class="info-row">
        <div class="info-label"><i class="fas fa-wallet"></i> Method:</div>
        <div class="info-content">
            <span>${getPaymentMethodDisplayName(order.paymentMethod)}</span>
            <span class="status-badge ${order.paymentStatus ? 'paid' : 'unpaid'}">
                ${order.paymentStatus ? "Paid" : "Unpaid"}
            </span>
        </div>
    </div>
    </div>
`;


            orderList.appendChild(orderCard); // Add the card to the list
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        alert("An error occurred while loading order data.");
    }
}
function getPaymentMethodDisplayName(paymentMethod) {
    const paymentMethodMap = {
        "COD": "COD (CASH_ON_DELIVERY)",
        "BANKING": "Bank Transfer",
        "E_WALLET": "E-Wallet",
        "CREDIT_CARD": "Credit Card",
        "PAYPAL": "PayPal",
        "CASH_ON_DELIVERY": "Cash on Delivery"
    };

    return paymentMethodMap[paymentMethod] || paymentMethod;
}


// Call the function when the page loads
document.addEventListener("DOMContentLoaded", function () {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        console.error('User ID not found in localStorage');
        return;
    }
    fetchAndDisplayOrders(userId);
});

// Display the cart items and update the UI with the total count
$(document).ready(function () {
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
        url: urlBase4 + `api/carts/${userId}`,
        type: 'GET',
        success: function (response) {
            console.log("Cart fetched successfully:", response);
            let cartItems = response.items;
            let cartItemsContainer = $('#cart-items');
            cartItemsContainer.empty(); // Clear old content

            let totalQuantity = 0;
            let totalPrice = 0;

            if (!cartItems || cartItems.length === 0) {
                cartItemsContainer.html('<p>Your cart is empty.</p>');
            } else {
                cartItems.forEach(item => {
                    let cartItemHTML = `
                           <div class="cart-item" style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
            <img src="${item.productImage}" alt="${item.productName}" style="width: 100px; height: 100px; object-fit: cover; margin-right: 20px;">
            <div style="flex-grow: 1;">
                <h4 style="margin: 0 0 10px 0;">${item.productName}</h4>
                <p>Quantity: ${item.productQuantity}</p>
                <p>Price: ${item.productPrice}.000 VND</p>
            </div>
            <div style="text-align: right;">
                <p>Total: ${item.productQuantity * item.productPrice}.000 VND</p>
                <button class="remove-btn" onclick="removeItem(${userId}, ${item.productId})">Remove</button>
            </div>
        </div>`;
                    cartItemsContainer.append(cartItemHTML);

                    totalQuantity += item.productQuantity;
                    totalPrice += item.productQuantity * item.productPrice;
                });

                $('#total-quantity').text(`Total Quantity: ${totalQuantity}`);
                $('#total-price').text(`Total Price: ${totalPrice}.000 VND`);
                $('.cart-items-count').text(totalQuantity);
            }

            $('#created-info').text(`Created Date: ${response.createdDate}`);
            $('#modified-info').text(`Last Modified Date: ${response.lastModifiedDate}`);
        },
        error: function (error) {
            console.error('Error fetching cart:', error);
        }
    });
}

// Redirections
$('.scroll-to-products').on('click', function () {
    window.location.href = 'http://localhost:8082/guests/allproducts';
});

$(document).ready(function () {
    $('.cart').click(function () {
        window.location.href = 'http://localhost:8082/guests/cart';
    });
});
