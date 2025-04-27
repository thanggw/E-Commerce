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


const URL = 'http://localhost:8082/';
let currentPage = 0;  // Start from page 0
const pageSize = 12;  // Display 12 products per page

$(document).ready(function () {
    // Call the function to fetch products for the first time when the page loads
    getAllProducts(currentPage);

    // Handle event when the user clicks "Next Page" button
    $('#nextPageBtn').on('click', function () {
        currentPage++;
        getAllProducts(currentPage);
    });

    // Handle event when the user clicks "Previous Page" button
    $('#prevPageBtn').on('click', function () {
        if (currentPage > 0) {
            currentPage--;
            getAllProducts(currentPage);
        }
    });
});



function getAllProducts(page) {
    $.ajax({
        url: `${URL}api/products/all-products?page=${page}&size=${pageSize}`,
        type: 'GET',
        success: function (response) {
            let productDtos = response.content;

            // Check if no products are returned
            if (!productDtos || productDtos.length === 0) {
                $('#all-products-container').html('<p>No more products found.</p>');
                $('#nextPageBtn').hide();
                return;
            }

            // Clear old products before displaying new ones
            let productContainer = $('#all-products-container');
            productContainer.empty();

            // Display the list of products
            for (let product of productDtos) {
                let productHTML = `
                    <div class="product" data-product-id="${product.id}">
                        <div class="product-image">
                            <img src="${product.imageUrls[0]}" alt="${product.name}" id="main-image-${product.id}">
                        </div>
                        <h3 id="product_name">${product.name}</h3>
                        <p id="product_price">${product.price}.000 VND</p>
                        <div class="rating">
                            ★★★★☆
                        </div>
                        <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                    </div>`;
                productContainer.append(productHTML);

                // Add click event to each product
                $('.product').on('click', function () {
                    let productId = $(this).data('product-id');
                    // Redirect to product detail page
                    window.location.href = `/guests/detail?productId=${productId}`;
                });
            }

            // Handle display of "Previous Page" and "Next Page" buttons
            $('#prevPageBtn').toggle(page > 0);
            $('#nextPageBtn').toggle(productDtos.length === pageSize);
        },
        error: function (error) {
            console.error('Error fetching products:', error);
        }
    });
}



document.addEventListener("DOMContentLoaded", function() {
    getUserProfile(); // Fetch user information from backend
});

function getUserProfile() {
    $.ajax({
        url: URL + 'api/users/profile',
        type: 'GET',
        success: function(response) {
            if (response.code === 200 && response.data) {
                const dropdownMenu = document.querySelector('.dropdown-menu');

                // Change dropdown menu content to "Profile" and "Logout"
                dropdownMenu.innerHTML = `
                        <a href="http://localhost:8082/guests/profile">Thông tin</a>
                        <a href="http://localhost:8082/guests/order">Đơn hàng</a>
                        <a href="http://localhost:8082/guests/login" id="logout">Đăng xuất</a>  
                    `;

                // Display user information (prefer full name if available, otherwise display username)
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