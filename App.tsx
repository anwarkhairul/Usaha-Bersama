import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UserDashboard, UserSavings, UserShop, UserSHU, UserProfile, UserInformation } from './views/UserViews';
import { AdminDashboard, AdminSHUManager, AdminMemberManagement, AdminInventory, AdminFinance, AdminReports, AdminSettings, AdminSavingsManager } from './views/AdminViews';
import { UserRole, Transaction, Product, User, SHUConfig, AppNotification, JournalEntry } from './types';
import { Lock, ArrowRight, User as UserIcon, Mail, Phone, CreditCard, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { AIChatWidget } from './components/AIChatWidget';
import { 
  MOCK_TRANSACTIONS, 
  MOCK_PENDING_APPROVALS, 
  MOCK_PRODUCTS, 
  MOCK_USER, 
  DEFAULT_SHU_CONFIG, 
  MOCK_NEWS,
  MOCK_STATS,
  MOCK_NOTIFICATIONS,
  formatIDR,
  MOCK_ADMIN
} from './services/mockDb';
import { supabase, isSupabaseConfigured } from './services/supabase';

// --- Auth Components ---

interface LoginPageProps {
  onLogin: (email: string, pass: string) => void;
  onSwitchToRegister: () => void;
  loading: boolean;
}

interface RegisterPageProps {
  onRegister: (data: any) => void;
  onSwitchToLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToRegister, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-emerald-100 flex flex-col md:flex-row">
        <div className="p-8 w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Selamat Datang</h1>
            <p className="text-slate-500 mt-2 text-sm">Masuk ke Sistem Koperasi UB Qurrotul ‘Ibaad</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email / ID Anggota</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" 
                  placeholder="nama@email.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" 
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-emerald-600"
                >
                  {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-900/10 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? 'Memproses...' : <><LogIn size={20} /> Masuk Sekarang</>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm mb-4">Belum menjadi anggota?</p>
            <button 
              onClick={onSwitchToRegister}
              className="text-emerald-600 font-bold hover:underline text-sm"
            >
              Daftar Anggota Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nik: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }
    onRegister(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Pendaftaran Anggota</h1>
            <p className="text-slate-500 mt-1 text-sm">Isi formulir di bawah untuk bergabung</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Nama Lengkap</label>
              <div className="relative mt-1">
                <UserIcon className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input required name="name" onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500" placeholder="Sesuai KTP" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">NIK (KTP)</label>
              <div className="relative mt-1">
                <CreditCard className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input required name="nik" type="number" onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500" placeholder="16 Digit NIK" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">No HP / WA</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input required name="phone" type="tel" onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500" placeholder="08..." />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input required name="email" type="email" onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500" placeholder="Email aktif" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input required name="password" type="password" onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500" placeholder="******" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Konfirmasi</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input required name="confirmPassword" type="password" onChange={handleChange} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500" placeholder="******" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2">
                <UserPlus size={20} /> Daftar Sekarang
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button onClick={onSwitchToLogin} className="text-sm text-slate-500 hover:text-emerald-600 font-medium">
              Sudah punya akun? Masuk disini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Storage Helper ---
const STORAGE_KEYS = {
  MEMBERS: 'ub_members',
  TRANSACTIONS: 'ub_transactions',
  PRODUCTS: 'ub_products',
  NOTIFICATIONS: 'ub_notifications',
  NEWS: 'ub_news',
  SHU_CONFIG: 'ub_shu_config',
  JOURNAL: 'ub_journal',
  SETTINGS: 'ub_settings'
};

const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Error loading ${key}`, e);
    return defaultValue;
  }
};

const App: React.FC = () => {
  // --- Centralized State (The "Database") ---
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [role, setRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Data States - Initialized from LocalStorage (Fallback)
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);
  
  const [members, setMembers] = useState<any[]>(() => loadFromStorage(STORAGE_KEYS.MEMBERS, []));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadFromStorage(STORAGE_KEYS.TRANSACTIONS, []));
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage(STORAGE_KEYS.PRODUCTS, []));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, []));
  const [news, setNews] = useState(() => loadFromStorage(STORAGE_KEYS.NEWS, []));
  const [shuConfig, setShuConfig] = useState<SHUConfig>(() => loadFromStorage(STORAGE_KEYS.SHU_CONFIG, DEFAULT_SHU_CONFIG));
  const [journal, setJournal] = useState<JournalEntry[]>(() => loadFromStorage(STORAGE_KEYS.JOURNAL, []));
  const [appSettings, setAppSettings] = useState(() => loadFromStorage(STORAGE_KEYS.SETTINGS, {
    name: 'Koperasi UB Qurrotul ‘Ibaad',
    email: 'admin@ub-qurrotul.id',
    address: 'Jl. Koperasi No. 1, Jakarta Pusat, DKI Jakarta 10110',
    phone: '(021) 555-0123'
  }));

  // --- Supabase Persistence ---
  useEffect(() => {
    const initData = async () => {
      if (!isSupabaseConfigured()) return;
      
      try {
        console.log("Loading data from Supabase...");
        
        // Members
        const { data: dbMembers } = await supabase.from('members').select('*');
        if (dbMembers && dbMembers.length > 0) {
           setMembers(dbMembers.map((m: any) => ({
             id: m.id, name: m.name, email: m.email, phone: m.phone, 
             nik: m.nik, password: m.password, role: m.role || 'USER', 
             joinDate: m.join_date, status: m.status, avatarUrl: m.avatar_url
           })));
        }

        // Transactions
        const { data: dbTrx } = await supabase.from('transactions').select('*');
        if (dbTrx && dbTrx.length > 0) {
            setTransactions(dbTrx.map((t: any) => ({
              id: t.id, memberId: t.member_id, date: t.date, type: t.type,
              amount: t.amount, profit: t.profit, status: t.status, description: t.description
            })));
        }

        // Products
        const { data: dbProd } = await supabase.from('products').select('*');
        if (dbProd && dbProd.length > 0) {
            setProducts(dbProd.map((p: any) => ({
               id: p.id, name: p.name, price: p.price, buyPrice: p.buy_price,
               stock: p.stock, category: p.category, image: p.image,
               description: p.description, sku: p.sku, supplierPhone: p.supplier_phone
            })));
        }
        
        // News
        const { data: dbNews } = await supabase.from('news').select('*');
        if (dbNews) setNews(dbNews);

        // Journal
        const { data: dbJournal } = await supabase.from('journal').select('*');
        if (dbJournal) {
             setJournal(dbJournal.map((j: any) => ({
                 id: j.id, date: j.date, type: j.type, category: j.category,
                 amount: j.amount, description: j.description, 
                 referenceId: j.reference_id, isCash: j.is_cash
             })));
        }

        // Settings (Optional/Placeholder)
        // const { data: dbSettings } = await supabase.from('app_settings').select('*');
        
      } catch (err) {
        console.error("Supabase load error:", err);
      }
    };
    initData();
  }, []);

  // --- Persistence Effects (Auto-Save Local) ---
  useEffect(() => localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members)), [members]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)), [notifications]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news)), [news]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.SHU_CONFIG, JSON.stringify(shuConfig)), [shuConfig]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journal)), [journal]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(appSettings)), [appSettings]);


  // --- Real-time Financial Calculations ---
  const calculateFinancialData = () => {
    const approvedTrx = transactions.filter(t => t.status === 'APPROVED');
    
    // 1. Total Simpanan
    const totalSavings = approvedTrx.reduce((acc, t) => {
        if (t.type === 'DEPOSIT' || t.type === 'PAYMENT') return acc + t.amount;
        if (t.type === 'WITHDRAWAL' || t.type === 'SHU_WITHDRAWAL') return acc - t.amount;
        return acc;
    }, 0);

    // 2. Eligible Savings for SHU
    const totalEligibleSavings = approvedTrx.reduce((acc, t) => {
        if (t.type === 'WITHDRAWAL' || t.type === 'SHU_WITHDRAWAL') return acc - t.amount;
        if (t.type === 'DEPOSIT' || t.type === 'PAYMENT') {
            const isMandatory = t.description.toLowerCase().includes('wajib');
            if (isMandatory) {
                const date = new Date(t.date);
                const day = date.getDate();
                if (day > 10) return acc; 
            }
            return acc + t.amount;
        }
        return acc;
    }, 0);

    // 3. Revenue & HPP
    const totalRevenue = approvedTrx
        .filter(t => t.type === 'PURCHASE')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalHPP = approvedTrx
        .filter(t => t.type === 'PURCHASE')
        .reduce((acc, t) => acc + (t.amount - (t.profit || 0)), 0);
    
    const grossProfit = totalRevenue - totalHPP;
    const operationalExpenses = totalRevenue * 0.05;
    const netIncome = grossProfit - operationalExpenses;

    const totalMemberPurchases = approvedTrx
        .filter(t => t.type === 'PURCHASE' && t.memberId !== 'NON-MEMBER')
        .reduce((acc, t) => acc + t.amount, 0);

    return {
      totalSavings, 
      totalEligibleSavings, 
      totalRevenue,
      totalHPP,
      operationalExpenses,
      netIncome,
      grossProfit,
      totalMemberPurchases
    };
  };

  const financialData = calculateFinancialData();

  const calculateTotalAssets = () => {
    const cashBalance = transactions
      .filter(t => t.status === 'APPROVED')
      .reduce((acc, t) => {
        if (['DEPOSIT', 'PAYMENT', 'PURCHASE'].includes(t.type)) return acc + t.amount;
        if (['WITHDRAWAL', 'SHU_WITHDRAWAL'].includes(t.type)) return acc - t.amount;
        return acc;
      }, 0);
      
    const inventoryValue = products.reduce((acc, p) => acc + (p.buyPrice * p.stock), 0);
    
    return cashBalance + inventoryValue;
  };
  const dynamicAssets = calculateTotalAssets();

  const calculateWalletBalance = (userId: string) => {
    const userTrx = transactions.filter(t => t.memberId === userId && t.status === 'APPROVED');
    const deposits = userTrx
        .filter(t => t.type === 'DEPOSIT' || t.type === 'PAYMENT')
        .reduce((sum, t) => sum + t.amount, 0);
    const withdrawals = userTrx
        .filter(t => t.type === 'WITHDRAWAL' || t.type === 'SHU_WITHDRAWAL')
        .reduce((sum, t) => sum + t.amount, 0);
    return deposits - withdrawals;
  };

  const currentWalletBalance = role === UserRole.USER ? calculateWalletBalance(currentUser.id) : 0;

  // --- Helper: Auto-Record Journal & Sync ---
  const recordJournalFromTransaction = async (trx: Transaction) => {
    let journalType: 'DEBIT' | 'CREDIT' = 'DEBIT';
    let category = 'Umum';
    let isCash = true;

    if (trx.type === 'DEPOSIT' || trx.type === 'PAYMENT') {
        journalType = 'DEBIT'; category = 'Simpanan Anggota';
    } else if (trx.type === 'PURCHASE') {
        journalType = 'DEBIT'; category = 'Penjualan Toko';
    } else if (trx.type === 'WITHDRAWAL') {
        journalType = 'CREDIT'; category = 'Simpanan Anggota';
    } else if (trx.type === 'SHU_WITHDRAWAL') {
        journalType = 'CREDIT'; category = 'Beban SHU';
    }

    const newJournal: JournalEntry = {
        id: `JRN-${trx.id}`,
        date: trx.date,
        type: journalType,
        category: category,
        amount: trx.amount,
        description: `Otomatis: ${trx.description} (${trx.memberId})`,
        referenceId: trx.id,
        isCash: isCash
    };

    let entriesToAdd = [newJournal];

    if (trx.type === 'PURCHASE') {
        const costOfGoods = trx.amount - (trx.profit || 0);
        if (costOfGoods > 0) {
            entriesToAdd.push({
                id: `JRN-HPP-${trx.id}`, date: trx.date, type: 'CREDIT',
                category: 'Beban Pokok Penjualan', amount: costOfGoods,
                description: `HPP Penjualan: ${trx.description}`, referenceId: trx.id, isCash: false
            });
        }
        const opsExpense = trx.amount * 0.05;
        if (opsExpense > 0) {
            entriesToAdd.push({
                id: `JRN-OPS-${trx.id}`, date: trx.date, type: 'CREDIT',
                category: 'Beban Operasional (5% Omzet)', amount: opsExpense,
                description: `Beban Ops 5% dari: ${trx.description}`, referenceId: trx.id, isCash: false
            });
        }
    }

    setJournal(prev => [...entriesToAdd, ...prev]);

    // Sync Journal to Supabase
    if (isSupabaseConfigured()) {
        const dbEntries = entriesToAdd.map(e => ({
            id: e.id, date: e.date, type: e.type, category: e.category,
            amount: e.amount, description: e.description, reference_id: e.referenceId, is_cash: e.isCash
        }));
        await supabase.from('journal').insert(dbEntries);
    }
  };

  // --- Auth Handlers ---

  const handleLogin = (email: string, pass: string) => {
    // 1. Check Admin
    if (email === MOCK_ADMIN.email && pass === 'Admin123') {
      setCurrentUser(MOCK_ADMIN);
      setRole(UserRole.ADMIN);
      setActiveTab('dashboard');
      return;
    }

    // 2. Check Members
    const member = members.find(m => m.email === email && m.password === pass);
    if (member) {
      if (member.status === 'Non-Aktif') {
        alert("Akun Anda sedang dinonaktifkan. Hubungi Admin.");
        return;
      }
      const userObj: User = {
        id: member.id,
        name: member.name,
        email: member.email,
        role: UserRole.USER,
        joinDate: member.joinDate,
        status: member.status,
        avatarUrl: member.avatarUrl || `https://ui-avatars.com/api/?name=${member.name}&background=10b981&color=fff`
      };
      setCurrentUser(userObj);
      setRole(UserRole.USER);
      setActiveTab('dashboard');
      return;
    }

    alert("Email atau password salah!");
  };

  const handleRegister = async (data: any) => {
    if (members.some(m => m.email === data.email)) {
      alert("Email sudah terdaftar!");
      return;
    }

    const newMember = {
      id: `USR-${String(members.length + 1).padStart(3, '0')}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      nik: data.nik,
      password: data.password,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Aktif',
      avatarUrl: `https://ui-avatars.com/api/?name=${data.name}&background=10b981&color=fff`
    };

    setMembers([...members, newMember]);
    
    // Sync Member
    if(isSupabaseConfigured()) {
        await supabase.from('members').insert([{
             id: newMember.id, name: newMember.name, email: newMember.email, 
             phone: newMember.phone, nik: newMember.nik, password: newMember.password,
             role: 'USER', join_date: newMember.joinDate, status: newMember.status,
             avatar_url: newMember.avatarUrl
        }]);
    }

    alert("Pendaftaran berhasil! Silakan login.");
    setAuthMode('LOGIN');
  };

  const handleLogout = () => {
    setRole(null);
    setAuthMode('LOGIN');
    setCurrentUser(MOCK_USER); 
  };

  // --- Actions / Handlers ---
  
  const handleUpdateUser = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    
    setMembers(prev => prev.map(m => m.id === updatedUser.id ? {
      ...m, 
      name: updatedUser.name,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl
    } : m));

    if(isSupabaseConfigured()) {
        await supabase.from('members').update({
            name: updatedUser.name, email: updatedUser.email, avatar_url: updatedUser.avatarUrl
        }).eq('id', updatedUser.id);
    }
  };

  const addNotification = async (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR', target: 'USER' | 'ADMIN' | 'ALL') => {
      const newNotif: AppNotification = {
          id: `NOTIF-${Date.now()}`,
          title, message, date: 'Baru saja', isRead: false, type, target
      };
      setNotifications(prev => [newNotif, ...prev]);

      if(isSupabaseConfigured()) {
          await supabase.from('notifications').insert([{
             id: newNotif.id, title, message, date: new Date().toISOString(),
             is_read: false, type, target
          }]);
      }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    // Optional: Sync read status
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Transactions
  const handleAddTransaction = async (trx: Transaction) => {
    const transactionWithUser = { ...trx, memberId: trx.memberId || currentUser.id };
    setTransactions([transactionWithUser, ...transactions]);
    
    // Sync Transaction
    if(isSupabaseConfigured()) {
        await supabase.from('transactions').insert([{
              id: trx.id, member_id: trx.memberId || currentUser.id,
              date: trx.date, type: trx.type, amount: trx.amount,
              profit: trx.profit || 0, status: trx.status, description: trx.description
        }]);
    }
    
    if (transactionWithUser.status === 'PENDING') {
        addNotification(
            'Transaksi Baru Masuk', 
            `Anggota melakukan ${transactionWithUser.description} sebesar ${formatIDR(transactionWithUser.amount)}. Harap verifikasi.`, 
            'INFO', 'ADMIN'
        );
    } else if (transactionWithUser.status === 'APPROVED') {
        recordJournalFromTransaction(transactionWithUser);
    }
  };

  const handleUpdateTransactionStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    
    if(isSupabaseConfigured()) {
        await supabase.from('transactions').update({ status }).eq('id', id);
    }

    const trx = transactions.find(t => t.id === id);
    if (trx) {
        if (status === 'APPROVED') {
            addNotification('Transaksi Disetujui', `Permintaan ${trx.description} disetujui.`, 'SUCCESS', 'USER');
            recordJournalFromTransaction(trx);
        } else {
            addNotification('Transaksi Ditolak', `Permintaan ${trx.description} ditolak.`, 'ERROR', 'USER');
        }
    }
  };

  // Products
  const handleAddProduct = async (product: Product) => {
    setProducts([...products, product]);

    if(isSupabaseConfigured()) {
        await supabase.from('products').insert([{
             id: product.id, name: product.name, price: product.price, buy_price: product.buyPrice,
             stock: product.stock, category: product.category, image: product.image,
             description: product.description, sku: product.sku, supplier_phone: product.supplierPhone
        }]);
    }
    
    // Journal: Stock Purchase
    const initialStockCost = (product.buyPrice || 0) * (product.stock || 0);
    if (initialStockCost > 0) {
        const journalEntry: JournalEntry = {
            id: `JRN-MODAL-${Date.now()}`, date: new Date().toISOString().split('T')[0],
            type: 'CREDIT', category: 'Belanja Barang/Produk', amount: initialStockCost,
            description: `Belanja Modal Usaha: ${product.name} (${product.stock} unit)`,
            referenceId: product.id, isCash: true
        };
        setJournal(prev => [journalEntry, ...prev]);
        
        if(isSupabaseConfigured()) {
             await supabase.from('journal').insert([{
                 id: journalEntry.id, date: journalEntry.date, type: journalEntry.type,
                 category: journalEntry.category, amount: journalEntry.amount,
                 description: journalEntry.description, reference_id: journalEntry.referenceId, is_cash: true
             }]);
        }
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    const oldProduct = products.find(p => p.id === updatedProduct.id);
    if (oldProduct && updatedProduct.stock > oldProduct.stock) {
         const addedQty = updatedProduct.stock - oldProduct.stock;
         const restockCost = addedQty * (updatedProduct.buyPrice || 0);
         
         if (restockCost > 0) {
             const journalEntry: JournalEntry = {
                 id: `JRN-RESTOCK-${Date.now()}`, date: new Date().toISOString().split('T')[0],
                 type: 'CREDIT', category: 'Belanja Barang/Produk', amount: restockCost,
                 description: `Restock Modal Usaha: ${updatedProduct.name} (+${addedQty} unit)`,
                 referenceId: updatedProduct.id, isCash: true
             };
             setJournal(prev => [journalEntry, ...prev]);
             if(isSupabaseConfigured()) {
                 await supabase.from('journal').insert([{
                     id: journalEntry.id, date: journalEntry.date, type: journalEntry.type,
                     category: journalEntry.category, amount: journalEntry.amount,
                     description: journalEntry.description, reference_id: journalEntry.referenceId, is_cash: true
                 }]);
            }
         }
    }
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));

    if(isSupabaseConfigured()) {
        await supabase.from('products').update({
             name: updatedProduct.name, price: updatedProduct.price, buy_price: updatedProduct.buyPrice,
             stock: updatedProduct.stock, category: updatedProduct.category, image: updatedProduct.image,
             description: updatedProduct.description, sku: updatedProduct.sku, supplier_phone: updatedProduct.supplierPhone
        }).eq('id', updatedProduct.id);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if(isSupabaseConfigured()) await supabase.from('products').delete().eq('id', id);
  };

  const handleProductStockUpdate = async (id: string, qtyObj: number) => {
     setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: p.stock - qtyObj } : p));
     if(isSupabaseConfigured()) {
         // This assumes we have the latest stock, a real implementation would decrement in SQL
         const prod = products.find(p => p.id === id);
         if(prod) await supabase.from('products').update({stock: prod.stock - qtyObj}).eq('id', id);
     }
  };

  // Members
  const handleAddMember = async (member: any) => {
    setMembers([...members, member]);
    if(isSupabaseConfigured()) {
        await supabase.from('members').insert([{
             id: member.id, name: member.name, email: member.email, 
             phone: member.phone, nik: member.nik, password: member.password,
             role: 'USER', join_date: member.joinDate, status: member.status,
             avatar_url: member.avatarUrl
        }]);
    }
  };

  const handleUpdateMember = async (updatedMember: any) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    if(isSupabaseConfigured()) {
        await supabase.from('members').update({
            name: updatedMember.name, email: updatedMember.email, 
            phone: updatedMember.phone, nik: updatedMember.nik, status: updatedMember.status
        }).eq('id', updatedMember.id);
    }
  };

  const handleDeleteMember = async (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    if(isSupabaseConfigured()) await supabase.from('members').delete().eq('id', id);
  };

  // Configs
  const handleUpdateSHUConfig = (newConfig: SHUConfig) => {
    setShuConfig(newConfig);
    // Sync logic for config could be added here
  };

  const handleUpdateSettings = (newSettings: any) => {
    setAppSettings({ ...appSettings, ...newSettings });
  };

  const handleAddNews = async (newItem: any) => {
    setNews([newItem, ...news]);
    addNotification('Pengumuman Baru', newItem.title, 'INFO', 'ALL');
    if(isSupabaseConfigured()) {
        await supabase.from('news').insert([{id: newItem.id, title: newItem.title, content: newItem.content, date: newItem.date}]);
    }
  };

  const handleDeleteNews = async (id: number) => {
    setNews(prev => prev.filter(n => n.id !== id));
    if(isSupabaseConfigured()) await supabase.from('news').delete().eq('id', id);
  };

  const handleAddJournalEntry = async (entry: JournalEntry) => {
    setJournal(prev => [entry, ...prev]);
    if(isSupabaseConfigured()) {
        await supabase.from('journal').insert([{
             id: entry.id, date: entry.date, type: entry.type,
             category: entry.category, amount: entry.amount,
             description: entry.description, reference_id: entry.referenceId, is_cash: entry.isCash
        }]);
    }
  };

  // Import/Export Logic
  const handleExportData = () => {
    const data = {
      members, transactions, products, settings: appSettings, news, shuConfig, journal, notifications
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-ub-qurrotul-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportData = (data: any) => {
    if (confirm('Import data akan menimpa semua data saat ini. Lanjutkan?')) {
        try {
            if(data.members) setMembers(data.members);
            if(data.transactions) setTransactions(data.transactions);
            if(data.products) setProducts(data.products);
            if(data.settings) setAppSettings(data.settings);
            if(data.news) setNews(data.news);
            if(data.shuConfig) setShuConfig(data.shuConfig);
            if(data.journal) setJournal(data.journal);
            if(data.notifications) setNotifications(data.notifications);
            alert("Data berhasil dipulihkan!");
        } catch(e) {
            alert("Gagal memuat data. Format file mungkin salah.");
            console.error(e);
        }
    }
  };

  // Filter transactions for current user view
  const userTransactions = transactions.filter(t => t.memberId === currentUser.id);

  // Content Renderer
  const renderContent = () => {
    if (role === UserRole.USER) {
      return (
        <>
          {activeTab === 'dashboard' && (
            <UserDashboard 
                onNavigate={setActiveTab} 
                transactions={userTransactions} 
                shuConfig={shuConfig}
                financialData={financialData}
            />
          )}
          {activeTab === 'simpanan' && (
            <UserSavings 
                user={currentUser}
                transactions={userTransactions} 
                onAddTransaction={handleAddTransaction} 
            />
          )}
          {activeTab === 'unit_usaha' && (
            <UserShop 
                user={currentUser}
                products={products} 
                onAddTransaction={handleAddTransaction} 
            />
          )}
          {activeTab === 'shu' && (
            <UserSHU 
                user={currentUser}
                shuConfig={shuConfig} 
                transactions={userTransactions}
                onAddTransaction={handleAddTransaction}
                financialData={financialData} 
            />
          )}
          {activeTab === 'profil' && (
            <UserProfile 
                user={currentUser} 
                onUpdateUser={handleUpdateUser} 
            />
          )}
          {activeTab === 'informasi' && (
            <UserInformation 
                news={news} 
                settings={appSettings} 
            />
          )}
        </>
      );
    } else {
      return (
        <>
          {activeTab === 'dashboard' && (
            <AdminDashboard 
                onNavigate={setActiveTab} 
                transactions={transactions}
                members={members}
                assets={dynamicAssets} 
                onUpdateTransactionStatus={handleUpdateTransactionStatus}
                financialData={financialData}
            />
          )}
          {activeTab === 'shu_adm' && (
            <AdminSHUManager 
                shuConfig={shuConfig} 
                onUpdateSHUConfig={handleUpdateSHUConfig}
                financialData={financialData}
            />
          )}
          {activeTab === 'anggota' && (
            <AdminMemberManagement 
                members={members} 
                onAddMember={handleAddMember}
                onUpdateMember={handleUpdateMember}
                onDeleteMember={handleDeleteMember}
            />
          )}
          {activeTab === 'unit_usaha_adm' && (
            <AdminInventory 
                products={products} 
                members={members}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateStock={handleProductStockUpdate}
                onAddTransaction={handleAddTransaction}
            />
          )}
          {activeTab === 'keuangan' && (
             <AdminFinance 
                journal={journal}
                onAddJournalEntry={handleAddJournalEntry}
             />
          )}
          {activeTab === 'laporan' && (
             <AdminReports 
                transactions={transactions} 
                members={members}
                products={products}
                journal={journal}
                financialData={financialData}
                shuConfig={shuConfig}
             />
          )}
          {activeTab === 'pengaturan' && (
             <AdminSettings 
                settings={appSettings} 
                news={news}
                onUpdateSettings={handleUpdateSettings}
                onAddNews={handleAddNews}
                onDeleteNews={handleDeleteNews}
                onExportData={handleExportData}
                onImportData={handleImportData}
             />
          )}
          {activeTab === 'simpanan_adm' && (
            <AdminSavingsManager 
                transactions={transactions} 
                members={members}
                onUpdateTransactionStatus={handleUpdateTransactionStatus}
                onAddTransaction={handleAddTransaction}
            />
          )}
        </>
      );
    }
  };

  if (!role) {
    return authMode === 'LOGIN' ? (
      <LoginPage 
        onLogin={handleLogin} 
        onSwitchToRegister={() => setAuthMode('REGISTER')} 
        loading={false}
      />
    ) : (
      <RegisterPage 
        onRegister={handleRegister} 
        onSwitchToLogin={() => setAuthMode('LOGIN')} 
      />
    );
  }

  // Filter notifications based on Role
  const visibleNotifications = notifications.filter(n => n.target === 'ALL' || n.target === role);

  return (
    <Layout 
      user={currentUser}
      role={role} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      notifications={visibleNotifications}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      walletBalance={currentWalletBalance}
      isCloudMode={isSupabaseConfigured()}
    >
      {renderContent()}
      <AIChatWidget />
    </Layout>
  );
};

export default App;