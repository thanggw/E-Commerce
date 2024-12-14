const sign_in_btn = document.getElementById("sign-in-btn");
const sign_up_btn = document.getElementById("sign-up-btn");
const container = document.querySelector(".container");

if (sign_up_btn && sign_up_btn && container){

    sign_up_btn.addEventListener('click', () => {
        container.classList.add("sign-up-mode");
    });

    sign_in_btn.addEventListener('click', () => {
        container.classList.remove("sign-up-mode");
    });
}
else console.error("One or more elements not found");

    async function registerUser(event) {
    event.preventDefault(); // Ngăn chặn reload trang mặc định khi submit form

    // Lấy dữ liệu từ form
    const username = document.getElementById('signUpUsername').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    // Định nghĩa payload (dữ liệu gửi đến API)
    const payload = {
    username: username,
    password: password,
    email: email,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    address: address
};

    try {
    // Gửi dữ liệu đến API
    const response = await fetch('http://localhost:8082/api/auth/register', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
},
    body: JSON.stringify(payload)
});

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            console.log(response);
            window.location.href = 'http://localhost:8082/guests/login'; // Chuyển hướng đến trang đăng nhập
        } else {
    const errorData = await response.json();
    alert(`Registration failed: ${errorData.message}`);
}
} catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again!');
}
}


document.addEventListener("DOMContentLoaded", function() {
    const alertBox = document.querySelector('.alert');
    if (alertBox) {
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000); // Ẩn sau 5 giây
    }
});

