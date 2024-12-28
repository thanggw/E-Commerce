

const URL = 'http://localhost:8082/';
const pageSize = 8;  // Số lượng sản phẩm hiển thị trên homepage

$(document).ready(function () {
    getProduct();
});
const colorMap2 = {
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
                        <p id="product_price">$${product.price}</p>
                        <div class="product-colors">
                            ${product.colors.map((color, index) => `
                                <span 
                                    class="color-dot" 
                                    style="background-color: ${colorMap2[color.name] || 'gray'};"
                                    data-image="${product.imageUrls[index] || product.imageUrls[0]}" 
                                    onmouseover="changeImage(${product.id}, '${product.imageUrls[index] || product.imageUrls[0]}')"
                                ></span>
                            `).join('')}
                        </div>
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
document.addEventListener("DOMContentLoaded", function() {
    getUserProfile(); // Lấy thông tin người dùng từ backend
});

function getUserProfile() {
    $.ajax({
        url: URL + 'api/users/profile',
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








// code này giống hệt bên cart.js hiển thị sản phẩm trong cart lên giao diện nhưng paste vào để hiển thij số lượng cart-items-count
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
        url: URL + `api/carts/${userId}`,
        type: 'GET',
        success: function (response) {
            console.log("Cart fetched successfully:", response);
            let cartItems = response.items;
            let cartItemsContainer = $('#cart-items');
            cartItemsContainer.empty(); // Xóa nội dung cũ

            let totalQuantity = 0;
            let totalPrice = 0;

            if (!cartItems || cartItems.length === 0) {
                cartItemsContainer.html('<p>Your cart is empty</p>');
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
                <p>Price: ${item.productPrice}.000 VND</p>
            </div>

            <!-- Tổng tiền cho sản phẩm -->
            <div style="text-align: right;">
                <p>Tổng: ${item.productQuantity * item.productPrice}.000 VND</p>
                <button class="remove-btn" onclick="removeItem(${userId}, ${item.productId})">Delete</button>
            </div>
        </div>`;
                    cartItemsContainer.append(cartItemHTML);

                    totalQuantity += item.productQuantity;
                    totalPrice += item.productQuantity * item.productPrice;
                });

                // Cập nhật thông tin tổng quan giỏ hàng
                $('#total-quantity').text(`Total product quantity: ${totalQuantity}`);
                $('#total-price').text(`Total money: ${totalPrice}.000 VND`);
                $('.cart-items-count').text(totalQuantity);
            }

            // Cập nhật thông tin về ngày tạo và ngày chỉnh sửa
            $('#created-info').text(`Created Date: ${response.createdDate}`);
            $('#modified-info').text(`Changed date: ${response.lastModifiedDate}`);
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
                        <span class="sale-price">${product.price}đ</span>
                        <span class="original-price">550$</span>
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

                    <!-- Color options -->
                    <div class="product-colors">
                            ${product.colors.map((color, index) => `
                                <span 
                                    class="color-dot" 
                                    style="background-color: ${colorMap2[color.name] || 'gray'};"
                                    data-image="${product.imageUrls[index] || product.imageUrls[0]}" 
                                    onmouseover="changeImage2(${product.id}, '${product.imageUrls[index] || product.imageUrls[0]}')"
                                ></span>
                            `).join('')}
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