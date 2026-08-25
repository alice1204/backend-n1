/* ==========================================================================
   CẤU HÌNH TÀI KHOẢN QUẢN TRỊ VIÊN ĐỘC LẬP (ADMIN CONFIG)
   Lưu trữ riêng biệt trong code hệ thống, không lưu lẫn trong DB khách hàng
   ========================================================================== */

const LUXURY_ADMIN_CONFIG = {
    username: 'admin',
    password: 'admin123',
    hoTen: 'Ban Quản Trị LUXURY Store',
    email: 'admin@luxuryperfume.vn',
    sdt: '0988 888 888',
    role: 'admin'
};

// Hàm xác thực trực tiếp tài khoản Admin bảo mật
function xacThucTaiKhoanAdmin(username, password) {
    if (!username || !password) return false;
    return (
        username.trim() === LUXURY_ADMIN_CONFIG.username &&
        password.trim() === LUXURY_ADMIN_CONFIG.password
    );
}
