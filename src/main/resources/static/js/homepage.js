

const URL = 'http://localhost:8082/';
const pageSize = 8;  // Số lượng sản phẩm hiển thị trên homepage

$(document).ready(function () {
    getProduct();
});


function getProduct() {
    $.ajax({
        url: URL + `api/products/all-products?page=0&size=${pageSize}`,
        type: 'GET',
        success: function (response) {
            console.log('AJAX response:', response);

            let productDtos = response.content;

            if (!productDtos || productDtos.length === 0) {
                console.log('No products found');
                return;
            }

            let productContainer = $('#products-container');
            productContainer.empty();

            for (let product of productDtos) {
                let truncatedDescription = product.description && product.description.length > 40
                    ? product.description.substring(0, 40) + "..."
                    : product.description || "No description available";
                let productHTML = `
                    <div class="product" data-product-id="${product.id}">
     
                        <div class="product-image">
                            <img src="${product.imageUrls[0]}" alt="${product.name}" id="main-image-${product.id}">
                        </div>
                        <div class="wishlist-icon2" data-tooltip="Add to wishlist">
                           <i class="fa fa-heart" id="add-to-wishlist2"></i>
                         </div>
                        <h3 id="product_name">${product.name}</h3>
                        <p id="product_price">${product.price}.000 VND</p>
                        
                        <p class="product-description">${truncatedDescription}</p> 
                        <div class="rating">
                            ★★★★☆ <!-- Hiển thị đánh giá, có thể thay bằng logic động -->
                        </div>
                        <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                    </div>
                `;

                // Thêm sản phẩm vào container
                productContainer.append(productHTML);
            }

            // Thêm sự kiện click vào mỗi sản phẩm
            $('.product').on('click', function () {
                let productId = $(this).data('product-id');
                // Chuyển hướng đến trang chi tiết sản phẩm
                window.location.href = `/guests/detail?productId=${productId}`;
            });
        },
        error: function (error) {
            console.error('Error fetching products:', error);
        }
    });
}


// Hàm thay đổi ảnh khi hover
function changeImage(productId, newImageUrl) {
    $(`#main-image-${productId}`).attr('src', newImageUrl);
}

$('#viewMoreBtn').on('click', function () {
    window.location.href = 'http://localhost:8082/guests/allproducts';  // Chuyển hướng tới trang mới hiển thị toàn bộ sản phẩm
});
$('.view-all').on('click', function () {
    window.location.href = 'http://localhost:8082/guests/allproducts';  // Chuyển hướng tới trang mới hiển thị toàn bộ sản phẩm
});
$('.scroll-to-products').on('click', function () {
    window.location.href = 'http://localhost:8082/guests/allproducts';  // Chuyển hướng tới trang mới hiển thị toàn bộ sản phẩm
});
$(document).ready(function () {
    // Thẻ <li> thứ 2
    $('#menu-list li:nth-child(2)').on('click', function () {
        window.location.href = "http://localhost:8082/guests/allproducts";
    });

    $('#menu-list li:nth-child(3)').on('click', function () {
        window.location.href = "http://localhost:8082/guests/aboutus";
    });
    // Thẻ <li> thứ 5
    $('#menu-list li:nth-child(5)').on('click', function () {
        window.location.href = "http://localhost:8082/guests/voucher";
    });
});
$('.news-item').on('click', function () {
    window.location.href = 'http://localhost:8082/guests/news';
});
$('.instagram-item').on('click', function () {
    window.location.href = 'https://www.instagram.com/_thawngg/';
});
$('.products-sale .product-sale:nth-child(1)').on('click', function () {
    window.location.href = `/guests/detail?productId=12`;
});
$('.products-sale .product-sale:nth-child(2)').on('click', function () {
    window.location.href = `/guests/detail?productId=16`;
});
$('.products-sale .product-sale:nth-child(3)').on('click', function () {
    window.location.href = `/guests/detail?productId=19`;
});
$('.products-sale .product-sale:nth-child(4)').on('click', function () {
    window.location.href = `/guests/detail?productId=11`;
});
$('.logo').on('click', function() {
    window.location.href = 'http://localhost:8082/guests/home-guest';
});

document.addEventListener("DOMContentLoaded", function() {
    getUserProfile(); // Lấy thông tin người dùng từ backend
});

function getUserProfile() {
    $.ajax({
        url: URL + 'api/users/profile',
        type: 'GET',
        success: function(response) {
            if (response.code === 200 && response.data) {
                console.log(response);

                // Kiểm tra trạng thái tài khoản
                if (response.data.status === 'INACTIVE' || response.data.status === 'LOCKED') {
                    let message = response.data.status === 'INACTIVE'
                        ? "Your account has been deactivated by admin with some seasons.\nContact admin: 1234567 for more information"
                        : "Your account has been locked by admin with some seasons .\nContact admin: 1234567 for more information";

                    Swal.fire({
                        title: "Account Status",
                        text: message,
                        icon: "warning",
                        confirmButtonText: "OK"
                    }).then(() => {
                        window.location.href = "http://localhost:8082/guests/login";
                    });

                    return; // Dừng tiếp tục hiển thị thông tin tài khoản
                }

                // Hiển thị menu dropdown nếu tài khoản hoạt động bình thường
                const dropdownMenu = document.querySelector('.dropdown-menu');
                dropdownMenu.innerHTML = `
                    <a href="http://localhost:8082/guests/profile">Thông tin</a>
                    <a href="http://localhost:8082/guests/order">Đơn hàng</a>
                    <a href="http://localhost:8082/guests/login" id="logout">Đăng xuất</a>   
                `;

                // Hiển thị tên người dùng
                const usernameSpan = document.getElementById('span1');
                const fullName = (response.data.firstName && response.data.lastName)
                    ? `${response.data.firstName} ${response.data.lastName}`
                    : response.data.username;
                usernameSpan.textContent = fullName;

                // Xử lý sự kiện đăng xuất
                document.getElementById('logout').addEventListener('click', function(event) {
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
                            Swal.fire({
                                title: "Logged out!",
                                text: "Your account has been logged out.",
                                icon: "success"
                            }).then(() => {
                                window.location.href = "http://localhost:8082/guests/login";
                            });

                            // Cập nhật giao diện về trạng thái chưa đăng nhập
                            const dropdownMenu = document.querySelector('.dropdown-menu');
                            dropdownMenu.innerHTML = `
                                <a href="#">Login</a>
                                <a href="#">Register</a>
                            `;

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




//featured products
// URL của API sản phẩm
const apiUrl = 'http://localhost:8082/api/products/all-products';

// Hàm để hiển thị sản phẩm
function displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';  // Xóa nội dung cũ nếu có

    products.forEach(product => {
        const productElement = `
                <div class="product-sales" data-product-id="${product.id}">
                    ${product.status.code === 'AVAILABLE' ? '<div class="sale-badge">Sale</div>' : ''}
                    <div class="product-image">
                            <img src="${product.imageUrls[0]}" alt="${product.name}" id="main-image2-${product.id}">
                    </div>
                    <div class="wishlist-icon2" data-tooltip="Add to wishlist">
                           <i class="fa fa-heart" id="add-to-wishlist2"></i>
                         </div>
                    <h3>${product.name}</h3>
                    <p class="price">
                        <span class="sale-price">${product.price}.000đ</span>
                        <span class="original-price">55.000đ</span>
                    </p>
                    <!-- Cart Icon -->
                    <div class="cart-icon">
                        <button class="add-to-cart-btn2"><i class="fa fa-shopping-cart"></i> Add to Cart</button>
                    </div>
                    <!-- Size options -->
                    <div class="size-options">
                       <label>Size:</label>
                            <div class="size-buttons">
                                ${product.sizes.map(size => `
                                <button 
                                    class="size-button" 
                                    data-size="${size}" 
                                    onclick="selectSize(this)"
                                   >
                                    ${size.name}
                                </button>
                                `).join('')}
                            </div>
                    </div>

                   
                </div>
            `;
        container.innerHTML += productElement;
    });
    // Thêm sự kiện click vào mỗi sản phẩm
    $('.product-sales').on('click', function () {
        let productId = $(this).data('product-id');
        // Chuyển hướng đến trang chi tiết sản phẩm
        window.location.href = `/guests/detail?productId=${productId}`;
    });
}
function changeImage2(productId, newImageUrl) {
    $(`#main-image2-${productId}`).attr('src', newImageUrl);
}

// Gọi API để lấy sản phẩm
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data); // Kiểm tra dữ liệu trả về từ API

        // Truy cập vào mảng sản phẩm trong thuộc tính 'content'
        const products = data.content;

        if (Array.isArray(products)) {
            // Lấy 2 sản phẩm đầu tiên
            const topSellingProducts = products.slice(0, 2);
            displayProducts(topSellingProducts, 'top-selling-products');

            // Lấy các sản phẩm còn lại
            const moreProducts = products.slice(2,6);
            displayProducts(moreProducts, 'more-products');
        } else {
            console.error('Data in content is not an array:', products);
        }
    })
    .catch(error => {
        console.error('Error fetching products:', error);
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
    $('.view-all-voucher').click(function () {
        window.location.href = 'http://localhost:8082/guests/voucher';
    });
});
$(document).ready(function () {
    $('.promotion li').click(function () {
        window.location.href = 'http://localhost:8082/guests/voucher';
    });
});

$(document).ready(function () {
    $('.wishlist').click(function () {
        window.location.href = 'http://localhost:8082/guests/wishlist';
    });
});

$(document).ready(function () {
    $('.banner').click(function () {
        window.location.href = 'http://localhost:8082/guests/allproducts';
    });
});