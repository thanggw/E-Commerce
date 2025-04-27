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
$('#email').on('input', function () {
    const email = $(this).val();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        $('#email-error').text('Email không hợp lệ.');
    } else {
        $('#email-error').text('');
    }
});

$('#phone').on('input', function () {
    const phone = $(this).val();
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        $('#phone-error').text('Số điện thoại không hợp lệ.');
    } else {
        $('#phone-error').text('');
    }
});



const URL = "http://localhost:8082/";
// code này giống hệt bên cart.js hiển thị sản phẩm trong cart lên giao diện nhưng paste vào để hiển thij số lượng cart-items-count
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

    if (!validateInputs()) {
        return; // Nếu có lỗi, không gửi request
    }

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
            alert('Cập nhật thông tin thành công');
        },
        error: function(error) {
            alert('Lỗi xảy ra: ' + error.responseText);
        }
    });
}


function validateInputs() {
    let isValid = true;

    // Xóa lỗi cũ
    $('.error-message').text('');

    // Email check
    const email = $('#email').val();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        $('#email-error').text('Email không hợp lệ. Vui lòng nhập đúng định dạng.');
        isValid = false;
    }

    // Phone check
    const phone = $('#phone').val();
    const phoneRegex = /^(0|\+84)[0-9]{9}$/; // Ví dụ: 0901234567 hoặc +84901234567
    if (!phoneRegex.test(phone)) {
        $('#phone-error').text('Số điện thoại không hợp lệ. Ví dụ: 0901234567');
        isValid = false;
    }

    return isValid;
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
    'Bạn muốn tìm gì?',
    'Bánh mì thịt nướng',
    'Trà sữa trân châu đường đen',
    'Mì cay hải sản',
    'Phở bò tái lăn',
    'Bún chả Hà Nội',
    'Cơm tấm sườn bì chả',
    'Gỏi cuốn tôm thịt'
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