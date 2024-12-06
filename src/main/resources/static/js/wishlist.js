document.addEventListener("DOMContentLoaded", function () {
    // User ID (giả sử lấy từ hệ thống)
    const userId = localStorage.getItem("userId");

    // API URL để lấy wishlist
    const apiUrl = `http://localhost:8082/api/wishlist/${userId}`;

    // Fetch wishlist từ API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const wishlistItemsContainer = document.getElementById("wishlist-items");
            const wishlistCountElement = document.querySelector('.wishlist span:nth-child(3)');
            // Kiểm tra nếu không có sản phẩm
            if (!data.items || data.items.length === 0) {
                wishlistItemsContainer.innerHTML = "<p>Your wishlist is empty!</p>";
                return;
            }
            // Lấy số lượng sản phẩm từ mảng items
            const count = data.items.length;
            // Cập nhật số lượng lên giao diện
            wishlistCountElement.textContent = count;

            // Render danh sách sản phẩm
            data.items.forEach(item => {
                const itemCard = document.createElement("div");
                itemCard.classList.add("wishlist-item");
                itemCard.setAttribute("data-product-id", item.productId);

                itemCard.innerHTML = `
                    
    <img src="${item.productImage}" alt="${item.productName}">
    <div class="item-details">
        <h3>${item.productName}</h3>
        <p>Color: 
            <span class="color-name">${item.color}</span>
            <span class="color-box" style="background-color: ${getColorCode(item.color)};"></span>
        </p>
        <p>Size: ${item.size}</p>
        <p>${item.available ? "In Stock" : "Out of Stock"}</p>
        <button class="remove-btn" data-item-id="${item.itemId}">Remove</button>
    </div>


                `;

                // Append card vào container
                wishlistItemsContainer.appendChild(itemCard);
            });


            // Thêm sự kiện click vào mỗi sản phẩm
            wishlistItemsContainer.addEventListener("click", function (event) {
                const target = event.target.closest(".wishlist-item");
                if (target) {
                    const productId = target.getAttribute("data-product-id");
                    if (productId) {
                        window.location.href = `/guests/detail?productId=${productId}`;
                    }
                }
            });
            // Gắn sự kiện click vào nút "Remove"
            document.querySelectorAll(".remove-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const itemId = this.getAttribute("data-item-id");
                    removeFromWishlist(itemId);
                });
            });
        })
        .catch(error => console.error("Error fetching wishlist:", error));
});

// Hàm xóa sản phẩm khỏi wishlist
function removeFromWishlist(itemId) {
    const apiUrl = `http://localhost:8082/api/wishlist/remove/${itemId}`;

    fetch(apiUrl, { method: "DELETE" })
        .then(response => {
            if (response.ok) {
                alert("Item removed from wishlist.");
                location.reload(); // Reload lại trang
            } else {
                alert("Failed to remove item.");
            }
        })
        .catch(error => console.error("Error removing item:", error));
}
function getColorCode(colorName) {
    const colorMap9 = {
        "Red": "#FF0000",       // Đỏ
        "Blue": "#0000FF",      // Xanh dương
        "Yellow": "#FFFF00",    // Vàng
        "Green": "#008000",     // Xanh lá cây
        "Orange": "#FFA500",    // Cam
        "Purple": "#800080",    // Tím
        "Pink": "#FFC0CB",      // Hồng
        "Brown": "#A52A2A",     // Nâu
        "Black": "#000000",     // Đen
        "White": "#FFFFFF",     // Trắng
        "Gray": "#808080",      // Xám
        "Violet": "#EE82EE"     // Tím violet
    };
    return colorMap9[colorName] || "#CCCCCC"; // Mặc định màu xám nếu không tìm thấy
}





const URL1 = 'http://localhost:8082/';
document.addEventListener("DOMContentLoaded", function() {
    getUserProfile(); // Lấy thông tin người dùng từ backend
});

function getUserProfile() {
    $.ajax({
        url: URL1 + 'api/users/profile',
        type: 'GET',
        success: function(response) {
            if (response.code === 200 && response.data) {
                const dropdownMenu = document.querySelector('.dropdown-menu');

                // Thay đổi nội dung dropdown menu thành "Thông tin" và "Đăng xuất"
                dropdownMenu.innerHTML = `
                        <a href="http://localhost:8082/guests/profile">Profile</a>
                        <a href="http://localhost:8082/guests/order" >Order</a>
                        <a href="http://localhost:8082/guests/login" id="logout">Log out</a>
                    `;

                // Hiển thị thông tin người dùng (ưu tiên full name nếu có, không thì hiển thị username)
                const usernameSpan = document.getElementById('span1');
                const fullName = (response.data.firstName && response.data.lastName)
                    ? `${response.data.firstName} ${response.data.lastName}`
                    : response.data.username;

                usernameSpan.textContent = fullName;

                // Xử lý sự kiện đăng xuất
                document.getElementById('logout').addEventListener('click', function() {
                    // Logic đăng xuất (ví dụ xóa session hoặc localStorage)
                    alert("Bạn đã đăng xuất!");
                    // Thay đổi lại giao diện về trạng thái chưa đăng nhập
                    dropdownMenu.innerHTML = `
                            <a href="#">Đăng nhập</a>
                            <a href="#">Đăng ký</a>
                        `;
                    // Đặt lại hiển thị username về trạng thái mặc định
                    usernameSpan.textContent = "Thông tin";
                });
            }
        },
        error: function(error) {
            console.error('Error fetching user profile:', error);
        }
    });
}


$(document).ready(function () {
    // Khi trang được tải, gọi hàm getCart
    getCart();
});

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
        url: URL1 + `api/carts/${userId}`,
        type: 'GET',
        success: function (response) {
            console.log("Cart fetched successfully:", response);
            let cartItems = response.items;
            let cartItemsContainer = $('#cart-items');
            cartItemsContainer.empty(); // Xóa nội dung cũ

            let totalQuantity = 0;
            let totalPrice = 0;

            if (!cartItems || cartItems.length === 0) {
                cartItemsContainer.html('<p>Giỏ hàng của bạn trống.</p>');
            } else {
                cartItems.forEach(item => {
                    let cartItemHTML = `
                           <div class="cart-item" style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
            <!-- Hiển thị ảnh sản phẩm -->
            <img src="${item.productImage}" alt="${item.productName}" style="width: 100px; height: 100px; object-fit: cover; margin-right: 20px;">

            <!-- Thông tin sản phẩm -->
            <div style="flex-grow: 1;">
                <h4 style="margin: 0 0 10px 0;">${item.productName}</h4>
                <p>Số lượng: ${item.productQuantity}</p>
                <p>Giá: ${item.productPrice}.000 VND</p>
            </div>

            <!-- Tổng tiền cho sản phẩm -->
            <div style="text-align: right;">
                <p>Tổng: ${item.productQuantity * item.productPrice}.000 VND</p>
                <button class="remove-btn" onclick="removeItem(${userId}, ${item.productId})">Xóa</button>
            </div>
        </div>`;
                    cartItemsContainer.append(cartItemHTML);

                    totalQuantity += item.productQuantity;
                    totalPrice += item.productQuantity * item.productPrice;
                });

                // Cập nhật thông tin tổng quan giỏ hàng
                $('#total-quantity').text(`Tổng số lượng sản phẩm: ${totalQuantity}`);
                $('#total-price').text(`Tổng tiền: ${totalPrice}.000 VND`);
                $('.cart-items-count').text(totalQuantity);
            }

            // Cập nhật thông tin về ngày tạo và ngày chỉnh sửa
            $('#created-info').text(`Ngày tạo: ${response.createdDate}`);
            $('#modified-info').text(`Ngày chỉnh sửa: ${response.lastModifiedDate}`);
        },
        error: function (error) {
            console.error('Error fetching cart:', error);
        }
    });
}
function removeItem(userId, productId) {
    console.log("Removing product with ID:", productId, "from user ID:", userId);
    $.ajax({
        url: URL + `api/carts/${userId}/remove/${productId}`,
        type: 'DELETE',
        success: function (response) {
            console.log(response);
            getCart();
        },
        error: function (error) {
            console.error('Error deleting cart item:', error);
        }
    });
}

const input9 = document.getElementById('animatedInput');
const placeholders9 = [
    'Bạn đang tìm gì?',
    'Adidas Superstar',
    'Nike Air Force 1',
    'Converse Chuck Taylor',
    'Vans Old Skool',
    'Puma Suede',
    'New Balance 574',
    'Reebok Classic Leather'
];

let currentIndex9 = 0;
let isDeleting9 = false;
let currentText9 = '';
let charIndex9 = 0;

function typeEffect() {
    const currentPlaceholder = placeholders9[currentIndex9];

    if (isDeleting9) {
        // Xóa từng ký tự
        currentText9 = currentPlaceholder.substring(0, charIndex9 - 1);
        charIndex9--;
    } else {
        // Thêm từng ký tự
        currentText9 = currentPlaceholder.substring(0, charIndex9 + 1);
        charIndex9++;
    }

    input9.setAttribute('placeholder', currentText9);

    let typingSpeed = isDeleting9 ? 30 : 50; // Tốc độ gõ và xóa

    if (!isDeleting9 && charIndex9 === currentPlaceholder.length) {
        // Khi gõ xong, đợi 1 giây rồi bắt đầu xóa
        typingSpeed = 1000;
        isDeleting9 = true;
    } else if (isDeleting9 && charIndex9 === 0) {
        // Khi xóa xong, chuyển sang placeholder tiếp theo
        isDeleting9 = false;
        currentIndex9 = (currentIndex9 + 1) % placeholders9.length;
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