# Tài liệu Chức năng của Dự án

## 1. Chức năng Quản lý Người dùng
### 1.1 Thêm Người dùng
- **Mô tả**: Cho phép thêm người dùng mới vào hệ thống.
- **Đầu vào**: 
  - `username`: Tên đăng nhập của người dùng.
  - `password`: Mật khẩu của người dùng.
  - `fullName`: Tên đầy đủ của người dùng.
  - `email`: Địa chỉ email của người dùng.
  - `phone`: Số điện thoại của người dùng.
  - `dob`: Ngày sinh của người dùng
- **Quá trình**:
  - Mã hóa mật khẩu bằng bcrypt trước khi lưu trữ.
  - Xác thực và kiểm tra xem username hoặc email có bị trùng không.
- **Đầu ra**: 
  - Thông báo thành công hoặc lỗi nếu không thể thêm người dùng.

### 1.2 Sửa Người dùng
- **Mô tả**: Cho phép chỉnh sửa thông tin của người dùng.
- **Đầu vào**: 
  - `userId`: ID của người dùng cần sửa.
  - Các thông tin cần sửa đổi (fullName, password, email, phone, role, dob).
- **Quá trình**:
  - Kiểm tra quyền truy cập dựa trên role của người dùng hiện tại.
  - Cập nhật thông tin người dùng trong cơ sở dữ liệu.
- **Đầu ra**: 
  - Thông báo thành công hoặc lỗi nếu không thể sửa người dùng.

### 1.3 Xóa (Mềm) Người dùng
- **Mô tả**: Cho phép xóa người dùng mà không xóa hoàn toàn khỏi cơ sở dữ liệu.
- **Đầu vào**: 
  - `userId`: ID của người dùng cần xóa.
- **Quá trình**:
  - Đánh dấu người dùng là đã xóa mà không loại bỏ dữ liệu.
- **Đầu ra**: 
  - Thông báo thành công hoặc lỗi nếu không thể xóa người dùng.

### 1.4 Tìm kiếm Người dùng
- **Mô tả**: Cho phép tìm kiếm người dùng theo các trường khác nhau.
- **Đầu vào**: 
  - Các trường tìm kiếm: `username`, `fullName`, `email`, `phone`, `role`.
- **Quá trình**:
  - Thực hiện truy vấn trên cơ sở dữ liệu dựa trên các tiêu chí tìm kiếm đã cung cấp.
- **Đầu ra**: 
  - Danh sách người dùng phù hợp với tiêu chí tìm kiếm.

### 1.5 Lấy Thông tin Cá nhân
- **Mô tả**: Người dùng có thể lấy thông tin cá nhân của mình dựa vào `username` có trong token JWT.
- **Đầu vào**: 
  - Token JWT: được sử dụng để xác thực người dùng.
- **Quá trình**:
  - Giải mã token JWT để lấy `username`.
  - Thực hiện truy vấn trên cơ sở dữ liệu để lấy thông tin người dùng tương ứng với `username`.
  - Kiểm tra quyền truy cập để đảm bảo người dùng có quyền truy cập thông tin của chính mình.
- **Đầu ra**: 
  - Thông tin cá nhân của người dùng, bao gồm các trường như `username`, `fullName`, `email`, `phone`, và `role`.
  - Thông báo lỗi nếu không tìm thấy thông tin người dùng hoặc nếu có vấn đề với token.

## 2. Xử lý và Validate Exception
- **Mô tả**: Xử lý và validate các exception trong hệ thống trong đó có sử dụng các custom annotations.
- **Quá trình**:
  - Tạo các annotation và các class xử lý exception để kiểm soát lỗi tốt hơn.

## 3. Phân quyền theo Role và Permission
- **Mô tả**: Cấu hình phân quyền cho người dùng dựa trên role và permission.
- **Quá trình**:
  - Kiểm tra quyền truy cập trước khi thực hiện các hành động quan trọng.

## 4. Mã hóa Mật khẩu
- **Mô tả**: Sử dụng bcrypt để mã hóa mật khẩu người dùng trước khi lưu trữ.
- **Quá trình**:
  - Khi thêm hoặc sửa đổi người dùng, mật khẩu sẽ được mã hóa.

## 5. Xác thực và Quản lý Token JWT
### 5.1 Đăng nhập
- **Mô tả**: Xử lý quá trình đăng nhập của người dùng.
- **Đầu vào**: 
  - `username` và `password`.
- **Quá trình**:
  - Xác thực thông tin đăng nhập và tạo token JWT nếu thành công.
- **Đầu ra**: 
  - Token JWT để truy cập vào các chức năng bảo mật.

### 5.2 Introspect
- **Mô tả**: Xác thực token JWT.
- **Quá trình**:
  - Kiểm tra tính hợp lệ của token và trả về thông tin người dùng liên quan.

### 5.3 Đăng xuất
- **Mô tả**: Xử lý đăng xuất người dùng.
- **Quá trình**:
  - Xóa token trên client hoặc đánh dấu token là không hợp lệ.

### 5.4 Refresh Token
- **Mô tả**: Cung cấp token mới khi token cũ hết hạn.
- **Quá trình**:
  - Xác thực refresh token và tạo token mới.