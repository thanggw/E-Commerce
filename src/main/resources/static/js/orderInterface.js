document.querySelectorAll(".search-bar input").forEach((input) => {
    input.addEventListener("input", function (event) {
        const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/; // Biểu thức kiểm tra ký tự đặc biệt

        if (specialCharPattern.test(this.value)) {
            // Hiển thị SweetAlert thông báo
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: `Field "${this.name}" contains special characters! Please remove them.`,
                confirmButtonText: 'OK',
            }).then(() => {
                this.value = ""; // Xóa nội dung của input
                this.focus(); // Đưa con trỏ trở lại ô nhập liệu
            });
        }
    });
});
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
async function fetchAndDisplayOrders() {
    const apiUrl = '/api/orders';

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Nếu dùng JWT
            }
        });
        if (!response.ok) {
            throw new Error('Unable to fetch order information');
        }
        const orders = await response.json();

        // Sắp xếp orders theo thứ tự mới nhất lên đầu
        orders.sort((a, b) => b.orderId - a.orderId);

        const orderList = document.getElementById('order-list');
        orderList.innerHTML = '';

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
                    <div class="order-status ${order.orderStatus.toLowerCase()}">
                        <i class="fas fa-info-circle"></i> Status: ${order.orderStatus}
                    </div>
                </div>
                <div class="info-section">
                    <div class="section-title"><i class="fas fa-shipping-fast"></i> Thông tin giao hàng</div>
                    <div class="info-row">
                        <div class="info-label"><i class="fas fa-user"></i> Người nhận:</div>
                        <div class="info-content">${order.recipientName}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label"><i class="fas fa-phone"></i> Số điện thoại:</div>
                        <div class="info-content">${order.recipientPhone}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label"><i class="fas fa-map-marker-alt"></i> Địa chỉ:</div>
                        <div class="info-content">${order.recipientAddress}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label"><i class="fas fa-calendar-alt"></i> Ngày giao hàng ước tính:</div>
                        <div class="info-content">${order.expectedDeliveryDate}</div>
                    </div>
                    <div class="tracking-info">
                        <div class="tracking-number"><i class="fas fa-barcode"></i> Tracking ID: ${order.trackingId}</div>
                    </div>
                </div>
                <div class="info-section">
                    <div class="section-title"><i class="fas fa-credit-card"></i> Thông tin thanh toán</div>
                    <div class="info-row">
                        <div class="info-label"><i class="fas fa-money-bill"></i> Tổng tiền:</div>
                        <div class="info-content">${order.totalPrice}.000 VND</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label"><i class="fas fa-wallet"></i> Phương thức thanh toán:</div>
                        <div class="info-content">
                            <span>${getPaymentMethodDisplayName(order.paymentMethod)}</span>
                            <span class="status-badge ${order.paymentStatus ? 'paid' : 'unpaid'}">
                                ${order.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}
                            </span>
                        </div>
                    </div>
                </div>
                <button class="toggle-items-btn">Xem sản phẩm</button>
                <div class="order-items hidden">
                    ${order.orderItems.map(item => `
                        <div class="order-item">
                            <p><strong>${item.productName}</strong></p>
                            <p>Số lượng: ${item.quantity}</p>
                            <p>Giá tiền mỗi sản phẩm: ${item.pricePerUnit}.000 VND</p>
                            <p>Total: ${item.totalPrice}.000 VND</p>
                        </div>
                    `).join('')}
                </div>
            `;

            const toggleBtn = orderCard.querySelector('.toggle-items-btn');
            const orderItemsDiv = orderCard.querySelector('.order-items');

            toggleBtn.addEventListener('click', () => {
                orderItemsDiv.classList.toggle('hidden');
                toggleBtn.textContent = orderItemsDiv.classList.contains('hidden') ? 'Xem sản phẩm' : 'Ẩn sản phẩm';
            });

            // === BẮT ĐẦU: Thêm nút Hủy Đơn Hàng ===
            const cancelButton = document.createElement('button');
            cancelButton.classList.add('cancel-order-btn');
            cancelButton.textContent = 'Hủy đơn hàng';

            // Nếu đơn đã hủy thì disable
            if (order.orderStatus === 'Canceled' || order.orderStatus === 'CANCELLED'
                || order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
                cancelButton.disabled = true;
                cancelButton.textContent = 'Đã hủy';
                cancelButton.style.backgroundColor = 'gray'; // Sửa lỗi cú pháp
            }

            cancelButton.addEventListener('click', () => {
                Swal.fire({
                    title: 'Bạn chắc chắn muốn hủy đơn này?',
                    text: "Hành động này sẽ không thể hoàn tác!",
                    icon: 'warning',
                    input: 'text', // <--- thêm input
                    inputPlaceholder: 'Nhập lý do hủy đơn hàng...',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Đồng ý hủy',
                    cancelButtonText: 'Thoát',
                    preConfirm: (reason) => {
                        if (!reason) {
                            Swal.showValidationMessage('Bạn phải nhập lý do hủy đơn!');
                        }
                        return reason;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const reason = result.value; // lấy lý do từ input
                        cancelOrder(order.orderId, reason);
                    }
                });
            });

            orderCard.appendChild(cancelButton);
            // === KẾT THÚC: Thêm nút Hủy Đơn Hàng ===

            orderList.appendChild(orderCard);
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        alert('An error occurred while loading order data.');
    }
}

// Hàm call API hủy đơn
async function cancelOrder(orderId, reason) {
    try {
        const response = await fetch(`/api/orders/${orderId}/cancel?reason=${encodeURIComponent(reason)}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire('Đã hủy!', 'Đơn hàng đã được hủy thành công.', 'success');
            fetchAndDisplayOrders(); // Load lại danh sách sau khi hủy
        } else {
            Swal.fire('Lỗi!', 'Không thể hủy đơn hàng.', 'error');
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
        Swal.fire('Lỗi!', 'Đã xảy ra lỗi trong quá trình hủy đơn.', 'error');
    }
}

function getPaymentMethodDisplayName(paymentMethod) {
    const paymentMethodMap = {
        COD: 'COD (Thanh toán khi nhận hàng)',
        BANKING: 'Chuyển khoản ngân hàng',
        E_WALLET: 'Ví điện tử',
        CREDIT_CARD: 'Thẻ tín dụng',
        PAYPAL: 'PayPal',
        CASH_ON_DELIVERY: 'Thanh toán khi nhận hàng'
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

const URL = "http://localhost:8082/";
// Display the cart items and update the UI with the total count
$(document).ready(function () {
    getCart(); // Tải giỏ hàng ngay khi trang ready
});

function getCart() {
    $.ajax({
        url: URL + 'api/carts',
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function (response) {
            console.log("API Response:", response);

            // Cập nhật số lượng
            const totalQuantity = response.totalQuantity || 0;
            $('#cart-counter').text(totalQuantity);

        },
        error: function (error) {
            console.error('Error:', error);
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


const input15 = document.getElementById('animatedInput');
const placeholders15 = [
    'Bạn muốn tìm gì?',
    'Bánh mì thịt nướng',
    'Trà sữa trân châu đường đen',
    'Mì cay hải sản',
    'Phở bò tái lăn',
    'Bún chả Hà Nội',
    'Cơm tấm sườn bì chả',
    'Gỏi cuốn tôm thịt'
];

let currentIndex25 = 0;
let isDeleting25 = false;
let currentText25 = '';
let charIndex25 = 0;

function typeEffect() {
    const currentPlaceholder = placeholders15[currentIndex25];

    if (isDeleting25) {
        // Xóa từng ký tự
        currentText25 = currentPlaceholder.substring(0, charIndex25 - 1);
        charIndex25--;
    } else {
        // Thêm từng ký tự
        currentText25 = currentPlaceholder.substring(0, charIndex25 + 1);
        charIndex25++;
    }

    input15.setAttribute('placeholder', currentText25);

    let typingSpeed = isDeleting25 ? 30 : 50; // Tốc độ gõ và xóa

    if (!isDeleting25 && charIndex25 === currentPlaceholder.length) {
        // Khi gõ xong, đợi 1 giây rồi bắt đầu xóa
        typingSpeed = 1000;
        isDeleting25 = true;
    } else if (isDeleting25 && charIndex25 === 0) {
        // Khi xóa xong, chuyển sang placeholder tiếp theo
        isDeleting25 = false;
        currentIndex25 = (currentIndex25 + 1) % placeholders15.length;
    }

    setTimeout(typeEffect, typingSpeed);
}

// Bắt đầu hiệu ứng
typeEffect();


// code này để hiển thị số lượng wishlist
document.addEventListener("DOMContentLoaded", function () {
    // API URL mới, không cần userId nữa
    const apiUrl = `http://localhost:8082/api/wishlist`;

    // Fetch wishlist từ API
    fetch(apiUrl, {
        method: "GET",
        credentials: "include" // RẤT QUAN TRỌNG: để gửi cookie/session JWT kèm theo request
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch wishlist");
            }
            return response.json();
        })
        .then(data => {
            const wishlistItemsContainer = document.getElementById("wishlist-items");
            const wishlistCountElement = document.querySelector('.wishlist span:nth-child(3)');

            // Nếu không có sản phẩm
            if (!data.items || data.items.length === 0) {
                wishlistItemsContainer.innerHTML = "<p>Your wishlist is empty!</p>";
                wishlistCountElement.textContent = "0"; // cập nhật số lượng = 0
                return;
            }
            // Cập nhật số lượng wishlist
            const count = data.items.length;
            wishlistCountElement.textContent = count;


        })
        .catch(error => console.error("Error fetching wishlist:", error));
});

$('.logo').on('click', function() {
    window.location.href = 'http://localhost:8082/guests/home-guest';
});