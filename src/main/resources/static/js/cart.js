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
    getUserProfile(); // Lấy thông tin người dùng từ backend
});
const urlBase2 = "http://localhost:8082/";
function getUserProfile() {
    $.ajax({
        url: urlBase2 + 'api/users/profile',
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


// code này giống hệt bên cart.js hiển thị sản phẩm trong cart lên giao diện nhưng paste vào để hiển thij số lượng cart-items-count
$(document).ready(function () {
    getCart(); // Tải giỏ hàng khi trang ready
});

// Hàm format tiền tệ (giữ nguyên)
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ".000 VND";
}

function getCart() {
    console.log("Loading cart...");

    $.ajax({
        url: urlBase2 + 'api/carts', // Endpoint mới không cần userId
        type: 'GET',
        xhrFields: {
            withCredentials: true // Gửi cookie session
        },
        success: function (response) {
            console.log("Cart data:", response);
            renderCartItems(response);
            const totalQuantity = response.totalQuantity || 0;
            $('#cart-counter').text(totalQuantity);
        },
        error: function (error) {
            console.error('Error:', error);
            if (error.status === 401) {
                window.location.href = '/guests/login'; // Redirect nếu chưa đăng nhập
            } else {
                $('#cart-items').html('<p>Có lỗi xảy ra khi tải giỏ hàng</p>');
            }
        }
    });
}

function renderCartItems(cartData) {
    const cartItemsContainer = $('#cart-items');
    cartItemsContainer.empty();

    // Kiểm tra dữ liệu
    const items = cartData.items || cartData.cartItems || [];
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
                <div class="cart-item" data-product-id="${item.productId}"style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                    <img src="${item.productImage}" alt="${item.productName}" class="cart-item-image" style="width: 100px; height: 100px; object-fit: cover; margin-right: 20px;">
                    <div class="cart-item-details" style="flex-grow: 1;">
                        <h4 style="margin: 0 0 10px 0;">${item.productName}</h4>
                        <p>Số lượng: ${item.productQuantity}</p>
                        <p>Giá: ${formatCurrency(item.productPrice)}</p>
                        ${item.color ? `<p>Topping: ${item.color}</p>` : ''}
                        ${item.size ? `<p>Kích cỡ: <strong>${item.size}</strong></p>` : ''}
                    </div>
                    <div class="cart-item-actions">
                        <p class="item-total">${formatCurrency(itemTotal)}</p>
                        <button class="btn-remove" data-product-id="${item.productId}">Xóa</button>
                    </div>
                </div>`;
            cartItemsContainer.append(itemHTML);
        });

        // Gắn sự kiện click cho nút xóa
        $('.btn-remove').click(function() {
            const productId = $(this).data('product-id');
            removeItem(productId);
            getCart();
        });

        // Gắn sự kiện click cho cart item (trừ nút xóa)
        $('.cart-item').click(function(e) {
            if (!$(e.target).closest('.btn-remove').length) {
                const productId = $(this).data('product-id');
                window.location.href = `/guests/detail?productId=${productId}`;
            }
        });
    }

    // Cập nhật tổng quan
    $('#total-quantity').text(`Tổng số lượng: ${totalQuantity}`);
    $('#total-price').text(`Tổng tiền: ${formatCurrency(totalPrice)}`);


    // Cập nhật ngày tháng
    if (cartData.createdDate) {
        $('#created-info').text(`Ngày tạo: ${formatDate(cartData.createdDate)}`);
    }
    if (cartData.lastModifiedDate) {
        $('#modified-info').text(`Cập nhật: ${formatDate(cartData.lastModifiedDate)}`);
    }
}

// Hàm xóa item (sửa lại để không cần userId)
function removeItem(productId) {
    Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn chắc chắn muốn xóa sản phẩm này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Vâng, xóa nó!',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: urlBase2 + `api/carts/remove/${productId}`,
                type: 'DELETE',
                xhrFields: {
                    withCredentials: true
                },
                success: function(response) {
                    if (response === true) {
                        getCart(); // Refresh giỏ hàng
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: 'Sản phẩm đã được xóa khỏi giỏ hàng.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                },
                error: function(error) {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: 'Xóa sản phẩm thất bại.',
                    });
                }
            });
        }
    });
}

// Hàm phụ: Format ngày tháng
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Hàm hiển thị thông báo
function showToast(message, type = 'success') {
    // Thêm code hiển thị toast tùy bạn (có thể dùng thư viện hoặc tự code)
    console.log(`${type}: ${message}`);
}



$(document).ready(function () {
    // Khi nhấn nút "Thanh toán", điều hướng sang trang thanh toán
    $('#checkout-btn').click(function () {
        window.location.href = 'http://localhost:8082/guests/checkout';
    });
});

$('.scroll-to-products').on('click', function () {
    window.location.href = 'http://localhost:8082/guests/allproducts';  // Chuyển hướng tới trang mới hiển thị toàn bộ sản phẩm
});




const input2 = document.getElementById('animatedInput');
const placeholders2 = [
    'Bạn muốn tìm gì?',
    'Bánh mì thịt nướng',
    'Trà sữa trân châu đường đen',
    'Mì cay hải sản',
    'Phở bò tái lăn',
    'Bún chả Hà Nội',
    'Cơm tấm sườn bì chả',
    'Gỏi cuốn tôm thịt'
];

let currentIndex2 = 0;
let isDeleting2 = false;
let currentText2 = '';
let charIndex2 = 0;

function typeEffect() {
    const currentPlaceholder = placeholders2[currentIndex2];

    if (isDeleting2) {
        // Xóa từng ký tự
        currentText2 = currentPlaceholder.substring(0, charIndex2 - 1);
        charIndex2--;
    } else {
        // Thêm từng ký tự
        currentText2 = currentPlaceholder.substring(0, charIndex2 + 1);
        charIndex2++;
    }

    input2.setAttribute('placeholder', currentText2);

    let typingSpeed = isDeleting2 ? 30 : 50; // Tốc độ gõ và xóa

    if (!isDeleting2 && charIndex2 === currentPlaceholder.length) {
        // Khi gõ xong, đợi 1 giây rồi bắt đầu xóa
        typingSpeed = 1000;
        isDeleting2 = true;
    } else if (isDeleting2 && charIndex2 === 0) {
        // Khi xóa xong, chuyển sang placeholder tiếp theo
        isDeleting2 = false;
        currentIndex2 = (currentIndex2 + 1) % placeholders2.length;
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