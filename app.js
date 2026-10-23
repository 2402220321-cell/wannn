/* ================= GLOBAL STATE & MOCK DATABASE ================= */
let currentRole = 'user'; // 'user' | 'admin'
let activeTab = 'user-beranda';
let selectedCategory = 'Semua';

// Current Logged User Profile
const currentUser = {
  id: "2402221748",
  name: "Rosa Ulina Ginting",
  program: "Bisnis Digital",
  maxQuota: 3
};

// Mock Initial Books Database
let booksDB = [
  {
    id: "BOK-001",
    title: "Pemrograman Mobile Berbasis React Native",
    author: "Rahman, A.",
    year: 2023,
    category: "Teknologi",
    isbn: "978-602-1234-56-7",
    rack: "Lantai 2, Rak B-04",
    totalStock: 3,
    availableStock: 2,
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80",
    synopsis: "Buku panduan komprehensif merancang aplikasi mobile Android dan iOS menggunakan React Native untuk sistem informasi perpustakaan."
  },
  {
    id: "BOK-002",
    title: "Manajemen Bisnis Digital Era Modern",
    author: "Sari, D.",
    year: 2024,
    category: "Bisnis",
    isbn: "978-602-9876-54-3",
    rack: "Lantai 1, Rak A-02",
    totalStock: 2,
    availableStock: 1,
    cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=80",
    synopsis: "Strategi pengelolaan transformasi bisnis digital dan integrasi teknologi informasi dalam dunia kerja nyata."
  },
  {
    id: "BOK-003",
    title: "Pengantar Sistem Informasi Perusahaan",
    author: "Wijaya, B.",
    year: 2022,
    category: "Sistem Informasi",
    isbn: "978-602-5555-11-2",
    rack: "Lantai 2, Rak C-01",
    totalStock: 2,
    availableStock: 0,
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80",
    synopsis: "Konsep dasar arsitektur sistem informasi enterprise, siklus pengembangan, serta pengelolaan basis data perpustakaan."
  },
  {
    id: "BOK-004",
    title: "Basis Data Dasar & Implementasi SQL",
    author: "Tanjung, D.",
    year: 2021,
    category: "Teknologi",
    isbn: "978-602-3333-88-9",
    rack: "Lantai 2, Rak B-02",
    totalStock: 4,
    availableStock: 3,
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80",
    synopsis: "Pemahaman struktur basis data relasional, perancangan diagram ERD, dan sintaks query SQL untuk pemula."
  }
];

// Mock Transactions Database
let loansDB = [
  {
    id: "PJM-1001",
    userId: "2402221748",
    userName: "Rosa Ulina Ginting",
    bookId: "BOK-001",
    bookTitle: "Pemrograman Mobile Berbasis React Native",
    borrowDate: "2026-10-20",
    dueDate: "2026-10-27",
    status: "Dipinjam", // 'Dipinjam' | 'Dikembalikan'
    extendedCount: 0
  },
  {
    id: "PJM-1002",
    userId: "2402221748",
    userName: "Rosa Ulina Ginting",
    bookId: "BOK-002",
    bookTitle: "Manajemen Bisnis Digital Era Modern",
    borrowDate: "2026-10-15",
    dueDate: "2026-10-22",
    status: "Dipinjam",
    extendedCount: 1
  },
  {
    id: "PJM-0998",
    userId: "2402221748",
    userName: "Rosa Ulina Ginting",
    bookId: "BOK-004",
    bookTitle: "Basis Data Dasar & Implementasi SQL",
    borrowDate: "2026-09-01",
    dueDate: "2026-09-08",
    status: "Dikembalikan",
    returnDate: "2026-09-07",
    extendedCount: 0
  }
];

// Activity Logs for Admin Panel
let activityLogs = [
  { text: "Peminjaman PJM-1002 diperpanjang oleh Rosa", time: "10 menit lalu" },
  { text: "Buku BOK-001 dipinjam oleh Rosa Ulina Ginting", time: "3 hari lalu" }
];

/* ================= INITIALIZATION & NAVIGATION ================= */

document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  generateMemberQR();
});

function renderApp() {
  updateRoleUI();
  renderNavigation();
  switchTab(activeTab);
  renderHomeData();
  renderCatalog();
  renderLoans();
  renderAdminDashboard();
  renderAdminBooks();
  renderAdminTransactions();
  populateScanSelect();
}

// Toggle Role between 'user' and 'admin'
function toggleRoleSwitch() {
  currentRole = currentRole === 'user' ? 'admin' : 'user';
  activeTab = currentRole === 'user' ? 'user-beranda' : 'admin-dashboard';
  
  // Show toast notification
  showToast(`Beralih ke mode: ${currentRole.toUpperCase()}`);
  
  renderApp();
}

function updateRoleUI() {
  const badge = document.getElementById('roleBadge');
  if (currentRole === 'user') {
    badge.innerText = 'ANGGOTA';
    badge.className = 'bg-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-white';
  } else {
    badge.innerText = 'ADMIN PETUGAS';
    badge.className = 'bg-amber-500 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-slate-950';
  }
}

// Render Dynamic Bottom Navigation Bar
function renderNavigation() {
  const nav = document.getElementById('bottomNav');
  
  if (currentRole === 'user') {
    nav.innerHTML = `
      <button onclick="switchTab('user-beranda')" id="nav-user-beranda" class="nav-item flex flex-col items-center gap-1 text-slate-400 text-[10px] transition">
        <i class="fas fa-home text-base"></i><span>Beranda</span>
      </button>
      <button onclick="switchTab('user-katalog')" id="nav-user-katalog" class="nav-item flex flex-col items-center gap-1 text-slate-400 text-[10px] transition">
        <i class="fas fa-book text-base"></i><span>Katalog</span>
      </button>
      <button onclick="switchTab('user-scan')" id="nav-user-scan" class="nav-item flex flex-col items-center gap-1 text-slate-400 text-[10px] transition">
        <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg -mt-5 shadow-lg border-2 border-slate-50">
          <i class="fas fa-qrcode"></i>
        </div>
        <span>Pindai</span>
      </button>
      <button onclick="switchTab('user-pinjaman')" id="nav-user-pinjaman" class="nav-item flex flex-col items-center gap-1 text-slate-400 text-[10px] transition">
        <i class="fas fa-bookmark text-base"></i><span>Pinjaman</span>
      </button>
      <button onclick="switchTab('user-profil')" id="nav-user-profil" class="nav-item flex flex-col items-center gap-1 text-slate-400 text-[10px] transition">
        <i class="fas fa-user text-base"></i><span>Profil</span>
      </button>
    `;
  } else {
    nav.innerHTML = `
      <button onclick="switchTab('admin-dashboard')" id="nav-admin-dashboard" class="nav-item flex flex-col items-center gap-1 text-slate-400 text-[10px] transition">
        <i class="fas fa-chart-line text-base"></i><span>Dashboard</span>
      </button>
      <button onclick="switchTab('admin-buku')" id="nav-admin-buku" class="nav-item flex flex-col items-center gap-1 text-slate-400 text-[10px] transition">
        <i class="fas fa-tasks text-base"></i><span>Kelola Buku</span>
      </button>
      <button onclick="switchTab('admin-transaksi')" id="nav-admin-transaksi" class="nav-item flex flex-col items-center gap-1 text-slate-400 text-[10px] transition">
        <i class="fas fa-receipt text-base"></i><span>Transaksi</span>
      </button>
    `;
  }
  updateNavHighlight();
}

function switchTab(tabId) {
  activeTab = tabId;
  
  // Hide all sections
  document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
  
  // Show active view section
  const targetView = document.getElementById(`view-${tabId}`);
  if (targetView) targetView.classList.add('active');
  
  updateNavHighlight();
  
  // Scroll to top of content
  document.getElementById('mainContent').scrollTop = 0;
}

function updateNavHighlight() {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const activeNavBtn = document.getElementById(`nav-${activeTab}`);
  if (activeNavBtn) activeNavBtn.classList.add('active');
}

/* ================= USER FUNCTIONS ================= */

function renderHomeData() {
  const activeLoans = loansDB.filter(l => l.userId === currentUser.id && l.status === 'Dipinjam');
  document.getElementById('userActiveLoanCount').innerText = `${activeLoans.length} Buku`;

  // Render recent books
  const container = document.getElementById('homeRecentBooks');
  container.innerHTML = booksDB.slice(0, 3).map(book => `
    <div onclick="openBookDetail('${book.id}')" class="min-w-[120px] max-w-[120px] bg-white rounded-xl border border-slate-200 p-2 shadow-sm cursor-pointer hover:border-primary transition">
      <img src="${book.cover}" class="w-full h-28 object-cover rounded-lg mb-1.5" alt="Cover">
      <h4 class="font-bold text-[11px] text-slate-800 truncate">${book.title}</h4>
      <p class="text-[10px] text-slate-500 truncate">${book.author}</p>
      <span class="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded ${book.availableStock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}">
        ${book.availableStock > 0 ? 'Tersedia' : 'Dipinjam'}
      </span>
    </div>
  `).join('');
}

function setCategory(cat, btn) {
  selectedCategory = cat;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  filterBooks();
}

function filterBooks() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const availableOnly = document.getElementById('availableOnlyToggle').checked;

  const filtered = booksDB.filter(book => {
    const matchCat = selectedCategory === 'Semua' || book.category === selectedCategory;
    const matchQuery = book.title.toLowerCase().includes(query) || 
                       book.author.toLowerCase().includes(query) || 
                       book.isbn.includes(query);
    const matchAvail = !availableOnly || book.availableStock > 0;
    return matchCat && matchQuery && matchAvail;
  });

  document.getElementById('catalogCount').innerText = `Menampilkan ${filtered.length} buku`;
  
  const container = document.getElementById('catalogList');
  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-slate-400 text-xs">Buku tidak ditemukan</div>`;
    return;
  }

  container.innerHTML = filtered.map(book => `
    <div onclick="openBookDetail('${book.id}')" class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex gap-3 cursor-pointer hover:border-primary transition">
      <img src="${book.cover}" class="w-16 h-22 object-cover rounded-lg shadow-sm border border-slate-100" alt="Cover">
      <div class="flex-1 flex flex-col justify-between">
        <div>
          <span class="text-[9px] font-bold text-primary bg-blue-50 px-2 py-0.5 rounded-full">${book.category}</span>
          <h3 class="font-bold text-xs text-slate-800 mt-1 line-clamp-2 leading-tight">${book.title}</h3>
          <p class="text-[11px] text-slate-500 mt-0.5">${book.author} (${book.year})</p>
        </div>
        <div class="flex justify-between items-center mt-2 text-[10px]">
          <span class="text-slate-400"><i class="fas fa-map-marker-alt text-primary/70"></i> ${book.rack}</span>
          <span class="font-bold ${book.availableStock > 0 ? 'text-emerald-600' : 'text-amber-600'}">
            ${book.availableStock > 0 ? `Tersedia ${book.availableStock}/${book.totalStock}` : 'Sedang Dipinjam'}
          </span>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCatalog() {
  filterBooks();
}

function openBookDetail(bookId) {
  const book = booksDB.find(b => b.id === bookId);
  if (!book) return;

  document.getElementById('modalBookCover').src = book.cover;
  document.getElementById('modalBookBadge').innerText = book.category;
  document.getElementById('modalBookTitle').innerText = book.title;
  document.getElementById('modalBookAuthor').innerText = `${book.author} • ${book.year}`;
  document.getElementById('modalBookISBN').innerText = `ISBN: ${book.isbn}`;
  document.getElementById('modalBookRack').innerText = book.rack;
  document.getElementById('modalBookStock').innerText = `${book.availableStock} dari ${book.totalStock} Eksemplar`;
  document.getElementById('modalBookSynopsis').innerText = book.synopsis;

  const actionsBox = document.getElementById('modalBookActions');
  const userActiveLoans = loansDB.filter(l => l.userId === currentUser.id && l.status === 'Dipinjam');

  if (book.availableStock <= 0) {
    actionsBox.innerHTML = `
      <button disabled class="w-full bg-slate-200 text-slate-500 py-2.5 rounded-xl text-xs font-bold cursor-not-allowed">
        Stok Tidak Tersedia
      </button>`;
  } else if (userActiveLoans.length >= currentUser.maxQuota) {
    actionsBox.innerHTML = `
      <p class="text-[10px] text-red-500 text-center mb-1 font-semibold">Batas maksimal peminjaman (3 buku) telah tercapai</p>
      <button disabled class="w-full bg-slate-200 text-slate-500 py-2.5 rounded-xl text-xs font-bold cursor-not-allowed">
        Batas Pinjam Terlampaui
      </button>`;
  } else {
    actionsBox.innerHTML = `
      <button onclick="processBorrow('${book.id}')" class="w-full bg-primary text-white py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-blue-800 transition">
        Ajukan Peminjaman Sekarang
      </button>`;
  }

  openModal('bookDetailModal');
}

function processBorrow(bookId) {
  const book = booksDB.find(b => b.id === bookId);
  if (!book || book.availableStock <= 0) return;

  // Decrease stock
  book.availableStock -= 1;

  // Create new transaction
  const newTxId = `PJM-${Math.floor(1000 + Math.random() * 9000)}`;
  const today = new Date().toISOString().split('T')[0];
  
  // Due 7 days later
  const due = new Date();
  due.setDate(due.getDate() + 7);
  const dueDateStr = due.toISOString().split('T')[0];

  const newTx = {
    id: newTxId,
    userId: currentUser.id,
    userName: currentUser.name,
    bookId: book.id,
    bookTitle: book.title,
    borrowDate: today,
    dueDate: dueDateStr,
    status: 'Dipinjam',
    extendedCount: 0
  };

  loansDB.unshift(newTx);
  activityLogs.unshift({
    text: `Pengajuan ${newTxId} (${book.title}) berhasil`,
    time: "Baru saja"
  });

  closeModal('bookDetailModal');
  
  // Show QR Confirmation Modal
  document.getElementById('qrModalTxId').innerText = newTxId;
  document.getElementById('qrModalTitle').innerText = book.title;
  document.getElementById('qrModalDueDate').innerText = `Batas Pengembalian: ${dueDateStr}`;
  
  // Generate QR Code
  const qrBox = document.getElementById('qrcodeCanvas');
  qrBox.innerHTML = '';
  new QRCode(qrBox, {
    text: newTxId,
    width: 128,
    height: 128
  });

  openModal('qrModal');
  renderApp();
}

function renderLoans() {
  const activeLoans = loansDB.filter(l => l.userId === currentUser.id && l.status === 'Dipinjam');
  const historyLoans = loansDB.filter(l => l.userId === currentUser.id && l.status === 'Dikembalikan');

  // Active Loans Render
  const activeContainer = document.getElementById('activeLoansContainer');
  if (activeLoans.length === 0) {
    activeContainer.innerHTML = `<p class="text-center text-xs text-slate-400 py-8">Tidak ada pinjaman buku aktif saat ini.</p>`;
  } else {
    activeContainer.innerHTML = activeLoans.map(loan => {
      const book = booksDB.find(b => b.id === loan.bookId);
      return `
        <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div class="flex gap-3">
            <img src="${book ? book.cover : 'https://via.placeholder.com/100'}" class="w-14 h-20 object-cover rounded-lg border" alt="Cover">
            <div class="flex-1 text-xs">
              <div class="flex justify-between items-start">
                <span class="font-mono text-[10px] text-slate-400 font-bold">${loan.id}</span>
                <span class="bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 rounded-full font-bold">Jatuh Tempo: ${loan.dueDate}</span>
              </div>
              <h4 class="font-bold text-slate-800 mt-1 line-clamp-1">${loan.bookTitle}</h4>
              <p class="text-slate-500 text-[10px] mt-0.5">Tanggal Pinjam: ${loan.borrowDate}</p>
              <p class="text-slate-500 text-[10px]">Perpanjangan: ${loan.extendedCount}/1 kali</p>
            </div>
          </div>
          <div class="pt-2 border-t flex justify-end gap-2">
            <button onclick="extendLoan('${loan.id}')" ${loan.extendedCount >= 1 ? 'disabled class="bg-slate-100 text-slate-400 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-not-allowed"' : 'class="bg-blue-50 text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition"'}>
              ${loan.extendedCount >= 1 ? 'Sudah Diperpanjang' : 'Perpanjang Masa Pinjam'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // History Render
  const historyContainer = document.getElementById('historyLoansContainer');
  if (historyLoans.length === 0) {
    historyContainer.innerHTML = `<p class="text-center text-xs text-slate-400 py-8">Belum ada riwayat pengembalian.</p>`;
  } else {
    historyContainer.innerHTML = historyLoans.map(loan => `
      <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-xs flex justify-between items-center">
        <div>
          <span class="font-mono text-[10px] text-slate-400">${loan.id}</span>
          <h4 class="font-bold text-slate-800 line-clamp-1">${loan.bookTitle}</h4>
          <p class="text-[10px] text-slate-500">Dikembalikan pada: ${loan.returnDate}</p>
        </div>
        <span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">Selesai</span>
      </div>
    `).join('');
  }
}

function switchLoanSubTab(tab) {
  const activeBtn = document.getElementById('tabActiveBtn');
  const historyBtn = document.getElementById('tabHistoryBtn');
  const activeBox = document.getElementById('activeLoansContainer');
  const historyBox = document.getElementById('historyLoansContainer');

  if (tab === 'active') {
    activeBtn.className = 'flex-1 py-2 rounded-lg bg-white text-primary shadow-sm transition-all';
    historyBtn.className = 'flex-1 py-2 rounded-lg text-slate-600 transition-all';
    activeBox.classList.remove('hidden');
    historyBox.classList.add('hidden');
  } else {
    historyBtn.className = 'flex-1 py-2 rounded-lg bg-white text-primary shadow-sm transition-all';
    activeBtn.className = 'flex-1 py-2 rounded-lg text-slate-600 transition-all';
    historyBox.classList.remove('hidden');
    activeBox.classList.add('hidden');
  }
}

function extendLoan(loanId) {
  const loan = loansDB.find(l => l.id === loanId);
  if (!loan || loan.extendedCount >= 1) return;

  // Extend 7 more days
  const currentDue = new Date(loan.dueDate);
  currentDue.setDate(currentDue.getDate() + 7);
  loan.dueDate = currentDue.toISOString().split('T')[0];
  loan.extendedCount += 1;

  activityLogs.unshift({
    text: `Perpanjangan ${loan.id} berhasil sampai ${loan.dueDate}`,
    time: "Baru saja"
  });

  showToast("Masa pinjam berhasil diperpanjang 7 hari!");
  renderApp();
}

function populateScanSelect() {
  const select = document.getElementById('quickScanSelect');
  select.innerHTML = booksDB.map(b => `
    <option value="${b.id}">${b.title} (${b.availableStock > 0 ? 'Tersedia' : 'Stok Habis'})</option>
  `).join('');
}

function triggerSimulatedScan() {
  const bookId = document.getElementById('quickScanSelect').value;
  openBookDetail(bookId);
}

function generateMemberQR() {
  const qrBox = document.getElementById('memberQrBox');
  qrBox.innerHTML = '';
  new QRCode(qrBox, {
    text: currentUser.id,
    width: 48,
    height: 48
  });
}

/* ================= ADMIN FUNCTIONS ================= */

function renderAdminDashboard() {
  document.getElementById('adminStatTotalBooks').innerText = booksDB.length;
  const activeCount = loansDB.filter(l => l.status === 'Dipinjam').length;
  document.getElementById('adminStatActiveLoans').innerText = activeCount;

  const logBox = document.getElementById('adminActivityLog');
  logBox.innerHTML = activityLogs.slice(0, 5).map(log => `
    <div class="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-center">
      <span class="text-slate-700 font-medium">${log.text}</span>
      <span class="text-[10px] text-slate-400 whitespace-nowrap ml-2">${log.time}</span>
    </div>
  `).join('');
}

function adminProcessReturn() {
  const input = document.getElementById('adminReturnInput').value.trim().toUpperCase();
  const loan = loansDB.find(l => l.id === input && l.status === 'Dipinjam');

  if (!loan) {
    showToast("ID Peminjaman tidak ditemukan atau sudah dikembalikan!");
    return;
  }

  // Process Return
  loan.status = 'Dikembalikan';
  loan.returnDate = new Date().toISOString().split('T')[0];

  // Restock book
  const book = booksDB.find(b => b.id === loan.bookId);
  if (book) book.availableStock += 1;

  activityLogs.unshift({
    text: `Buku ${loan.id} telah dikembalikan & ditandai selesai`,
    time: "Baru saja"
  });

  document.getElementById('adminReturnInput').value = '';
  showToast(`Pengembalian ${loan.id} Sukses!`);
  renderApp();
}

function renderAdminBooks() {
  const query = (document.getElementById('adminBookSearch')?.value || '').toLowerCase();
  const filtered = booksDB.filter(b => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query));

  const container = document.getElementById('adminBookList');
  container.innerHTML = filtered.map(book => `
    <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between text-xs">
      <div class="flex items-center gap-3">
        <img src="${book.cover}" class="w-10 h-14 object-cover rounded border" alt="Cover">
        <div>
          <h4 class="font-bold text-slate-800 line-clamp-1">${book.title}</h4>
          <p class="text-slate-500 text-[10px]">${book.author} | Stok: ${book.availableStock}/${book.totalStock}</p>
          <p class="text-slate-400 text-[9px]">Rak: ${book.rack}</p>
        </div>
      </div>
      <div class="flex gap-1.5">
        <button onclick="openBookModal('${book.id}')" class="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteAdminBook('${book.id}')" class="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Hapus">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function openBookModal(bookId = null) {
  const form = document.getElementById('adminBookForm');
  form.reset();

  if (bookId) {
    const book = booksDB.find(b => b.id === bookId);
    if (!book) return;
    document.getElementById('adminBookModalTitle').innerText = 'Edit Data Buku';
    document.getElementById('editBookId').value = book.id;
    document.getElementById('formTitle').value = book.title;
    document.getElementById('formAuthor').value = book.author;
    document.getElementById('formCategory').value = book.category;
    document.getElementById('formYear').value = book.year;
    document.getElementById('formTotalStock').value = book.totalStock;
    document.getElementById('formRack').value = book.rack;
    document.getElementById('formISBN').value = book.isbn;
    document.getElementById('formCover').value = book.cover;
    document.getElementById('formSynopsis').value = book.synopsis;
  } else {
    document.getElementById('adminBookModalTitle').innerText = 'Tambah Buku Baru';
    document.getElementById('editBookId').value = '';
  }

  openModal('adminBookModal');
}

function saveAdminBook(e) {
  e.preventDefault();
  const id = document.getElementById('editBookId').value;
  const title = document.getElementById('formTitle').value;
  const author = document.getElementById('formAuthor').value;
  const category = document.getElementById('formCategory').value;
  const year = parseInt(document.getElementById('formYear').value);
  const totalStock = parseInt(document.getElementById('formTotalStock').value);
  const rack = document.getElementById('formRack').value;
  const isbn = document.getElementById('formISBN').value;
  const cover = document.getElementById('formCover').value || 'https://via.placeholder.com/300x400?text=No+Cover';
  const synopsis = document.getElementById('formSynopsis').value;

  if (id) {
    // Edit existing
    const book = booksDB.find(b => b.id === id);
    if (book) {
      book.title = title;
      book.author = author;
      book.category = category;
      book.year = year;
      book.totalStock = totalStock;
      book.rack = rack;
      book.isbn = isbn;
      book.cover = cover;
      book.synopsis = synopsis;
      showToast("Data buku berhasil diperbarui");
    }
  } else {
    // Add new
    const newBook = {
      id: `BOK-00${booksDB.length + 1}`,
      title, author, category, year, totalStock,
      availableStock: totalStock,
      rack, isbn, cover, synopsis
    };
    booksDB.push(newBook);
    showToast("Buku baru berhasil ditambahkan!");
  }

  closeModal('adminBookModal');
  renderApp();
}

function deleteAdminBook(bookId) {
  if (confirm("Apakah Anda yakin ingin menghapus buku ini dari inventaris?")) {
    booksDB = booksDB.filter(b => b.id !== bookId);
    showToast("Buku berhasil dihapus");
    renderApp();
  }
}

function renderAdminTransactions() {
  document.getElementById('adminTxCount').innerText = `${loansDB.length} Data`;
  const container = document.getElementById('adminTxList');
  container.innerHTML = loansDB.map(tx => `
    <div class="p-3 flex justify-between items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="font-mono font-bold text-slate-800">${tx.id}</span>
          <span class="text-[9px] px-2 py-0.2 rounded-full font-bold ${tx.status === 'Dipinjam' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">${tx.status}</span>
        </div>
        <p class="font-medium text-slate-700 mt-0.5">${tx.bookTitle}</p>
        <p class="text-[10px] text-slate-400">Peminjam: ${tx.userName} (${tx.userId})</p>
      </div>
      <div class="text-right text-[10px] text-slate-500">
        <p>Jatuh Tempo:</p>
        <p class="font-bold text-slate-700">${tx.dueDate}</p>
      </div>
    </div>
  `).join('');
}

/* ================= UTILITY / MODAL HELPERS ================= */

function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

function openLocationModal() {
  openModal('locationModal');
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2 rounded-full shadow-2xl z-50 animate-bounce font-medium';
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}