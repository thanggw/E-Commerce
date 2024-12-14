document.addEventListener("DOMContentLoaded", function () {
    // Lấy productId từ URL (trong URL sẽ có tham số ?productId=ID)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("productId");

    if (productId) {
        const apiUrl = `http://localhost:8082/api/products/${productId}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Update thông tin sản phẩm
                document.querySelector(".product-title").textContent = data.name;
                document.querySelector(".price").textContent = `${data.price.toLocaleString()}$`;

                // Cập nhật hình ảnh sản phẩm
                const mainImage = document.querySelector(".main-image img");
                const thumbnailList = document.querySelector(".thumbnail-list");
                mainImage.src = data.imageUrls[0];
                thumbnailList.innerHTML = ""; // Xóa các hình ảnh thu nhỏ cũ

                data.imageUrls.forEach((url, index) => {
                    const thumbnail = document.createElement("div");
                    thumbnail.classList.add("thumbnail");
                    thumbnail.innerHTML = `<img src="${url}" alt="Thumbnail ${index + 1}">`;
                    thumbnailList.appendChild(thumbnail);

                    // Thay đổi hình ảnh chính khi người dùng nhấn vào hình thu nhỏ
                    thumbnail.addEventListener("click", () => {
                        mainImage.src = url;
                    });
                });



                // Cập nhật các tùy chọn màu sắc
                const colorOptions = document.querySelector("#color-options");
                const sizeOptions = document.querySelector("#size-options");

                // Đảm bảo chỉ làm trống phần tử màu sắc và kích cỡ
                colorOptions.innerHTML = "";
                sizeOptions.innerHTML = "";

                // Cập nhật các màu sắc
                data.colors.forEach((color, index) => {
                    const option = document.createElement("div");
                    option.classList.add("variation-option");
                    option.textContent = color.name; // Hiển thị tên màu
                    option.dataset.id = color.id; // Lưu colorId vào data-id
                    // Lắng nghe sự kiện click vào màu sắc
                    option.addEventListener("click", () => {
                        // Khi người dùng click vào màu sắc, thay đổi hình ảnh
                        mainImage.src = data.imageUrls[index] || data.imageUrls[0];
                        const selectedOption = colorOptions.querySelector(".selected");
                        if (selectedOption) {
                            selectedOption.classList.remove("selected");
                        }
                        option.classList.add("selected");
                    });
                    colorOptions.appendChild(option);
                });

                // Cập nhật các kích cỡ
                data.sizes.forEach((size) => {
                    const option = document.createElement("div");
                    option.classList.add("variation-option");
                    option.textContent = size.name; // Hiển thị tên kích cỡ
                    option.dataset.id = size.id; // Lưu sizeId vào data-id
                    // Lắng nghe sự kiện click vào kích cỡ
                    option.addEventListener("click", () => {
                        // Khi người dùng chọn một kích cỡ, đánh dấu là "selected"
                        const selectedOption = sizeOptions.querySelector(".selected");
                        if (selectedOption) {
                            selectedOption.classList.remove("selected");
                        }
                        option.classList.add("selected");
                    });
                    sizeOptions.appendChild(option);
                });
                const quantityInput = document.querySelector(".quantity-input");
                const decreaseBtn = document.querySelector(".quantity-controls button:first-child");
                const increaseBtn = document.querySelector(".quantity-controls button:last-child");

                let quantity = parseInt(quantityInput.value) || 1; // Giá trị mặc định là 1

                // Giới hạn số lượng sản phẩm
                const maxQuantity = data.quantity;

                // Xử lý giảm số lượng
                decreaseBtn.addEventListener("click", () => {
                    if (quantity > 1) {
                        quantity--;
                        quantityInput.value = quantity;
                    }
                });

                // Xử lý tăng số lượng
                increaseBtn.addEventListener("click", () => {
                    if (quantity < maxQuantity) {
                        quantity++;
                        quantityInput.value = quantity;
                    }
                });

                // Xử lý khi người dùng nhập số lượng trực tiếp
                quantityInput.addEventListener("input", () => {
                    let inputVal = parseInt(quantityInput.value);
                    if (isNaN(inputVal) || inputVal < 1) {
                        quantity = 1; // Nếu nhập không hợp lệ, đặt về 1
                    } else if (inputVal > maxQuantity) {
                        quantity = maxQuantity; // Nếu vượt quá số lượng tối đa
                    } else {
                        quantity = inputVal;
                    }
                    quantityInput.value = quantity;
                });

                // Cập nhật thông tin số lượng sản phẩm còn lại
                const quantityInfo = document.querySelector(".quantity-section span:last-child");
                quantityInfo.textContent = `Product Available: ${data.quantity} `;
            })
            .catch(error => console.error("Error fetching product data:", error));
    } else {
        console.error("Product ID is missing in URL.");
    }
});



document.addEventListener("DOMContentLoaded", function () {
    const wishlistIcon = document.querySelector("#add-to-wishlist2");

    // Lắng nghe sự kiện click vào icon wishlist
    wishlistIcon.addEventListener("click", function () {
        // Lấy userId, productId, colorId, sizeId
        const userId = localStorage.getItem("userId"); // Thay bằng logic lấy userId thực tế
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get("productId");

        // Lấy colorId và sizeId từ các lựa chọn của người dùng
        const selectedColor = document.querySelector("#color-options .selected");
        const selectedSize = document.querySelector("#size-options .selected");

        if (!productId || !selectedColor || !selectedSize) {
            Swal.fire({
                title: "Can not add to wishlist!",
                text: "Please choose color and size!",
                icon: "warning"
            });
            return;
        }

        const colorId = selectedColor.dataset.id;
        const sizeId = selectedSize.dataset.id;

        // Tạo payload
        const payload = {
            userId: userId,
            productId: parseInt(productId),
            colorId: parseInt(colorId),
            sizeId: parseInt(sizeId),
        };

        // Gửi yêu cầu POST tới API
        fetch("http://localhost:8082/api/wishlist/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    Swal.fire({
                        title: "Successfully",
                        text: "You added this product to wishlist successfully!",
                        icon: "success"
                    });
                } else {
                    Swal.fire({
                        title: "Can not add to wishlist because of the system error:((",
                        showClass: {
                            popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
                        },
                        hideClass: {
                            popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
                        }
                    });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Không thể thêm sản phẩm vào danh sách yêu thích. Vui lòng thử lại!");
            });
    });
});





document.addEventListener("DOMContentLoaded", function() {
    getUserProfile(); // Lấy thông tin người dùng từ backend
});
const urlBase7 = "http://localhost:8082/";
function getUserProfile() {
    $.ajax({
        url: urlBase7 + 'api/users/profile',
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
                            <a href="#">Login</a>
                            <a href="#">Register</a>
                        `;
                    // Đặt lại hiển thị username về trạng thái mặc định
                    usernameSpan.textContent = "Information";
                });
            }
        },
        error: function(error) {
            console.error('Error fetching user profile:', error);
        }
    });
}





document.querySelector(".btn-cart").addEventListener("click", () => {
    const selectedColor = document.querySelector("#color-options .selected");
    const selectedSize = document.querySelector("#size-options .selected");
    const quantity = parseInt(document.querySelector(".quantity-input").value);

    if (!selectedColor || !selectedSize) {
        alert("Enter your color and size!");
        return;
    }

    if (isNaN(quantity) || quantity < 1) {
        alert("Invalid Quantity");
        return;
    }

    const userId = localStorage.getItem("userId");
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("productId");
    const colorId = selectedColor.dataset.id; // Get the selected colorId
    const sizeId = selectedSize.dataset.id; // Get the selected sizeId

    const cartItemData = {
        userId,
        productId,
        colorId: parseInt(colorId),
        sizeId: parseInt(sizeId),
        quantity: quantity
    };

    fetch("http://localhost:8082/api/carts/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cartItemData)
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error occur when adding into cart");
            return response.json();
        })
        .then((data) => {
            Swal.fire({
                icon: 'success', // loại biểu tượng: 'success', 'error', 'warning', 'info'
                title: 'Success!',
                text: 'Add thí product to your cart successfully!',
                timer: 2000, // tự động đóng sau 3 giây
                timerProgressBar: true,
                showConfirmButton: false // ẩn nút xác nhận
            });
            console.log(data);
        })
        .catch((error) => {
            console.error("Error adding to cart:", error);
            alert("Unable to add to cart. Try again!");
        });
});





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
        url: urlBase7 + `api/carts/${userId}`,
        type: 'GET',
        success: function (response) {
            console.log("Cart fetched successfully:", response);
            let cartItems = response.items;
            let cartItemsContainer = $('#cart-items');
            cartItemsContainer.empty(); // Xóa nội dung cũ

            let totalQuantity = 0;
            let totalPrice = 0;

            if (!cartItems || cartItems.length === 0) {
                cartItemsContainer.html('<p>Your cart is empty.</p>');
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
                <p>Total: ${item.productQuantity * item.productPrice}.000 VND</p>
                <button class="remove-btn" onclick="removeItem(${userId}, ${item.productId})">Delete</button>
            </div>
        </div>`;
                    cartItemsContainer.append(cartItemHTML);

                    totalQuantity += item.productQuantity;
                    totalPrice += item.productQuantity * item.productPrice;
                });

                // Cập nhật thông tin tổng quan giỏ hàng
                $('#total-quantity').text(`Total number of product: ${totalQuantity}`);
                $('#total-price').text(`Total price: ${totalPrice}.000 VND`);
                $('.cart-items-count').text(totalQuantity);
            }

            // Cập nhật thông tin về ngày tạo và ngày chỉnh sửa
            $('#created-info').text(`Created date: ${response.createdDate}`);
            $('#modified-info').text(`Changed Date: ${response.lastModifiedDate}`);
        },
        error: function (error) {
            console.error('Error fetching cart:', error);
        }
    });
}
function removeItem(userId, productId) {
    console.log("Removing product with ID:", productId, "from user ID:", userId);
    $.ajax({
        url: urlBase7 + `api/carts/${userId}/remove/${productId}`,
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


$('.scroll-to-products').on('click', function () {
    window.location.href = 'http://localhost:8082/guests/allproducts';  // Chuyển hướng tới trang mới hiển thị toàn bộ sản phẩm
});




const input7 = document.getElementById('animatedInput');
const placeholders7 = [
    'What are you looking for?',
    'Adidas Superstar',
    'Nike Air Force 1',
    'Converse Chuck Taylor',
    'Vans Old Skool',
    'Puma Suede',
    'New Balance 574',
    'Reebok Classic Leather'
];

let currentIndex7 = 0;
let isDeleting7 = false;
let currentText7 = '';
let charIndex7 = 0;

function typeEffect() {
    const currentPlaceholder = placeholders7[currentIndex7];

    if (isDeleting7) {
        // Xóa từng ký tự
        currentText7 = currentPlaceholder.substring(0, charIndex7 - 1);
        charIndex7--;
    } else {
        // Thêm từng ký tự
        currentText7 = currentPlaceholder.substring(0, charIndex7 + 1);
        charIndex7++;
    }

    input7.setAttribute('placeholder', currentText7);

    let typingSpeed = isDeleting7 ? 30 : 50; // Tốc độ gõ và xóa

    if (!isDeleting7 && charIndex7 === currentPlaceholder.length) {
        // Khi gõ xong, đợi 1 giây rồi bắt đầu xóa
        typingSpeed = 1000;
        isDeleting7 = true;
    } else if (isDeleting7 && charIndex7 === 0) {
        // Khi xóa xong, chuyển sang placeholder tiếp theo
        isDeleting7 = false;
        currentIndex7 = (currentIndex7 + 1) % placeholders7.length;
    }

    setTimeout(typeEffect, typingSpeed);
}

// Bắt đầu hiệu ứng
typeEffect();



$(document).ready(function () {
    $('.btn-buy').click(function () {
        // Lấy productId từ URL hiện tại
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('productId');
        const selectedColor = document.querySelector("#color-options .selected");
        const selectedSize = document.querySelector("#size-options .selected");
        const quantity = parseInt(document.querySelector(".quantity-input").value);


        const colorId = selectedColor.dataset.id; // Get the selected colorId
        const sizeId = selectedSize.dataset.id; // Get the selected sizeId

        if (!colorId || !sizeId) {
            alert("Enter your color and size!");
            return;
        }

        if (isNaN(quantity) || quantity < 1) {
            alert("Invalid Number");
            return;
        }



        if (productId && colorId && sizeId) {
            // Chuyển hướng đến trang checkout với các thông tin
            window.location.href = `/guests/checkout?productId=${productId}&color=${colorId}&size=${sizeId}&quantity=${quantity}`;
        } else {
            console.error("Please choose an size and color before click buy");
            alert("Please choose an size and color before click buy.");
        }
    });
});


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