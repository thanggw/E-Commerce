// Khởi tạo giỏ hàng trống
let cart = [];
function updateCartDisplay() {
    const cartIcon = document.querySelector('.cart .cart-items-count');
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartIcon.textContent = totalItems ;
}


// Lưu giỏ hàng vào localStorage (nếu có)
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    updateCartDisplay(); // Cập nhật hiển thị giỏ hàng khi tải trang
}

// Xử lý khi nhấn vào giỏ hàng
$(document).ready(function () {

    $('.cart').click(function () {
        window.location.href = 'http://localhost:8082/guests/cart';
    });
});



const urlBase = "http://localhost:8082/";

// được gọi khi load hoàn chỉnh được toàn bộ html
$(document).ready(function () {
    // gọi hàm get profile, setup thông tin lên html
    getProfile();

    $('#formAccountSettings').submit(async function (e) {
        await updateUserInfo(e);
    });
});
// Lấy thông tin người dùng và hiển thị
function getProfile(){
    $.ajax({
        url: urlBase + 'api/users/profile',
        type: 'GET',
        success: function(response) {
            console.log(response);
            if (response.code !== 200) {
                console.error('Error: Unable to fetch user profile');ff
                return;
            }
            const user = response.data;
            setUserToView(user);
        },
        error: function(error) {
            console.error('Error fetching user:', error);
        }
    });
}


function setUserToView(user) {
    $('#username').val(user.username);
    $('#code').val(user.id);
    $('#email').val(user.email);
    $('#firstName').val(user.firstName);
    $('#lastName').val(user.lastName);
    $('#phone').val(user.phone);
    $('#address').val(user.address ? user.address : '');
    localStorage.setItem("userId", user.id);
    const avatarUrl = user.pathAvatar || 'http://localhost:8082/file/avatar/avatar_admin_1.jpg';
    $('#avatar-img').attr('src', avatarUrl);
}

async function updateUserInfo(e) {
    e.preventDefault();

    let obj = {
        file: await toBase64($('#upload')[0].files[0]),
        username: $('#username').val(),
        email: $('#email').val(),
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        phone: $('#phone').val(),
        address: $('#address').val(),
        id: parseInt(localStorage.getItem("userId"))
    };

    $.ajax({
        url: urlBase + 'api/users/update',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(obj),
        success: function(response) {
            alert('Profile updated successfully');
        },
        error: function(error) {
            alert('An error occurred: ' + error.responseText);
        }
    });
}

/**
 Promise : được sử dụng để lý bất đồng bổ
 vì quá trình chuyển từ file img -> stringBase64 mất nhiều gian và phải xử lý bất đồng bộ
 => sử dụng Promise để xử lý
 => tại nơi gọi hàm toBase64 phải thêm từ khóa await, và tại hàm to phải thêm từ khóa async
 cặp await, async => thể hiện việc sẽ chờ cho tời khi hàm xử lý bất đồng bộ xử lý xong mới thực hiện các câu lệnh phia sau
 vd: tại câu lệnh obj.file = await toBase64($('#upload')[0].files[0]);
 nếu không sử dụng await, async thì hàm toBase64 sẽ được tách ra một thread riêng và convert ảnh -> stirng base64 tại thread độc lập đấy
 mà trong object obj cần stringbase64 img mới có thể gửi lên server => phải sử dụng await, async để chờ cho hàm xử lý
 xong mới tiếp tục chạy các câu lệnh tiếp theo
 */
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
})


document.addEventListener("DOMContentLoaded", function() {
    getUserProfile(); // Lấy thông tin người dùng từ backend
});

function getUserProfile() {
    $.ajax({
        url: urlBase + 'api/users/profile',
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


// show avatar sau khi upload lên html, nhưng chưa gửi ảnh lên server
document.getElementById('upload').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('avatar-img').setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(file); // Đảm bảo chuyển đổi file ảnh thành base64 để hiển thị trước
    }
});

$('.scroll-to-products').on('click', function () {
    window.location.href = 'http://localhost:8082/guests/allproducts';  // Chuyển hướng tới trang mới hiển thị toàn bộ sản phẩm
});




const input5 = document.getElementById('animatedInput');
const placeholders5 = [
    'What are you looking for?',
    'Adidas Superstar',
    'Nike Air Force 1',
    'Converse Chuck Taylor',
    'Vans Old Skool',
    'Puma Suede',
    'New Balance 574',
    'Reebok Classic Leather'
];

let currentIndex5 = 0;
let isDeleting5 = false;
let currentText5 = '';
let charIndex5 = 0;

function typeEffect() {
    const currentPlaceholder = placeholders5[currentIndex5];

    if (isDeleting5) {
        // Xóa từng ký tự
        currentText5 = currentPlaceholder.substring(0, charIndex5 - 1);
        charIndex5--;
    } else {
        // Thêm từng ký tự
        currentText5 = currentPlaceholder.substring(0, charIndex5 + 1);
        charIndex5++;
    }

    input5.setAttribute('placeholder', currentText5);

    let typingSpeed = isDeleting5 ? 30 : 50; // Tốc độ gõ và xóa

    if (!isDeleting5 && charIndex5 === currentPlaceholder.length) {
        // Khi gõ xong, đợi 1 giây rồi bắt đầu xóa
        typingSpeed = 1000;
        isDeleting5 = true;
    } else if (isDeleting5 && charIndex5 === 0) {
        // Khi xóa xong, chuyển sang placeholder tiếp theo
        isDeleting5 = false;
        currentIndex5 = (currentIndex5 + 1) % placeholders5.length;
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