/* ==========================================================================
   XỬ LÝ DỮ LIỆU ĐỘNG & MODAL CHI TIẾT SẢN PHẨM - LUXURY STORE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    khoiTaoTrangKhachHang();
    damBaoModalChiTietTonTai();
});

function khoiTaoTrangKhachHang() {
    // Nếu đang ở Trang Chủ
    if (document.querySelector('.gioi-thieu')) {
        hienThiSanPhamTrangChu();
    }

    // Nếu đang ở Trang Sản Phẩm
    if (document.querySelector('.khu-vuc-san-pham')) {
        hienThiDanhSachSanPhamShop();
        caiDatSuKienTimKiemShop();
    }

    // Nếu đang ở Trang Đơn Hàng
    if (document.querySelector('.khu-vuc-don-hang')) {
        hienThiDanhSachDonHangUser('tat-ca');
        caiDatBoLocDonHangUser();
    }

    // Lắng nghe sự kiện cập nhật dữ liệu từ Admin
    window.addEventListener('luxury_products_updated', () => {
        if (document.querySelector('.gioi-thieu')) hienThiSanPhamTrangChu();
        if (document.querySelector('.khu-vuc-san-pham')) hienThiDanhSachSanPhamShop();
    });

    window.addEventListener('luxury_orders_updated', () => {
        if (document.querySelector('.khu-vuc-don-hang')) {
            const activeBtn = document.querySelector('.bo-loc.active');
            const status = activeBtn ? activeBtn.getAttribute('data-status') || 'tat-ca' : 'tat-ca';
            hienThiDanhSachDonHangUser(status);
        }
    });
}

// --------------------------------------------------------------------------
// 1. MENU 3 CHẤM Ở TRANG CHỦ
// --------------------------------------------------------------------------
function moDanhMuc() {
    const danhSach = document.getElementById("danh-sach-danh-muc");
    if (danhSach) {
        danhSach.classList.toggle("hien-thi");
    }
}

function locDanhMucTrangChu(danhMuc) {
    const danhSach = getDanhSachSanPham();
    const container = document.getElementById("danh-sach-san-pham");
    if (!container) return;

    let filtered = danhSach;
    if (danhMuc !== 'tat-ca') {
        if (danhMuc === 'khuyen-mai') {
            filtered = danhSach.filter(p => p.danhMuc === 'khuyen-mai' || p.gia < 2500000);
        } else {
            filtered = danhSach.filter(p => p.danhMuc === danhMuc);
        }
    }

    renderCardsTrangChu(filtered, container);
    
    const menu = document.getElementById("danh-sach-danh-muc");
    if (menu) menu.classList.remove("hien-thi");
}

// --------------------------------------------------------------------------
// 2. HIỂN THỊ SẢN PHẨM TRANG CHỦ
// --------------------------------------------------------------------------
function hienThiSanPhamTrangChu() {
    const container = document.getElementById("danh-sach-san-pham");
    if (!container) return;

    const products = getDanhSachSanPham();
    let displayList = products.filter(p => p.noiBat);
    if (displayList.length < 4) {
        displayList = products.slice(0, 8);
    }

    renderCardsTrangChu(displayList, container);
}

function renderCardsTrangChu(list, container) {
    if (list.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #dfc46a;">Chưa có sản phẩm nào trong danh mục này.</div>`;
        return;
    }

    let html = '';
    list.forEach(sp => {
        html += `
            <div class="the-san-pham">
                <img src="${sp.hinhAnh}" alt="${sp.ten}" class="anh-san-pham" onerror="this.src=FALLBACK_PERFUME_IMG" onclick="moModalChiTietSanPham('${sp.id}')">
                <div class="thong-tin-san-pham">
                    <h3 title="${sp.ten}" onclick="moModalChiTietSanPham('${sp.id}')" style="cursor: pointer;">${sp.ten}</h3>
                    <p class="gia-san-pham">${dinhDangTien(sp.gia)}</p>
                    <p class="so-luong">${sp.danhMucTen || sp.danhMuc} • ${sp.dungTich || '100ml'}</p>
                    
                    <button class="nut-dat-hang" onclick="datHangNhanh('${sp.id}')">
                        ĐẶT HÀNG
                    </button>
                    <button class="nut-xem-nhanh" onclick="moModalChiTietSanPham('${sp.id}')">
                        👁️ Xem Chi Tiết
                    </button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// --------------------------------------------------------------------------
// 3. HIỂN THỊ & BỘ LỌC TRANG SẢN PHẨM (SHOP)
// --------------------------------------------------------------------------
function hienThiDanhSachSanPhamShop(danhSachLoc = null) {
    const container = document.getElementById("danh-sach-san-pham");
    const countEl = document.getElementById("so-luong-san-pham");
    if (!container) return;

    const products = danhSachLoc !== null ? danhSachLoc : getDanhSachSanPham();

    if (countEl) {
        countEl.textContent = `Hiển thị ${products.length} sản phẩm`;
    }

    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: #dfc46a; background: rgba(16, 43, 64, 0.6); border-radius: 16px;">
                <h3>Không tìm thấy sản phẩm nước hoa phù hợp</h3>
                <p style="color: #ffffff; opacity: 0.8; margin-top: 8px;">Vui lòng thử lại với các tiêu chí tìm kiếm hoặc bộ lọc khác.</p>
            </div>
        `;
        return;
    }

    let html = '';
    products.forEach(sp => {
        html += `
            <div class="san-pham">
                <img src="${sp.hinhAnh}" alt="${sp.ten}" onerror="this.src=FALLBACK_PERFUME_IMG" onclick="moModalChiTietSanPham('${sp.id}')" style="cursor: pointer;">
                <div class="thong-tin-san-pham">
                    <h3 class="ten-san-pham" onclick="moModalChiTietSanPham('${sp.id}')" style="cursor: pointer;">${sp.ten}</h3>
                    <p class="danh-muc-san-pham">${sp.danhMucTen || sp.danhMuc} | ${sp.dungTich || '100ml'}</p>
                    <p class="gia-san-pham">${dinhDangTien(sp.gia)}</p>
                    <button class="nut-dat-hang" onclick="datHangNhanh('${sp.id}')">
                        ĐẶT HÀNG
                    </button>
                    <button class="nut-xem-nhanh" onclick="moModalChiTietSanPham('${sp.id}')">
                        👁️ Xem Chi Tiết
                    </button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function caiDatSuKienTimKiemShop() {
    const searchInput = document.getElementById("tu-khoa");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            locSanPham();
        });
    }
}

function locSanPham() {
    const allProducts = getDanhSachSanPham();
    const keyword = (document.getElementById("tu-khoa")?.value || '').toLowerCase().trim();

    const selectedGenders = Array.from(document.querySelectorAll('input[name="gioi-tinh"]:checked')).map(cb => cb.value);
    const selectedBrands = Array.from(document.querySelectorAll('input[name="thuong-hieu"]:checked')).map(cb => cb.value);
    const selectedPrice = document.querySelector('input[name="khoang-gia"]:checked')?.value;

    const filtered = allProducts.filter(sp => {
        const matchKeyword = !keyword || sp.ten.toLowerCase().includes(keyword) || (sp.moTa && sp.moTa.toLowerCase().includes(keyword));
        const matchGender = selectedGenders.length === 0 || selectedGenders.includes(sp.danhMuc);
        const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(sp.thuongHieu);

        let matchPrice = true;
        if (selectedPrice === 'duoi-1') {
            matchPrice = sp.gia < 1000000;
        } else if (selectedPrice === '1-2') {
            matchPrice = sp.gia >= 1000000 && sp.gia <= 2000000;
        } else if (selectedPrice === '2-5') {
            matchPrice = sp.gia > 2000000 && sp.gia <= 5000000;
        } else if (selectedPrice === 'tren-5') {
            matchPrice = sp.gia > 5000000;
        }

        return matchKeyword && matchGender && matchBrand && matchPrice;
    });

    hienThiDanhSachSanPhamShop(filtered);
}

// --------------------------------------------------------------------------
// 4. MODAL CHI TIẾT SẢN PHẨM LUXURY
// --------------------------------------------------------------------------
let currentDetailProductId = null;

function damBaoModalChiTietTonTai() {
    if (document.getElementById('modal-chi-tiet-san-pham-box')) return;

    const modalHtml = `
        <div id="modal-chi-tiet-san-pham-box" class="modal-san-pham-overlay" onclick="dongModalChiTietNgoai(event)">
            <div class="modal-san-pham-box" onclick="event.stopPropagation()">
                <button class="modal-san-pham-dong" onclick="dongModalChiTietSanPham()" title="Đóng">✕</button>
                
                <div class="modal-san-pham-grid">
                    <!-- Cột trái: Hình ảnh & Cam kết -->
                    <div class="modal-san-pham-trai">
                        <div class="modal-anh-khung">
                            <img id="detail-modal-img" src="" alt="Nước hoa Luxury" onerror="this.src=FALLBACK_PERFUME_IMG">
                            <span class="modal-badge-chinh-hang">✨ Chính Hãng 100%</span>
                        </div>
                        <div class="modal-cam-ket">
                            <div class="modal-cam-ket-item">
                                <span>🛡️</span>
                                <div>Cam kết bồi thường 200% nếu giả</div>
                            </div>
                            <div class="modal-cam-ket-item">
                                <span>🚚</span>
                                <div>Giao hàng hỏa tốc 2H toàn quốc</div>
                            </div>
                            <div class="modal-cam-ket-item">
                                <span>🎁</span>
                                <div>Tặng kèm hộp quà sang trọng</div>
                            </div>
                            <div class="modal-cam-ket-item">
                                <span>🔄</span>
                                <div>Đổi trả trong 7 ngày nếu lỗi</div>
                            </div>
                        </div>
                    </div>

                    <!-- Cột phải: Chi tiết sản phẩm -->
                    <div class="modal-san-pham-phai">
                        <div>
                            <span class="modal-thuong-hieu-tag" id="detail-modal-brand">BRAND</span>
                            <h2 class="modal-ten-san-pham" id="detail-modal-name">Tên Nước Hoa</h2>
                            
                            <div class="modal-danh-gia-row">
                                <span class="modal-sao">★★★★★</span>
                                <span><strong>5.0</strong> (128 đánh giá)</span>
                                <span>•</span>
                                <span id="detail-modal-sold">Đã bán 0</span>
                            </div>

                            <div class="modal-gia-block">
                                <span class="modal-gia-chinh" id="detail-modal-price">0 ₫</span>
                                <span class="modal-gia-goc" id="detail-modal-old-price">0 ₫</span>
                                <span class="modal-tinh-trang-kho" id="detail-modal-stock">Còn hàng</span>
                            </div>

                            <!-- Thông số kỹ thuật -->
                            <div class="modal-thong-so-grid">
                                <div class="modal-thong-so-item">
                                    <span>Dung Tích</span>
                                    <strong id="detail-modal-vol">100ml</strong>
                                </div>
                                <div class="modal-thong-so-item">
                                    <span>Lưu Hương</span>
                                    <strong>8 - 12 Tiếng</strong>
                                </div>
                                <div class="modal-thong-so-item">
                                    <span>Độ Tỏa Hương</span>
                                    <strong>Bán kính 2m</strong>
                                </div>
                            </div>

                            <!-- Tầng hương & mô tả -->
                            <div class="modal-mo-ta-khung">
                                <h4>🌸 Phong Cách & Tầng Hương</h4>
                                <p id="detail-modal-desc">Mùi hương đẳng cấp...</p>
                            </div>
                        </div>

                        <!-- Khu vực đặt mua -->
                        <div class="modal-thao-tac-row">
                            <div class="modal-so-luong-group">
                                <button class="modal-btn-so-luong" onclick="tangGiamSoLuongModal(-1)">−</button>
                                <input type="number" id="detail-modal-qty" class="modal-input-so-luong" value="1" min="1" max="99" readonly>
                                <button class="modal-btn-so-luong" onclick="tangGiamSoLuongModal(1)">+</button>
                            </div>

                            <button class="modal-btn-dat-hang" onclick="datHangTuModalChiTiet()">
                                <span>🛍️</span>
                                <span>ĐẶT MUA NGAY</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function moModalChiTietSanPham(id) {
    damBaoModalChiTietTonTai();
    const sp = getSanPhamTheoId(id);
    if (!sp) return;

    currentDetailProductId = id;

    document.getElementById('detail-modal-img').src = sp.hinhAnh || FALLBACK_PERFUME_IMG;
    document.getElementById('detail-modal-brand').textContent = sp.thuongHieuTen || sp.thuongHieu.toUpperCase();
    document.getElementById('detail-modal-name').textContent = sp.ten;
    document.getElementById('detail-modal-sold').textContent = `Đã bán ${sp.daBan || 25}`;
    document.getElementById('detail-modal-price').textContent = dinhDangTien(sp.gia);
    
    // Giả lập giá gốc cao hơn 15% để tạo cảm giác ưu đãi
    const giaGoc = Math.round(sp.gia * 1.15 / 50000) * 50000;
    document.getElementById('detail-modal-old-price').textContent = dinhDangTien(giaGoc);

    const stockEl = document.getElementById('detail-modal-stock');
    if (sp.tonKho <= 0) {
        stockEl.textContent = 'Hết hàng';
        stockEl.style.color = '#ff6b6b';
        stockEl.style.background = 'rgba(230, 57, 70, 0.15)';
    } else {
        stockEl.textContent = `Còn ${sp.tonKho} chai trong kho`;
        stockEl.style.color = '#52b788';
        stockEl.style.background = 'rgba(82, 183, 136, 0.15)';
    }

    document.getElementById('detail-modal-vol').textContent = sp.dungTich || '100ml';
    document.getElementById('detail-modal-desc').textContent = sp.moTa || 'Sản phẩm nước hoa cao cấp chính hãng mang đến mùi hương tinh tế, quyến rũ và lưu giữ phong cách sang trọng suốt cả ngày.';
    document.getElementById('detail-modal-qty').value = 1;

    const overlay = document.getElementById('modal-chi-tiet-san-pham-box');
    if (overlay) {
        overlay.classList.add('hien-thi');
    }
}

function dongModalChiTietSanPham() {
    const overlay = document.getElementById('modal-chi-tiet-san-pham-box');
    if (overlay) {
        overlay.classList.remove('hien-thi');
    }
}

function dongModalChiTietNgoai(e) {
    if (e.target.id === 'modal-chi-tiet-san-pham-box') {
        dongModalChiTietSanPham();
    }
}

function tangGiamSoLuongModal(delta) {
    const input = document.getElementById('detail-modal-qty');
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val += delta;
    if (val < 1) val = 1;
    if (val > 50) val = 50;
    input.value = val;
}

// --------------------------------------------------------------------------
// 5. MODAL ĐẶT HÀNG & THANH TOÁN (LUXURY CHECKOUT MODAL)
// --------------------------------------------------------------------------
let currentCheckoutProduct = null;
let currentCheckoutQty = 1;
let currentDiscountAmount = 0;
let currentPaymentMethod = 'COD - Thanh toán khi nhận hàng';

function damBaoModalDatHangTonTai() {
    if (document.getElementById('modal-dat-hang-box')) return;

    const modalHtml = `
        <div id="modal-dat-hang-box" class="modal-dat-hang-overlay" onclick="dongModalDatHangNgoai(event)">
            <div class="modal-dat-hang-box" onclick="event.stopPropagation()">
                
                <div class="modal-dat-hang-header">
                    <h3>🛍️ Đặt Mua Nước Hoa Cao Cấp</h3>
                    <button class="modal-dat-hang-dong" onclick="dongModalDatHang()" title="Đóng">✕</button>
                </div>

                <div class="modal-dat-hang-body">
                    <form id="form-dat-hang-luxury" onsubmit="xacNhanDatHangSubmit(event)">
                        <div class="checkout-grid">
                            
                            <!-- Cột trái: Thông tin nhận hàng & Thanh toán -->
                            <div>
                                <h4 class="checkout-section-title">👤 Thông Tin Người Nhận Hàng</h4>
                                
                                <div class="checkout-form-group">
                                    <label for="checkout-name">Họ và tên của bạn *</label>
                                    <input type="text" id="checkout-name" class="checkout-input" required placeholder="VD: Nguyễn Hoàng Nam">
                                </div>

                                <div class="checkout-form-group">
                                    <label for="checkout-phone">Số điện thoại nhận hàng *</label>
                                    <input type="tel" id="checkout-phone" class="checkout-input" required pattern="[0-9]{10,11}" placeholder="VD: 0912345678">
                                </div>

                                <div class="checkout-form-group">
                                    <label for="checkout-address">Địa chỉ giao hàng chi tiết *</label>
                                    <input type="text" id="checkout-address" class="checkout-input" required placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP...">
                                </div>

                                <div class="checkout-form-group">
                                    <label for="checkout-note">Ghi chú giao hàng (không bắt buộc)</label>
                                    <input type="text" id="checkout-note" class="checkout-input" placeholder="VD: Gói quà tặng sinh nhật, gọi trước khi giao 15p...">
                                </div>

                                <h4 class="checkout-section-title" style="margin-top: 25px;">💳 Hình Thức Thanh Toán</h4>
                                
                                <div class="payment-methods">
                                    <label class="payment-card active" id="pay-card-cod" onclick="chonPhuongThucThanhToan('COD - Thanh toán khi nhận hàng', 'pay-card-cod')">
                                        <input type="radio" name="payment_type" value="COD" checked>
                                        <div class="payment-card-content">
                                            <div class="payment-card-title">💵 Thanh toán khi nhận hàng (COD)</div>
                                            <div class="payment-card-desc">Kiểm tra mùi hương và hàng chính hãng trước khi thanh toán tiền</div>
                                        </div>
                                    </label>

                                    <label class="payment-card" id="pay-card-bank" onclick="chonPhuongThucThanhToan('Chuyển khoản ngân hàng (QR Code)', 'pay-card-bank')">
                                        <input type="radio" name="payment_type" value="BANKING">
                                        <div class="payment-card-content">
                                            <div class="payment-card-title">📱 Chuyển khoản QR Code / Ngân hàng</div>
                                            <div class="payment-card-desc">Xác nhận thanh toán tự động nhanh chóng và an toàn</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Cột phải: Tóm tắt đơn & Bảng tính tiền -->
                            <div>
                                <div class="checkout-summary-card">
                                    <h4 class="checkout-section-title" style="margin-bottom: 0;">🧴 Sản Phẩm Đặt Mua</h4>
                                    
                                    <div class="checkout-prod-item">
                                        <img id="checkout-prod-img" src="" alt="Nước hoa" class="checkout-prod-img" onerror="this.src=FALLBACK_PERFUME_IMG">
                                        <div class="checkout-prod-info">
                                            <h4 id="checkout-prod-name">Tên sản phẩm</h4>
                                            <p id="checkout-prod-meta">100ml | Full Box Chính Hãng</p>
                                            <div class="checkout-prod-price" id="checkout-prod-price">0 ₫</div>
                                        </div>
                                    </div>

                                    <!-- Số lượng stepper -->
                                    <div class="checkout-qty-row">
                                        <span style="color: #b0c4d8; font-weight: 600;">Số lượng đặt mua:</span>
                                        <div class="checkout-qty-stepper">
                                            <button type="button" class="checkout-qty-btn" onclick="capNhatSoLuongCheckout(-1)">−</button>
                                            <input type="number" id="checkout-qty-input" class="checkout-qty-input" value="1" min="1" max="99" readonly>
                                            <button type="button" class="checkout-qty-btn" onclick="capNhatSoLuongCheckout(1)">+</button>
                                        </div>
                                    </div>

                                    <!-- Mã giảm giá -->
                                    <div class="checkout-voucher-row">
                                        <input type="text" id="checkout-voucher-input" class="checkout-voucher-input" placeholder="Nhập mã: LUXURY50">
                                        <button type="button" class="checkout-voucher-btn" onclick="apDungMaGiamGia()">Áp Dụng</button>
                                    </div>
                                    <div id="voucher-message" style="font-size: 12px; color: #52b788; display: none;"></div>

                                    <!-- Quà tặng kèm -->
                                    <div class="checkout-gift-badge">
                                        <span style="font-size: 20px;">🎁</span>
                                        <div><strong>Quà Tặng Độc Quyền:</strong> 01 Túi quà sang trọng + 01 Ống Vial dùng thử chính hãng 2ml.</div>
                                    </div>

                                    <!-- Bảng tính tiền -->
                                    <div class="checkout-totals-box">
                                        <div class="checkout-total-row">
                                            <span>Tiền hàng:</span>
                                            <span id="checkout-subtotal">0 ₫</span>
                                        </div>
                                        <div class="checkout-total-row">
                                            <span>Phí vận chuyển:</span>
                                            <span style="color: #52b788; font-weight: bold;">Miễn phí (Freeship)</span>
                                        </div>
                                        <div class="checkout-total-row" id="row-discount" style="display: none;">
                                            <span>Ưu đãi voucher:</span>
                                            <span style="color: #ff7777; font-weight: bold;" id="checkout-discount">-0 ₫</span>
                                        </div>
                                        <div class="checkout-total-row final">
                                            <span>Tổng thanh toán:</span>
                                            <strong id="checkout-final-total">0 ₫</strong>
                                        </div>
                                    </div>

                                    <!-- Nút hoàn tất -->
                                    <button type="submit" class="btn-xac-nhan-dat-hang">
                                        <span>✨</span>
                                        <span>XÁC NHẬN ĐẶT HÀNG</span>
                                    </button>

                                    <div class="checkout-trust-guarantee">
                                        🛡️ Cam kết 100% chính hãng • Đổi trả miễn phí 7 ngày • Giao nhanh toàn quốc
                                    </div>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>

            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function damBaoModalThanhCongTonTai() {
    if (document.getElementById('modal-thanh-cong-box')) return;

    const modalSuccessHtml = `
        <div id="modal-thanh-cong-box" class="modal-thanh-cong-overlay" onclick="dongModalThanhCongNgoai(event)">
            <div class="modal-thanh-cong-box" onclick="event.stopPropagation()">
                <div class="success-icon-circle">✓</div>
                <h2 style="margin: 0 0 8px; color: #dfc46a; font-size: 24px;">ĐẶT HÀNG THÀNH CÔNG!</h2>
                <p style="margin: 0; color: #b0c4d8; font-size: 14px;">Cảm ơn quý khách đã tin tưởng và lựa chọn LUXURY Perfume.</p>
                
                <div>
                    <span class="success-order-code" id="success-order-id">#LX-00000</span>
                </div>

                <div style="background: rgba(11, 36, 57, 0.7); border: 1px solid #31536b; border-radius: 14px; padding: 16px; margin: 15px 0; text-align: left; font-size: 13px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <span style="color: #8b9fb3;">Người nhận:</span>
                        <strong id="success-cust-name" style="color: #ffffff;"></strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <span style="color: #8b9fb3;">Số điện thoại:</span>
                        <span id="success-cust-phone"></span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <span style="color: #8b9fb3;">Tổng thanh toán:</span>
                        <strong id="success-order-total" style="color: #dfc46a; font-size: 15px;"></strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #8b9fb3;">Hình thức:</span>
                        <span id="success-order-pay"></span>
                    </div>
                </div>

                <p style="font-size: 13px; color: #dca8c7; margin: 0 0 10px;">Chuyên viên tư vấn sẽ liên hệ xác nhận đơn hàng trong ít phút.</p>

                <div class="success-actions">
                    <a href="trang-don-hang.html" class="btn-success-primary">
                        <span>📦</span>
                        <span>Theo Dõi Đơn Hàng</span>
                    </a>
                    <button class="btn-success-secondary" onclick="dongModalThanhCong()">
                        <span>🛍️</span>
                        <span>Tiếp Tục Mua Sắm</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalSuccessHtml);
}

function moModalDatHang(productId, quantity = 1) {
    damBaoModalDatHangTonTai();
    damBaoModalThanhCongTonTai();

    const sp = getSanPhamTheoId(productId);
    if (!sp) return;

    currentCheckoutProduct = sp;
    currentCheckoutQty = quantity > 0 ? quantity : 1;
    currentDiscountAmount = 0;
    currentPaymentMethod = 'COD - Thanh toán khi nhận hàng';

    // Đóng modal chi tiết nếu đang mở
    dongModalChiTietSanPham();

    // Điền thông tin sản phẩm
    document.getElementById('checkout-prod-img').src = sp.hinhAnh || FALLBACK_PERFUME_IMG;
    document.getElementById('checkout-prod-name').textContent = sp.ten;
    document.getElementById('checkout-prod-meta').textContent = `${sp.danhMucTen || sp.danhMuc} • ${sp.dungTich || '100ml'}`;
    document.getElementById('checkout-prod-price').textContent = dinhDangTien(sp.gia);
    document.getElementById('checkout-qty-input').value = currentCheckoutQty;

    // Reset voucher
    document.getElementById('checkout-voucher-input').value = '';
    const vMsg = document.getElementById('voucher-message');
    if (vMsg) vMsg.style.display = 'none';

    tinhToanTongTienCheckout();

    const overlay = document.getElementById('modal-dat-hang-box');
    if (overlay) {
        overlay.classList.add('hien-thi');
    }
}

function dongModalDatHang() {
    const overlay = document.getElementById('modal-dat-hang-box');
    if (overlay) {
        overlay.classList.remove('hien-thi');
    }
}

function dongModalDatHangNgoai(e) {
    if (e.target.id === 'modal-dat-hang-box') {
        dongModalDatHang();
    }
}

function capNhatSoLuongCheckout(delta) {
    let val = currentCheckoutQty + delta;
    if (val < 1) val = 1;
    if (val > 50) val = 50;
    currentCheckoutQty = val;

    const input = document.getElementById('checkout-qty-input');
    if (input) input.value = val;

    tinhToanTongTienCheckout();
}

function chonPhuongThucThanhToan(methodName, cardId) {
    currentPaymentMethod = methodName;
    document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
    const activeCard = document.getElementById(cardId);
    if (activeCard) {
        activeCard.classList.add('active');
        const radio = activeCard.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
    }
}

function apDungMaGiamGia() {
    const code = (document.getElementById('checkout-voucher-input')?.value || '').trim().toUpperCase();
    const vMsg = document.getElementById('voucher-message');
    if (!code) return;

    if (code === 'LUXURY50') {
        currentDiscountAmount = 50000;
        if (vMsg) {
            vMsg.textContent = '✓ Đã áp dụng mã LUXURY50: Giảm 50.000 ₫';
            vMsg.style.color = '#52b788';
            vMsg.style.display = 'block';
        }
    } else if (code === 'FREESHIP') {
        currentDiscountAmount = 0;
        if (vMsg) {
            vMsg.textContent = '✓ Miễn phí vận chuyển toàn quốc!';
            vMsg.style.color = '#52b788';
            vMsg.style.display = 'block';
        }
    } else if (code === 'VIP10') {
        if (currentCheckoutProduct) {
            currentDiscountAmount = Math.round((currentCheckoutProduct.gia * currentCheckoutQty * 0.1) / 10000) * 10000;
            if (vMsg) {
                vMsg.textContent = `✓ Đã áp dụng mã VIP10: Giảm 10% (${dinhDangTien(currentDiscountAmount)})`;
                vMsg.style.color = '#52b788';
                vMsg.style.display = 'block';
            }
        }
    } else {
        currentDiscountAmount = 0;
        if (vMsg) {
            vMsg.textContent = '✕ Mã giảm giá không hợp lệ hoặc đã hết hạn';
            vMsg.style.color = '#ff7777';
            vMsg.style.display = 'block';
        }
    }

    tinhToanTongTienCheckout();
}

function tinhToanTongTienCheckout() {
    if (!currentCheckoutProduct) return;

    const subtotal = currentCheckoutProduct.gia * currentCheckoutQty;
    const finalTotal = Math.max(0, subtotal - currentDiscountAmount);

    document.getElementById('checkout-subtotal').textContent = dinhDangTien(subtotal);
    
    const rowDisc = document.getElementById('row-discount');
    const discEl = document.getElementById('checkout-discount');
    if (currentDiscountAmount > 0) {
        if (rowDisc) rowDisc.style.display = 'flex';
        if (discEl) discEl.textContent = `-${dinhDangTien(currentDiscountAmount)}`;
    } else {
        if (rowDisc) rowDisc.style.display = 'none';
    }

    document.getElementById('checkout-final-total').textContent = dinhDangTien(finalTotal);
}

function xacNhanDatHangSubmit(e) {
    e.preventDefault();
    if (!currentCheckoutProduct) return;

    const hoTen = document.getElementById('checkout-name').value.trim();
    const sdt = document.getElementById('checkout-phone').value.trim();
    const diaChi = document.getElementById('checkout-address').value.trim();
    const ghiChu = document.getElementById('checkout-note').value.trim();

    if (!hoTen || !sdt || !diaChi) {
        alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!');
        return;
    }

    const subtotal = currentCheckoutProduct.gia * currentCheckoutQty;
    const tongTien = Math.max(0, subtotal - currentDiscountAmount);

    const thongTinDonMoi = {
        khachHang: {
            hoTen,
            sdt,
            diaChi,
            ghiChu: ghiChu || (currentDiscountAmount > 0 ? 'Có áp dụng voucher ưu đãi' : '')
        },
        phuongThucThanhToan: currentPaymentMethod,
        sanPham: [
            {
                id: currentCheckoutProduct.id,
                ten: currentCheckoutProduct.ten,
                dungTich: currentCheckoutProduct.dungTich || '100ml | Full Box Chính Hãng',
                soLuong: currentCheckoutQty,
                donGia: currentCheckoutProduct.gia,
                hinhAnh: currentCheckoutProduct.hinhAnh
            }
        ],
        tamTinh: subtotal,
        phiVanChuyen: 0,
        tongTien: tongTien
    };

    const donDaTao = taoDonHangMoi(thongTinDonMoi);

    // Đóng modal checkout
    dongModalDatHang();

    // Mở modal thành công
    hienThiModalThanhCong(donDaTao);
}

function hienThiModalThanhCong(don) {
    damBaoModalThanhCongTonTai();

    document.getElementById('success-order-id').textContent = '#' + don.maDon;
    document.getElementById('success-cust-name').textContent = don.khachHang.hoTen;
    document.getElementById('success-cust-phone').textContent = don.khachHang.sdt;
    document.getElementById('success-order-total').textContent = dinhDangTien(don.tongTien);
    document.getElementById('success-order-pay').textContent = don.phuongThucThanhToan;

    const overlay = document.getElementById('modal-thanh-cong-box');
    if (overlay) {
        overlay.classList.add('hien-thi');
    }
}

function dongModalThanhCong() {
    const overlay = document.getElementById('modal-thanh-cong-box');
    if (overlay) {
        overlay.classList.remove('hien-thi');
    }
}

function dongModalThanhCongNgoai(e) {
    if (e.target.id === 'modal-thanh-cong-box') {
        dongModalThanhCong();
    }
}

function datHangTuModalChiTiet() {
    if (!currentDetailProductId) return;
    const qty = parseInt(document.getElementById('detail-modal-qty')?.value) || 1;
    moModalDatHang(currentDetailProductId, qty);
}

function datHangNhanh(productId) {
    moModalDatHang(productId, 1);
}


// --------------------------------------------------------------------------
// 6. HIỂN THỊ ĐƠN HÀNG TẠI TRANG ĐƠN HÀNG
// --------------------------------------------------------------------------
function caiDatBoLocDonHangUser() {
    const filterButtons = document.querySelectorAll('.bo-loc');
    filterButtons.forEach((btn, index) => {
        const statusMap = ['tat-ca', 'cho-xac-nhan', 'dang-giao', 'hoan-thanh', 'da-huy'];
        const status = statusMap[index] || 'tat-ca';
        btn.setAttribute('data-status', status);

        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            hienThiDanhSachDonHangUser(status);
        });
    });
}

function hienThiDanhSachDonHangUser(trangThaiLoc = 'tat-ca') {
    const orders = getDanhSachDonHang();
    const stats = tinhToanThongKe();

    const oThongKe = document.querySelectorAll('.o-thong-ke strong');
    if (oThongKe.length >= 4) {
        oThongKe[0].textContent = stats.tongDonHang;
        oThongKe[1].textContent = stats.donChoXacNhan;
        oThongKe[2].textContent = stats.donDangGiao;
        oThongKe[3].textContent = stats.donHoanThanh;
    }

    const filteredOrders = orders.filter(o => {
        if (trangThaiLoc === 'tat-ca') return true;
        return o.trangThai === trangThaiLoc;
    });

    let container = document.getElementById('danh-sach-don-hang-container');
    if (!container) {
        const filterBox = document.querySelector('.bo-loc-don-hang');
        if (filterBox) {
            const oldOrders = document.querySelectorAll('.khu-vuc-don-hang .don-hang');
            oldOrders.forEach(o => o.remove());

            container = document.createElement('div');
            container.id = 'danh-sach-don-hang-container';
            filterBox.parentNode.insertBefore(container, filterBox.nextSibling);
        }
    }

    if (!container) return;

    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; background: rgba(16, 43, 64, 0.8); border: 1px solid #31536b; border-radius: 20px; margin-top: 20px;">
                <p style="font-size: 32px; margin: 0 0 10px;">📦</p>
                <h3 style="color: #dfc46a; margin: 0 0 8px;">Chưa có đơn hàng nào</h3>
                <p style="color: #ffffff; opacity: 0.7; font-size: 14px;">Không tìm thấy đơn hàng trong mục này.</p>
                <a href="trang-san-pham.html" style="display: inline-block; margin-top: 15px; background: #dfc46a; color: #102b40; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">Khám Phá Nước Hoa Ngay</a>
            </div>
        `;
        return;
    }

    let html = '';
    filteredOrders.forEach(o => {
        const infoTT = getThongTinTrangThai(o.trangThai);
        
        let sanPhamHtml = '';
        o.sanPham.forEach(sp => {
            sanPhamHtml += `
                <div class="san-pham-trong-don">
                    <img src="${sp.hinhAnh || FALLBACK_PERFUME_IMG}" alt="${sp.ten}" onerror="this.src=FALLBACK_PERFUME_IMG" onclick="moModalChiTietSanPham('${sp.id}')" style="cursor: pointer;">
                    <div class="thong-tin-san-pham-don">
                        <h2 onclick="moModalChiTietSanPham('${sp.id}')" style="cursor: pointer;">${sp.ten}</h2>
                        <p>${sp.dungTich || '100ml | Full Box Chính Hãng'}</p>
                        <p>Số lượng: x${sp.soLuong}</p>
                        <strong>${dinhDangTien(sp.donGia * sp.soLuong)}</strong>
                    </div>
                </div>
            `;
        });

        let btnHuyHtml = '';
        if (o.trangThai === 'cho-xac-nhan') {
            btnHuyHtml = `<button class="nut-huy-don" onclick="huyDonHangUser('${o.maDon}')">Hủy đơn hàng</button>`;
        }

        html += `
            <div class="don-hang">
                <div class="dau-don-hang">
                    <div>
                        <strong class="ma-don">#${o.maDon}</strong>
                        <span class="ngay-dat">${o.ngayDat}</span>
                    </div>
                    <span class="trang-thai ${infoTT.class}">
                        ${infoTT.icon} ${infoTT.text}
                    </span>
                </div>

                ${sanPhamHtml}

                <div class="tong-don-hang">
                    <span>Tổng thanh toán:</span>
                    <strong>${dinhDangTien(o.tongTien)}</strong>
                </div>

                <div class="nut-don-hang">
                    <button class="nut-xem-chi-tiet" onclick="xemChiTietDonUser('${o.maDon}')">
                        Xem chi tiết đơn
                    </button>
                    ${btnHuyHtml}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function huyDonHangUser(maDon) {
    const xacNhan = confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${maDon} không?`);
    if (!xacNhan) return;

    capNhatTrangThaiDonHang(maDon, 'da-huy');
    alert(`Đơn hàng #${maDon} đã được hủy thành công!`);
    const activeBtn = document.querySelector('.bo-loc.active');
    const status = activeBtn ? activeBtn.getAttribute('data-status') || 'tat-ca' : 'tat-ca';
    hienThiDanhSachDonHangUser(status);
}

function damBaoModalDonHangUserTonTai() {
    if (document.getElementById('modal-chi-tiet-don-hang-box')) return;

    const modalHtml = `
        <div id="modal-chi-tiet-don-hang-box" class="modal-don-hang-overlay" onclick="dongModalDonHangUserNgoai(event)">
            <div class="modal-don-hang-box" onclick="event.stopPropagation()">
                
                <div class="modal-don-hang-header">
                    <h3 id="user-modal-order-title">📦 Chi Tiết Đơn Hàng</h3>
                    <button class="modal-don-hang-dong" onclick="dongModalChiTietDonHangUser()" title="Đóng">✕</button>
                </div>

                <div class="modal-don-hang-body">
                    
                    <!-- HÀNH TRÌNH ĐƠN HÀNG (TIMELINE) -->
                    <div id="user-modal-tracking" class="order-tracking-timeline">
                        <!-- Render timeline qua JS -->
                    </div>

                    <!-- 2 HỘP THÔNG TIN GIAO NHẬN & THANH TOÁN -->
                    <div class="modal-order-grid-info">
                        
                        <div class="modal-info-card">
                            <h4>👤 Thông Tin Người Nhận</h4>
                            <div class="modal-info-card-row">
                                <span>Người nhận:</span>
                                <strong id="user-modal-cust-name" style="color: #ffffff;"></strong>
                            </div>
                            <div class="modal-info-card-row">
                                <span>Số điện thoại:</span>
                                <span id="user-modal-cust-phone"></span>
                            </div>
                            <div class="modal-info-card-row">
                                <span>Địa chỉ:</span>
                                <span id="user-modal-cust-address" style="text-align: right; max-width: 60%;"></span>
                            </div>
                            <div class="modal-info-card-row">
                                <span>Ghi chú:</span>
                                <span id="user-modal-cust-note" style="font-style: italic; color: #dfc46a;"></span>
                            </div>
                        </div>

                        <div class="modal-info-card">
                            <h4>📋 Chi Tiết Giao Dịch</h4>
                            <div class="modal-info-card-row">
                                <span>Mã đơn:</span>
                                <strong id="user-modal-order-code" style="color: #dfc46a;"></strong>
                            </div>
                            <div class="modal-info-card-row">
                                <span>Thời gian đặt:</span>
                                <span id="user-modal-order-date"></span>
                            </div>
                            <div class="modal-info-card-row">
                                <span>Trạng thái:</span>
                                <span id="user-modal-order-status-badge"></span>
                            </div>
                            <div class="modal-info-card-row">
                                <span>Thanh toán:</span>
                                <span id="user-modal-order-payment"></span>
                            </div>
                        </div>

                    </div>

                    <!-- DANH SÁCH SẢN PHẨM -->
                    <div class="modal-order-items-box">
                        <h4>🧴 Danh Sách Nước Hoa Đặt Mua</h4>
                        <div id="user-modal-order-items">
                            <!-- Render bằng JS -->
                        </div>

                        <!-- TỔNG KẾT TIỀN -->
                        <div class="modal-order-pricing">
                            <div class="modal-pricing-row">
                                <span>Tạm tính tiền hàng:</span>
                                <span id="user-modal-subtotal"></span>
                            </div>
                            <div class="modal-pricing-row">
                                <span>Phí vận chuyển:</span>
                                <span style="color: #52b788; font-weight: bold;">Miễn phí (Freeship)</span>
                            </div>
                            <div class="modal-pricing-row total">
                                <strong>Tổng tiền thanh toán:</strong>
                                <strong id="user-modal-total"></strong>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="modal-don-hang-footer" id="user-modal-footer">
                    <!-- Render nút thao tác qua JS -->
                </div>

            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

let currentUserViewingOrderId = null;

function xemChiTietDonUser(maDon) {
    damBaoModalDonHangUserTonTai();
    const don = getDonHangTheoMa(maDon);
    if (!don) return;

    currentUserViewingOrderId = maDon;
    const infoTT = getThongTinTrangThai(don.trangThai);

    // Tiêu đề & Thông tin cơ bản
    document.getElementById('user-modal-order-title').innerHTML = `📦 Đơn Hàng <span style="color: #dfc46a;">#${don.maDon}</span>`;
    document.getElementById('user-modal-order-code').textContent = '#' + don.maDon;
    document.getElementById('user-modal-order-date').textContent = don.ngayDat;
    document.getElementById('user-modal-order-payment').textContent = don.phuongThucThanhToan || 'COD - Thanh toán khi nhận hàng';
    document.getElementById('user-modal-order-status-badge').innerHTML = `<span class="trang-thai ${infoTT.class}">${infoTT.icon} ${infoTT.text}</span>`;

    // Thông tin người nhận
    document.getElementById('user-modal-cust-name').textContent = don.khachHang.hoTen;
    document.getElementById('user-modal-cust-phone').textContent = don.khachHang.sdt;
    document.getElementById('user-modal-cust-address').textContent = don.khachHang.diaChi;
    document.getElementById('user-modal-cust-note').textContent = don.khachHang.ghiChu || '(Không có ghi chú)';

    // Timeline tiến độ đơn hàng
    const timelineEl = document.getElementById('user-modal-tracking');
    if (don.trangThai === 'da-huy') {
        timelineEl.innerHTML = `
            <div style="width: 100%; text-align: center; background: rgba(230, 57, 70, 0.15); border: 1px solid rgba(230, 57, 70, 0.4); border-radius: 12px; padding: 14px; color: #ff7777;">
                <strong>❌ Đơn hàng này đã bị hủy</strong>
                <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Nếu bạn muốn mua lại, vui lòng chọn lại sản phẩm và bấm Đặt Hàng.</p>
            </div>
        `;
    } else {
        const isStep1 = true;
        const isStep2 = don.trangThai === 'cho-xac-nhan' || don.trangThai === 'dang-giao' || don.trangThai === 'hoan-thanh';
        const isStep3 = don.trangThai === 'dang-giao' || don.trangThai === 'hoan-thanh';
        const isStep4 = don.trangThai === 'hoan-thanh';

        timelineEl.innerHTML = `
            <div class="tracking-step ${isStep1 ? 'active' : ''}">
                <div class="tracking-step-circle">📝</div>
                <div class="tracking-step-label">Đặt Hàng</div>
            </div>
            <div class="tracking-step ${isStep2 ? 'active' : ''}">
                <div class="tracking-step-circle">📦</div>
                <div class="tracking-step-label">Chuẩn Bị Hàng</div>
            </div>
            <div class="tracking-step ${isStep3 ? 'active' : ''}">
                <div class="tracking-step-circle">🚚</div>
                <div class="tracking-step-label">Đang Vận Chuyển</div>
            </div>
            <div class="tracking-step ${isStep4 ? 'active' : ''}">
                <div class="tracking-step-circle">🎉</div>
                <div class="tracking-step-label">Đã Giao Thành Công</div>
            </div>
        `;
    }

    // Danh sách mặt hàng
    const itemsEl = document.getElementById('user-modal-order-items');
    let itemsHtml = '';
    don.sanPham.forEach(sp => {
        itemsHtml += `
            <div class="modal-item-row">
                <img src="${sp.hinhAnh || FALLBACK_PERFUME_IMG}" alt="${sp.ten}" class="modal-item-img" onerror="this.src=FALLBACK_PERFUME_IMG">
                <div class="modal-item-info">
                    <h5>${sp.ten}</h5>
                    <p>${sp.dungTich || '100ml | Full Box Chính Hãng'} • Số lượng: <strong style="color: #dfc46a;">x${sp.soLuong}</strong></p>
                </div>
                <div class="modal-item-price">${dinhDangTien(sp.donGia * sp.soLuong)}</div>
            </div>
        `;
    });
    itemsEl.innerHTML = itemsHtml;

    // Tổng tiền
    document.getElementById('user-modal-subtotal').textContent = dinhDangTien(don.tamTinh);
    document.getElementById('user-modal-total').textContent = dinhDangTien(don.tongTien);

    // Nút chân modal
    const footerEl = document.getElementById('user-modal-footer');
    let footerBtns = '';
    if (don.trangThai === 'cho-xac-nhan') {
        footerBtns += `<button class="modal-btn-huy-don" onclick="huyDonTuModalUser('${don.maDon}')">❌ Hủy Đơn Hàng Này</button>`;
    }
    footerBtns += `<button class="modal-btn-dong" onclick="dongModalChiTietDonHangUser()">Đóng</button>`;
    footerEl.innerHTML = footerBtns;

    // Mở modal
    const modalBox = document.getElementById('modal-chi-tiet-don-hang-box');
    if (modalBox) {
        modalBox.classList.add('hien-thi');
    }
}

function dongModalChiTietDonHangUser() {
    const modalBox = document.getElementById('modal-chi-tiet-don-hang-box');
    if (modalBox) {
        modalBox.classList.remove('hien-thi');
    }
}

function dongModalDonHangUserNgoai(e) {
    if (e.target.id === 'modal-chi-tiet-don-hang-box') {
        dongModalChiTietDonHangUser();
    }
}

function huyDonTuModalUser(maDon) {
    const xacNhan = confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${maDon} không?`);
    if (!xacNhan) return;

    capNhatTrangThaiDonHang(maDon, 'da-huy');
    dongModalChiTietDonHangUser();
    alert(`Đơn hàng #${maDon} đã được hủy thành công!`);

    const activeBtn = document.querySelector('.bo-loc.active');
    const status = activeBtn ? activeBtn.getAttribute('data-status') || 'tat-ca' : 'tat-ca';
    hienThiDanhSachDonHangUser(status);
}