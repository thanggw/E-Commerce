const URL = 'http://localhost:8082/';

$(document).ready(function () {
    getProduct();
});


function getProduct() {
    $.ajax({
        url: URL + 'products/all-products',
        type: 'GET',
        success: function (response) {
            console.log('AJAX response:', response);  // Log the entire response

            // Access the 'content' array in the response, not 'data'
            let productDtos = response.content;

            if (!productDtos || productDtos.length === 0) {
                console.log('No products found or data is undefined');
                return;
            }

            let productContainer = $('#product'); // Use correct id selector with #
            productContainer.empty(); // Clear the container first

            for (let i = 0; i < productDtos.length; i++) {
                let product = productDtos[i];
                let productHTML = `
                    <div class="product">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="color-options1">
                            <ul class="color-list1">
                                <li style="background-color: #f0bf82;"></li>
                                <li style="background-color: #e86868;"></li>
                                <li style="background-color: #e47bf0;"></li>
                            </ul>
                        </div>
                        <h3 id="product_name">${product.name}</h3>
                        <p id="product_price">$${product.price}</p>
                        <div class="rating">
                            ★★★★☆
                        </div>
                        <button>Add to Cart</button>
                    </div>`;

                productContainer.append(productHTML); // Append each product HTML
            }
        },
        error: function (error) {
            console.error('Error fetching products:', error);
        }
    });
}


document.addEventListener("DOMContentLoaded", function() {
    getUserProfile(); // Lấy thông tin người dùng từ backend
});

function getUserProfile() {
    $.ajax({
        url: URL + 'api/users/profile',  // API lấy thông tin người dùng
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
