-- MySQL version converted from the supplied SQL Server script
-- Database: WebBanNuocHoa

CREATE DATABASE IF NOT EXISTS WebBanNuocHoa
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE WebBanNuocHoa;

-- 1. Bảng sản phẩm
CREATE TABLE SanPham (
    MaSanPham INT NOT NULL AUTO_INCREMENT,
    TenSanPham VARCHAR(200) NOT NULL,
    ThuongHieu VARCHAR(100) NULL,
    GioiTinh VARCHAR(20) NULL,
    DungTich INT NULL,
    NongDo VARCHAR(50) NULL,
    GiaBan DECIMAL(15,2) NOT NULL,
    SoLuongTon INT NOT NULL DEFAULT 0,
    MoTa TEXT NULL,
    HinhAnh VARCHAR(500) NULL,
    TrangThai TINYINT(1) NOT NULL DEFAULT 1,
    NgayTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT PK_SanPham PRIMARY KEY (MaSanPham),
    CONSTRAINT CK_SanPham_GiaBan CHECK (GiaBan >= 0),
    CONSTRAINT CK_SanPham_SoLuongTon CHECK (SoLuongTon >= 0)
) ENGINE=InnoDB;

-- 2. Bảng đơn hàng
CREATE TABLE DonHang (
    MaDonHang INT NOT NULL AUTO_INCREMENT,
    TenKhachHang VARCHAR(150) NOT NULL,
    SoDienThoai VARCHAR(20) NOT NULL,
    Email VARCHAR(150) NULL,
    DiaChiGiaoHang VARCHAR(500) NOT NULL,
    NgayDatHang DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PhuongThucThanhToan VARCHAR(50) NOT NULL,
    TrangThaiDonHang VARCHAR(50) NOT NULL DEFAULT 'Chờ xác nhận',
    GhiChu VARCHAR(500) NULL,

    CONSTRAINT PK_DonHang PRIMARY KEY (MaDonHang)
) ENGINE=InnoDB;

-- 3. Bảng chi tiết đơn hàng
CREATE TABLE ChiTietDonHang (
    MaDonHang INT NOT NULL,
    MaSanPham INT NOT NULL,
    SoLuong INT NOT NULL,
    DonGia DECIMAL(15,2) NOT NULL,

    CONSTRAINT PK_ChiTietDonHang PRIMARY KEY (MaDonHang, MaSanPham),
    CONSTRAINT FK_ChiTietDonHang_DonHang
        FOREIGN KEY (MaDonHang)
        REFERENCES DonHang(MaDonHang)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT FK_ChiTietDonHang_SanPham
        FOREIGN KEY (MaSanPham)
        REFERENCES SanPham(MaSanPham)
        ON UPDATE CASCADE,
    CONSTRAINT CK_ChiTietDonHang_SoLuong CHECK (SoLuong > 0),
    CONSTRAINT CK_ChiTietDonHang_DonGia CHECK (DonGia >= 0)
) ENGINE=InnoDB;

-- Kiểm tra nhanh sau khi tạo
SHOW TABLES;
