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



// code này giống hệt bên cart.js hiển thị sản phẩm trong cart lên giao diện nhưng paste vào để hiển thij số lượng cart-items-count
$(document).ready(function () {
    // Khi trang được tải, gọi hàm getCart
    getCart();
});
const urlBase6 = "http://localhost:8082/";
function getCart() {
    console.log("Refreshing cart...");
    // Lấy userId từ localStorage
    let userId = localStorage.getItem("userId");

    if (!userId) {
        console.error('User ID not found in localStorage');
        return;
    }

    // Gọi API giỏ hàng với userId lấy từ localStorage
    $.ajax({
        url: urlBase6 + `api/carts/${userId}`,
        type: 'GET',
        success: function (response) {
            console.log("Cart fetched successfully:", response);
            let cartItems = response.items;
            let cartItemsContainer = $('#cart-items');
            cartItemsContainer.empty(); // Xóa nội dung cũ

            let totalQuantity = 0;
            let totalPrice = 0;

            if (!cartItems || cartItems.length === 0) {
                cartItemsContainer.html('<p>Your cart is empty.</p>');
            } else {
                cartItems.forEach(item => {
                    let cartItemHTML = `
                           <div class="cart-item" style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
            <!-- Hiển thị ảnh sản phẩm -->
            <img src="${item.productImage}" alt="${item.productName}" style="width: 100px; height: 100px; object-fit: cover; margin-right: 20px;">

            <!-- Thông tin sản phẩm -->
            <div style="flex-grow: 1;">
                <h4 style="margin: 0 0 10px 0;">${item.productName}</h4>
                <p>Quantity: ${item.productQuantity}</p>
                <p>Price: ${item.productPrice}.000 VND</p>
            </div>

            <!-- Tổng tiền cho sản phẩm -->
            <div style="text-align: right;">
                <p>Total: ${item.productQuantity * item.productPrice}.000 VND</p>
                <button class="remove-btn" onclick="removeItem(${userId}, ${item.productId})">Delete</button>
            </div>
        </div>`;
                    cartItemsContainer.append(cartItemHTML);

                    totalQuantity += item.productQuantity;
                    totalPrice += item.productQuantity * item.productPrice;
                });

                // Cập nhật thông tin tổng quan giỏ hàng
                $('#total-quantity').text(`Total number of product: ${totalQuantity}`);
                $('#total-price').text(`Total Price: ${totalPrice}.000 VND`);
                $('.cart-items-count').text(totalQuantity);
            }

            // Cập nhật thông tin về ngày tạo và ngày chỉnh sửa
            $('#created-info').text(`Created Date: ${response.createdDate}`);
            $('#modified-info').text(`Changed date: ${response.lastModifiedDate}`);
        },
        error: function (error) {
            console.error('Error fetching cart:', error);
        }
    });
}




document.addEventListener("DOMContentLoaded", function() {
    getUserProfile(); // Lấy thông tin người dùng từ backend
});

function getUserProfile() {
    $.ajax({
        url: urlBase6 + 'api/users/profile',
        type: 'GET',
        success: function(response) {
            if (response.code === 200 && response.data) {
                const dropdownMenu = document.querySelector('.dropdown-menu');

                // Thay đổi nội dung dropdown menu thành "Thông tin" và "Đăng xuất"
                dropdownMenu.innerHTML = `
                        <a href="http://localhost:8082/guests/profile">Thông tin</a>
                        <a href="http://localhost:8082/guests/order">Đơn hàng</a>
                        <a href="http://localhost:8082/guests/login" id="logout">Đăng xuất</a>
                    `;

                // Hiển thị thông tin người dùng (ưu tiên full name nếu có, không thì hiển thị username)
                const usernameSpan = document.getElementById('span1');
                const fullName = (response.data.firstName && response.data.lastName)
                    ? `${response.data.firstName} ${response.data.lastName}`
                    : response.data.username;

                usernameSpan.textContent = fullName;

                // Xử lý sự kiện đăng xuất
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

$(document).on('click', '.scroll-to-products', function () {
    window.location.href = 'http://localhost:8082/guests/allproducts';
});
$(document).ready(function () {

    $('.cart').click(function () {
        window.location.href = 'http://localhost:8082/guests/cart';
    });
});





const input8 = document.getElementById('animatedInput');
const placeholders18 = [
    'Bạn đang tìm gì?',
    'Adidas Superstar',
    'Nike Air Force 1',
    'Converse Chuck Taylor',
    'Vans Old Skool',
    'Puma Suede',
    'New Balance 574',
    'Reebok Classic Leather'
];

let currentIndex18 = 0;
let isDeleting18 = false;
let currentText18 = '';
let charIndex18 = 0;

function typeEffect() {
    const currentPlaceholder = placeholders18[currentIndex18];

    if (isDeleting18) {
        // Xóa từng ký tự
        currentText18 = currentPlaceholder.substring(0, charIndex18 - 1);
        charIndex18--;
    } else {
        // Thêm từng ký tự
        currentText18 = currentPlaceholder.substring(0, charIndex18 + 1);
        charIndex18++;
    }

    input8.setAttribute('placeholder', currentText18);

    let typingSpeed = isDeleting18 ? 30 : 50; // Tốc độ gõ và xóa

    if (!isDeleting18 && charIndex18 === currentPlaceholder.length) {
        // Khi gõ xong, đợi 1 giây rồi bắt đầu xóa
        typingSpeed = 1000;
        isDeleting18 = true;
    } else if (isDeleting18 && charIndex18 === 0) {
        // Khi xóa xong, chuyển sang placeholder tiếp theo
        isDeleting18 = false;
        currentIndex18 = (currentIndex18 + 1) % placeholders18.length;
    }

    setTimeout(typeEffect, typingSpeed);
}

// Bắt đầu hiệu ứng
typeEffect();


$(document).ready(function () {
    $('.wishlist').click(function () {
        window.location.href = 'http://localhost:8082/guests/wishlist';
    });
});

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



async function searchProducts(query) {
    const searchResultsDiv = document.getElementById("searchResults");

    if (!query.trim()) {
        searchResultsDiv.innerHTML = "";
        searchResultsDiv.style.display = "none";
        return;
    }

    try {
        const response = await fetch(`/api/products/search?name=${encodeURIComponent(query)}`);
        const products = await response.json();

        searchResultsDiv.innerHTML = "";
        if (products.length > 0) {
            searchResultsDiv.style.display = "block";
            products.forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.className = "product-item";

                // Hiển thị tên sản phẩm
                productDiv.innerText = product.name.length > 20
                    ? product.name.substring(0, 40) + "..."
                    : product.name;
                productDiv.title = product.name;

                // Gán productId dưới dạng thuộc tính data
                productDiv.dataset.productId = product.id;

                // Thêm sự kiện click để chuyển hướng
                productDiv.onclick = () => {
                    const productId = productDiv.dataset.productId;
                    window.location.href = `/guests/detail?productId=${productId}`;
                };

                searchResultsDiv.appendChild(productDiv);
            });
        } else {
            searchResultsDiv.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching search results:", error);
        searchResultsDiv.style.display = "none";
    }
}
$(document).ready(function () {
    $('.news-item').click(function () {
        window.location.href = 'http://localhost:8082/guests/news';
    });
});