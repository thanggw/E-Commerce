

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
    const userId = localStorage.getItem("userId"); // User ID fetched from localStorage
    const apiUrl = `http://localhost:8082/api/wishlist/${userId}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const wishlistItemsContainer = document.getElementById("wishlist-items");
            const wishlistCountElement = document.querySelector('.wishlist span:nth-child(3)');

            if (!data.items || data.items.length === 0) {
                wishlistItemsContainer.innerHTML = "<p>Your wishlist is empty!</p>";
                return;
            }

            const count = data.items.length;
            wishlistCountElement.textContent = count;

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

                wishlistItemsContainer.appendChild(itemCard);
            });

            document.querySelectorAll(".remove-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const itemId = this.getAttribute("data-item-id");
                    removeFromWishlist(itemId);
                });
            });
        })
        .catch(error => console.error("Error fetching wishlist:", error));
});

function removeFromWishlist(itemId) {
    const apiUrl = `http://localhost:8082/api/wishlist/remove/${itemId}`;

    fetch(apiUrl, { method: "DELETE" })
        .then(response => {
            if (response.ok) {
                alert("Item removed from wishlist.");
                location.reload();
            } else {
                alert("Failed to remove item.");
            }
        })
        .catch(error => console.error("Error removing item:", error));
}

function getColorCode(colorName) {
    const colorMap = {
        "Red": "#FF0000",
        "Blue": "#0000FF",
        "Yellow": "#FFFF00",
        "Green": "#008000",
        "Orange": "#FFA500",
        "Purple": "#800080",
        "Pink": "#FFC0CB",
        "Brown": "#A52A2A",
        "Black": "#000000",
        "White": "#FFFFFF",
        "Gray": "#808080",
        "Violet": "#EE82EE"
    };
    return colorMap[colorName] || "#CCCCCC";
}

// Manage the shopping cart and display cart items
$(document).ready(function () {
    getCart();
});

function getCart() {
    console.log("Refreshing cart...");
    let userId = localStorage.getItem("userId");

    if (!userId) {
        console.error('User ID not found in localStorage');
        return;
    }

    $.ajax({
        url: URL1 + `api/carts/${userId}`,
        type: 'GET',
        success: function (response) {
            console.log("Cart fetched successfully:", response);
            let cartItems = response.items;
            let cartItemsContainer = $('#cart-items');
            cartItemsContainer.empty();

            let totalQuantity = 0;
            let totalPrice = 0;

            if (!cartItems || cartItems.length === 0) {
                cartItemsContainer.html('<p>Your cart is empty.</p>');
            } else {
                cartItems.forEach(item => {
                    let cartItemHTML = `
                        <div class="cart-item" style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                            <img src="${item.productImage}" alt="${item.productName}" style="width: 100px; height: 100px; object-fit: cover; margin-right: 20px;">
                            <div style="flex-grow: 1;">
                                <h4 style="margin: 0 0 10px 0;">${item.productName}</h4>
                                <p>Quantity: ${item.productQuantity}</p>
                                <p>Price: ${item.productPrice}.000 VND</p>
                            </div>
                            <div style="text-align: right;">
                                <p>Total: ${item.productQuantity * item.productPrice}.000 VND</p>
                                <button class="remove-btn" onclick="removeItem(${userId}, ${item.productId})">Remove</button>
                            </div>
                        </div>`;
                    cartItemsContainer.append(cartItemHTML);

                    totalQuantity += item.productQuantity;
                    totalPrice += item.productQuantity * item.productPrice;
                });

                $('#total-quantity').text(`Total items: ${totalQuantity}`);
                $('#total-price').text(`Total cost: ${totalPrice}.000 VND`);
                $('.cart-items-count').text(totalQuantity);
            }

            $('#created-info').text(`Created on: ${response.createdDate}`);
            $('#modified-info').text(`Last modified: ${response.lastModifiedDate}`);
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

// Fetch and display user profile
document.addEventListener("DOMContentLoaded", function() {
    getUserProfile();
});

function getUserProfile() {
    $.ajax({
        url: URL1 + 'api/users/profile',
        type: 'GET',
        success: function(response) {
            if (response.code === 200 && response.data) {
                const dropdownMenu = document.querySelector('.dropdown-menu');

                dropdownMenu.innerHTML = `
                    <a href="http://localhost:8082/guests/profile">Profile</a>
                    <a href="http://localhost:8082/guests/order">Order</a>
                    <a href="http://localhost:8082/guests/login" id="logout">Log out</a>`;

                const usernameSpan = document.getElementById('span1');
                const fullName = (response.data.firstName && response.data.lastName)
                    ? `${response.data.firstName} ${response.data.lastName}`
                    : response.data.username;

                usernameSpan.textContent = fullName;

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




document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:8082/api/products/current-user';
    const productTableBody = document.querySelector('#productTable tbody');
    const editForm = document.getElementById('editForm');
    const editProductName = document.getElementById('editProductName');
    const editProductPrice = document.getElementById('editProductPrice');
    const editProductId = document.getElementById('editProductId');
    const saveEditButton = document.getElementById('saveEditButton');

    // Fetch and Render Products
    function fetchProducts() {
        productTableBody.innerHTML = '';
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                data.forEach(product => {
                    const row = document.createElement('tr');
                    row.setAttribute('data-product-id', product.id);

                    row.innerHTML = `
                                <td>${product.id}</td>
                                <td><img src="${product.imageUrls[0]}" alt="${product.name}" class="product-image"></td>
                                <td>${product.name}</td>
                                <td>$${product.price.toFixed(2)}</td>
                                <td>${product.category.description}</td>
                                <td>
                                    <button class="action-button edit-button" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Edit</button>
                                    <button class="action-button delete-button" data-id="${product.id}">Delete</button>
                                </td>
                            `;
                    productTableBody.appendChild(row);
                    row.addEventListener('click', function (event) {
                        // Nếu click vào button thì ngăn chặn sự lan truyền
                        if (event.target.tagName === 'BUTTON') {
                            event.stopPropagation();
                        } else {
                            // Lấy productId từ data-product-id và chuyển hướng
                            const productId = row.getAttribute('data-product-id');
                            window.location.href = `/guests/detail?productId=${productId}`;
                        }
                    });
                });

                attachEventListeners(); // Attach events to buttons
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    // Attach Event Listeners for Edit and Delete
    function attachEventListeners() {
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                const productName = button.getAttribute('data-name');
                const productPrice = button.getAttribute('data-price');

                // Populate Edit Form
                editProductId.value = productId;
                editProductName.value = productName;
                editProductPrice.value = productPrice;

                // Show the Edit Form
                editForm.style.display = 'block';
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                handleDelete(productId);
            });
        });
    }

    // Handle Save Edit
    saveEditButton.addEventListener('click', () => {
        const productId = editProductId.value;
        const updatedData = {
            name: editProductName.value,
            price: parseFloat(editProductPrice.value)
        };

        fetch(`http://localhost:8082/api/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
            .then(response => {
                if (response.ok) {
                    alert('Sản phẩm đã được cập nhật!');
                    editForm.style.display = 'none';
                    fetchProducts();
                } else {
                    throw new Error('Failed to update product');
                }
            })
            .catch(error => {
                console.error('Error updating product:', error);
                alert('Có lỗi xảy ra khi cập nhật sản phẩm.');
            });
    });

    // Handle Delete
    function handleDelete(productId) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            fetch(`http://localhost:8082/api/products/${productId}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        alert('Sản phẩm đã được xóa!');
                        fetchProducts();
                    } else {
                        throw new Error('Failed to delete product');
                    }
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    alert('Có lỗi xảy ra khi xóa sản phẩm.');
                });
        }
    }

    // Initial Fetch
    fetchProducts();
});



document.addEventListener('DOMContentLoaded', function () {
    const bankInfoContainer = document.getElementById('bankInfoContainer');
    const bankSummary = document.getElementById('bankSummary');
    const editBankButton = document.getElementById('editBankButton');

    const bankForm = document.getElementById('bankForm');
    const bankDropdown = document.getElementById('bankDropdown');
    const bankAccountInput = document.getElementById('bankAccount');
    const updateBankButton = document.getElementById('updateBankButton');
    let userId = localStorage.getItem("userId");

    const bankApiUrl = 'https://api.vietqr.io/v2/banks';
    const bankInfoApiUrl = `http://localhost:8082/api/seller/bank-info?userId=${userId}`;
    const updateBankApiUrl = `http://localhost:8082/api/seller/update-bank?userId=${userId}`;

    // Fetch danh sách ngân hàng


    function fetchBanks() {
        fetch('http://api.vietqr.io/v2/banks')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.code === "00") {
                    const banks = data.data;

                    // Thêm từng ngân hàng vào dropdown
                    // Thêm option mặc định trước khi thêm các ngân hàng
                    const defaultOption = document.createElement('option');
                    defaultOption.value = "";

                    defaultOption.selected = true; // Đặt làm giá trị mặc định
                    defaultOption.disabled = true; // Không cho phép người dùng chọn
                    bankDropdown.appendChild(defaultOption);

// Thêm các ngân hàng như trước
                    banks.forEach(bank => {
                        const option = document.createElement('option');
                        option.value = bank.code;
                        option.dataset.content = `
        <img src="${bank.logo}" alt="${bank.shortName}" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 10px;">
        ${bank.shortName}
    `;
                        bankDropdown.appendChild(option);
                    });
                    $('#bankDropdown').selectpicker({
                        title: "Chọn Ngân Hàng" // Hiển thị tiêu đề mặc định
                    });
                    $('#bankDropdown').selectpicker('refresh');


                } else {
                    console.error('Không thể tải danh sách ngân hàng:', data.desc);
                }
            })
            .catch(error => console.error('Lỗi khi gọi API:', error));
    }


    $(document).ready(function () {
        fetchBanks(); // Gọi hàm fetchBanks khi DOM đã sẵn sàng
    });

    // Fetch thông tin ngân hàng của người dùng
    function fetchBankInfo() {
        fetch(bankInfoApiUrl, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                if (data.bankName && data.bankAccount) {
                    // Hiển thị tóm tắt thông tin ngân hàng
                    bankSummary.textContent = `Ngân hàng: ${data.bankName} 
                                               - Số tài khoản: ****${data.bankAccount.slice(-4)}`;
                    bankSummary.style.display = 'block';
                    editBankButton.style.display = 'inline-block';
                } else {
                    // Hiển thị form nếu chưa có thông tin
                    bankForm.style.display = 'block';
                    fetchBanks();
                }
            })
            .catch(error => console.error('Error fetching bank info:', error));
    }

    // Hiển thị form chỉnh sửa khi click "Chỉnh sửa"
    editBankButton.addEventListener('click', function () {
        bankSummary.style.display = 'none';
        editBankButton.style.display = 'none';
        bankForm.style.display = 'block';
        fetchBanks(); // Gọi lại danh sách ngân hàng
    });

    // Cập nhật ngân hàng và số tài khoản
    updateBankButton.addEventListener('click', () => {
        const selectedBank = bankDropdown.value;
        const bankAccount = bankAccountInput.value;

        if (!selectedBank || !bankAccount) {
            alert('Vui lòng chọn ngân hàng và nhập số tài khoản.');
            return;
        }

        fetch(updateBankApiUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bankName: selectedBank, bankAccount: bankAccount }),
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    alert('Thông tin ngân hàng đã được cập nhật thành công!');
                    location.reload(); // Reload lại trang để cập nhật
                } else {
                    throw new Error('Cập nhật thất bại');
                }
            })
            .catch(error => {
                console.error('Error updating bank information:', error);
                alert('Có lỗi xảy ra khi cập nhật thông tin.');
            });
    });

    // Gọi fetchBankInfo khi load trang
    fetchBankInfo();
});

