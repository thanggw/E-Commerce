const sign_in_btn = document.getElementById("sign-in-btn");
const sign_up_btn = document.getElementById("sign-up-btn");
const container = document.querySelector(".container");

if (sign_up_btn && sign_up_btn && container) {

    sign_up_btn.addEventListener('click', () => {
        container.classList.add("sign-up-mode");
    });

    sign_in_btn.addEventListener('click', () => {
        container.classList.remove("sign-up-mode");
    });
} else console.error("One or more elements not found");


const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('signUpPassword');

togglePassword.addEventListener('click', function () {
    const isPasswordHidden = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPasswordHidden ? 'text' : 'password');

    // Đổi icon: nếu đang là mắt nhắm thì đổi sang mắt mở, ngược lại
    this.classList.toggle('fa-eye-slash');
    this.classList.toggle('fa-eye');
});

async function registerUser(event) {
    event.preventDefault(); // Ngăn chặn reload trang mặc định khi submit form

    // Lấy dữ liệu từ form
    const username = document.getElementById('signUpUsername').value.trim();
    const email = document.getElementById('signUpEmail').value.trim();
    const password = document.getElementById('signUpPassword').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    // Kiểm tra ô nào bị thiếu
    const missingFields = [];
    if (!username) missingFields.push("Tên người dùng");
    if (!email) missingFields.push("Email");
    if (!password) missingFields.push("Mật khẩu");
    if (!firstName) missingFields.push("Họ");
    if (!lastName) missingFields.push("Tên");
    if (!phone) missingFields.push("Số điện thoại");
    if (!address) missingFields.push("Địa chỉ");

    if (missingFields.length > 0) {
        // Nếu thiếu, hiện cảnh báo và dừng lại
        Swal.fire({
            title: "Thiếu thông tin!",
            text: `Bạn chưa nhập: ${missingFields.join(", ")}`,
            icon: "warning",
            confirmButtonText: "Đã hiểu"
        });
        return; // Không gửi API nữa
    }

    // Nếu không thiếu ô nào, tiếp tục gửi API
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
        const response = await fetch('http://localhost:8082/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            Swal.fire({
                title: "Chúc mừng!",
                text: "Bạn đã đăng ký thành công!",
                icon: "success",
                confirmButtonText: "Đăng nhập ngay!"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'http://localhost:8082/guests/login';
                }
            });
        } else {
            const errorData = await response.json();
            Swal.fire({
                title: "Lỗi!",
                text: `Đăng ký thất bại: ${errorData.message}`,
                icon: "error",
                confirmButtonText: "Đã hiểu"
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra lỗi. Vui lòng thử lại sau!",
            icon: "error",
            confirmButtonText: "Đã hiểu"
        });
    }
}



document.addEventListener("DOMContentLoaded", function () {
    const alertBox = document.querySelector('.alert');
    if (alertBox) {
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000); // Ẩn sau 5 giây
    }
});

document.getElementById("signUpPassword").addEventListener("input", function () {
    const password = this.value;
    const passwordHelp = document.getElementById("passwordHelp");

    // Regular expressions for password strength
    const minLength = /.{8,}/; // At least 8 characters
    const upperCase = /[A-Z]/; // At least one uppercase letter
    const lowerCase = /[a-z]/; // At least one lowercase letter
    const number = /[0-9]/; // At least one number
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character

    let message = "Mật khẩu nên bao gồm: ";
    let isValid = true;

    if (!minLength.test(password)) {
        message += "ít nhất 8 ký tự, ";
        isValid = false;
    }
    if (!upperCase.test(password)) {
        message += "ít nhất 1 chữ cái hoa, ";
        isValid = false;
    }
    if (!lowerCase.test(password)) {
        message += "ít nhất 1 chữ cái thường, ";
        isValid = false;
    }
    if (!number.test(password)) {
        message += "ít nhất 1 số, ";
        isValid = false;
    }
    if (!specialChar.test(password)) {
        message += "ít nhất 1 ký tự đặc biệt.";
        isValid = false;
    }

    // Display suggestions or hide help text
    if (!isValid) {
        passwordHelp.style.display = "block";
        passwordHelp.textContent = message.trim().replace(/,$/, "");
    } else {
        passwordHelp.style.display = "none";
    }
});


function registerUser(event) {
    event.preventDefault(); // Ngăn submit form ngay

    // Lấy giá trị từ các ô input
    const email = document.getElementById('signUpEmail').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const emailField = document.getElementById('signUpEmail');
    const phoneField = document.getElementById('phone');

    // Xóa lỗi cũ nếu có
    removeError('emailError');
    removeError('phoneError');

    let isValid = true;

    // Validate email
    if (!validateEmail(email)) {
        showError(emailField, 'Email không hợp lệ. Email bắt buộc phải có @', 'emailError');
        isValid = false;
    }

    // Validate số điện thoại (10 số và chỉ chứa chữ số)
    if (!validatePhone(phone)) {
        showError(phoneField, 'Số điện thoại không hợp lệ (phải có 10 chữ số)', 'phoneError');
        isValid = false;
    }

    if (isValid) {
        // Nếu hợp lệ thì bạn có thể gửi form hoặc gọi API
        console.log("Form hợp lệ, tiến hành gửi đăng ký...");
        document.getElementById('sign-up').submit(); // Hoặc thay bằng code call API tùy bạn
    }
}

function validateEmail(email) {
    // Regex đơn giản để kiểm tra email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Kiểm tra đúng 10 chữ số
    const re = /^\d{10}$/;
    return re.test(phone);
}

function showError(inputElement, message, errorId) {
    // Tạo 1 thẻ small để hiện lỗi
    const errorElement = document.createElement('small');
    errorElement.style.color = 'red';
    errorElement.style.display = 'block';
    errorElement.style.width="500px";
    errorElement.id = errorId;
    errorElement.innerText = message;

    // Chèn vào ngay dưới ô input
    inputElement.parentNode.appendChild(errorElement);
}

function removeError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.remove();
    }
}