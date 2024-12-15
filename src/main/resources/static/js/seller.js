/*document.getElementById('addProductForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const quantity = document.getElementById('quantity').value;
    const brandCode = document.getElementById('brandCode').value;
    const categoryCode = document.getElementById('categoryCode').value;
    const colors = document.getElementById('colors').value.split(',').map(c => c.trim());
    const sizes = document.getElementById('sizes').value.split(',').map(s => s.trim());
    const statusCode = document.getElementById('statusCode').value;

    // Xử lý ảnh
    const imageInput = document.getElementById('imageInput');
    const imageFiles = imageInput.files;
    console.log('Số lượng file:', imageFiles.length);
    const imageUrls = await Promise.all(Array.from(imageFiles).map(file => toBase64(file)));

    const payload = {
        name,
        price,
        description,
        quantity,
        brandCode,
        categoryCode,
        colors,
        sizes,
        imageUrls,
        statusCode,
    };

    console.log('Payload:', payload);
    try {
        const response = await axios.post('http://localhost:8082/api/products/create', payload);
        document.getElementById('message').textContent = 'Product added successfully!';
        document.getElementById('message').className = 'message success';
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'An error occurred while adding the product.';
        document.getElementById('message').className = 'message error';
    }
});*/

// Hàm chuyển file thành Base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            console.log("Base64 string:", reader.result);
            resolve(reader.result.split(',')[1]); // Chỉ lấy phần Base64 sau dấu phẩy
        };
        reader.onerror = error => {
            console.error("Error reading file:", error);
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}





const URL1 = 'http://localhost:8082/';
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
        url: URL1 + `api/carts/${userId}`,
        type: 'GET',
        success: function (response) {
            console.log("Cart fetched successfully:", response);
            let cartItems = response.items;
            let cartItemsContainer = $('#cart-items');
            cartItemsContainer.empty(); // Xóa nội dung cũ

            let totalQuantity = 0;
            let totalPrice = 0;

            if (!cartItems || cartItems.length === 0) {
                cartItemsContainer.html('<p>Giỏ hàng của bạn trống.</p>');
            } else {
                cartItems.forEach(item => {
                    let cartItemHTML = `
                           <div class="cart-item" style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
            <!-- Hiển thị ảnh sản phẩm -->
            <img src="${item.productImage}" alt="${item.productName}" style="width: 100px; height: 100px; object-fit: cover; margin-right: 20px;">

            <!-- Thông tin sản phẩm -->
            <div style="flex-grow: 1;">
                <h4 style="margin: 0 0 10px 0;">${item.productName}</h4>
                <p>Số lượng: ${item.productQuantity}</p>
                <p>Giá: ${item.productPrice}.000 VND</p>
            </div>

            <!-- Tổng tiền cho sản phẩm -->
            <div style="text-align: right;">
                <p>Tổng: ${item.productQuantity * item.productPrice}.000 VND</p>
                <button class="remove-btn" onclick="removeItem(${userId}, ${item.productId})">Xóa</button>
            </div>
        </div>`;
                    cartItemsContainer.append(cartItemHTML);

                    totalQuantity += item.productQuantity;
                    totalPrice += item.productQuantity * item.productPrice;
                });

                // Cập nhật thông tin tổng quan giỏ hàng
                $('#total-quantity').text(`Tổng số lượng sản phẩm: ${totalQuantity}`);
                $('#total-price').text(`Tổng tiền: ${totalPrice}.000 VND`);
                $('.cart-items-count').text(totalQuantity);
            }

            // Cập nhật thông tin về ngày tạo và ngày chỉnh sửa
            $('#created-info').text(`Ngày tạo: ${response.createdDate}`);
            $('#modified-info').text(`Ngày chỉnh sửa: ${response.lastModifiedDate}`);
        },
        error: function (error) {
            console.error('Error fetching cart:', error);
        }
    });
}
function removeItem(userId, productId) {
    console.log("Removing product with ID:", productId, "from user ID:", userId);
    $.ajax({
        url: URL1 + `api/carts/${userId}/remove/${productId}`,
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




document.addEventListener("DOMContentLoaded", function() {
    getUserProfile(); // Lấy thông tin người dùng từ backend
});

function getUserProfile() {
    $.ajax({
        url: URL1 + 'api/users/profile',
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
                                title: "Log out!",
                                text: "Your account has been logged out.",
                                icon: "success"
                            });
                        }
                    });
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




const input20 = document.getElementById('animatedInput');
const placeholders20 = [
    'What are you looking for?',
    'Adidas Superstar',
    'Nike Air Force 1',
    'Converse Chuck Taylor',
    'Vans Old Skool',
    'Puma Suede',
    'New Balance 574',
    'Reebok Classic Leather'
];

let currentIndex20 = 0;
let isDeleting20 = false;
let currentText20 = '';
let charIndex20 = 0;

function typeEffect() {
    const currentPlaceholder = placeholders20[currentIndex20];

    if (isDeleting20) {
        // Xóa từng ký tự
        currentText20 = currentPlaceholder.substring(0, charIndex20 - 1);
        charIndex20--;
    } else {
        // Thêm từng ký tự
        currentText20 = currentPlaceholder.substring(0, charIndex20 + 1);
        charIndex20++;
    }

    input20.setAttribute('placeholder', currentText20);

    let typingSpeed = isDeleting20 ? 30 : 50; // Tốc độ gõ và xóa

    if (!isDeleting20 && charIndex20 === currentPlaceholder.length) {
        // Khi gõ xong, đợi 1 giây rồi bắt đầu xóa
        typingSpeed = 1000;
        isDeleting20 = true;
    } else if (isDeleting20 && charIndex20 === 0) {
        // Khi xóa xong, chuyển sang placeholder tiếp theo
        isDeleting20 = false;
        currentIndex20 = (currentIndex20 + 1) % placeholders20.length;
    }

    setTimeout(typeEffect, typingSpeed);
}

// Bắt đầu hiệu ứng
typeEffect();




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




// JavaScript cho chức năng tải ảnh lên, xem trước, xem full ảnh và tích hợp với API backend

document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('imageInput');
    const previewImages = document.getElementById('previewImages');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.getElementById('closeModal');
    const addProductForm = document.getElementById('addProductForm');
    const imageBase64s = []; // Lưu trữ các ảnh dưới dạng Base64

    // Khi người dùng nhấn vào nút "Choose Image"
    document.getElementById('selectFiles').addEventListener('click', () => {
        imageInput.click();
    });

    // Khi chọn file ảnh
    imageInput.addEventListener('change', function () {
        const files = imageInput.files;

        Array.from(files).forEach(file => {
            const reader = new FileReader();

            reader.onload = function (e) {
                // Thêm ảnh Base64 vào danh sách
                imageBase64s.push(e.target.result);

                // Tạo phần tử chứa ảnh xem trước
                const imageWrapper = document.createElement('div');
                imageWrapper.classList.add('image-wrapper');

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = file.name;
                img.classList.add('preview-image');

                // Sự kiện click để xem full ảnh
                img.addEventListener('click', () => {
                    modal.style.display = 'block';
                    modalImage.src = e.target.result;
                });

                imageWrapper.appendChild(img);
                previewImages.appendChild(imageWrapper);
            };

            reader.readAsDataURL(file);
        });

        // Reset giá trị của input file để cho phép chọn lại các ảnh cũ và mới
        imageInput.value = '';
    });

    // Đóng modal khi nhấn vào nút "close"
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Đóng modal khi nhấn ra ngoài ảnh
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Gửi dữ liệu sản phẩm đến API khi submit form
    addProductForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form

        try {
            // Thu thập dữ liệu từ form
            const formData = new FormData(addProductForm);
            const colors = formData.get('colors') ? formData.get('colors').split(',').map(color => color.trim()) : [];
            const sizes = formData.get('sizes') ? formData.get('sizes').split(',').map(size => size.trim()) : [];
            const productData = {
                name: formData.get('name'),
                price: parseFloat(formData.get('price')),
                description: formData.get('description'),
                quantity: parseInt(formData.get('quantity')),
                brandCode: formData.get('brandCode'),
                categoryCode: formData.get('categoryCode'),
                colors: colors.length > 0 ? colors : null, // Đảm bảo `colors` không phải mảng rỗng
                sizes: sizes.length > 0 ? sizes : null,   // Đảm bảo `sizes` không phải mảng rỗng
                imageBase64s: imageBase64s.length > 0 ? imageBase64s : null, // Kiểm tra danh sách ảnh
                statusCode: formData.get('statusCode')
            };

            // Kiểm tra cấu trúc của productData trước khi gửi
            console.log('Product Data:', productData);

            // Gửi dữ liệu đến API backend
            fetch('/api/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            })
                .then(response => {
                    console.log('HTTP Status:', response.status);

                    if (response.status === 204) {
                        return { status: response.status, data: null }; // Xử lý trường hợp 204 No Content
                    }
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Add your product to the shop successfully!',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
                    return response.json().then(data => ({ status: response.status, data }));
                })

        } catch (error) {
            console.error('Error in form submission:', error);
            alert('An error occurred while preparing product data.');
        }
    });
});



