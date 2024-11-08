// Tải dữ liệu giỏ hàng từ localStorage khi trang được load
document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalQuantityElement = document.getElementById('total-quantity');
    const totalPriceElement = document.getElementById('total-price');
    const createdInfoElement = document.getElementById('created-info');
    const modifiedInfoElement = document.getElementById('modified-info');

    let totalQuantity = 0;
    let totalPrice = 0;

    // Hiển thị sản phẩm trong giỏ hàng
    cart.forEach((item, index) => {
        totalQuantity += item.quantity;
        totalPrice += item.quantity * parseFloat(item.price.replace('$', ''));

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.setAttribute('data-index', index); // Set index to cart item to help remove it later

        cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>Giá: ${item.price}</p>
          <p>Số lượng: <span class="item-quantity">${item.quantity}</span></p>
      </div>
      <div class="increase">
        <button class="decrease" data-index="${index}">-</button>
        <button class="current-quantity">${item.quantity}</button>
        <button class="increase-btn" data-index="${index}">+</button>
      </div>
      <button class="remove-item" data-index="${index}">Xóa</button>
    `;

        cartItemsContainer.appendChild(cartItem);
    });

    // Cập nhật tổng số lượng và tổng giá tiền
    totalQuantityElement.textContent = `Tổng số lượng sản phẩm: ${totalQuantity}`;
    totalPriceElement.textContent = `Tổng tiền: ${totalPrice.toLocaleString('vi-VN')}.000 VND`;

    // Hiển thị thời gian tạo và chỉnh sửa từ localStorage
    const createdTime = localStorage.getItem('cartCreatedTime');
    const modifiedTime = localStorage.getItem('cartModifiedTime');

    createdInfoElement.textContent = `Ngày tạo: ${createdTime ? createdTime : 'Chưa xác định'}`;
    modifiedInfoElement.textContent = `Ngày chỉnh sửa: ${modifiedTime ? modifiedTime : 'Chưa xác định'}`;

    // Xử lý sự kiện tăng/giảm số lượng sản phẩm
    cartItemsContainer.addEventListener('click', (event) => {
        const index = event.target.getAttribute('data-index');
        if (event.target.classList.contains('increase-btn')) {
            cart[index].quantity++;
            updateCart(cart);
        } else if (event.target.classList.contains('decrease')) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                updateCart(cart);
            }
        } else if (event.target.classList.contains('remove-item')) {
            cart.splice(index, 1); // Xóa sản phẩm khỏi giỏ hàng
            updateCart(cart);
        }
    });
});

// Cập nhật giỏ hàng và lưu vào localStorage
function updateCart(cart) {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalQuantityElement = document.getElementById('total-quantity');
    const totalPriceElement = document.getElementById('total-price');

    let totalQuantity = 0;
    let totalPrice = 0;

    cartItemsContainer.innerHTML = ''; // Xóa nội dung giỏ hàng cũ

    cart.forEach((item, index) => {
        totalQuantity += item.quantity;
        totalPrice += item.quantity * parseFloat(item.price.replace('$', ''));

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.setAttribute('data-index', index);

        cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>Giá: ${item.price}</p>
          <p>Số lượng: <span class="item-quantity">${item.quantity}</span></p>
      </div>
      <div class="increase">
        <button class="decrease" data-index="${index}">-</button>
        <button class="current-quantity">${item.quantity}</button>
        <button class="increase-btn" data-index="${index}">+</button>
      </div>
      <button class="remove-item" data-index="${index}">Xóa</button>
    `;

        cartItemsContainer.appendChild(cartItem);
    });

    // Cập nhật tổng số lượng và tổng giá tiền
    totalQuantityElement.textContent = `Tổng số lượng sản phẩm: ${totalQuantity}`;
    totalPriceElement.textContent = `Tổng tiền: ${totalPrice.toLocaleString('vi-VN')}.000 VND`;

    // Lưu lại giỏ hàng mới vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Cập nhật thời gian chỉnh sửa
    const modifiedTime = new Date().toLocaleString();
    localStorage.setItem('cartModifiedTime', modifiedTime);
}





function updateCartDisplay() {
    const cartIcon = document.querySelector('.cart .cart-items-count');
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartIcon.textContent = totalItems;
}

// Khởi tạo giỏ hàng trống
let cart = [];

// Lưu giỏ hàng vào localStorage (nếu có)
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    updateCartDisplay(); // Cập nhật hiển thị giỏ hàng khi tải trang
}