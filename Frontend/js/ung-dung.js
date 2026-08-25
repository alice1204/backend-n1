/* ==========================================================================
   XỬ LÝ GIAO DIỆN KHÁCH HÀNG, TÌM KIẾM THỜI GIAN THỰC & AUTH - LUXURY STORE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    khoiTaoThanhDauTrang();
    khoiTaoTrangKhachHang();
    damBaoModalChiTietTonTai();
    damBaoModalAuthTonTai();
});

// --------------------------------------------------------------------------
// 0. KHỞI TẠO THANH ĐẦU TRANG (HEADER), MENU ĐIỀU HƯỚNG & THANH TÌM KIẾM
// --------------------------------------------------------------------------
function khoiTaoThanhDauTrang() {
    capNhatGiaoDienHeader();
    caiDatThanhTimKiemHeader();

    // Lắng nghe thay đổi trạng thái đăng nhập
    window.addEventListener('luxury_auth_changed', () => {
        capNhatGiaoDienHeader();
        if (document.querySelector('.khu-vuc-don-hang')) {
            hienThiDanhSachDonHangUser('tat-ca');
        }
    });
}

function capNhatGiaoDienHeader() {
    const user = getNguoiDungHienTai();
    const taiKhoanBoxes = document.querySelectorAll('.tai-khoan');
    const navs = document.querySelectorAll('.thanh-dieu-huong');

    // Cập nhật thanh điều hướng
    navs.forEach(nav => {
        const path = window.location.pathname;
        const isTrangChu = path.includes('trang-chu') || path.endsWith('/') || path.endsWith('index.html');
        const isTrangSP = path.includes('trang-san-pham');
        const isTrangDon = path.includes('trang-don-hang');
        const isTrangAdmin = path.includes('trang-quan-tri');

        let linksHtml = `
            <a href="trang-chu.html" class="${isTrangChu ? 'active' : ''}">Trang Chủ</a>
            <a href="trang-san-pham.html" class="${isTrangSP ? 'active' : ''}">Sản Phẩm</a>
            <a href="trang-don-hang.html" class="${isTrangDon ? 'active' : ''}">Đơn Hàng</a>
        `;

        if (user && user.role === 'admin') {
            linksHtml += `<a href="trang-quan-tri.html" class="${isTrangAdmin ? 'active' : ''}" style="color: #be185d; font-weight: bold;">👑 Quản Trị</a>`;
        }

        nav.innerHTML = linksHtml;
    });

    // Cập nhật ô tài khoản
    taiKhoanBoxes.forEach(box => {
        if (!user) {
            box.innerHTML = `
                <button class="nut-auth-header" onclick="moModalAuth('login')">
                    <span>👤</span>
                    <span>Đăng Nhập / Đăng Ký</span>
                </button>
            `;
        } else if (user.role === 'admin') {
            box.innerHTML = `
                <div class="user-header-menu">
                    <button class="user-header-btn admin-btn" onclick="toggleUserDropdown(event)">
                        <span>👑 Quản Trị: <strong>${user.username}</strong></span>
                        <span style="font-size: 10px;">▼</span>
                    </button>
                    <div class="user-dropdown-menu" id="header-user-dropdown">
                        <div class="dropdown-user-info">
                            <strong>${user.hoTen}</strong>
                            <small>Quản Trị Viên Hệ Thống</small>
                        </div>
                        <a href="trang-quan-tri.html">📊 Bảng Quản Trị (Admin)</a>
                        <a href="trang-don-hang.html">📦 Xem Đơn Hàng</a>
                        <button onclick="thucHienDangXuat()">🚪 Đăng Xuất</button>
                    </div>
                </div>
            `;
        } else {
            box.innerHTML = `
                <div class="user-header-menu">
                    <button class="user-header-btn" onclick="toggleUserDropdown(event)">
                        <span>👤 <strong>${user.hoTen || user.username}</strong></span>
                        <span style="font-size: 10px;">▼</span>
                    </button>
                    <div class="user-dropdown-menu" id="header-user-dropdown">
                        <div class="dropdown-user-info">
                            <strong>${user.hoTen}</strong>
                            <small>${user.email || user.username}</small>
                        </div>
                        <a href="trang-don-hang.html">📦 Đơn Hàng Của Tôi</a>
                        <a href="trang-san-pham.html">🛍️ Mua Sắm Nước Hoa</a>
                        <button onclick="thucHienDangXuat()">🚪 Đăng Xuất</button>
                    </div>
                </div>
            `;
        }
    });
}

function toggleUserDropdown(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('header-user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

document.addEventListener('click', () => {
    const dropdown = document.getElementById('header-user-dropdown');
    if (dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});

function thucHienDangXuat() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
        dangXuat();
        alert('Đã đăng xuất thành công!');
        if (window.location.pathname.includes('trang-quan-tri')) {
            window.location.href = 'trang-chu.html';
        } else {
            window.location.reload();
        }
    }
}

// Cài đặt sự kiện cho thanh tìm kiếm Header
function caiDatThanhTimKiemHeader() {
    const searchInput = document.getElementById('header-search-input');
    const searchDropdown = document.getElementById('header-search-dropdown');
    if (!searchInput) return;

    // Nếu đang ở trang sản phẩm, lấy query param nếu có
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
        searchInput.value = q;
        if (document.querySelector('.khu-vuc-san-pham')) {
            locSanPham();
        }
    }

    searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.trim();

        // Nếu đang ở trang sản phẩm: Lọc trực tiếp danh sách sản phẩm trên trang
        if (document.querySelector('.khu-vuc-san-pham')) {
            locSanPham();
            if (searchDropdown) searchDropdown.classList.remove('show');
            return;
        }

        // Nếu đang ở trang khác: Hiện dropdown kết quả nhanh khi gõ
        if (!searchDropdown) return;

        if (!keyword) {
            searchDropdown.classList.remove('show');
            return;
        }

        const allProds = getDanhSachSanPham();
        const matches = allProds.filter(p => khopTuKhoaSanPham(p, keyword)).slice(0, 5);

        if (matches.length === 0) {
            searchDropdown.innerHTML = `
                <div class="search-drop-empty">
                    Không tìm thấy nước hoa nào khớp với "<strong>${keyword}</strong>"
                </div>
            `;
        } else {
            let html = '<div class="search-drop-header">Gợi ý sản phẩm phù hợp:</div>';
            matches.forEach(p => {
                html += `
                    <div class="search-drop-item" onclick="moModalChiTietSanPham('${p.id}')">
                        <img src="${p.hinhAnh || FALLBACK_PERFUME_IMG}" alt="${p.ten}" onerror="this.src=FALLBACK_PERFUME_IMG">
                        <div class="search-drop-info">
                            <div class="search-drop-title">${p.ten}</div>
                            <div class="search-drop-meta">${p.danhMucTen || p.danhMuc} • ${p.dungTich || '100ml'}</div>
                            <div class="search-drop-price">${dinhDangTien(p.gia)}</div>
                        </div>
                    </div>
                `;
            });
            html += `
                <a href="trang-san-pham.html?q=${encodeURIComponent(keyword)}" class="search-drop-view-all">
                    Xem tất cả kết quả cho "${keyword}" →
                </a>
            `;
            searchDropdown.innerHTML = html;
        }

        searchDropdown.classList.add('show');
    });

    // Bấm Enter để tìm kiếm
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const kw = searchInput.value.trim();
            if (!document.querySelector('.khu-vuc-san-pham')) {
                window.location.href = `trang-san-pham.html?q=${encodeURIComponent(kw)}`;
            } else {
                locSanPham();
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (searchDropdown && !searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.classList.remove('show');
        }
    });
}

// --------------------------------------------------------------------------
// 1. KHỞI TẠO TRANG KHÁCH HÀNG & SỰ KIỆN DỮ LIỆU
// --------------------------------------------------------------------------
function khoiTaoTrangKhachHang() {
    // Nếu đang ở Trang Chủ
    if (document.querySelector('.gioi-thieu')) {
        hienThiSanPhamTrangChu();
    }

    // Nếu đang ở Trang Sản Phẩm
    if (document.querySelector('.khu-vuc-san-pham')) {
        locSanPham();
    }

    // Nếu đang ở Trang Đơn Hàng
    if (document.querySelector('.khu-vuc-don-hang')) {
        hienThiDanhSachDonHangUser('tat-ca');
        caiDatBoLocDonHangUser();
    }

    // Lắng nghe sự kiện cập nhật dữ liệu từ Admin
    window.addEventListener('luxury_products_updated', () => {
        if (document.querySelector('.gioi-thieu')) hienThiSanPhamTrangChu();
        if (document.querySelector('.khu-vuc-san-pham')) locSanPham();
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
// 2. PHÂN LOẠI & HIỂN THỊ SẢN PHẨM TRANG CHỦ
// --------------------------------------------------------------------------
let currentHomeCategory = 'tat-ca';

function chonDanhMucTrangChu(danhMuc, elBtn) {
    currentHomeCategory = danhMuc;
    document.querySelectorAll('.tab-danh-muc-btn').forEach(btn => btn.classList.remove('active'));
    if (elBtn) {
        elBtn.classList.add('active');
    }
    hienThiSanPhamTrangChu();
}

function hienThiSanPhamTrangChu() {
    const container = document.getElementById("danh-sach-san-pham");
    if (!container) return;

    const products = getDanhSachSanPham();
    let displayList = products;

    if (currentHomeCategory === 'nam') {
        displayList = products.filter(p => p.danhMuc === 'nam');
    } else if (currentHomeCategory === 'nu') {
        displayList = products.filter(p => p.danhMuc === 'nu');
    } else if (currentHomeCategory === 'unisex') {
        displayList = products.filter(p => p.danhMuc === 'unisex');
    } else if (currentHomeCategory === 'khuyen-mai') {
        displayList = products.filter(p => p.danhMuc === 'khuyen-mai' || p.gia < 3000000);
    } else {
        // 'tat-ca' -> Hiển thị tất cả sản phẩm
        displayList = products;
    }

    renderCardsTrangChu(displayList, container);
}

function renderCardsTrangChu(list, container) {
    if (list.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
                <p style="font-size: 32px; margin: 0 0 10px;">📦</p>
                <h3 style="color: #0f172a; margin-bottom: 6px;">Chưa có sản phẩm nào trong danh mục này</h3>
                <p style="font-size: 14px; color: #64748b;">Vui lòng chọn danh mục khác để khám phá mùi hương.</p>
            </div>
        `;
        return;
    }

    let html = '';
    list.forEach(sp => {
        html += `
            <div class="the-san-pham">
                <div class="anh-wrap" onclick="moModalChiTietSanPham('${sp.id}')">
                    <img src="${sp.hinhAnh}" alt="${sp.ten}" class="anh-san-pham" onerror="this.src=FALLBACK_PERFUME_IMG">
                    <span class="badge-danh-muc">${sp.danhMucTen || sp.danhMuc}</span>
                </div>
                <div class="thong-tin-san-pham">
                    <h3 title="${sp.ten}" onclick="moModalChiTietSanPham('${sp.id}')" style="cursor: pointer;">${sp.ten}</h3>
                    <p class="thuong-hieu-sp">Thương hiệu: <strong>${sp.thuongHieuTen || sp.thuongHieu}</strong> • ${sp.dungTich || '100ml'}</p>
                    <p class="gia-san-pham">${dinhDangTien(sp.gia)}</p>
                    
                    <div class="nut-card-group">
                        <button class="nut-dat-hang" onclick="datHangNhanh('${sp.id}')">
                            MUA NGAY
                        </button>
                        <button class="nut-xem-nhanh" onclick="moModalChiTietSanPham('${sp.id}')" title="Xem chi tiết">
                            👁️
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// --------------------------------------------------------------------------
// 3. HIỂN THỊ & BỘ LỌC TRANG SẢN PHẨM (SHOP)
// --------------------------------------------------------------------------
let currentShopCategoryPill = 'all';

function chonTabPillShop(danhMuc, elBtn) {
    currentShopCategoryPill = danhMuc;
    document.querySelectorAll('.shop-pill-btn').forEach(b => b.classList.remove('active'));
    if (elBtn) elBtn.classList.add('active');

    // Cập nhật checkbox giới tính tương ứng
    document.querySelectorAll('input[name="gioi-tinh"]').forEach(cb => {
        if (danhMuc === 'all') {
            cb.checked = false;
        } else {
            cb.checked = (cb.value === danhMuc);
        }
    });

    locSanPham();
}

function locSanPham() {
    const allProducts = getDanhSachSanPham();
    
    // Lấy từ khóa từ thanh tìm kiếm Header
    const searchInput = document.getElementById("header-search-input");
    const keyword = (searchInput ? searchInput.value : '').trim();

    const selectedGenders = Array.from(document.querySelectorAll('input[name="gioi-tinh"]:checked')).map(cb => cb.value);
    const selectedBrands = Array.from(document.querySelectorAll('input[name="thuong-hieu"]:checked')).map(cb => cb.value);
    const selectedPrice = document.querySelector('input[name="khoang-gia"]:checked')?.value;

    const filtered = allProducts.filter(sp => {
        // Khớp từ khóa tìm kiếm tiếng Việt gần giống nhất (Fuzzy match)
        const matchKeyword = khopTuKhoaSanPham(sp, keyword);
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

    hienThiDanhSachSanPhamShop(filtered, keyword);
}

function hienThiDanhSachSanPhamShop(products, keyword = '') {
    const container = document.getElementById("danh-sach-san-pham");
    const countEl = document.getElementById("so-luong-san-pham");
    if (!container) return;

    if (countEl) {
        let text = `Hiển thị ${products.length} sản phẩm`;
        if (keyword) {
            text += ` khớp với "${keyword}"`;
        }
        countEl.textContent = text;
    }

    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: #475569; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.04);">
                <p style="font-size: 36px; margin-bottom: 10px;">🔍</p>
                <h3 style="margin-bottom: 8px; color: #0f172a;">Không tìm thấy sản phẩm nước hoa phù hợp</h3>
                <p style="color: #64748b; font-size: 14px;">
                    ${keyword ? `Không có mẫu nước hoa nào khớp với từ khóa "<strong>${keyword}</strong>".` : 'Không có sản phẩm nào phù hợp với bộ lọc đã chọn.'}
                </p>
                <button onclick="xoaBoLocSanPham()" style="margin-top: 15px; padding: 10px 22px; background: #0f172a; color: #ffffff; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
                    🔄 Đặt Lại Bộ Lọc & Tìm Kiếm
                </button>
            </div>
        `;
        return;
    }

    let html = '';
    products.forEach(sp => {
        html += `
            <div class="san-pham">
                <div class="anh-wrap" onclick="moModalChiTietSanPham('${sp.id}')">
                    <img src="${sp.hinhAnh}" alt="${sp.ten}" onerror="this.src=FALLBACK_PERFUME_IMG" style="cursor: pointer;">
                    <span class="badge-danh-muc">${sp.danhMucTen || sp.danhMuc}</span>
                </div>
                <div class="thong-tin-san-pham">
                    <h3 class="ten-san-pham" onclick="moModalChiTietSanPham('${sp.id}')" style="cursor: pointer;">${sp.ten}</h3>
                    <p class="danh-muc-san-pham">Hãng: <strong>${sp.thuongHieuTen || sp.thuongHieu}</strong> • ${sp.dungTich || '100ml'}</p>
                    <p class="gia-san-pham">${dinhDangTien(sp.gia)}</p>
                    
                    <div class="nut-card-group">
                        <button class="nut-dat-hang" onclick="datHangNhanh('${sp.id}')">
                            MUA NGAY
                        </button>
                        <button class="nut-xem-nhanh" onclick="moModalChiTietSanPham('${sp.id}')" title="Xem chi tiết">
                            👁️
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function xoaBoLocSanPham() {
    const searchInput = document.getElementById("header-search-input");
    if (searchInput) searchInput.value = '';

    document.querySelectorAll('input[name="gioi-tinh"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="thuong-hieu"]').forEach(cb => cb.checked = false);
    const radioAll = document.querySelector('input[name="khoang-gia"][value="all"]');
    if (radioAll) radioAll.checked = true;

    document.querySelectorAll('.shop-pill-btn').forEach(b => b.classList.remove('active'));
    const allPill = document.querySelector('.shop-pill-btn[data-pill="all"]');
    if (allPill) allPill.classList.add('active');

    locSanPham();
}

// --------------------------------------------------------------------------
// 4. MODAL ĐĂNG NHẬP / ĐĂNG KÝ TỐI GIẢN (AUTH)
// --------------------------------------------------------------------------
let currentAuthMode = 'login'; // 'login' hoặc 'register'

function damBaoModalAuthTonTai() {
    if (document.getElementById('modal-auth-box')) return;

    const modalHtml = `
        <div id="modal-auth-box" class="modal-auth-overlay" onclick="dongModalAuthNgoai(event)">
            <div class="modal-auth-box" onclick="event.stopPropagation()">
                <button class="modal-auth-close" onclick="dongModalAuth()" title="Đóng">✕</button>
                
                <div class="modal-auth-header">
                    <div class="auth-brand-logo">LUXURY PERFUME</div>
                    <h3 id="auth-modal-title" style="margin: 0; font-size: 18px; color: #0f172a; font-weight: 800;">ĐĂNG NHẬP</h3>
                </div>

                <div class="modal-auth-body">
                    
                    <!-- FORM ĐĂNG NHẬP -->
                    <form id="form-auth-login" class="auth-form active" onsubmit="xuLyDangNhapSubmit(event)">
                        <div class="auth-form-desc">
                            Đăng nhập để theo dõi đơn hàng, lưu thông tin giao nhận và mua sắm nhanh chóng.
                        </div>

                        <div class="auth-input-group">
                            <label>Tên đăng nhập hoặc Email *</label>
                            <input type="text" id="auth-login-username" class="auth-input" required placeholder="Nhập tài khoản của bạn">
                        </div>

                        <div class="auth-input-group">
                            <label>Mật khẩu *</label>
                            <input type="password" id="auth-login-password" class="auth-input" required placeholder="Nhập mật khẩu">
                        </div>

                        <div id="auth-login-error" class="auth-error-msg" style="display: none;"></div>

                        <button type="submit" class="btn-auth-submit">
                            <span>🔑</span>
                            <span>ĐĂNG NHẬP</span>
                        </button>

                        <div class="auth-switch-text">
                            Chưa có tài khoản? <a href="javascript:void(0)" onclick="chuyenAuthMode('register')">Đăng ký tài khoản mới ngay</a>
                        </div>
                    </form>

                    <!-- FORM ĐĂNG KÝ (AUTO ROLE USER) -->
                    <form id="form-auth-register" class="auth-form" onsubmit="xuLyDangKySubmit(event)">
                        <div class="auth-form-desc">
                            Tạo tài khoản khách hàng để trải nghiệm mua sắm nước hoa chính hãng cao cấp.
                        </div>

                        <div class="auth-grid-2">
                            <div class="auth-input-group">
                                <label>Họ và tên *</label>
                                <input type="text" id="reg-fullname" class="auth-input" required placeholder="VD: Nguyễn Văn A">
                            </div>

                            <div class="auth-input-group">
                                <label>Tên đăng nhập *</label>
                                <input type="text" id="reg-username" class="auth-input" required placeholder="VD: nguyenvana">
                            </div>
                        </div>

                        <div class="auth-grid-2">
                            <div class="auth-input-group">
                                <label>Số điện thoại *</label>
                                <input type="tel" id="reg-phone" class="auth-input" required placeholder="VD: 0912345678">
                            </div>

                            <div class="auth-input-group">
                                <label>Email</label>
                                <input type="email" id="reg-email" class="auth-input" placeholder="VD: vana@gmail.com">
                            </div>
                        </div>

                        <div class="auth-input-group">
                            <label>Địa chỉ nhận hàng</label>
                            <input type="text" id="reg-address" class="auth-input" placeholder="Số nhà, tên đường, Quận/Huyện, Tỉnh/TP...">
                        </div>

                        <div class="auth-grid-2">
                            <div class="auth-input-group">
                                <label>Mật khẩu (≥ 6 ký tự) *</label>
                                <input type="password" id="reg-password" class="auth-input" required minlength="6" placeholder="Nhập mật khẩu">
                            </div>

                            <div class="auth-input-group">
                                <label>Xác nhận mật khẩu *</label>
                                <input type="password" id="reg-confirm-password" class="auth-input" required minlength="6" placeholder="Nhập lại mật khẩu">
                            </div>
                        </div>

                        <div id="auth-register-error" class="auth-error-msg" style="display: none;"></div>

                        <button type="submit" class="btn-auth-submit">
                            <span>✨</span>
                            <span>HOÀN TẤT ĐĂNG KÝ</span>
                        </button>

                        <div class="auth-switch-text">
                            Đã có tài khoản? <a href="javascript:void(0)" onclick="chuyenAuthMode('login')">Đăng nhập</a>
                        </div>
                    </form>

                </div>

            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function moModalAuth(mode = 'login') {
    damBaoModalAuthTonTai();
    chuyenAuthMode(mode);
    const modal = document.getElementById('modal-auth-box');
    if (modal) {
        modal.classList.add('hien-thi');
    }
}

function dongModalAuth() {
    const modal = document.getElementById('modal-auth-box');
    if (modal) {
        modal.classList.remove('hien-thi');
    }
}

function dongModalAuthNgoai(e) {
    if (e.target.id === 'modal-auth-box') {
        dongModalAuth();
    }
}

function chuyenAuthMode(mode) {
    currentAuthMode = mode;
    damBaoModalAuthTonTai();

    const titleEl = document.getElementById('auth-modal-title');
    const formLogin = document.getElementById('form-auth-login');
    const formRegister = document.getElementById('form-auth-register');

    if (mode === 'login') {
        if (titleEl) titleEl.textContent = 'ĐĂNG NHẬP';
        if (formLogin) formLogin.classList.add('active');
        if (formRegister) formRegister.classList.remove('active');
    } else {
        if (titleEl) titleEl.textContent = 'ĐĂNG KÝ TÀI KHOẢN MỚI';
        if (formLogin) formLogin.classList.remove('active');
        if (formRegister) formRegister.classList.add('active');
    }

    // Xóa các lỗi cũ
    document.querySelectorAll('.auth-error-msg').forEach(el => el.style.display = 'none');
}

function xuLyDangNhapSubmit(e) {
    e.preventDefault();
    const uname = document.getElementById('auth-login-username').value.trim();
    const pass = document.getElementById('auth-login-password').value.trim();
    const errEl = document.getElementById('auth-login-error');

    const res = dangNhap(uname, pass);
    if (res.success) {
        dongModalAuth();
        if (res.redirect) {
            // Tự động chuyển hướng vào trang Admin nếu là tài khoản Admin
            alert(res.message);
            window.location.href = res.redirect;
        } else {
            alert(res.message);
            capNhatGiaoDienHeader();
            if (document.querySelector('.khu-vuc-don-hang')) {
                hienThiDanhSachDonHangUser('tat-ca');
            }
        }
    } else {
        if (errEl) {
            errEl.textContent = res.message;
            errEl.style.display = 'block';
        }
    }
}

function xuLyDangKySubmit(e) {
    e.preventDefault();
    const fullname = document.getElementById('reg-fullname').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const errEl = document.getElementById('auth-register-error');

    if (password !== confirmPassword) {
        if (errEl) {
            errEl.textContent = 'Mật khẩu xác nhận không khớp!';
            errEl.style.display = 'block';
        }
        return;
    }

    const res = dangKy({
        hoTen: fullname,
        username: username,
        password: password,
        sdt: phone,
        email: email,
        diaChi: address
    });

    if (res.success) {
        dongModalAuth();
        alert(`Chúc mừng ${res.user.hoTen} đã đăng ký tài khoản thành công!`);
        capNhatGiaoDienHeader();
    } else {
        if (errEl) {
            errEl.textContent = res.message;
            errEl.style.display = 'block';
        }
    }
}

// --------------------------------------------------------------------------
// 5. MODAL CHI TIẾT SẢN PHẨM LUXURY
// --------------------------------------------------------------------------
let currentDetailProductId = null;

function damBaoModalChiTietTonTai() {
    if (document.getElementById('modal-chi-tiet-box')) return;

    const modalHtml = `
        <div id="modal-chi-tiet-box" class="modal-chi-tiet-overlay" onclick="dongModalChiTietNgoai(event)">
            <div class="modal-chi-tiet-box" onclick="event.stopPropagation()">
                <button class="modal-dong" onclick="dongModalChiTietSanPham()" title="Đóng">✕</button>

                <div class="modal-chi-tiet-grid">
                    <div class="modal-anh-container">
                        <img id="detail-modal-img" src="${FALLBACK_PERFUME_IMG}" alt="Chi tiết nước hoa" onerror="this.src=FALLBACK_PERFUME_IMG">
                    </div>

                    <div class="modal-thong-tin-container">
                        <span id="detail-modal-brand" class="modal-thuong-hieu">DIOR</span>
                        <h2 id="detail-modal-name" class="modal-ten-sp">Dior Sauvage Eau de Parfum</h2>
                        
                        <div class="modal-gia-box">
                            <span id="detail-modal-price" class="modal-gia-chinh">2.950.000 ₫</span>
                            <span class="modal-freeship">Miễn phí giao hàng</span>
                        </div>

                        <div class="modal-meta-box">
                            <div class="modal-meta-item">
                                <span>Dung tích:</span>
                                <strong id="detail-modal-volume">100ml</strong>
                            </div>
                            <div class="modal-meta-item">
                                <span>Phân loại:</span>
                                <strong id="detail-modal-cat">Nước hoa nam</strong>
                            </div>
                            <div class="modal-meta-item">
                                <span>Tình trạng:</span>
                                <strong id="detail-modal-stock" style="color: #10b981;">Còn hàng</strong>
                            </div>
                        </div>

                        <div class="modal-mo-ta-box">
                            <h4>Mô tả mùi hương:</h4>
                            <p id="detail-modal-desc">Hương thơm cao cấp sang trọng...</p>
                        </div>

                        <div class="modal-so-luong-box">
                            <label>Số lượng:</label>
                            <div class="modal-qty-control">
                                <button type="button" onclick="thayDoiSoLuongModalDetail(-1)">-</button>
                                <input type="number" id="detail-modal-qty" value="1" min="1" max="50" readonly>
                                <button type="button" onclick="thayDoiSoLuongModalDetail(1)">+</button>
                            </div>
                        </div>

                        <div class="modal-action-box">
                            <button class="btn-dat-ngay" onclick="datHangTuModalChiTiet()">
                                <span>🛍️</span>
                                <span>MUA NGAY (GIAO TẬN NƠI)</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function moModalChiTietSanPham(productId) {
    damBaoModalChiTietTonTai();
    const sp = getSanPhamTheoId(productId);
    if (!sp) return;

    currentDetailProductId = productId;

    document.getElementById('detail-modal-img').src = sp.hinhAnh || FALLBACK_PERFUME_IMG;
    document.getElementById('detail-modal-brand').textContent = (sp.thuongHieuTen || sp.thuongHieu || 'LUXURY').toUpperCase();
    document.getElementById('detail-modal-name').textContent = sp.ten;
    document.getElementById('detail-modal-price').textContent = dinhDangTien(sp.gia);
    document.getElementById('detail-modal-volume').textContent = sp.dungTich || '100ml Full Box';
    document.getElementById('detail-modal-cat').textContent = sp.danhMucTen || sp.danhMuc;
    document.getElementById('detail-modal-desc').textContent = sp.moTa || 'Sản phẩm nước hoa chính hãng nhập khẩu nguyên seal.';
    
    const stockEl = document.getElementById('detail-modal-stock');
    if (sp.tonKho > 0) {
        stockEl.textContent = `Còn hàng (${sp.tonKho} chai)`;
        stockEl.style.color = '#10b981';
    } else {
        stockEl.textContent = 'Hết hàng tạm thời';
        stockEl.style.color = '#ef4444';
    }

    document.getElementById('detail-modal-qty').value = 1;

    const overlay = document.getElementById('modal-chi-tiet-box');
    if (overlay) {
        overlay.classList.add('hien-thi');
    }
}

function dongModalChiTietSanPham() {
    const overlay = document.getElementById('modal-chi-tiet-box');
    if (overlay) {
        overlay.classList.remove('hien-thi');
    }
}

function dongModalChiTietNgoai(e) {
    if (e.target.id === 'modal-chi-tiet-box') {
        dongModalChiTietSanPham();
    }
}

function thayDoiSoLuongModalDetail(delta) {
    const qtyInput = document.getElementById('detail-modal-qty');
    if (!qtyInput) return;
    let val = parseInt(qtyInput.value) || 1;
    val += delta;
    if (val < 1) val = 1;
    if (val > 50) val = 50;
    qtyInput.value = val;
}

// --------------------------------------------------------------------------
// 6. MODAL ĐẶT HÀNG & CHECKOUT (CHẶN NẾU CHƯA ĐĂNG NHẬP)
// --------------------------------------------------------------------------
let currentCheckoutProduct = null;
let currentCheckoutQty = 1;
let currentDiscountAmount = 0;
let currentPaymentMethod = 'COD - Thanh toán khi nhận hàng';

function damBaoModalDatHangTonTai() {
    if (document.getElementById('modal-dat-hang-box')) return;

    const modalCheckoutHtml = `
        <div id="modal-dat-hang-box" class="modal-checkout-overlay" onclick="dongModalDatHangNgoai(event)">
            <div class="modal-checkout-box" onclick="event.stopPropagation()">
                <button class="modal-checkout-close" onclick="dongModalDatHang()" title="Đóng">✕</button>

                <div class="checkout-header">
                    <h3>🛍️ XÁC NHẬN ĐẶT MUA NƯỚC HOA</h3>
                    <p>Cam kết 100% chính hãng • Kiểm tra hàng trước khi thanh toán</p>
                </div>

                <form id="form-checkout-submit" onsubmit="xacNhanDatHangSubmit(event)">
                    <div class="checkout-grid">
                        
                        <!-- CỘT TRÁI: THÔNG TIN GIAO HÀNG -->
                        <div class="checkout-col-form">
                            <h4>1. Thông Tin Nhận Hàng</h4>
                            
                            <div class="checkout-form-group">
                                <label>Họ và tên người nhận *</label>
                                <input type="text" id="checkout-name" required placeholder="Nhập đầy đủ họ tên">
                            </div>

                            <div class="checkout-form-group">
                                <label>Số điện thoại liên hệ *</label>
                                <input type="tel" id="checkout-phone" required placeholder="Nhập số điện thoại giao hàng">
                            </div>

                            <div class="checkout-form-group">
                                <label>Địa chỉ nhận hàng chi tiết *</label>
                                <input type="text" id="checkout-address" required placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP">
                            </div>

                            <div class="checkout-form-group">
                                <label>Ghi chú đơn hàng (nếu có)</label>
                                <textarea id="checkout-note" rows="2" placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."></textarea>
                            </div>

                            <h4>2. Phương Thức Thanh Toán</h4>
                            <div class="payment-methods-list">
                                <div class="payment-card active" id="pay-cod" onclick="chonPhuongThucThanhToan('COD - Thanh toán khi nhận hàng', 'pay-cod')">
                                    <input type="radio" name="payment-opt" checked>
                                    <div class="pay-info">
                                        <strong>💵 Thanh toán khi nhận hàng (COD)</strong>
                                        <small>Kiểm tra chai nước hoa chính hãng trước khi gửi tiền</small>
                                    </div>
                                </div>

                                <div class="payment-card" id="pay-bank" onclick="chonPhuongThucThanhToan('Chuyển khoản ngân hàng (QR Code)', 'pay-bank')">
                                    <input type="radio" name="payment-opt">
                                    <div class="pay-info">
                                        <strong>💳 Chuyển khoản ngân hàng (Quét mã QR)</strong>
                                        <small>Miễn phí chuyển khoản, xác nhận nhanh 24/7</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CỘT PHẢI: TÓM TẮT ĐƠN HÀNG -->
                        <div class="checkout-col-summary">
                            <h4>3. Sản Phẩm Đặt Mua</h4>

                            <div class="checkout-prod-preview">
                                <img id="checkout-prod-img" src="${FALLBACK_PERFUME_IMG}" alt="Nước hoa" onerror="this.src=FALLBACK_PERFUME_IMG">
                                <div class="prod-info">
                                    <h5 id="checkout-prod-name">Dior Sauvage Eau de Parfum</h5>
                                    <p id="checkout-prod-meta">Nước hoa nam • 100ml</p>
                                    <strong id="checkout-prod-price">2.950.000 ₫</strong>
                                </div>
                            </div>

                            <!-- ĐIỀU CHỈNH SỐ LƯỢNG -->
                            <div class="checkout-qty-row">
                                <span>Số lượng:</span>
                                <div class="modal-qty-control mini">
                                    <button type="button" onclick="capNhatSoLuongCheckout(-1)">-</button>
                                    <input type="number" id="checkout-qty-input" value="1" readonly>
                                    <button type="button" onclick="capNhatSoLuongCheckout(1)">+</button>
                                </div>
                            </div>

                            <!-- MÃ GIẢM GIÁ -->
                            <div class="voucher-box">
                                <div class="voucher-input-group">
                                    <input type="text" id="checkout-voucher-input" placeholder="Mã giảm giá (LUXURY50, VIP10)">
                                    <button type="button" onclick="apDungMaGiamGia()">Áp Dụng</button>
                                </div>
                                <div id="voucher-message" class="voucher-msg"></div>
                            </div>

                            <!-- BẢNG TÍNH TIỀN -->
                            <div class="checkout-pricing-table">
                                <div class="pricing-row">
                                    <span>Tạm tính:</span>
                                    <strong id="checkout-subtotal">2.950.000 ₫</strong>
                                </div>
                                <div class="pricing-row">
                                    <span>Phí vận chuyển:</span>
                                    <strong style="color: #10b981;">MIỄN PHÍ</strong>
                                </div>
                                <div class="pricing-row" id="row-discount" style="display: none;">
                                    <span>Giảm giá ưu đãi:</span>
                                    <strong id="checkout-discount" style="color: #ef4444;">-0 ₫</strong>
                                </div>
                                <div class="pricing-row total">
                                    <span>Tổng thanh toán:</span>
                                    <span id="checkout-final-total">2.950.000 ₫</span>
                                </div>
                            </div>

                            <button type="submit" class="btn-xac-nhan-dat-hang">
                                <span>🔒</span>
                                <span>HOÀN TẤT ĐẶT HÀNG NGAY</span>
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalCheckoutHtml);
}

function damBaoModalThanhCongTonTai() {
    if (document.getElementById('modal-thanh-cong-box')) return;

    const modalSuccessHtml = `
        <div id="modal-thanh-cong-box" class="modal-checkout-overlay" onclick="dongModalThanhCongNgoai(event)">
            <div class="modal-checkout-box success-box" onclick="event.stopPropagation()">
                <div class="success-icon-badge">🎉</div>
                <h3>ĐẶT HÀNG THÀNH CÔNG!</h3>
                <p>Cảm ơn bạn đã tin chọn LUXURY Perfume. Đơn hàng của bạn đã được ghi nhận.</p>

                <div class="success-order-card">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #64748b;">Mã đơn hàng:</span>
                        <strong id="success-order-id" style="color: #be185d; font-family: monospace;">#LX-12345</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #64748b;">Người nhận:</span>
                        <strong id="success-cust-name" style="color: #1f131a;"></strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #64748b;">Số điện thoại:</span>
                        <span id="success-cust-phone" style="color: #1f131a;"></span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #64748b;">Tổng tiền:</span>
                        <strong id="success-order-total" style="color: #e11d48; font-size: 16px;"></strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #64748b;">Hình thức:</span>
                        <span id="success-order-pay" style="color: #0f172a;"></span>
                    </div>
                </div>

                <p style="font-size: 13px; color: #64748b; margin: 0 0 10px;">Chuyên viên tư vấn sẽ liên hệ xác nhận đơn hàng trong ít phút.</p>

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
    // CHẶN NẾU CHƯA ĐĂNG NHẬP
    if (!kiemTraDaDangNhap()) {
        alert('🔒 Quý khách vui lòng đăng nhập tài khoản để tiến hành đặt hàng!');
        moModalAuth('login');
        return;
    }

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

    // Điền thông tin người dùng nếu đã đăng nhập
    const user = getNguoiDungHienTai();
    if (user) {
        const nameInput = document.getElementById('checkout-name');
        const phoneInput = document.getElementById('checkout-phone');
        const addrInput = document.getElementById('checkout-address');
        if (nameInput) nameInput.value = user.hoTen || '';
        if (phoneInput) phoneInput.value = user.sdt || '';
        if (addrInput) addrInput.value = user.diaChi || '';
    }

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
            vMsg.style.color = '#10b981';
            vMsg.style.display = 'block';
        }
    } else if (code === 'FREESHIP') {
        currentDiscountAmount = 0;
        if (vMsg) {
            vMsg.textContent = '✓ Miễn phí vận chuyển toàn quốc!';
            vMsg.style.color = '#10b981';
            vMsg.style.display = 'block';
        }
    } else if (code === 'VIP10') {
        if (currentCheckoutProduct) {
            currentDiscountAmount = Math.round((currentCheckoutProduct.gia * currentCheckoutQty * 0.1) / 10000) * 10000;
            if (vMsg) {
                vMsg.textContent = `✓ Đã áp dụng mã VIP10: Giảm 10% (${dinhDangTien(currentDiscountAmount)})`;
                vMsg.style.color = '#10b981';
                vMsg.style.display = 'block';
            }
        }
    } else {
        currentDiscountAmount = 0;
        if (vMsg) {
            vMsg.textContent = '✕ Mã giảm giá không hợp lệ hoặc đã hết hạn';
            vMsg.style.color = '#ef4444';
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
    if (!kiemTraDaDangNhap()) {
        alert('🔒 Quý khách vui lòng đăng nhập tài khoản để tiến hành đặt hàng!');
        moModalAuth('login');
        return;
    }
    if (!currentDetailProductId) return;
    const qty = parseInt(document.getElementById('detail-modal-qty')?.value) || 1;
    moModalDatHang(currentDetailProductId, qty);
}

function datHangNhanh(productId) {
    if (!kiemTraDaDangNhap()) {
        alert('🔒 Quý khách vui lòng đăng nhập tài khoản để tiến hành đặt hàng!');
        moModalAuth('login');
        return;
    }
    moModalDatHang(productId, 1);
}

// --------------------------------------------------------------------------
// 7. HIỂN THỊ ĐƠN HÀNG TẠI TRANG ĐƠN HÀNG (USER CHỈ XEM THÔNG TIN, KHÔNG HỦY/XÓA)
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

    // 1. NẾU CHƯA ĐĂNG NHẬP: HIỆN THÔNG BÁO MỜI ĐĂNG NHẬP
    if (!kiemTraDaDangNhap()) {
        const oThongKe = document.querySelectorAll('.o-thong-ke strong');
        oThongKe.forEach(el => el.textContent = '0');

        container.innerHTML = `
            <div class="user-guest-order-prompt">
                <div class="guest-icon">🔒</div>
                <h3>VUI LÒNG ĐĂNG NHẬP ĐỂ XEM ĐƠN HÀNG</h3>
                <p>Quý khách cần đăng nhập tài khoản để tra cứu thông tin chi tiết, lịch sử mua hàng và tiến độ vận chuyển đơn hàng của mình.</p>
                <button onclick="moModalAuth('login')" class="btn-guest-login">
                    <span>👤</span>
                    <span>ĐĂNG NHẬP NGAY</span>
                </button>
            </div>
        `;
        return;
    }

    // 2. NẾU ĐÃ ĐĂNG NHẬP: LỌC VÀ HIỂN THỊ ĐƠN HÀNG CỦA RIÊNG USER
    const orders = getDanhSachDonHang(true);

    const tongDon = orders.length;
    const donCho = orders.filter(o => o.trangThai === 'cho-xac-nhan').length;
    const donGiao = orders.filter(o => o.trangThai === 'dang-giao').length;
    const donXong = orders.filter(o => o.trangThai === 'hoan-thanh').length;

    const oThongKe = document.querySelectorAll('.o-thong-ke strong');
    if (oThongKe.length >= 4) {
        oThongKe[0].textContent = tongDon;
        oThongKe[1].textContent = donCho;
        oThongKe[2].textContent = donGiao;
        oThongKe[3].textContent = donXong;
    }

    const filteredOrders = orders.filter(o => {
        if (trangThaiLoc === 'tat-ca') return true;
        return o.trangThai === trangThaiLoc;
    });

    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; margin-top: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.04);">
                <p style="font-size: 32px; margin: 0 0 10px;">📦</p>
                <h3 style="color: #0f172a; margin: 0 0 8px;">Chưa có đơn hàng nào</h3>
                <p style="color: #64748b; font-size: 14px;">Không tìm thấy đơn hàng trong mục trạng thái này.</p>
                <a href="trang-san-pham.html" style="display: inline-block; margin-top: 15px; background: #0f172a; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">Khám Phá Nước Hoa Ngay</a>
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
                        <p>Số lượng: <strong>x${sp.soLuong}</strong></p>
                        <strong>${dinhDangTien(sp.donGia * sp.soLuong)}</strong>
                    </div>
                </div>
            `;
        });

        // User chỉ có nút "Xem chi tiết đơn" (Không có nút hủy, duyệt, xóa trên giao diện User)
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
                        🔍 Xem Chi Tiết & Tiến Độ Đơn
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
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
                                <strong id="user-modal-cust-name" style="color: #0f172a;"></strong>
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
                                <span id="user-modal-cust-note" style="font-style: italic; color: #be185d;"></span>
                            </div>
                        </div>

                        <div class="modal-info-card">
                            <h4>📋 Chi Tiết Giao Dịch</h4>
                            <div class="modal-info-card-row">
                                <span>Mã đơn:</span>
                                <strong id="user-modal-order-code" style="color: #be185d;"></strong>
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
                                <span style="color: #10b981; font-weight: bold;">Miễn phí (Freeship)</span>
                            </div>
                            <div class="modal-pricing-row total">
                                <strong>Tổng tiền thanh toán:</strong>
                                <strong id="user-modal-total"></strong>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="modal-don-hang-footer" id="user-modal-footer">
                    <button class="modal-btn-dong" onclick="dongModalChiTietDonHangUser()">Đóng</button>
                </div>

            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function xemChiTietDonUser(maDon) {
    damBaoModalDonHangUserTonTai();
    const don = getDonHangTheoMa(maDon);
    if (!don) return;

    const infoTT = getThongTinTrangThai(don.trangThai);

    // Tiêu đề & Thông tin cơ bản
    document.getElementById('user-modal-order-title').innerHTML = `📦 Đơn Hàng <span style="color: #be185d;">#${don.maDon}</span>`;
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
            <div style="width: 100%; text-align: center; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 14px; color: #ef4444;">
                <strong>❌ Đơn hàng này đã bị hủy</strong>
                <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Nếu quý khách muốn mua lại, vui lòng chọn lại sản phẩm và bấm Đặt Hàng.</p>
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
                    <p>${sp.dungTich || '100ml | Full Box Chính Hãng'} • Số lượng: <strong style="color: #be185d;">x${sp.soLuong}</strong></p>
                </div>
                <div class="modal-item-price">${dinhDangTien(sp.donGia * sp.soLuong)}</div>
            </div>
        `;
    });
    itemsEl.innerHTML = itemsHtml;

    // Tổng tiền
    document.getElementById('user-modal-subtotal').textContent = dinhDangTien(don.tamTinh);
    document.getElementById('user-modal-total').textContent = dinhDangTien(don.tongTien);

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