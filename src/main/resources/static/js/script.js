function startCountdown(hours, minutes, seconds) {
    const countdown = document.querySelector('.countdown');
    const updateCountdown = () => {
        if (seconds === 0) {
            if (minutes === 0) {
                if (hours === 0) {
                    clearInterval(interval);
                    return;
                }
                hours--;
                minutes = 59;
            } else {
                minutes--;
            }
            seconds = 59;
        } else {
            seconds--;
        }

        countdown.innerHTML = `
            <span class="time">${hours.toString().padStart(2, '0')}</span> :
            <span class="time">${minutes.toString().padStart(2, '0')}</span> :
            <span class="time">${seconds.toString().padStart(2, '0')}</span>
        `;
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
}

// Start countdown with 2 hours, 9 minutes, 45 seconds
startCountdown(2, 9, 45);


//Sao chép mã voucher khi nhấn vào nút 'Sao chép'
document.querySelectorAll('.copy-code').forEach(button => {
    button.addEventListener('click', function() {
        const code = this.previousElementSibling.textContent;
        navigator.clipboard.writeText(code).then(() => {
            Swal.fire({
                icon: "success",
                title: "Copy code "+code+" successfully!"
            });
        }).catch(err => {
            console.error('Không thể sao chép', err);
        });
    });
});

//Thêm tính năng cuộn mượt khi nhấp vào liên kết menu
document.querySelectorAll('.navigation a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#') || href.startsWith('.')) {
            // Liên kết nội bộ
            e.preventDefault();
            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});




document.addEventListener("DOMContentLoaded", function () {
    const scrollIcon = document.getElementById("scroll");
    const scrollContainer = scrollIcon.parentElement;
    const header = document.querySelector(".main-header");

    // Hiển thị/ẩn icon khi cuộn
    window.addEventListener("scroll", function () {
        if (window.scrollY > header.offsetHeight) {
            scrollContainer.classList.add("visible"); // Thêm lớp 'visible' để hiển thị
        } else {
            scrollContainer.classList.remove("visible"); // Xóa lớp 'visible' để ẩn
        }
    });

    // Xử lý click để cuộn lên đầu trang
    scrollIcon.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
});


const slides = document.querySelectorAll('.slide');
let currentIndex = 0;

function showNextSlide() {
    // Xóa lớp active của slide hiện tại
    slides[currentIndex].classList.remove('active');

    // Chuyển sang slide tiếp theo
    currentIndex = (currentIndex + 1) % slides.length;

    // Thêm lớp active vào slide tiếp theo
    slides[currentIndex].classList.add('active');
}

// Chuyển ảnh mỗi 3 giây
setInterval(showNextSlide, 3000);



const input15 = document.getElementById('animatedInput');
const placeholders15 = [
    'What are you looking for?',
    'Adidas Superstar',
    'Nike Air Force 1',
    'Converse Chuck Taylor',
    'Vans Old Skool',
    'Puma Suede',
    'New Balance 574',
    'Reebok Classic Leather'
];

let currentIndex15 = 0;
let isDeleting15 = false;
let currentText15 = '';
let charIndex15 = 0;

function typeEffect() {
    const currentPlaceholder = placeholders15[currentIndex15];

    if (isDeleting15) {
        // Xóa từng ký tự
        currentText15 = currentPlaceholder.substring(0, charIndex15 - 1);
        charIndex15--;
    } else {
        // Thêm từng ký tự
        currentText15 = currentPlaceholder.substring(0, charIndex15 + 1);
        charIndex15++;
    }

    input15.setAttribute('placeholder', currentText15);

    let typingSpeed = isDeleting15 ? 30 : 50; // Tốc độ gõ và xóa

    if (!isDeleting15 && charIndex15 === currentPlaceholder.length) {
        // Khi gõ xong, đợi 1 giây rồi bắt đầu xóa
        typingSpeed = 1000;
        isDeleting15 = true;
    } else if (isDeleting15 && charIndex15 === 0) {
        // Khi xóa xong, chuyển sang placeholder tiếp theo
        isDeleting15 = false;
        currentIndex15 = (currentIndex15 + 1) % placeholders15.length;
    }

    setTimeout(typeEffect, typingSpeed);
}

// Bắt đầu hiệu ứng
typeEffect();

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
