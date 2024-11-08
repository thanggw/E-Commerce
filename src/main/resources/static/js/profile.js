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
document.querySelector('.cart').addEventListener('click', () => {
    window.location.href = './cart.html'; // Chuyển hướng đến trang giỏ hàng
});



const urlBase = "http://localhost:8082/"; // Thay thế bằng URL thực tế

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
                        <a href="http://localhost:8082/guests/profile">Thông tin</a>
                        <a href="http://localhost:8082/guests/login" id="logout">Đăng xuất</a>
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
