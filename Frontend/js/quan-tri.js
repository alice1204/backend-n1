/* ==========================================================================
   LOGIC GIAO DIỆN QUẢN TRỊ (ADMIN CONTROLLER) - LUXURY PERFUME STORE
   ========================================================================== */

// Biến trạng thái toàn cục trong trang Admin
let currentTab = 'thong-ke';
let currentEditingProductId = null;
let currentDeletingProductId = null;
let currentViewingOrderId = null;

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    khoiTaoGiaoDienAdmin();
    langNgheSuKienCapNhat();
});

// Khởi tạo các thành phần giao diện
function khoiTaoGiaoDienAdmin() {
    caiDatTabs();
    taiDuLieuThongKe();
    taiDanhSachSanPhamAdmin();
    taiDanhSachDonHangAdmin();
    caiDatTimKiemVaBoLoc();
    caiDatFormSanPham();
}

// Lắng nghe sự kiện đồng bộ từ LocalStorage
function langNgheSuKienCapNhat() {
    window.addEventListener('luxury_products_updated', () => {
        taiDuLieuThongKe();
        taiDanhSachSanPhamAdmin();
    });

    window.addEventListener('luxury_orders_updated', () => {
        taiDuLieuThongKe();
        taiDanhSachDonHangAdmin();
    });
}

// --------------------------------------------------------------------------
// 1. QUẢN LÝ TABS
// --------------------------------------------------------------------------
function caiDatTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            chuyenTab(targetTab);
        });
    });
}

function chuyenTab(tabId) {
    currentTab = tabId;

    // Cập nhật trạng thái nút tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Cập nhật hiển thị panel nội dung
    document.querySelectorAll('.tab-content-panel').forEach(panel => {
        if (panel.id === `panel-${tabId}`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    // Tải lại dữ liệu tương ứng khi mở tab
    if (tabId === 'thong-ke') {
        taiDuLieuThongKe();
    } else if (tabId === 'san-pham') {
        taiDanhSachSanPhamAdmin();
    } else if (tabId === 'don-hang') {
        taiDanhSachDonHangAdmin();
    }
}

// --------------------------------------------------------------------------
// 2. TAB 1: THỐNG KÊ & TỔNG QUAN
// --------------------------------------------------------------------------
function taiDuLieuThongKe() {
    const stats = tinhToanThongKe();
    const products = getDanhSachSanPham();
    const orders = getDanhSachDonHang();

    // Cập nhật số liệu trên 4 thẻ KPI
    const elRevenue = document.getElementById('kpi-revenue');
    const elOrders = document.getElementById('kpi-orders');
    const elPending = document.getElementById('kpi-pending');
    const elProducts = document.getElementById('kpi-products');

    if (elRevenue) elRevenue.textContent = dinhDangTien(stats.doanhThuTong);
    if (elOrders) elOrders.textContent = stats.tongDonHang;
    if (elPending) elPending.textContent = stats.donChoXacNhan;
    if (elProducts) elProducts.textContent = `${stats.tongSanPham} SP (${stats.tongTonKho} chai)`;

    // Cập nhật badge số lượng trên thanh tabs
    const badgeProds = document.getElementById('tab-badge-products');
    const badgeOrders = document.getElementById('tab-badge-orders');
    if (badgeProds) badgeProds.textContent = stats.tongSanPham;
    if (badgeOrders) badgeOrders.textContent = stats.tongDonHang;

    // Vẽ biểu đồ phân bổ trạng thái đơn hàng
    vePhanBoTrangThai(stats);

    // Vẽ biểu đồ doanh thu tuần
    veBieuDoDoanhThu(orders);

    // Render danh sách Top sản phẩm bán chạy
    renderTopSanPham(products);
}

function vePhanBoTrangThai(stats) {
    const total = stats.tongDonHang || 1;
    const pPending = Math.round((stats.donChoXacNhan / total) * 100);
    const pShipping = Math.round((stats.donDangGiao / total) * 100);
    const pCompleted = Math.round((stats.donHoanThanh / total) * 100);
    const pCancelled = Math.round((stats.donDaHuy / total) * 100);

    const fillPending = document.getElementById('progress-pending');
    const fillShipping = document.getElementById('progress-shipping');
    const fillCompleted = document.getElementById('progress-completed');
    const fillCancelled = document.getElementById('progress-cancelled');

    const countPending = document.getElementById('count-pending');
    const countShipping = document.getElementById('count-shipping');
    const countCompleted = document.getElementById('count-completed');
    const countCancelled = document.getElementById('count-cancelled');

    if (fillPending) fillPending.style.width = `${pPending}%`;
    if (fillShipping) fillShipping.style.width = `${pShipping}%`;
    if (fillCompleted) fillCompleted.style.width = `${pCompleted}%`;
    if (fillCancelled) fillCancelled.style.width = `${pCancelled}%`;

    if (countPending) countPending.textContent = `${stats.donChoXacNhan} đơn (${pPending}%)`;
    if (countShipping) countShipping.textContent = `${stats.donDangGiao} đơn (${pShipping}%)`;
    if (countCompleted) countCompleted.textContent = `${stats.donHoanThanh} đơn (${pCompleted}%)`;
    if (countCancelled) countCancelled.textContent = `${stats.donDaHuy} đơn (${pCancelled}%)`;
}

function veBieuDoDoanhThu(orders) {
    const container = document.getElementById('revenue-bars-container');
    if (!container) return;

    // Giả lập doanh thu 7 ngày gần nhất
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    const mockValues = [4250000, 3850000, 5900000, 7100000, 4900000, 9200000, 11500000];
    const maxVal = Math.max(...mockValues);

    let html = '';
    days.forEach((day, index) => {
        const val = mockValues[index];
        const heightPercent = Math.max(15, Math.round((val / maxVal) * 100));
        html += `
            <div class="bar-col">
                <div class="bar-fill" style="height: ${heightPercent}%">
                    <span class="bar-tooltip">${dinhDangTien(val)}</span>
                </div>
                <span class="bar-label">${day}</span>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderTopSanPham(products) {
    const tbody = document.getElementById('top-products-tbody');
    if (!tbody) return;

    const topList = [...products].sort((a, b) => (b.daBan || 0) - (a.daBan || 0)).slice(0, 5);

    let html = '';
    topList.forEach((sp, index) => {
        html += `
            <tr>
                <td><strong>#${index + 1}</strong></td>
                <td>
                    <div class="product-cell">
                        <img src="${sp.hinhAnh}" alt="${sp.ten}" class="product-thumb" onerror="this.src=FALLBACK_PERFUME_IMG">
                        <div>
                            <div class="product-info-name">${sp.ten}</div>
                            <div class="product-info-id">${sp.dungTich || '100ml'}</div>
                        </div>
                    </div>
                </td>
                <td>${sp.thuongHieuTen || sp.thuongHieu}</td>
                <td class="price-text">${dinhDangTien(sp.gia)}</td>
                <td><strong style="color: #52b788;">${sp.daBan || 0}</strong> đã bán</td>
                <td>${sp.tonKho || 0} trong kho</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// --------------------------------------------------------------------------
// 3. TAB 2: QUẢN LÝ SẢN PHẨM (CRUD)
// --------------------------------------------------------------------------
function taiDanhSachSanPhamAdmin() {
    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;

    const products = getDanhSachSanPham();
    const keyword = (document.getElementById('search-product-input')?.value || '').toLowerCase().trim();
    const categoryFilter = document.getElementById('filter-product-category')?.value || 'all';
    const brandFilter = document.getElementById('filter-product-brand')?.value || 'all';

    // Lọc theo từ khóa, danh mục, thương hiệu
    const filtered = products.filter(sp => {
        const matchKeyword = !keyword || sp.ten.toLowerCase().includes(keyword) || sp.id.toLowerCase().includes(keyword);
        const matchCategory = categoryFilter === 'all' || sp.danhMuc === categoryFilter;
        const matchBrand = brandFilter === 'all' || sp.thuongHieu === brandFilter;
        return matchKeyword && matchCategory && matchBrand;
    });

    const countEl = document.getElementById('product-result-count');
    if (countEl) countEl.textContent = `Hiển thị ${filtered.length} / ${products.length} sản phẩm`;

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #9cb3c9;">
                    Không tìm thấy sản phẩm nào phù hợp.
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    filtered.forEach(sp => {
        let stockBadge = '<span class="badge badge-in-stock">Còn hàng</span>';
        if (sp.tonKho <= 0) {
            stockBadge = '<span class="badge badge-out-stock">Hết hàng</span>';
        } else if (sp.tonKho <= 10) {
            stockBadge = '<span class="badge badge-low-stock">Sắp hết (' + sp.tonKho + ')</span>';
        }

        html += `
            <tr>
                <td><strong>#${sp.id}</strong></td>
                <td>
                    <div class="product-cell" onclick="moModalChiTietSanPham('${sp.id}')" style="cursor: pointer;" title="Xem chi tiết sản phẩm">
                        <img src="${sp.hinhAnh}" alt="${sp.ten}" class="product-thumb" onerror="this.src=FALLBACK_PERFUME_IMG">
                        <div>
                            <div class="product-info-name">${sp.ten}</div>
                            <div class="product-info-id">${sp.dungTich || '100ml'}</div>
                        </div>
                    </div>
                </td>
                <td>${sp.danhMucTen || sp.danhMuc}</td>
                <td>${sp.thuongHieuTen || sp.thuongHieu}</td>
                <td class="price-text">${dinhDangTien(sp.gia)}</td>
                <td>${sp.tonKho} chai<br>${stockBadge}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-view" title="Xem chi tiết sản phẩm" onclick="moModalChiTietSanPham('${sp.id}')">
                            👁️
                        </button>
                        <button class="btn-icon btn-edit" title="Chỉnh sửa sản phẩm" onclick="moModalSuaSanPham('${sp.id}')">
                            ✏️
                        </button>
                        <button class="btn-icon btn-delete" title="Xóa sản phẩm" onclick="moModalXacNhanXoa('${sp.id}', '${sp.ten.replace(/'/g, "\\'")}')">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// Cài đặt Form thêm/sửa sản phẩm
function caiDatFormSanPham() {
    const form = document.getElementById('form-product');
    const inputImg = document.getElementById('prod-image');
    const previewImg = document.getElementById('prod-image-preview');

    if (inputImg && previewImg) {
        inputImg.addEventListener('input', () => {
            const url = inputImg.value.trim();
            previewImg.src = url || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80';
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            luuThongTinSanPham();
        });
    }
}

function moModalThemSanPham() {
    currentEditingProductId = null;
    document.getElementById('modal-product-title').innerHTML = '✨ Thêm Sản Phẩm Nước Hoa Mới';
    document.getElementById('form-product').reset();
    
    // Mặc định ảnh mẫu
    document.getElementById('prod-image').value = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80';
    document.getElementById('prod-image-preview').src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80';
    
    document.getElementById('modal-product').classList.add('active');
}

function moModalSuaSanPham(id) {
    const sp = getSanPhamTheoId(id);
    if (!sp) return;

    currentEditingProductId = id;
    document.getElementById('modal-product-title').innerHTML = '✏️ Chỉnh Sửa Thông Tin Sản Phẩm';

    document.getElementById('prod-name').value = sp.ten;
    document.getElementById('prod-category').value = sp.danhMuc;
    document.getElementById('prod-brand').value = sp.thuongHieu;
    document.getElementById('prod-price').value = sp.gia;
    document.getElementById('prod-volume').value = sp.dungTich || '100ml';
    document.getElementById('prod-stock').value = sp.tonKho || 0;
    document.getElementById('prod-image').value = sp.hinhAnh || '';
    document.getElementById('prod-image-preview').src = sp.hinhAnh || FALLBACK_PERFUME_IMG;
    document.getElementById('prod-desc').value = sp.moTa || '';
    document.getElementById('prod-featured').checked = !!sp.noiBat;

    document.getElementById('modal-product').classList.add('active');
}

function dongModalSanPham() {
    document.getElementById('modal-product').classList.remove('active');
}

function luuThongTinSanPham() {
    const ten = document.getElementById('prod-name').value.trim();
    const danhMuc = document.getElementById('prod-category').value;
    const thuongHieu = document.getElementById('prod-brand').value;
    const gia = Number(document.getElementById('prod-price').value) || 0;
    const dungTich = document.getElementById('prod-volume').value.trim();
    const tonKho = Number(document.getElementById('prod-stock').value) || 0;
    const hinhAnh = document.getElementById('prod-image').value.trim() || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80';
    const moTa = document.getElementById('prod-desc').value.trim();
    const noiBat = document.getElementById('prod-featured').checked;

    const selectCategory = document.getElementById('prod-category');
    const danhMucTen = selectCategory.options[selectCategory.selectedIndex].text;

    const selectBrand = document.getElementById('prod-brand');
    const thuongHieuTen = selectBrand.options[selectBrand.selectedIndex].text;

    const duLieuSanPham = {
        ten,
        danhMuc,
        danhMucTen,
        thuongHieu,
        thuongHieuTen,
        gia,
        dungTich,
        tonKho,
        hinhAnh,
        moTa,
        noiBat
    };

    if (currentEditingProductId) {
        // Sửa sản phẩm
        suaSanPham(currentEditingProductId, duLieuSanPham);
        hienThiToast('Cập nhật thông tin sản phẩm thành công!', 'toast-success');
    } else {
        // Thêm mới sản phẩm
        themSanPham(duLieuSanPham);
        hienThiToast('Thêm sản phẩm nước hoa mới thành công!', 'toast-success');
    }

    dongModalSanPham();
    taiDanhSachSanPhamAdmin();
    taiDuLieuThongKe();
}

// Xóa sản phẩm
function moModalXacNhanXoa(id, ten) {
    currentDeletingProductId = id;
    document.getElementById('delete-product-name').textContent = `"${ten}" (#${id})`;
    document.getElementById('modal-delete-confirm').classList.add('active');
}

function dongModalXacNhanXoa() {
    currentDeletingProductId = null;
    document.getElementById('modal-delete-confirm').classList.remove('active');
}

function thucHienXoaSanPham() {
    if (currentDeletingProductId) {
        const ok = xoaSanPham(currentDeletingProductId);
        if (ok) {
            hienThiToast('Đã xóa sản phẩm khỏi hệ thống!', 'toast-danger');
            taiDanhSachSanPhamAdmin();
            taiDuLieuThongKe();
        }
    }
    dongModalXacNhanXoa();
}

// --------------------------------------------------------------------------
// 4. TAB 3: QUẢN LÝ ĐƠN HÀNG
// --------------------------------------------------------------------------
function taiDanhSachDonHangAdmin() {
    const tbody = document.getElementById('admin-orders-tbody');
    if (!tbody) return;

    const orders = getDanhSachDonHang();
    const keyword = (document.getElementById('search-order-input')?.value || '').toLowerCase().trim();
    const statusFilter = document.getElementById('filter-order-status')?.value || 'all';

    const filtered = orders.filter(o => {
        const matchKeyword = !keyword ||
            o.maDon.toLowerCase().includes(keyword) ||
            o.khachHang.hoTen.toLowerCase().includes(keyword) ||
            o.khachHang.sdt.includes(keyword);
        const matchStatus = statusFilter === 'all' || o.trangThai === statusFilter;
        return matchKeyword && matchStatus;
    });

    const countEl = document.getElementById('order-result-count');
    if (countEl) countEl.textContent = `Hiển thị ${filtered.length} / ${orders.length} đơn hàng`;

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #9cb3c9;">
                    Không tìm thấy đơn hàng nào phù hợp.
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    filtered.forEach(o => {
        const itemsSummary = o.sanPham.map(p => `${p.ten} (x${p.soLuong})`).join(', ');

        html += `
            <tr>
                <td><strong class="price-text">#${o.maDon}</strong></td>
                <td>
                    <div style="font-weight: 600; color: #ffffff;">${o.khachHang.hoTen}</div>
                    <div style="font-size: 12px; color: #9cb3c9;">${o.khachHang.sdt}</div>
                </td>
                <td>
                    <div style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemsSummary}">
                        ${itemsSummary}
                    </div>
                </td>
                <td>${o.ngayDat}</td>
                <td><strong class="price-text">${dinhDangTien(o.tongTien)}</strong></td>
                <td>
                    <select class="status-select ${o.trangThai}" onchange="doiTrangThaiNhanh('${o.maDon}', this.value)">
                        <option value="cho-xac-nhan" ${o.trangThai === 'cho-xac-nhan' ? 'selected' : ''}>⏳ Chờ xác nhận</option>
                        <option value="dang-giao" ${o.trangThai === 'dang-giao' ? 'selected' : ''}>🚚 Đang giao hàng</option>
                        <option value="hoan-thanh" ${o.trangThai === 'hoan-thanh' ? 'selected' : ''}>✅ Hoàn thành</option>
                        <option value="da-huy" ${o.trangThai === 'da-huy' ? 'selected' : ''}>❌ Đã hủy</option>
                    </select>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-view" title="Xem chi tiết đơn" onclick="moModalChiTietDonHang('${o.maDon}')">
                            👁️
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function doiTrangThaiNhanh(maDon, trangThaiMoi) {
    const donHang = capNhatTrangThaiDonHang(maDon, trangThaiMoi);
    if (donHang) {
        hienThiToast(`Đã cập nhật trạng thái đơn #${maDon}!`, 'toast-info');
        taiDanhSachDonHangAdmin();
        taiDuLieuThongKe();
    }
}

function moModalChiTietDonHang(maDon) {
    const don = getDonHangTheoMa(maDon);
    if (!don) return;

    currentViewingOrderId = maDon;
    document.getElementById('modal-order-title').textContent = `📦 Chi Tiết Đơn Hàng #${don.maDon}`;

    document.getElementById('detail-order-code').textContent = '#' + don.maDon;
    document.getElementById('detail-order-date').textContent = don.ngayDat;
    document.getElementById('detail-order-payment').textContent = don.phuongThucThanhToan || 'COD';

    document.getElementById('detail-cust-name').textContent = don.khachHang.hoTen;
    document.getElementById('detail-cust-phone').textContent = don.khachHang.sdt;
    document.getElementById('detail-cust-address').textContent = don.khachHang.diaChi;
    document.getElementById('detail-cust-note').textContent = don.khachHang.ghiChu || '(Không có ghi chú)';

    document.getElementById('detail-subtotal').textContent = dinhDangTien(don.tamTinh);
    document.getElementById('detail-shipping').textContent = dinhDangTien(don.phiVanChuyen);
    document.getElementById('detail-total').textContent = dinhDangTien(don.tongTien);

    // Trạng thái modal dropdown
    document.getElementById('detail-order-status-select').value = don.trangThai;

    // Render danh sách sản phẩm trong đơn
    const itemsContainer = document.getElementById('detail-order-items');
    let itemsHtml = '';
    don.sanPham.forEach(item => {
        itemsHtml += `
            <div class="order-item-row">
                <img src="${item.hinhAnh || FALLBACK_PERFUME_IMG}" class="order-item-img" onerror="this.src=FALLBACK_PERFUME_IMG">
                <div class="order-item-meta">
                    <h5>${item.ten}</h5>
                    <p>${item.dungTich || '100ml'} | Số lượng: <strong>x${item.soLuong}</strong></p>
                </div>
                <div class="price-text">${dinhDangTien(item.donGia * item.soLuong)}</div>
            </div>
        `;
    });
    itemsContainer.innerHTML = itemsHtml;

    document.getElementById('modal-order-detail').classList.add('active');
}

function dongModalChiTietDonHang() {
    currentViewingOrderId = null;
    document.getElementById('modal-order-detail').classList.remove('active');
}

function luuTrangThaiTuModal() {
    if (!currentViewingOrderId) return;
    const trangThaiMoi = document.getElementById('detail-order-status-select').value;
    capNhatTrangThaiDonHang(currentViewingOrderId, trangThaiMoi);
    hienThiToast(`Cập nhật đơn #${currentViewingOrderId} thành công!`, 'toast-success');
    dongModalChiTietDonHang();
    taiDanhSachDonHangAdmin();
    taiDuLieuThongKe();
}

// --------------------------------------------------------------------------
// 5. CÀI ĐẶT BỘ LỌC VÀ TÌM KIẾM
// --------------------------------------------------------------------------
function caiDatTimKiemVaBoLoc() {
    // Tìm kiếm sản phẩm
    const searchProd = document.getElementById('search-product-input');
    const filterCat = document.getElementById('filter-product-category');
    const filterBrand = document.getElementById('filter-product-brand');

    if (searchProd) searchProd.addEventListener('input', taiDanhSachSanPhamAdmin);
    if (filterCat) filterCat.addEventListener('change', taiDanhSachSanPhamAdmin);
    if (filterBrand) filterBrand.addEventListener('change', taiDanhSachSanPhamAdmin);

    // Tìm kiếm đơn hàng
    const searchOrder = document.getElementById('search-order-input');
    const filterStatus = document.getElementById('filter-order-status');

    if (searchOrder) searchOrder.addEventListener('input', taiDanhSachDonHangAdmin);
    if (filterStatus) filterStatus.addEventListener('change', taiDanhSachDonHangAdmin);
}

// --------------------------------------------------------------------------
// 6. HỆ THỐNG TOAST THÔNG BÁO
// --------------------------------------------------------------------------
function hienThiToast(noiDung, loai = 'toast-info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${loai}`;
    
    let icon = 'ℹ️';
    if (loai === 'toast-success') icon = '✅';
    if (loai === 'toast-danger') icon = '❌';

    toast.innerHTML = `<span>${icon}</span> <span>${noiDung}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// --------------------------------------------------------------------------
// 7. MODAL XEM CHI TIẾT SẢN PHẨM TRÊN ADMIN
// --------------------------------------------------------------------------
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

                        <!-- Thao tác từ phía Admin -->
                        <div class="modal-thao-tac-row">
                            <button class="modal-btn-dat-hang" onclick="dongModalChiTietSanPham(); moModalSuaSanPham(currentDetailProductId);">
                                <span>✏️</span>
                                <span>Chỉnh Sửa Thông Tin Sản Phẩm Này</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

let currentDetailProductId = null;

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

