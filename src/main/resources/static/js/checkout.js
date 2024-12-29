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
document.querySelectorAll("#checkout-page input").forEach((input) => {
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
    getUserProfile(); // Lấy thông tin người dùng từ backend
});
const urlBase3 = "http://localhost:8082/";
function getUserProfile() {
    $.ajax({
        url: urlBase3 + 'api/users/profile',
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

$(document).ready(function () {
    // Làm trống container sản phẩm trước
    $('#checkout-items').empty();

    // Lấy productId từ query string
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    if (productId) {
        fetchProductDetails(productId);
        // Nếu có productId trong URL, gọi API lấy sản phẩm theo productId
        //$(document).ready($('#place-order-btn').click(checkoutSingleProduct(productId)));
    } else {
        // Nếu không có productId, gọi API hiển thị giỏ hàng
        getCart();
        //$(document).ready($('#place-order-btn').click(checkoutAllProduct(productId)));
    }

    $('#place-order-btn').on('click', function () {
        if (productId) {
            checkoutSingleProduct(productId);
        } else {
            checkoutAllProduct();
        }
    });
});

const colorMap3 = {
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
        url: urlBase3 + `api/carts/${userId}`,
        type: 'GET',
        success: function (response) {
            console.log("Cart fetched successfully:", response);
            let cartItems = response.items;
            let cartItemsContainer = $('#checkout-items');
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
                <p>Quantity: ${item.productQuantity}</p>
                <p>Price: ${item.productPrice}.$</p>
                 <p>Color: <span style="display: inline-block; background-color: ${colorMap3[item.color] || '#808080'}; width: 10px; height: 10px; border-radius: 50%; border: 1px solid #000;" title="${item.color}"></span> ${item.color}</p>
                <p>Size: <span style="font-weight: bold;">${item.size}</span></p>
            </div>

            <!-- Tổng tiền cho sản phẩm -->
            <div style="text-align: right;">
                <p>Total: ${item.productQuantity * item.productPrice}$</p>
               
            </div>
        </div>`;
                    cartItemsContainer.append(cartItemHTML);

                    totalQuantity += item.productQuantity;
                    totalPrice += item.productQuantity * item.productPrice;
                });
                totalPrice+=30;

                // Cập nhật thông tin tổng quan giỏ hàng
                $('#total-quantity').text(`Total number of products: ${totalQuantity}`);
                $('#total-price').text(`Total cash: ${totalPrice}.000 VND`);
                $('.cart-items-count').text(totalQuantity);
            }

            // Cập nhật thông tin về ngày tạo và ngày chỉnh sửa
            $('#created-info').text(`Created Date: ${response.createdDate}`);
            $('#modified-info').text(`Modified date: ${response.lastModifiedDate}`);
        },
        error: function (error) {
            console.error('Error fetching cart:', error);
        }
    });
}



$('.scroll-to-products').on('click', function () {
    window.location.href = 'http://localhost:8082/guests/allproducts';  // Chuyển hướng tới trang mới hiển thị toàn bộ sản phẩm
});

$('.cart').on('click', function () {
    window.location.href = 'http://localhost:8082/guests/cart';
});





const input3 = document.getElementById('animatedInput');
const placeholders3 = [
    'What are you looking for?',
    'Adidas Superstar',
    'Nike Air Force 1',
    'Converse Chuck Taylor',
    'Vans Old Skool',
    'Puma Suede',
    'New Balance 574',
    'Reebok Classic Leather'
];

let currentIndex3 = 0;
let isDeleting3 = false;
let currentText3 = '';
let charIndex3 = 0;

function typeEffect() {
    const currentPlaceholder = placeholders3[currentIndex3];

    if (isDeleting3) {
        // Xóa từng ký tự
        currentText3 = currentPlaceholder.substring(0, charIndex3 - 1);
        charIndex3--;
    } else {
        // Thêm từng ký tự
        currentText3 = currentPlaceholder.substring(0, charIndex3 + 1);
        charIndex3++;
    }

    input3.setAttribute('placeholder', currentText3);

    let typingSpeed = isDeleting3 ? 30 : 50; // Tốc độ gõ và xóa

    if (!isDeleting3 && charIndex3 === currentPlaceholder.length) {
        // Khi gõ xong, đợi 1 giây rồi bắt đầu xóa
        typingSpeed = 1000;
        isDeleting3 = true;
    } else if (isDeleting3 && charIndex3 === 0) {
        // Khi xóa xong, chuyển sang placeholder tiếp theo
        isDeleting3 = false;
        currentIndex3 = (currentIndex3 + 1) % placeholders3.length;
    }

    setTimeout(typeEffect, typingSpeed);
}

// Bắt đầu hiệu ứng
typeEffect();




function fetchProductDetails(productId) {
    $.ajax({
        url: `${urlBase3}api/products/${productId}`, // API lấy chi tiết sản phẩm
        type: 'GET',
        success: function (response) {
            console.log("Product Information:", response);

            let cartItemsContainer = $('#checkout-items');
            cartItemsContainer.empty(); // Xóa nội dung cũ
            const urlParams = new URLSearchParams(window.location.search);

            // Lấy thông tin từ URL
            let colorId = parseInt(urlParams.get('color')); // ID của màu sắc
            let sizeId = parseInt(urlParams.get('size'));   // ID của kích thước
            let quantity = parseInt(urlParams.get('quantity')) || 1; // Số lượng

            // Tìm color và size từ dữ liệu API
            let selectedColor = response.colors.find(color => color.id === colorId);
            let selectedSize = response.sizes.find(size => size.id === sizeId);

            // Nếu không tìm thấy color hoặc size, hiển thị lỗi
            if (!selectedColor || !selectedSize) {
                console.error("Color or size with the provided ID was not found.");
                $('#checkout-items').html('<p>Can not find information about product. Please check color and size again</p>');
                return;
            }

            // Lấy ảnh sản phẩm (lấy ảnh đầu tiên làm mặc định)
            let productImage = response.imageUrls && response.imageUrls.length > 0 ? response.imageUrls[0] : 'default-image.jpg';

            // Tạo thông tin chi tiết sản phẩm
            let cartItemHTML = `
        <div class="cart-item" style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
            <!-- Hiển thị ảnh sản phẩm -->
            <img src="${productImage}" alt="${response.name}" style="width: 120px; height: 120px; object-fit: cover; margin-right: 20px;">

            <!-- Thông tin sản phẩm -->
            <div style="flex-grow: 1;">
                <h4 style="margin: 0 0 7px 0;">${response.name}</h4>
                <p>Quantity: ${quantity}</p>
                <p>Price: ${response.price}.000 VND</p>
                <p>Color: <span style="display: inline-block; background-color: ${selectedColor.name || '#fff'}; width: 10px; height: 10px; border-radius: 50%; border: 1px solid #000;" title="${selectedColor.name}"></span> ${selectedColor.name}</p>
                <p>Size: <span style="font-weight: bold;">${selectedSize.name}</span></p>
            </div>

            <!-- Tổng tiền cho sản phẩm -->
            <div style="text-align: right;">
                <p>Tổng: ${(response.price * quantity)}.000 VND</p>
            </div>
        </div>`;

            cartItemsContainer.append(cartItemHTML);

            // Cập nhật thông tin tổng quan
            let totalPrice = response.price * quantity + 30; // Thêm phí vận chuyển (30)
            $('#total-quantity').text(`Total number of products: ${quantity}`);
            $('#total-price').text(`Total cash: ${totalPrice}.000 VND`);

            // Cập nhật thông tin ngày tạo/chỉnh sửa nếu cần
            $('#created-info').text(`Created Date: ${response.createdDate || 'N/A'}`);
            $('#modified-info').text(`Modified Date: ${response.lastModifiedDate || 'N/A'}`);
        }
        ,
        error: function (error) {
            console.error("Can not get the information about product:", error);
            $('#checkout-items').html('<p>Can not get the information about product</p>');
        }
    });
}



// Gọi API http://localhost:8082/api/checkout cho 1 sản phẩm
function checkoutSingleProduct(productId) {
    let userId = localStorage.getItem("userId");

    if (!userId) {
        console.error('User ID not found in localStorage');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    let colorId = parseInt(urlParams.get('color'));
    let sizeId = parseInt(urlParams.get('size'));
    let quantity = parseInt(urlParams.get('quantity')) || 1;

    let paymentMethod = $('#payment-method').val(); // Lấy giá trị paymentMethod

    let requestBody = {
        userId: userId,
        recipientName: $('#user-btn').val(),
        recipientPhone: $('#phone-btn').val(),
        recipientAddress: $('#address-btn').val(),
        paymentMethod: paymentMethod,
        voucherCode: $('#voucher-code').val(),
        shippingCost: $('#shipping-cost').val(),
        expectedDeliveryDate: $('#expected-delivery-date').val(),
        trackingId: $('#tracking-id').val(),
        items: [
            {
                productId: productId,
                colorId: colorId,
                sizeId: sizeId,
                quantity: quantity
            }
        ]
    };
    console.log("Selected payment method:", paymentMethod);

    $.ajax({
        url: urlBase3 + "api/checkout",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestBody),
        success: function (response) {
            console.log("Checkout cho sản phẩm:", response);

            // Chuyển hướng dựa trên phương thức thanh toán
            if (paymentMethod === 'COD') {
                window.location.href = 'http://localhost:8082/guests/notification';
            } else {
                window.location.href = 'http://localhost:8082/';
            }
        },
        error: function (error) {
            console.error("Unable to checkout the product.:", error);
            $('#checkout-items').html('<p>Unable to calculate product information.</p>');
        }
    });
}


function checkoutAllProduct() {
    let paymentMethod = $('#payment-method').val(); // Lấy giá trị paymentMethod

    let orderData = {
        userId: localStorage.getItem("userId"),
        recipientName: $('#user-btn').val(),
        recipientPhone: $('#phone-btn').val(),
        recipientAddress: $('#address-btn').val(),
        paymentMethod: paymentMethod,
        voucherCode: $('#voucher-code').val(),
        shippingCost: $('#shipping-cost').val(),
        expectedDeliveryDate: $('#expected-delivery-date').val(),
        trackingId: $('#tracking-id').val()
    };
    console.log("Selected payment method:", paymentMethod);


    $.ajax({
        url: urlBase3 + "api/orders/checkout",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(orderData),
        success: function (response) {
            console.log("Checkout all products:", response);

            // Chuyển hướng dựa trên phương thức thanh toán
            if (paymentMethod === 'COD') {
                window.location.href = 'http://localhost:8082/guests/notification';
            } else {
                window.location.href = 'http://localhost:8082/';
            }
        },
        error: function (error) {
            console.error("Checkout failed:", error);
            alert("An error occurred while placing the order");
        }
    });
}


$(document).ready(function () {
    $('.wishlist').click(function () {
        window.location.href = 'http://localhost:8082/guests/wishlist';
    });
});

// code này để hiển thị số lượng wishlist
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

                itemCard.innerHTML = `
                    <div class="wishlist-item">
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
</div>

                `;

                // Append card vào container
                wishlistItemsContainer.appendChild(itemCard);
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