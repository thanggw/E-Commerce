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
    input.addEventListener("input", function () {
        const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

        if (specialCharPattern.test(this.value)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: `Trường "${this.name}" chứa ký tự đặc biệt!`,
                confirmButtonText: 'OK',
            }).then(() => {
                this.value = "";
                this.focus();
            });
        }
    });
});


function validateInputFields() {
    let isValid = true;

    // Tên người nhận
    const nameInput = document.getElementById("user-btn");
    const nameError = document.getElementById("name-error");
    if (nameInput.value.trim() === "") {
        nameError.textContent = "Vui lòng nhập tên người nhận";
        nameError.style.display = "block";
        nameInput.classList.add("input-error");
        isValid = false;
    } else {
        nameError.textContent = "";
        nameError.style.display = "none";
        nameInput.classList.remove("input-error");
    }

    // Số điện thoại
    const phoneInput = document.getElementById("phone-btn");
    const phoneError = document.getElementById("phone-error");
    const phonePattern = /^[0-9]{9,11}$/;
    if (!phonePattern.test(phoneInput.value.trim())) {
        phoneError.textContent = "Số điện thoại không hợp lệ (9-11 chữ số)";
        phoneError.style.display = "block";
        phoneInput.classList.add("input-error");
        isValid = false;
    } else {
        phoneError.textContent = "";
        phoneError.style.display = "none";
        phoneInput.classList.remove("input-error");
    }

    // Địa chỉ
    const addressInput = document.getElementById("address-btn");
    const addressError = document.getElementById("address-error");
    if (addressInput.value.trim() === "") {
        addressError.textContent = "Vui lòng nhập địa chỉ";
        addressError.style.display = "block";
        addressInput.classList.add("input-error");
        isValid = false;
    } else {
        addressError.textContent = "";
        addressError.style.display = "none";
        addressInput.classList.remove("input-error");
    }

    // Phương thức thanh toán
    const paymentInput = document.getElementById("payment-method");
    const paymentError = document.getElementById("payment-error");
    if (paymentInput.value === "") {
        paymentError.textContent = "Vui lòng chọn phương thức thanh toán";
        paymentError.style.display = "block";
        paymentInput.classList.add("input-error");
        isValid = false;
    } else {
        paymentError.textContent = "";
        paymentError.style.display = "none";
        paymentInput.classList.remove("input-error");
    }

    return isValid;
}







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

    $('#place-order-btn').on('click', async function () {
        if (!validateInputFields()) {
            return; // Nếu có lỗi thì không tiếp tục xử lý
        }

        try {
            const response = await fetch('/api/admin/users/check-opening-hours');
            if (!response.ok) throw new Error(`Lỗi máy chủ: ${response.status}`);
            const data = await response.json();

            if (data.message || !data.isOpen) {
                Swal.fire({
                    title: 'Xin lỗi bạn🥲',
                    text: data.message || `Cửa hàng đã đóng.`,
                    icon: 'warning',
                });
                return;
            }

            const productId = new URLSearchParams(window.location.search).get('productId');
            if (productId) {
                await checkoutSingleProduct(productId);
            } else {
                await checkoutAllProduct();
            }

        } catch (error) {
            console.error('Lỗi khi kiểm tra giờ mở cửa:', error);
        }
    });


});
document.querySelectorAll(".validate-input").forEach(input => {
    input.addEventListener("input", () => {
        validateInputFields(); // Gọi lại mỗi khi có thay đổi để ẩn lỗi nếu sửa đúng
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
    console.log("Fetching cart for current user...");

    $.ajax({
        url: urlBase3 + 'api/carts', // Endpoint mới không cần userId
        type: 'GET',
        xhrFields: {
            withCredentials: true // Quan trọng: gửi cookie session
        },
        success: function(response) {
            console.log("Cart data:", response);
            renderCartItems(response);
            const totalQuantity = response.totalQuantity || 0;
            $('#cart-counter').text(totalQuantity);
            updateOrderSummary(response);
            applyVoucherHandlers();
        },
        error: function(error) {
            console.error('Error:', error);
            if (error.status === 401) {
                window.location.href = '/guests/login'; // Redirect nếu chưa đăng nhập
            } else {
                $('#checkout-items').html('<p class="error-message">Có lỗi khi tải giỏ hàng</p>');
            }
        }
    });
}

function renderCartItems(cartData) {
    const cartItemsContainer = $('#checkout-items');
    cartItemsContainer.empty();

    const items = cartData.items || [];
    let totalQuantity = 0;
    let totalPrice = 0;

    if (items.length === 0) {
        cartItemsContainer.html('<p class="empty-cart">Giỏ hàng của bạn trống.</p>');
    } else {
        items.forEach(item => {
            const itemTotal = item.productQuantity * item.productPrice;
            totalQuantity += item.productQuantity;
            totalPrice += itemTotal;

            const itemHTML = `
                <div class="cart-item" style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                    <img src="${item.productImage}" alt="${item.productName}" class="cart-item-img" style="width: 100px; height: 100px; object-fit: cover; margin-right: 20px;">
                    <div class="cart-item-details" style="flex-grow: 1;">
                        <h4 style="margin-bottom: -10px;">${item.productName}</h4>
                        <p style="margin-top: 13px;">Số lượng: ${item.productQuantity}</p>
                        <p style="margin-top: -10px;">Giá: ${formatCurrency(item.productPrice)}</p>
                        ${item.color ? `<p style="margin-top: -10px;">Topping: ${item.color}</p>` : ''}
                        ${item.size ? `<p style="margin-top: -10px;">Size: <strong>${item.size}</strong></p>` : ''}
                    </div>
                    <div class="cart-item-total" style="text-align: right;">
                        <p>Tổng: ${formatCurrency(itemTotal)}</p>
                    </div>
                </div>`;
            cartItemsContainer.append(itemHTML);
        });
    }

    // Cập nhật tổng quan
    totalPrice += 10; // Phí ship
    $('#total-quantity').text(`Tổng số lượng sản phẩm: ${totalQuantity}`);
    $('#total-price').text(`Tổng tiền: ${formatCurrency(totalPrice)}`);
    $('#total-price2').text(`Tổng tiền sau giảm: ${formatCurrency(totalPrice)}`);


    // Lưu giá trị cho voucher tính toán
    localStorage.setItem('finalAmount', totalPrice * 1000);
}

function updateOrderSummary(cartData) {
    if (cartData.createdDate) {
        $('#created-info').text(`Ngày tạo: ${formatDate(cartData.createdDate)}`);
    }
    if (cartData.lastModifiedDate) {
        $('#modified-info').text(`Cập nhật: ${formatDate(cartData.lastModifiedDate)}`);
    }
}

function applyVoucher() {
    const voucherCode = $('#voucher-code').val().trim();
    if (voucherCode === '') return;

    const voucherErrorDiv = $('#voucher-error');
    voucherErrorDiv.hide().text(''); // Clear lỗi cũ

    $.ajax({
        url: urlBase3 + `api/vouchers/info/${voucherCode}`,
        type: 'GET',
        xhrFields: { withCredentials: true },
        success: function(response) {
            console.log('Voucher hợp lệ:', response);

            const discountAmount = response.discountAmount;
            let totalPriceText = $('#total-price').text();
            let totalPrice = parseInt(totalPriceText.replace(/[^\d]/g, ''), 10); // chỉ lấy số nguyên

            // Trừ tiền voucher
            const newTotal = totalPrice - discountAmount;
            $('#discount-info').text(`Tiền khuyến mãi: ${formatCurrency(discountAmount)}`);
            $('#total-price2').text(`Tổng tiền sau giảm: ${formatCurrency(newTotal)}`);
        },
        error: function(xhr) {
            console.error('Voucher lỗi:', xhr.responseJSON);

            if (xhr.responseJSON && xhr.responseJSON.error) {
                voucherErrorDiv.text(xhr.responseJSON.error).show();
            } else {
                voucherErrorDiv.text('Đã xảy ra lỗi khi kiểm tra voucher.').show();
            }
        }
    });
}


function resetVoucherDisplay(totalPrice) {
    if (isNaN(totalPrice)) {
        totalPrice = parseFloat(localStorage.getItem('finalAmount') || '0') / 1000;
    }
    $('#discount-info').text("Tiền khuyến mãi: Chưa có mã khuyến mãi");
    $('#total-price2').text(`Tổng tiền sau giảm: ${formatCurrency(totalPrice)}`);
    $('#voucher-error').removeClass('show');
    localStorage.setItem('finalAmount', totalPrice * 1000);
}

function applyVoucherHandlers() {
    let voucherTimer;

    $('#voucher-code').on('input', function() {
        clearTimeout(voucherTimer);
        voucherTimer = setTimeout(applyVoucher, 2000); // Sau 2 giây mới gọi
    });

    $('#voucher-code').on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            clearTimeout(voucherTimer);
            applyVoucher();
        }
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
}
// Hàm format tiền tệ (giữ nguyên)
function formatCurrency(amount) {
    if (typeof amount !== 'number') {
        amount = parseInt(amount, 10);
    }
    return amount.toLocaleString('vi-VN') + '.000 VND';
}




$('.scroll-to-products').on('click', function () {
    window.location.href = 'http://localhost:8082/guests/allproducts';  // Chuyển hướng tới trang mới hiển thị toàn bộ sản phẩm
});

$('.cart').on('click', function () {
    window.location.href = 'http://localhost:8082/guests/cart';
});





const input3 = document.getElementById('animatedInput');
const placeholders3 = [
    'Bạn muốn tìm gì?',
    'Bánh mì thịt nướng',
    'Trà sữa trân châu đường đen',
    'Mì cay hải sản',
    'Phở bò tái lăn',
    'Bún chả Hà Nội',
    'Cơm tấm sườn bì chả',
    'Gỏi cuốn tôm thịt'
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
    getCartCount();
    function updateTotalPrices(totalPrice) {
        let voucherCode = $('#voucher-code').val().trim();
        if (voucherCode) {
            $.ajax({
                url: urlBase3 + "api/vouchers/info/" + voucherCode,
                type: 'GET',
                success: function (voucherInfo) {
                    let discountAmount = voucherInfo.discountAmount;
                    let totalAfter = totalPrice - discountAmount;
                    if (totalAfter < 0) totalAfter = 0;

                    // Cập nhật thông tin khuyến mãi
                    $('#discount-info').text(`Tiền khuyến mãi: ${discountAmount}.000 VND`);
                    $('#total-price2').text(`Tổng tiền sau giảm: ${totalAfter}.000 VND`);
                    $('#voucher-error').hide();
                },
                error: function (err) {
                    console.error("Voucher info fetch failed", err);
                    $('#voucher-error').text("Voucher không tồn tại.").show();
                    $('#total-price2').text(`Tổng tiền sau giảm: ${totalPrice}.000 VND`);
                    // Khi có lỗi, coi như không có mã khuyến mãi
                    $('#discount-info').text("Tiền khuyến mãi: Chưa có mã khuyến mãi");
                }
            });
        } else {
            $('#voucher-error').hide();
            $('#total-price2').text(`Tổng tiền sau giảm: ${totalPrice}.000 VND`);
            // Khi không có mã
            $('#discount-info').text("Tiền khuyến mãi: Chưa có mã khuyến mãi");
        }
    }
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
                <p>Số lượng: ${quantity}</p>
                <p>Giá tiền: ${response.price}.000 VND</p>
                <p>Topping:  ${selectedColor.name}</p>
                <p>Size: <span style="font-weight: bold;">${selectedSize.name}</span></p>
            </div>

            <!-- Tổng tiền cho sản phẩm -->
            <div style="text-align: right;">
                <p>Tổng: ${(response.price * quantity)}.000 VND</p>
            </div>
        </div>`;

            cartItemsContainer.append(cartItemHTML);

            // Cập nhật thông tin tổng quan
            let totalPrice = response.price * quantity + 10; // Thêm phí vận chuyển (30)
            $('#total-quantity').text(`Tổng số lượng sản phẩm: ${quantity}`);
            $('#total-price').text(`Tổng tiền: ${totalPrice}.000 VND`);
            updateTotalPrices(totalPrice);

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
    // Cập nhật lại tổng tiền sau giảm khi người dùng nhập voucher
    let voucherTimer=null;
    function applyVoucherWithLatestPrice() {
        let priceText = $('#total-price').text(); // "Tổng tiền: 120.000 VND"
        let raw = priceText.match(/\d+/g); // Lấy [120, 000]
        let totalPrice = parseInt(raw[0]);
        updateTotalPrices(totalPrice);
    }

// Bắt sự kiện nhập vào ô mã giảm giá
    $('#voucher-code').on('input', function () {
        clearTimeout(voucherTimer);
        voucherTimer = setTimeout(() => {
            applyVoucherWithLatestPrice();
        }, 2000); // 2 giây sau khi ngừng gõ
    });

// Áp dụng ngay khi nhấn Enter
    $('#voucher-code').on('keypress', function (e) {
        if (e.which === 13) {
            clearTimeout(voucherTimer); // hủy delay cũ
            applyVoucherWithLatestPrice(); // áp dụng luôn
        }
    });
}


function getCartCount() {
    $.ajax({
        url: urlBase3 + 'api/carts',
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


function showVoucherError(message) {
    $('#voucher-error').show().text(message);
}

// Gọi API http://localhost:8082/api/checkout cho 1 sản phẩm
function checkoutSingleProduct(productId) {
    const colorId = parseInt(new URLSearchParams(window.location.search).get('color'));
    const sizeId = parseInt(new URLSearchParams(window.location.search).get('size'));
    const quantity = parseInt(new URLSearchParams(window.location.search).get('quantity')) || 1;
    let paymentMethod = $('#payment-method').val();
    const requestBody = {
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

    $.ajax({
        url: urlBase3 + "api/checkout",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestBody),
        xhrFields: {
            withCredentials: true // Gửi cookie session
        },
        headers: {
            "X-CSRF-TOKEN": getCSRFToken() // CSRF protection
        },
        success: function(response) {
            if (requestBody.paymentMethod === 'COD') {
                window.location.href = '/guests/notification';
            } else {
                window.location.href = 'http://localhost:8082/'; // Xử lý thanh toán online
            }
        },
        error: handleCheckoutError
    });
}

// Hàm hỗ trợ
function getCSRFToken() {
    return document.querySelector("meta[name='_csrf']")?.content || "";
}

function handleCheckoutError(xhr) {
    const errorMsg = xhr.responseJSON?.error ?? xhr.responseJSON?.message ?? "Checkout failed";
    if (xhr.status === 401 || xhr.status === 400 || xhr.status === 404) {
        showVoucherError(errorMsg);
    } else {
        $('#checkout-items').html('<p>Không thể tính toán thông tin sản phẩm.</p>');
        alert(errorMsg);
    }
}




function checkoutAllProduct() {
    const paymentMethod = $('#payment-method').val();

    const orderData = {
        recipientName: $('#user-btn').val(),
        recipientPhone: $('#phone-btn').val(),
        recipientAddress: $('#address-btn').val(),
        paymentMethod: paymentMethod,
        voucherCode: $('#voucher-code').val(),
        shippingCost: $('#shipping-cost').val() || 0
        // items: [] // Không cần gửi items vì backend tự lấy từ cart
    };

    $.ajax({
        url: urlBase3 + "api/orders/checkout",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(orderData),
        xhrFields: {
            withCredentials: true // Quan trọng: gửi cookie session
        },
        headers: {
            "X-CSRF-TOKEN": getCSRFToken() // CSRF protection
        },
        success: function(response) {
            if (paymentMethod === 'COD') {
                window.location.href = '/guests/order-success';
            } else {
                window.location.href = 'http://localhost:8082/';
            }
        },
        error: function(xhr) {
            const errorMsg = xhr.responseJSON?.error || "Có lỗi xảy ra khi đặt hàng";
            if (xhr.status === 401) {
                window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            } else if (xhr.status === 400 && errorMsg.includes("voucher")) {
                showVoucherError(errorMsg);
            } else {
                Swal.fire('Lỗi', errorMsg, 'error');
            }
        }
    });
}


// Hàm hỗ trợ lấy CSRF token
function getCSRFToken() {
    const meta = document.querySelector("meta[name='_csrf']");
    return meta ? meta.content : "";
}



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