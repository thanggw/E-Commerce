

**Mô tả:**

Đây là một ứng dụng website bán đồ ăn trực tuyến hoàn chỉnh, được xây dựng bằng Spring Boot cho backend, HTML, CSS cho giao diện người dùng, và JavaScript, jQuery, Async/Await, Fetch API để tăng tính tương tác và trải nghiệm người dùng. Website cung cấp đầy đủ các chức năng cho cả khách hàng và quản trị viên.

**Các tính năng chính:**

**Dành cho Khách hàng:**

* **Xem thực đơn và chi tiết sản phẩm:** Duyệt danh sách các món ăn, xem hình ảnh, mô tả, giá cả và các thông tin liên quan.
* **Thêm vào giỏ hàng:** Dễ dàng thêm các món ăn yêu thích vào giỏ hàng.
* **Thêm vào mục ưa thích:** Lưu lại các món ăn quan tâm để dễ dàng xem lại sau này.
* **Mua hàng:** Thực hiện quy trình đặt hàng và thanh toán trực tuyến.
* **Chat với quản trị viên:** Liên hệ trực tiếp với quản trị viên để được hỗ trợ hoặc giải đáp thắc mắc thông qua WebSocket.
* **Thanh toán trực tuyến qua VNPay:** Tích hợp cổng thanh toán VNPay an toàn và tiện lợi.

**Dành cho Quản trị viên:**

* **Quản lý người dùng:** Thêm, sửa, xóa và xem thông tin người dùng.
* **Quản lý sản phẩm:** Thêm, sửa, xóa và xem thông tin sản phẩm (tên, mô tả, giá, hình ảnh, danh mục, v.v.).
* **Quản lý đơn hàng:** Xem chi tiết đơn hàng, thay đổi trạng thái đơn hàng (chờ xác nhận, đang giao, đã giao, đã hủy, v.v.).
* **Thiết lập giờ hoạt động:** Cấu hình thời gian mở và đóng cửa của website.
* **Tạo và quản lý voucher:** Tạo mã giảm giá và quản lý các chương trình khuyến mãi.
* **Chat với người dùng:** Hỗ trợ và giải đáp thắc mắc của khách hàng thông qua WebSocket.

**Công nghệ sử dụng:**

* **Backend:**
    * [Spring Boot](https://spring.io/projects/spring-boot): Framework phát triển ứng dụng Java nhanh chóng và dễ dàng.
* **Frontend:**
    * [HTML5](https://www.w3.org/html/): Ngôn ngữ đánh dấu cấu trúc nội dung web.
    * [CSS3](https://www.w3.org/Style/CSS/): Ngôn ngữ tạo kiểu và trình bày giao diện web.
    * [JavaScript (ES6+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript): Ngôn ngữ lập trình phía client để tạo hiệu ứng và tương tác.
    * [jQuery](https://jquery.com/): Thư viện JavaScript giúp thao tác DOM, AJAX và xử lý sự kiện dễ dàng hơn.
    * **Async/Await:** Cú pháp bất đồng bộ trong JavaScript giúp viết code dễ đọc và quản lý hơn.
    * **Fetch API:** API hiện đại để thực hiện các yêu cầu HTTP bất đồng bộ.
* **Cơ sở dữ liệu:**
    * [MySQL](https://www.mysql.com/): Hệ quản trị cơ sở dữ liệu quan hệ phổ biến.
* **Tích hợp thanh toán:**
    * [VNPay](https://vnpay.vn/): Cổng thanh toán trực tuyến hàng đầu tại Việt Nam.
* **Giao tiếp thời gian thực:**
    * [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket_API): Giao thức cho phép giao tiếp hai chiều giữa server và client trong thời gian thực.

**Cài đặt và chạy ứng dụng:**

1.  **Yêu cầu:**
    * [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/javase-downloads.html) (phiên bản được hỗ trợ)
    * [Maven](https://maven.apache.org/download.cgi) (nếu bạn muốn build từ source)
    * [MySQL](https://dev.mysql.com/downloads/) đã được cài đặt và cấu hình.

2.  **Cấu hình cơ sở dữ liệu:**
    * Tạo một database MySQL với tên bạn muốn (ví dụ: `food_delivery`).
    * Cập nhật thông tin kết nối cơ sở dữ liệu trong file `src/main/resources/application.properties` của dự án Spring Boot:

    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/food_delivery?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    spring.jpa.hibernate.ddl-auto=update
    ```

3.  **Cấu hình VNPay (nếu cần):**
    * Bạn cần có tài khoản merchant tại VNPay.
    * Cập nhật các thông tin cấu hình VNPay (ví dụ: `vnpay.tmnCode`, `vnpay.secretKey`, `vnpay.apiUrl`) trong file `application.properties` hoặc một file cấu hình riêng.

4.  **Build và chạy ứng dụng backend (Spring Boot):**
    * Mở terminal hoặc command prompt, di chuyển đến thư mục gốc của dự án Spring Boot.
    * Sử dụng Maven (nếu bạn build từ source):
        ```bash
        mvn clean install
        mvn spring-boot:run
        ```
    * Hoặc chạy trực tiếp nếu bạn đã build thành file JAR:
        ```bash
        java -jar target/your-project-name.jar
        ```
    * Ứng dụng backend sẽ chạy trên cổng mặc định là `8080`.

**Hướng dẫn sử dụng:**

* **Khách hàng:**
    * Truy cập website qua trình duyệt (ví dụ: `http://localhost:8082`).
    * Duyệt xem các món ăn, thêm vào giỏ hàng, mục ưa thích và tiến hành đặt hàng.
    * Sử dụng chức năng chat để liên hệ với quản trị viên khi cần.
* **Quản trị viên:**
    * Truy cập trang quản trị (thường có một đường dẫn riêng, ví dụ: `http://localhost:8080/admin` hoặc `/dashboard`).
    * Đăng nhập bằng tài khoản quản trị.
    * Sử dụng các chức năng quản lý người dùng, sản phẩm, đơn hàng, voucher, thiết lập giờ hoạt động và chat với người dùng.
