let stompAdmin = null;
let currentCustomer = null;

function connectAdmin() {
    let socket = new SockJS('/ws');
    stompAdmin = Stomp.over(socket);

    stompAdmin.connect({}, function () {
        console.log("✅ Admin đã kết nối WebSocket thành công!");

        stompAdmin.subscribe('/topic/customerList', function (message) {
            console.log("📩 Nhận danh sách khách hàng: ", message.body);
            showCustomerList(JSON.parse(message.body));
        });

        stompAdmin.subscribe('/topic/messages', function (message) {
            console.log("📩 Nhận tin nhắn: ", message.body);
            showAdminMessage(JSON.parse(message.body));
        });

        stompAdmin.subscribe('/topic/chatHistory', function (message) {
            console.log("📩 Nhận lịch sử tin nhắn: ", message.body);
            showAdminChatHistory(JSON.parse(message.body));
        });

        stompAdmin.send("/app/customerList", {});
    }, function (error) {
        console.error("❌ Kết nối WebSocket thất bại:", error);
    });
}

function showCustomerList(customers) {
    let list = document.getElementById("customer-list");
    list.innerHTML = customers.map(c => `<button onclick="openChatWith('${c}')">${c}</button>`).join("<br>");

    // Cập nhật số lượng khách hàng trên icon chat
    let customerCount = document.getElementById("customer-count");
    customerCount.innerText = customers.length;
    customerCount.style.display = customers.length > 0 ? "inline-block" : "none";
}


function openChatWith(customer) {
    currentCustomer = customer;
    document.getElementById("chat-with").innerText = "Chat with " + customer;
    document.getElementById("admin-chat-box").style.display = "block";
    document.getElementById("admin-chat-messages").innerHTML = "";

    // Gửi yêu cầu lấy tin nhắn của khách hàng
    stompAdmin.send("/app/getMessages", {}, JSON.stringify({ sender: customer }));
}

function sendAdminMessage() {
    let messageInput = document.getElementById("admin-message-input");
    let messageContent = messageInput.value.trim();

    if (messageContent && currentCustomer) {
        let message = {
            sender: "Admin",
            content: messageContent,
            role: "admin"
        };

        // Hiển thị tin nhắn ngay lập tức
        showAdminMessage(message);

        stompAdmin.send("/app/sendMessage", {}, JSON.stringify(message));

        messageInput.value = "";
    }
}


function showAdminMessage(message) {
    if (message.sender === currentCustomer || message.role === "admin") {
        let chatBox = document.getElementById("admin-chat-messages");
        let msgDiv = document.createElement("div");
        msgDiv.innerHTML = `<strong>${message.sender}:</strong> ${message.content}`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Tự động cuộn xuống
    }
}


function showAdminChatHistory(messages) {
    let chatBox = document.getElementById("admin-chat-messages");
    chatBox.innerHTML = messages.map(msg => `<div><strong>${msg.sender}:</strong> ${msg.content}</div>`).join("");
}

function openAdminChat() {
    document.getElementById("admin-chat-popup").style.display = "block";
    connectAdmin();

}


function closeAdminChat() {
    document.getElementById("admin-chat-popup").style.display = "none";
    // Khi admin mở danh sách khách hàng, ẩn số lượng khách hàng
    document.getElementById("customer-count").innerText = "0";
    document.getElementById("customer-count").style.display = "none";
}

function closeChatBox() {
    document.getElementById("admin-chat-box").style.display = "none";
}

$(document).ready(function() {
    $("#profile-icon").click(function() {
        window.location.href = "http://localhost:8082/adminScreen/adminProfile";
    });
});





/**
 * Set giờ hoạt động*/
function openBusinessHoursModal() {
    document.getElementById("businessHoursModal").style.display = "block";
}

function closeBusinessHoursModal() {
    document.getElementById("businessHoursModal").style.display = "none";
}
function getCurrentDayOfWeek() {
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const today = new Date().getDay(); // getDay() trả về số từ 0 (Chủ Nhật) đến 6 (Thứ Bảy)
    return days[today]; // Trả về giá trị DayOfWeek tương ứng
}
function saveBusinessHours() {
    const openingTime = document.getElementById("opening-time").value;
    const closingTime = document.getElementById("closing-time").value;

    if (!openingTime || !closingTime) {
        alert("Please select both opening and closing times.");
        return;
    }

    // Lấy ngày hiện tại
    const currentDayOfWeek = getCurrentDayOfWeek();

    // Tạo một đối tượng chứa dữ liệu cần gửi
    const businessHours = {
        dayOfWeek: currentDayOfWeek,
        openTime: openingTime,
        closeTime: closingTime
    };

    // Gửi dữ liệu lên server
    fetch('/api/admin/users/set-hours', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([businessHours]) // Gửi một mảng các đối tượng BusinessHourRequest
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to update business hours');
            }
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Giờ làm việc đã được cập nhật thành công!',
                confirmButtonText: 'Tuyệt vời!'
            }).then(() => {
                closeBusinessHoursModal();
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Đã xảy ra lỗi khi cập nhật giờ làm việc.',
                confirmButtonText: 'Đã hiểu'
            });
        });
}

// Đóng modal khi click ra ngoài vùng modal-content
window.onclick = function(event) {
    let modal = document.getElementById("businessHoursModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
