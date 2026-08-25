/* ==========================================================================
   HỆ THỐNG DỮ LIỆU DÙNG CHUNG (LOCALSTORAGE) - LUXURY PERFUME STORE
   ========================================================================== */

const STORAGE_KEYS = {
    PRODUCTS: 'luxury_perfume_products',
    ORDERS: 'luxury_perfume_orders',
    USERS: 'luxury_perfume_users',
    CURRENT_USER: 'luxury_current_user'
};

const FALLBACK_PERFUME_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22400%22%20viewBox%3D%220%200%20400%20400%22%3E%3Crect%20fill%3D%22%23102b40%22%20width%3D%22400%22%20height%3D%22400%22%2F%3E%3Ctext%20fill%3D%22%23dfc46a%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2248%25%22%20text-anchor%3D%22middle%22%3ELUXURY%3C%2Ftext%3E%3Ctext%20fill%3D%22%23b0c4d8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20x%3D%2250%25%22%20y%3D%2256%25%22%20text-anchor%3D%22middle%22%3EPERFUME%3C%2Ftext%3E%3C%2Fsvg%3E";

// Dữ liệu mẫu tài khoản khách hàng (User)
const DEFAULT_USERS = [
    {
        id: 'USER01',
        username: 'user1',
        password: '123456', // Mật khẩu người dùng thường
        hoTen: 'Nguyễn Hoàng Nam',
        email: 'nam.nguyen@gmail.com',
        sdt: '0912 345 678',
        diaChi: 'Tòa Landmark 81, 720A Điện Biên Phủ, P.22, Q.Bình Thạnh, TP.HCM',
        role: 'user',
        ngayTao: '2026-08-10'
    }
];

// Dữ liệu mẫu ban đầu cho sản phẩm
const DEFAULT_PRODUCTS = [
    {
        id: 'SP001',
        ten: 'Dior Sauvage Eau de Parfum',
        danhMuc: 'nam', // nam, nu, unisex, khuyen-mai
        danhMucTen: 'Nước hoa nam',
        thuongHieu: 'dior',
        thuongHieuTen: 'Dior',
        gia: 2950000,
        dungTich: '100ml',
        tonKho: 24,
        daBan: 68,
        hinhAnh: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
        moTa: 'Mùi hương nam tính, mạnh mẽ và hoang dã với hương cam Bergamot, tiêu Tứ Xuyên và long diên hương quý phái.',
        noiBat: true
    },
    {
        id: 'SP002',
        ten: 'Chanel Coco Mademoiselle',
        danhMuc: 'nu',
        danhMucTen: 'Nước hoa nữ',
        thuongHieu: 'chanel',
        thuongHieuTen: 'Chanel',
        gia: 3850000,
        dungTich: '100ml',
        tonKho: 18,
        daBan: 95,
        hinhAnh: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80',
        moTa: 'Hương thơm phương Đông tươi trẻ, quyến rũ bất tận với cam tươi, hoa hồng Thổ Nhĩ Kỳ và hoắc hương sang trọng.',
        noiBat: true
    },
    {
        id: 'SP003',
        ten: 'Gucci Bloom For Women',
        danhMuc: 'nu',
        danhMucTen: 'Nước hoa nữ',
        thuongHieu: 'gucci',
        thuongHieuTen: 'Gucci',
        gia: 2800000,
        dungTich: '100ml',
        tonKho: 15,
        daBan: 52,
        hinhAnh: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
        moTa: 'Một vườn hoa ngát hương phong phú với hoa huệ trắng, hoa nhài Sambac và hoa dạ lý hương Rangoon thơm ngát.',
        noiBat: true
    },
    {
        id: 'SP004',
        ten: 'Bleu de Chanel Parfum',
        danhMuc: 'nam',
        danhMucTen: 'Nước hoa nam',
        thuongHieu: 'chanel',
        thuongHieuTen: 'Chanel',
        gia: 4250000,
        dungTich: '100ml',
        tonKho: 12,
        daBan: 110,
        hinhAnh: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
        moTa: 'Biểu tượng của sự thanh lịch vượt thời gian. Hương gỗ thơm nồng nàn và hổ phách sâu lắng, quyền lực.',
        noiBat: true
    },
    {
        id: 'SP005',
        ten: 'Versace Eros Flame EDP',
        danhMuc: 'nam',
        danhMucTen: 'Nước hoa nam',
        thuongHieu: 'versace',
        thuongHieuTen: 'Versace',
        gia: 2350000,
        dungTich: '100ml',
        tonKho: 30,
        daBan: 45,
        hinhAnh: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
        moTa: 'Tình yêu và đam mê mãnh liệt. Sự hòa quyện bùng nổ giữa cam Ý, hương thảo, tiêu đen và hương gỗ quý.',
        noiBat: false
    },
    {
        id: 'SP006',
        ten: 'Tom Ford Black Orchid Unisex',
        danhMuc: 'unisex',
        danhMucTen: 'Nước hoa unisex',
        thuongHieu: 'dior',
        thuongHieuTen: 'Tom Ford',
        gia: 4900000,
        dungTich: '100ml',
        tonKho: 8,
        daBan: 39,
        hinhAnh: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=80',
        moTa: 'Hương thơm bí ẩn, xa hoa và quyến rũ bậc nhất thế giới với phong lan đen, nấm truffle và gia vị ấm áp.',
        noiBat: true
    },
    {
        id: 'SP007',
        ten: 'Maison Francis Kurkdjian Baccarat Rouge 540',
        danhMuc: 'unisex',
        danhMucTen: 'Nước hoa unisex',
        thuongHieu: 'chanel',
        thuongHieuTen: 'MFK',
        gia: 6800000,
        dungTich: '70ml',
        tonKho: 6,
        daBan: 74,
        hinhAnh: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
        moTa: 'Mùi hương ngọt ngào hoàng gia từ hổ phách, nghệ tây và hoa nhài Ai Cập. Tỏa sáng đẳng cấp thượng lưu.',
        noiBat: false
    },
    {
        id: 'SP008',
        ten: 'Versace Bright Crystal Absolu',
        danhMuc: 'nu',
        danhMucTen: 'Nước hoa nữ',
        thuongHieu: 'versace',
        thuongHieuTen: 'Versace',
        gia: 1950000,
        dungTich: '90ml',
        tonKho: 20,
        daBan: 82,
        hinhAnh: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
        moTa: 'Viên kim cương hồng rực rỡ với hương lựu đỏ, hoa sen thanh khiết và mẫu đơn dịu dàng nữ tính.',
        noiBat: true
    }
];

// Dữ liệu mẫu ban đầu cho đơn hàng
const DEFAULT_ORDERS = [
    {
        maDon: 'LX-89241',
        username: 'user1',
        khachHang: {
            hoTen: 'Nguyễn Hoàng Nam',
            sdt: '0912 345 678',
            diaChi: 'Tòa Landmark 81, 720A Điện Biên Phủ, P.22, Q.Bình Thạnh, TP.HCM',
            ghiChu: 'Giao giờ hành chính, gọi trước 15 phút giúp mình'
        },
        ngayDat: '18/08/2026 09:30',
        trangThai: 'cho-xac-nhan', // cho-xac-nhan, dang-giao, hoan-thanh, da-huy
        phuongThucThanhToan: 'COD - Thanh toán khi nhận hàng',
        sanPham: [
            {
                id: 'SP004',
                ten: 'Bleu de Chanel Parfum',
                dungTich: '100ml | Full Box Chính Hãng',
                soLuong: 1,
                donGia: 4250000,
                hinhAnh: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80'
            }
        ],
        tamTinh: 4250000,
        phiVanChuyen: 0,
        tongTien: 4250000
    },
    {
        maDon: 'LX-89240',
        username: 'khachhang2',
        khachHang: {
            hoTen: 'Trần Thị Mỹ Linh',
            sdt: '0988 765 432',
            diaChi: 'Số 45 Tràng Tiền, Hoàn Kiếm, Hà Nội',
            ghiChu: 'Gói quà giúp mình tặng sinh nhật'
        },
        ngayDat: '17/08/2026 15:45',
        trangThai: 'dang-giao',
        phuongThucThanhToan: 'Chuyển khoản ngân hàng (Đã TT)',
        sanPham: [
            {
                id: 'SP002',
                ten: 'Chanel Coco Mademoiselle',
                dungTich: '100ml | Full Box Chính Hãng',
                soLuong: 1,
                donGia: 3850000,
                hinhAnh: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80'
            }
        ],
        tamTinh: 3850000,
        phiVanChuyen: 0,
        tongTien: 3850000
    },
    {
        maDon: 'LX-89239',
        username: 'user1',
        khachHang: {
            hoTen: 'Phạm Minh Quân',
            sdt: '0903 112 233',
            diaChi: '128 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM',
            ghiChu: ''
        },
        ngayDat: '16/08/2026 11:20',
        trangThai: 'hoan-thanh',
        phuongThucThanhToan: 'COD - Thanh toán khi nhận hàng',
        sanPham: [
            {
                id: 'SP001',
                ten: 'Dior Sauvage Eau de Parfum',
                dungTich: '100ml | Full Box Chính Hãng',
                soLuong: 2,
                donGia: 2950000,
                hinhAnh: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80'
            }
        ],
        tamTinh: 5900000,
        phiVanChuyen: 0,
        tongTien: 5900000
    },
    {
        maDon: 'LX-89238',
        username: 'khachhang3',
        khachHang: {
            hoTen: 'Lê Thanh Hà',
            sdt: '0977 445 566',
            diaChi: 'KĐT Vinhomes Riverside, Long Biên, Hà Nội',
            ghiChu: 'Khách đổi ý muốn lấy mẫu khác'
        },
        ngayDat: '15/08/2026 14:10',
        trangThai: 'da-huy',
        phuongThucThanhToan: 'COD - Thanh toán khi nhận hàng',
        sanPham: [
            {
                id: 'SP005',
                ten: 'Versace Eros Flame EDP',
                dungTich: '100ml | Full Box Chính Hãng',
                soLuong: 1,
                donGia: 2350000,
                hinhAnh: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80'
            }
        ],
        tamTinh: 2350000,
        phiVanChuyen: 0,
        tongTien: 2350000
    }
];

// Khởi tạo dữ liệu nếu chưa có trong LocalStorage
function khoiTaoDuLieu() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
}

// ----------------------------------------------------
// CÁC HÀM XÁC THỰC & QUẢN LÝ TÀI KHOẢN (AUTH)
// ----------------------------------------------------

function getDanhSachNguoiDung() {
    khoiTaoDuLieu();
    try {
        const data = localStorage.getItem(STORAGE_KEYS.USERS);
        return data ? JSON.parse(data) : DEFAULT_USERS;
    } catch (e) {
        console.error('Lỗi khi đọc danh sách người dùng:', e);
        return DEFAULT_USERS;
    }
}

function luuDanhSachNguoiDung(danhSach) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(danhSach));
}

function getNguoiDungHienTai() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
}

function setNguoiDungHienTai(user) {
    if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    window.dispatchEvent(new Event('luxury_auth_changed'));
}

function getAdminConfig() {
    if (typeof LUXURY_ADMIN_CONFIG !== 'undefined' && LUXURY_ADMIN_CONFIG) {
        return LUXURY_ADMIN_CONFIG;
    }
    return {
        username: 'admin',
        password: 'admin123',
        hoTen: 'Ban Quản Trị LUXURY Store',
        email: 'admin@luxuryperfume.vn',
        sdt: '0988 888 888',
        role: 'admin'
    };
}

function dangNhap(username, password) {
    const uname = (username || '').trim();
    const pass = (password || '').trim();
    const adminCfg = getAdminConfig();

    // 1. KIỂM TRA TÀI KHOẢN QUẢN TRỊ VIÊN (ADMIN) ĐỘC LẬP
    if (uname === adminCfg.username && pass === adminCfg.password) {
        const adminUser = {
            id: 'ADMIN_MASTER',
            username: adminCfg.username,
            hoTen: adminCfg.hoTen,
            email: adminCfg.email,
            sdt: adminCfg.sdt,
            role: 'admin',
            ngayTao: '2026-08-01'
        };
        setNguoiDungHienTai(adminUser);
        return { 
            success: true, 
            message: 'Đăng nhập Quản Trị Viên thành công!', 
            user: adminUser, 
            redirect: 'trang-quan-tri.html' 
        };
    }

    // 2. KIỂM TRA TÀI KHOẢN KHÁCH HÀNG (USER)
    const users = getDanhSachNguoiDung();
    const user = users.find(u => 
        (u.username.toLowerCase() === uname.toLowerCase() || (u.email && u.email.toLowerCase() === uname.toLowerCase())) &&
        u.password === pass
    );

    if (!user) {
        return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' };
    }

    // Lưu phiên đăng nhập User
    setNguoiDungHienTai(user);
    return { 
        success: true, 
        message: `Chào mừng ${user.hoTen} quay trở lại!`, 
        user: user, 
        redirect: null 
    };
}

function dangKy(thongTin) {
    const adminCfg = getAdminConfig();
    const uname = (thongTin.username || '').trim();
    const email = (thongTin.email || '').trim().toLowerCase();

    if (!uname || !thongTin.password || !thongTin.hoTen) {
        return { success: false, message: 'Vui lòng điền đầy đủ các thông tin bắt buộc!' };
    }

    if (uname.length < 3) {
        return { success: false, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' };
    }

    if (thongTin.password.length < 6) {
        return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự!' };
    }

    // Không cho phép đăng ký trùng tên Admin
    if (uname.toLowerCase() === adminCfg.username.toLowerCase()) {
        return { success: false, message: 'Tên tài khoản này đã được bảo lưu bởi hệ thống!' };
    }

    const users = getDanhSachNguoiDung();

    // Kiểm tra trùng username
    if (users.some(u => u.username.toLowerCase() === uname.toLowerCase())) {
        return { success: false, message: 'Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác!' };
    }

    // Kiểm tra trùng email nếu có
    if (email && users.some(u => u.email && u.email.toLowerCase() === email)) {
        return { success: false, message: 'Email này đã được đăng ký tài khoản khác!' };
    }

    // Mọi tài khoản tạo mới luôn là User
    const newUser = {
        id: 'USER' + String(Date.now()).slice(-5),
        username: uname,
        password: thongTin.password,
        hoTen: thongTin.hoTen.trim(),
        email: email || '',
        sdt: thongTin.sdt ? thongTin.sdt.trim() : '',
        diaChi: thongTin.diaChi ? thongTin.diaChi.trim() : '',
        role: 'user', // Luôn gán role user
        ngayTao: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    luuDanhSachNguoiDung(users);

    // Tự động đăng nhập sau khi đăng ký
    setNguoiDungHienTai(newUser);
    return { success: true, message: 'Đăng ký tài khoản thành công!', user: newUser };
}

function dangXuat() {
    setNguoiDungHienTai(null);
}

function kiemTraLaAdmin() {
    const user = getNguoiDungHienTai();
    return !!(user && user.role === 'admin');
}

function kiemTraDaDangNhap() {
    return !!getNguoiDungHienTai();
}

// ----------------------------------------------------
// TIỆN ÍCH TÌM KIẾM & CHUẨN HÓA TIẾNG VIỆT (FUZZY SEARCH)
// ----------------------------------------------------

function xoaDauTiengViet(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Kiểm tra khớp từ khóa gần giống nhất
function khopTuKhoaSanPham(sanPham, tuKhoa) {
    if (!tuKhoa) return true;
    const cleanKw = xoaDauTiengViet(tuKhoa);
    if (!cleanKw) return true;

    const keywords = cleanKw.split(' ').filter(k => k.length > 0);

    const chuoiKiemTra = xoaDauTiengViet(`
        ${sanPham.ten || ''} 
        ${sanPham.thuongHieuTen || sanPham.thuongHieu || ''} 
        ${sanPham.danhMucTen || sanPham.danhMuc || ''} 
        ${sanPham.dungTich || ''} 
        ${sanPham.moTa || ''}
    `);

    // Khớp nếu tất cả các từ trong từ khóa đều xuất hiện trong sản phẩm
    return keywords.every(kw => chuoiKiemTra.includes(kw));
}

// ----------------------------------------------------
// CÁC HÀM XỬ LÝ SẢN PHẨM (CRUD)
// ----------------------------------------------------

function getDanhSachSanPham() {
    khoiTaoDuLieu();
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
    } catch (e) {
        console.error('Lỗi khi đọc danh sách sản phẩm:', e);
        return DEFAULT_PRODUCTS;
    }
}

function luuDanhSachSanPham(danhSach) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(danhSach));
    window.dispatchEvent(new Event('luxury_products_updated'));
}

function themSanPham(sanPhamMoi) {
    const danhSach = getDanhSachSanPham();
    if (!sanPhamMoi.id) {
        sanPhamMoi.id = 'SP' + String(Date.now()).slice(-4);
    }
    if (!sanPhamMoi.daBan) {
        sanPhamMoi.daBan = 0;
    }
    danhSach.unshift(sanPhamMoi);
    luuDanhSachSanPham(danhSach);
    return sanPhamMoi;
}

function suaSanPham(id, duLieuCapNhat) {
    const danhSach = getDanhSachSanPham();
    const index = danhSach.findIndex(item => item.id === id);
    if (index !== -1) {
        danhSach[index] = { ...danhSach[index], ...duLieuCapNhat };
        luuDanhSachSanPham(danhSach);
        return danhSach[index];
    }
    return null;
}

function xoaSanPham(id) {
    let danhSach = getDanhSachSanPham();
    const truocKhiXoa = danhSach.length;
    danhSach = danhSach.filter(item => item.id !== id);
    if (danhSach.length < truocKhiXoa) {
        luuDanhSachSanPham(danhSach);
        return true;
    }
    return false;
}

function getSanPhamTheoId(id) {
    const danhSach = getDanhSachSanPham();
    return danhSach.find(item => item.id === id) || null;
}

// ----------------------------------------------------
// CÁC HÀM XỬ LÝ ĐƠN HÀNG
// ----------------------------------------------------

function getDanhSachDonHang(locTheoUser = false) {
    khoiTaoDuLieu();
    try {
        const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
        const orders = data ? JSON.parse(data) : DEFAULT_ORDERS;
        if (locTheoUser) {
            const currentUser = getNguoiDungHienTai();
            if (currentUser && currentUser.role !== 'admin') {
                return orders.filter(o => o.username === currentUser.username || (o.khachHang && o.khachHang.sdt === currentUser.sdt));
            }
        }
        return orders;
    } catch (e) {
        console.error('Lỗi khi đọc danh sách đơn hàng:', e);
        return DEFAULT_ORDERS;
    }
}

function luuDanhSachDonHang(danhSach) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(danhSach));
    window.dispatchEvent(new Event('luxury_orders_updated'));
}

function capNhatTrangThaiDonHang(maDon, trangThaiMoi) {
    const danhSach = getDanhSachDonHang(false);
    const donHang = danhSach.find(item => item.maDon === maDon);
    if (donHang) {
        donHang.trangThai = trangThaiMoi;
        luuDanhSachDonHang(danhSach);
        return donHang;
    }
    return null;
}

function taoDonHangMoi(thongTinDon) {
    const danhSach = getDanhSachDonHang(false);
    const maDonMoi = 'LX-' + Math.floor(10000 + Math.random() * 90000);
    const now = new Date();
    const ngayDatStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const currentUser = getNguoiDungHienTai();
    const username = currentUser ? currentUser.username : (thongTinDon.username || 'guest');

    const donHangHoanChinh = {
        maDon: maDonMoi,
        username: username,
        ngayDat: ngayDatStr,
        trangThai: 'cho-xac-nhan',
        phuongThucThanhToan: thongTinDon.phuongThucThanhToan || 'COD - Thanh toán khi nhận hàng',
        khachHang: thongTinDon.khachHang || {
            hoTen: currentUser ? currentUser.hoTen : 'Khách hàng Luxury',
            sdt: currentUser ? currentUser.sdt : '0900 000 000',
            diaChi: currentUser ? currentUser.diaChi : 'Hà Nội, Việt Nam',
            ghiChu: ''
        },
        sanPham: thongTinDon.sanPham || [],
        tamTinh: thongTinDon.tamTinh || 0,
        phiVanChuyen: thongTinDon.phiVanChuyen || 0,
        tongTien: thongTinDon.tongTien || 0
    };

    danhSach.unshift(donHangHoanChinh);
    luuDanhSachDonHang(danhSach);
    return donHangHoanChinh;
}

function getDonHangTheoMa(maDon) {
    const danhSach = getDanhSachDonHang(false);
    return danhSach.find(item => item.maDon === maDon) || null;
}

// ----------------------------------------------------
// TÍNH TOÁN THỐNG KÊ
// ----------------------------------------------------

function tinhToanThongKe() {
    const products = getDanhSachSanPham();
    const orders = getDanhSachDonHang(false);

    // Doanh thu từ các đơn đã hoàn thành và đang giao
    const doanhThuTong = orders
        .filter(o => o.trangThai === 'hoan-thanh' || o.trangThai === 'dang-giao')
        .reduce((sum, o) => sum + (o.tongTien || 0), 0);

    const tongDonHang = orders.length;
    const donChoXacNhan = orders.filter(o => o.trangThai === 'cho-xac-nhan').length;
    const donDangGiao = orders.filter(o => o.trangThai === 'dang-giao').length;
    const donHoanThanh = orders.filter(o => o.trangThai === 'hoan-thanh').length;
    const donDaHuy = orders.filter(o => o.trangThai === 'da-huy').length;

    const tongSanPham = products.length;
    const tongTonKho = products.reduce((sum, p) => sum + (Number(p.tonKho) || 0), 0);

    return {
        doanhThuTong,
        tongDonHang,
        donChoXacNhan,
        donDangGiao,
        donHoanThanh,
        donDaHuy,
        tongSanPham,
        tongTonKho
    };
}

// Định dạng tiền tệ VNĐ
function dinhDangTien(soTien) {
    if (!soTien && soTien !== 0) return '0 ₫';
    return Number(soTien).toLocaleString('vi-VN') + ' ₫';
}

// Trả về text và class cho trạng thái đơn hàng
function getThongTinTrangThai(trangThai) {
    switch (trangThai) {
        case 'cho-xac-nhan':
            return { text: 'Chờ xác nhận', class: 'cho-xac-nhan', badgeClass: 'badge-warning', icon: '⏳' };
        case 'dang-giao':
            return { text: 'Đang giao hàng', class: 'dang-giao', badgeClass: 'badge-info', icon: '🚚' };
        case 'hoan-thanh':
            return { text: 'Đã hoàn thành', class: 'hoan-thanh', badgeClass: 'badge-success', icon: '✅' };
        case 'da-huy':
            return { text: 'Đã hủy', class: 'da-huy', badgeClass: 'badge-danger', icon: '❌' };
        default:
            return { text: 'Không xác định', class: '', badgeClass: 'badge-secondary', icon: '❓' };
    }
}

// Tự động khởi tạo khi load file
khoiTaoDuLieu();

