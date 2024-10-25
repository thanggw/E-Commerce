document.getElementById('addProductForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn việc gửi form theo cách mặc định

    // Lấy dữ liệu từ form
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const productStatus = document.getElementById('productStatus').value;
    const productImageFile = document.getElementById('productImage').files[0];
    const productImageUrl = URL.createObjectURL(productImageFile); // Tạo URL cho hình ảnh

    // Tạo hàng mới trong bảng
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><img src="${productImageUrl}" alt="${productName}" class="product-img"></td>
        <td>${productName}</td>
        <td>${productPrice} VND</td>
        <td>${productQuantity}</td>
        <td>${productStatus}</td>
        <td>
            <button class="btn">Chỉnh sửa</button>
            <button class="btn danger">Xóa</button>
        </td>
    `;

    // Thêm hàng mới vào bảng
    document.querySelector('.product-table tbody').appendChild(newRow);

    // Xóa thông tin trong form sau khi thêm sản phẩm
    document.getElementById('addProductForm').reset();

    // Thêm sự kiện cho nút Xóa
    newRow.querySelector('.btn.danger').addEventListener('click', function () {
        const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa sản phẩm: ${productName}?`);
        if (confirmDelete) {
            newRow.remove(); 
            alert(`${productName} đã được xóa.`);
        }
    });

    // Thêm sự kiện cho nút Chỉnh sửa
    newRow.querySelector('.btn:not(.danger)').addEventListener('click', function () {
        // Mở modal và đổ dữ liệu vào
        currentRow = newRow; // Lưu hàng hiện tại
        document.getElementById('editName').value = productName;
        document.getElementById('editPrice').value = productPrice;
        document.getElementById('editQuantity').value = productQuantity;
        document.getElementById('editStatus').value = 'Còn hàng'; // Mặc định trạng thái

        modal.style.display = "block"; // Hiển thị modal
    });

    alert('Sản phẩm đã được thêm thành công!');
});

  
    // Hàm xử lý sự kiện khi người dùng nhấn vào nút "Xóa"
    document.querySelectorAll('.btn.danger').forEach((deleteButton) => {
        deleteButton.addEventListener('click', function () {
            const row = this.closest('tr'); // Lấy hàng (row) chứa nút Xóa
            const productName = row.querySelector('td:nth-child(2)').innerText; // Lấy tên sản phẩm

            const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa sản phẩm: ${productName}?`);

            if (confirmDelete) {
                row.remove(); 
                alert(`${productName} đã được xóa.`);
            }
        });
    });


    const modal = document.getElementById("editProductModal");
    const closeModal = document.querySelector(".modal .close");
    const editForm = document.getElementById("editProductForm");
    let currentRow; // Biến lưu trữ hàng đang được chỉnh sửa

    // Mở modal khi nhấn vào nút "Chỉnh sửa"
    document.querySelectorAll('.btn:not(.danger)').forEach((editButton) => {
        editButton.addEventListener('click', function () {
            currentRow = this.closest('tr'); // Lấy hàng (row) chứa nút Chỉnh sửa

            // Lấy dữ liệu sản phẩm từ bảng
            const productName = currentRow.querySelector('td:nth-child(2)').innerText;
            const productPrice = currentRow.querySelector('td:nth-child(3)').innerText;
            const productQuantity = currentRow.querySelector('td:nth-child(4)').innerText;
            const productStatus = currentRow.querySelector('td:nth-child(5)').innerText;

            // Đổ dữ liệu vào form chỉnh sửa
            document.getElementById('editName').value = productName;
            document.getElementById('editPrice').value = productPrice.replace(/[^0-9]/g, ''); // Lấy số từ chuỗi giá
            document.getElementById('editQuantity').value = productQuantity;
            document.getElementById('editStatus').value = productStatus;

            modal.style.display = "block"; // Hiển thị modal
        });
    });

    // Đóng modal khi nhấn vào nút X (close)
    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    // Đóng modal khi nhấn ra ngoài modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Xử lý khi người dùng nhấn nút "Cập nhật" để lưu thay đổi
    document.getElementById('updateProductBtn').addEventListener('click', function () {
        // Lấy dữ liệu từ form
        const updatedName = document.getElementById('editName').value;
        const updatedPrice = document.getElementById('editPrice').value;
        const updatedQuantity = document.getElementById('editQuantity').value;
        const updatedStatus = document.getElementById('editStatus').value;

        // Cập nhật dữ liệu trong bảng
        currentRow.querySelector('td:nth-child(2)').innerText = updatedName;
        currentRow.querySelector('td:nth-child(3)').innerText = updatedPrice + " VND";
        currentRow.querySelector('td:nth-child(4)').innerText = updatedQuantity;
        currentRow.querySelector('td:nth-child(5)').innerText = updatedStatus;

        modal.style.display = "none"; // Đóng modal sau khi cập nhật
    });
