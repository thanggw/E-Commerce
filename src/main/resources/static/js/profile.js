const urlBase = "http://localhost:8082/file"; // Thay thế bằng URL thực tế

// Lấy thông tin người dùng và hiển thị
function getProfile() {
    fetch('/resource/user/profile')
        .then(response => response.json())
        .then(user => {
            setUserToView(user);
        })
        .catch(error => console.error('Error:', error));
}

function setUserToView(user) {
    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;
    document.getElementById('firstName').value = user.firstName;
    document.getElementById('lastName').value = user.lastName;
    document.getElementById('phone').value = user.phone;
    document.getElementById('address').value = user.address;

    // Hiển thị avatar nếu có
    if (user.pathAvatar) {
        const avatarUrl = `${urlBase}/${user.pathAvatar}`;
        document.getElementById('uploadedAvatar').src = avatarUrl;
    }

    // Lưu userId vào localStorage
    localStorage.setItem('userId', user.id);
}

// Gọi hàm getProfile khi trang được load
document.addEventListener('DOMContentLoaded', getProfile);


document.querySelector('.choose-avatar-btn').addEventListener('click', function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = function () {
        const file = input.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            fetch('/api/profile/upload-avatar', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                })
                .catch(error => {
                    console.error('Error uploading avatar:', error);
                });
        }
    };
});

document.addEventListener("DOMContentLoaded", function () {
    const username = 'thngthng701'; // Bạn có thể lấy username từ session hoặc token

    fetch(`/api/user/profile?username=${username}`)
        .then(response => response.json())
        .then(data => {
            // Populate the form with user data from the database
            document.getElementById("username").value = data.username;
            document.getElementById("name").value = `${data.firstName} ${data.lastName}`;
            document.querySelector("#email").innerHTML = data.email ? data.email : 'Thêm';
            document.querySelector("#phone").innerHTML = data.phone ? data.phone : 'Thêm';

            // Xử lý phần giới tính nếu có trong DTO của bạn
            if (data.gender === "male") {
                document.getElementById("male").checked = true;
            } else if (data.gender === "female") {
                document.getElementById("female").checked = true;
            } else {
                document.getElementById("other").checked = true;
            }
        })
        .catch(error => console.error('Error fetching profile:', error));
});