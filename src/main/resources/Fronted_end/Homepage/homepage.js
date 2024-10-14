
function searchProduct() {
    const searchQuery = document.getElementById('search').value;
    if (searchQuery) {
        alert('Searching for: ' + searchQuery);
    } else {
        alert('Please enter a product name.');
    }
}

//Tự động gợi ý từ khóa khi nhập vào thanh tìm kiếm
document.querySelector('.search-bar input').addEventListener('input', function() {
    const suggestions = document.querySelector('.suggestions');
    const searchText = this.value.toLowerCase();

    if (searchText) {
        suggestions.style.display = 'block';
        Array.from(suggestions.children).forEach(item => {
            if (item.textContent.toLowerCase().includes(searchText)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    } else {
        suggestions.style.display = 'none';
    }
});
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

// Start countdown with 7 hours, 9 minutes, 45 seconds
startCountdown(7, 9, 45);


//Sao chép mã voucher khi nhấn vào nút 'Sao chép'
document.querySelectorAll('.copy-code').forEach(button => {
    button.addEventListener('click', function() {
        const code = this.previousElementSibling.textContent;
        navigator.clipboard.writeText(code).then(() => {
            alert('Đã sao chép mã: ' + code);
        }).catch(err => {
            console.error('Không thể sao chép', err);
        });
    });
});

//Thêm tính năng cuộn mượt khi nhấp vào liên kết menu
document.querySelectorAll('.navigation a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetSection = document.querySelector(this.getAttribute('href'));
        targetSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
});


//Hiển thị thông báo khi thêm sản phẩm vào giỏ hàng
document.querySelectorAll('.product button').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.previousElementSibling.previousElementSibling.textContent;
        alert(productName + ' đã được thêm vào giỏ hàng!');
    });
});