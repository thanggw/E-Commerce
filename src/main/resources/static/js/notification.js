$(document).ready(function () {
    // Khi nhấn nút "Thanh toán", điều hướng sang trang thanh toán
    $('.btn-primary').click(function () {
        window.location.href = 'http://localhost:8082/guests/order';
    });
});

$(document).ready(function () {
    // Khi nhấn nút "Thanh toán", điều hướng sang trang thanh toán
    $('.btn-secondary').click(function () {
        window.location.href = 'http://localhost:8082/guests/home-guest';
    });
});