
-- 2.1. Bảng Sản phẩm (SanPham)
CREATE TABLE SanPham (
    MaSanPham INT IDENTITY(1,1) PRIMARY KEY, -- Khóa chính
    TenSanPham NVARCHAR(200),
    ThuongHieu NVARCHAR(100),
    GioiTinh NVARCHAR(20),
    DungTich INT,
    NongDo NVARCHAR(50),
    GiaBan DECIMAL(15,2),
    SoLuongTon INT,
    MoTa NVARCHAR(MAX),
    HinhAnh NVARCHAR(500),
    TrangThai BIT,
    NgayTao DATETIME2
);
GO

-- 2.4. Bảng người dùng (NguoiDung)
CREATE TABLE NguoiDung (
    MaNguoiDung INT IDENTITY(1,1) PRIMARY KEY, -- Khóa chính
    TenDangNhap VARCHAR(50) UNIQUE,            -- Tên đăng nhập là duy nhất
    MatKhau VARCHAR(255),
    Email VARCHAR(150) UNIQUE,                 -- Email là duy nhất
    VaiTro NVARCHAR(30),
    TrangThai BIT,
    NgayTao DATETIME2,
    NgayCapNhat DATETIME2,
    LanDangNhapCuoi DATETIME2
);
GO

-- 2.5. Bảng khách hàng (KhachHang)
CREATE TABLE KhachHang (
    MaKhachHang INT IDENTITY(1,1) PRIMARY KEY, -- Khóa chính
    HoTen NVARCHAR(150),
    MaNguoiDung INT UNIQUE,                    -- Khóa ngoại, Unique do quan hệ 1-1
    SoDienThoai VARCHAR(20) UNIQUE,            -- Số điện thoại duy nhất
    GioiTinh NVARCHAR(20),
    NgaySinh DATE,
    DiaChi NVARCHAR(500),
    AnhDaiDien NVARCHAR(500),
    TrangThai BIT,
    NgayDangKy DATETIME2,
    CONSTRAINT FK_KhachHang_NguoiDung FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung)
);
GO

-- 2.2. Bảng Đơn hàng (DonHang)
CREATE TABLE DonHang (
    MaDonHang INT IDENTITY(1,1) PRIMARY KEY, -- Khóa chính
    MaKhachHang INT,                         -- Khóa ngoại
    TenNguoiNhan NVARCHAR(150),
    SoDienThoai VARCHAR(20),
    DiaChiGiaoHang NVARCHAR(500),
    NgayDatHang DATETIME2,
    TongTien DECIMAL(15,2),
    PhuongThucThanhToan NVARCHAR(50),
    TrangThaiDonHang NVARCHAR(50),
    GhiChu NVARCHAR(500),
    CONSTRAINT FK_DonHang_KhachHang FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaKhachHang)
);
GO

-- 2.3. Bảng Chi tiết đơn hàng (ChiTietDonHang)
CREATE TABLE ChiTietDonHang (
    MaDonHang INT,                           -- Khóa ngoại (Một phần của khóa chính)
    MaSanPham INT,                           -- Khóa ngoại (Một phần của khóa chính)
    SoLuong INT,
    DonGia DECIMAL(15,2),
    PRIMARY KEY (MaDonHang, MaSanPham),      -- Khóa chính ghép
    CONSTRAINT FK_ChiTietDonHang_DonHang FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang),
    CONSTRAINT FK_ChiTietDonHang_SanPham FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
);
GO
