
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  avatarUrl: string;
}

export interface Savings {
  mandatory: number; // Simpanan Wajib
  principal: number; // Simpanan Pokok
  voluntary: number; // Simpanan Sukarela
  termDeposit: number; // Simpanan Berjangka
}

export interface Transaction {
  id: string;
  memberId: string; // ID Anggota pemilik transaksi
  date: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'PURCHASE' | 'SHU_WITHDRAWAL';
  amount: number;
  profit?: number; // Keuntungan transaksi (Untuk Purchase)
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  description: string;
}

export interface Product {
  id: string;
  name: string;
  price: number; // Harga Jual
  buyPrice: number; // Harga Beli (HPP)
  category: string;
  stock: number;
  image: string;
  description?: string; // Keterangan Produk
  sku?: string; // Kode Barang
  supplierPhone?: string; // Telepon Supplier/Kontak
}

export interface SHUConfig {
  labaUsaha: number;
  allocations: {
    jasaModal: number; // 30%
    cadanganModal: number; // 25%
    jasaPengurus: number; // 15%
    danaPendidikan: number; // 5%
    infaq: number; // 5%
    jasaTransaksi: number; // 20%
  };
}

export interface CooperativeStats {
  totalMembers: number;
  totalAssets: number;
  totalLoans: number;
  totalSavings: number; // Total Simpanan Seluruh Anggota
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  target: 'USER' | 'ADMIN' | 'ALL'; // Field baru untuk menargetkan notifikasi
}

export interface JournalEntry {
  id: string;
  date: string;
  type: 'DEBIT' | 'CREDIT'; // DEBIT = Pemasukan (Kas Masuk), CREDIT = Pengeluaran (Kas Keluar)
  category: string; // Modal, Pendapatan, Beban Gaji, Beban Listrik, dll
  amount: number;
  description: string;
  referenceId?: string; // Jika terhubung dengan transaksi lain
  isCash?: boolean; // Whether this entry affects cash/bank balance directly
}