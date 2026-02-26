import axios, { AxiosInstance, AxiosResponse } from 'axios';

/// <reference types="vite/client" />


// Extend ImportMetaEnv hanya untuk variabel custom project ini.
// DEV, MODE, PROD sudah di-declare oleh vite/client — tidak perlu di-declare ulang.
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_TIMEOUT?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const SESSION_IDLE_TIMEOUT_MS = 24 * 60 * 60 * 1000;
const LAST_ACTIVITY_KEY = 'lastActivityAt';

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('[API Config] Base URL:', API_BASE_URL);
  console.log('[API Config] Environment:', import.meta.env.MODE);
}

// Log API URL for debugging
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${BACKEND_URL}${cleanPath}`;
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface IUser {
  id?: number;
  email: string;
  password?: string;
  name: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: IUser;
  token: string;
}

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
  password?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  service?: 'website' | 'undangan' | 'desain' | 'katalog';
  budget?: '< 1jt' | '1-3jt' | '3-5jt' | '5-10jt' | '> 10jt';
  status: 'new' | 'read' | 'responded' | 'active' | 'inactive';
  cpanelUrl?: string;
  cpanelUsername?: string;
  cpanelPassword?: string;
  packageStartDate?: string | Date | null;
  packageDuration?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Portfolio {
  id: number;
  title: string;
  category: 'website' | 'undangan' | 'desain' | 'katalog' | 'fotografi';
  description: string;
  image: string;
  client: string;
  technologies?: string;
  link?: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type PortfolioFormData = Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'> & {
  imageFile?: File | null;
};

export interface Invoice {
  id: number;
  invoiceNumber: string;
  clientId?: number;
  clientName?: string;
  clientEmail?: string;
  client?: {
    id: number;
    name: string;
    email?: string;
    company?: string;
  };
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  service?: 'website' | 'undangan' | 'desain' | 'katalog';
  priceBreakdown?: string | null;
  description?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Finance {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod?: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Report {
  id: number;
  title: string;
  type: 'clients' | 'invoices' | 'finance' | 'performance';
  period: string;
  data: any;
  generatedBy: number;
  createdAt?: string;
  updatedAt?: string;
}

// ── Checkout types ────────────────────────────────────────────────────────────

export interface CheckoutItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface CheckoutPayload {
  name: string;
  email: string;
  phone: string;
  items: CheckoutItem[];
  totalPrice: number;
}

export interface PaymentLinkResponse {
  token: string;
  paymentUrl: string;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate invoice number: INV-YYYYMMDD-XXXXX
 * Contoh: INV-20260221-A3F9B
 */
const generateInvoiceNumber = (): string => {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `INV-${date}-${rand}`;
};

export interface PackageSnapTokenPayload {
  name: string;
  email: string;
  phone?: string;
}

export interface PackageSnapTokenResponse {
  orderId: string;
  packageId: number;
  packageTitle: string;
  token: string;
  redirectUrl: string;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;
  private activeRequests: number = 0;
  private loadingListeners: Array<(loading: boolean) => void> = [];

  constructor(baseUrl: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.loadToken();
    this.setupInterceptors();
  }

  private decodeJwtPayload(token: string): Record<string, any> | null {
    if (typeof window === 'undefined') return null;
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      const decoded = window.atob(padded);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== 'number') return false;
    return Date.now() >= payload.exp * 1000;
  }

  private markActivity(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  }

  private isIdleExpired(): boolean {
    if (typeof window === 'undefined') return false;
    const raw = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!raw) return false;
    const lastActivity = Number(raw);
    if (!Number.isFinite(lastActivity)) return false;
    return Date.now() - lastActivity > SESSION_IDLE_TIMEOUT_MS;
  }

  private clearAuthStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  }

  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (this.token) {
        if (this.isIdleExpired() || this.isTokenExpired(this.token)) {
          this.setToken(null);
          return;
        }
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        this.markActivity();
      }
    }
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          if (this.isIdleExpired() || this.isTokenExpired(this.token)) {
            this.setToken(null);
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            return Promise.reject(new Error('Sesi login berakhir setelah 24 jam tidak aktif. Silakan login kembali.'));
          }
          config.headers.Authorization = `Bearer ${this.token}`;
          this.markActivity();
        }
        if (import.meta.env.DEV) {
          console.log('[API Request]', config.method?.toUpperCase(), config.url);
        }
        this.activeRequests = this.activeRequests + 1;
        this.emitLoading(true);
        return config;
      },
      (error) => {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
        if (this.activeRequests === 0) this.emitLoading(false);
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {

        this.activeRequests = Math.max(0, this.activeRequests - 1);
        if (this.activeRequests === 0) this.emitLoading(false);
        return response;

        if (this.token) {
          this.markActivity();
        }
        // decrement active requests and notify
        this.activeRequests = Math.max(0, this.activeRequests - 1)
        if (this.activeRequests === 0) this.emitLoading(false)
        return response
      },
      (error) => {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
        if (this.activeRequests === 0) this.emitLoading(false);

        if (error.response?.status === 401) {
          this.setToken(null);
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  onLoadingChange(cb: (loading: boolean) => void) {
    this.loadingListeners.push(cb);
  }

  offLoadingChange(cb: (loading: boolean) => void) {
    this.loadingListeners = this.loadingListeners.filter((f) => f !== cb);
  }

  private emitLoading(loading: boolean) {
    try {
      this.loadingListeners.forEach((cb) => {
        try { cb(loading); } catch (e) { }
      });
    } catch { }
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('token', token);
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      this.markActivity();
    } else {
      this.clearAuthStorage();
      delete this.axiosInstance.defaults.headers.common['Authorization'];
    }
  }

  async request<T>(
    endpoint: string,
    method: string = 'GET',
    data?: any,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance({
        url: endpoint,
        method,
        data,
      });

      return response.data;
    } catch (error: any) {
      console.error('[API Error]', error);

      if (error.response) {
        const message = error.response.data?.message || error.response.data?.error || `HTTP error! status: ${error.response.status}`;
        throw new Error(message);
      } else if (error.request) {
        console.error('[API Error] No response received:', error.request);
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau hubungi administrator.');
      } else {
        throw new Error(error.message || 'Terjadi kesalahan yang tidak terduga');
      }
    }
  }

  // ── Auth endpoints ──────────────────────────────────────────────────────────

  async register(email: string, password: string, name: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', 'POST', { email, password, name });
    if (response.data?.token) this.setToken(response.data.token);
    return response;
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', 'POST', { email, password });
    if (response.data?.token) this.setToken(response.data.token);
    return response;
  }

  async logout(): Promise<void> {
    this.setToken(null);
  }

  

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.request<any>('/auth/profile', 'GET');
    if (response.data && response.data.user) response.data = response.data.user;
    return response as ApiResponse<User>;
  }

  // ── Checkout ───────────────────────────────────────────────────────────────
  //
  // ✅ TIDAK ada skipAuth — token dikirim otomatis oleh interceptor jika ada.
  //
  // Behaviour:
  //   • User SUDAH LOGIN  → token terkirim → backend decode → req.user terisi
  //                       → backend cari contact by email → clientId terisi ✅
  //   • User BELUM LOGIN  → tidak ada token → optionalAuthMiddleware set req.user=undefined
  //                       → clientId = null ✅ (tidak error FK)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * STEP 1: Buat invoice dari data checkout.
   * Route POST /invoices pakai optionalAuthMiddleware di backend.
   */
  async checkoutCreateInvoice(payload: CheckoutPayload): Promise<ApiResponse<Invoice>> {
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const body = {
      invoiceNumber: generateInvoiceNumber(),
      clientName: payload.name,
      clientEmail: payload.email,
      phone: payload.phone,           // ← tambah phone agar auto-create contact lengkap
      amount: payload.totalPrice,
      status: 'sent',
      issueDate: today,
      dueDate,
      service: (payload.items[0]?.category as Invoice['service']) ?? 'website',
      description: payload.items.map((i) => `${i.name} ×${i.quantity}`).join(', '),
      priceBreakdown: payload.items.map((i) => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
      })),
    };

    // Cek apakah user sudah login
    const isLoggedIn = !!this.token;

    // Gunakan route yang sesuai
    return this.request<Invoice>(isLoggedIn ? '/invoices' : '/invoices/noLogin', 'POST', body);
  }

  /**
   * STEP 2: Generate Midtrans payment link dari invoice yang sudah dibuat.
   * Route POST /invoices/:id/payment-link pakai optionalAuthMiddleware di backend.
   */
  async checkoutGeneratePaymentLink(invoiceId: number | string): Promise<ApiResponse<PaymentLinkResponse>> {
  const isLoggedIn = !!this.token;

  return this.request<PaymentLinkResponse>(
    isLoggedIn
      ? `/invoices/${invoiceId}/payment-link`
      : `/invoices/noLogin/${invoiceId}/payment-link`,
    'POST'
  );
}




  // ── Contact endpoints ───────────────────────────────────────────────────────

  async submitContact(data: Omit<Contact, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Contact>> {
    return this.request<Contact>('/contacts', 'POST', data);
  }

  async getContacts(): Promise<ApiResponse<Contact[]>> {
    const response = await this.request<any>('/contacts', 'GET');
    if (response.data && response.data.items) response.data = response.data.items;
    return response as ApiResponse<Contact[]>;
  }

  async getContact(id: string): Promise<ApiResponse<Contact>> {
    return this.request<Contact>(`/contacts/${id}`, 'GET');
  }

  async updateContactStatus(id: string, status: Contact['status']): Promise<ApiResponse<Contact>> {
    return this.request<Contact>(`/contacts/${id}/status`, 'PUT', { status });
  }

  async updateContact(id: string, data: Partial<Contact>): Promise<ApiResponse<Contact>> {
    return this.request<Contact>(`/contacts/${id}`, 'PUT', data);
  }

  async deleteContact(id: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`/contacts/${id}`, 'DELETE');
  }

  // ── User endpoints ──────────────────────────────────────────────────────────

  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/users', 'GET');
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, 'GET');
  }

  async createUser(data: { name: string; email: string; password: string; role: string }): Promise<ApiResponse<User>> {
    return this.request<User>('/users', 'POST', data);
  }

  async updateUser(id: string, data: { name: string; email: string; password?: string; role: string }): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`, 'PUT', data);
  }

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/users/${id}`, 'DELETE');
  }

  // ── Portfolio endpoints ─────────────────────────────────────────────────────

  async getPortfolios(category?: Portfolio['category'], featured?: boolean): Promise<ApiResponse<Portfolio[]>> {
    let url = '/portfolios';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (featured) params.append('featured', 'true');
    if (params.toString()) url += `?${params.toString()}`;
    const response = await this.request<any>(url, 'GET');
    if (response.data && response.data.items) response.data = response.data.items;
    return response as ApiResponse<Portfolio[]>;
  }

  private buildPortfolioFormData(data: Partial<PortfolioFormData>): FormData {
    const formData = new FormData();
    if (data.imageFile) formData.append('image', data.imageFile);
    if (data.title !== undefined) formData.append('title', data.title);
    if (data.category !== undefined) formData.append('category', data.category);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.client !== undefined) formData.append('client', data.client);
    if (data.technologies !== undefined) formData.append('technologies', data.technologies);
    if (data.link !== undefined) formData.append('link', data.link ?? '');
    if (data.featured !== undefined) formData.append('featured', String(data.featured));
    return formData;
  }

  async createPortfolio(data: PortfolioFormData): Promise<ApiResponse<Portfolio>> {
    try {
      const response = await this.axiosInstance.post('/portfolios', this.buildPortfolioFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) throw new Error(error.response.data?.message || 'Gagal menambahkan portfolio');
      throw new Error(error.message || 'Terjadi kesalahan yang tidak terduga');
    }
  }

  async updatePortfolio(id: string, data: Partial<PortfolioFormData>): Promise<ApiResponse<Portfolio>> {
    try {
      const response = await this.axiosInstance.put(`/portfolios/${id}`, this.buildPortfolioFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) throw new Error(error.response.data?.message || 'Gagal mengupdate portfolio');
      throw new Error(error.message || 'Terjadi kesalahan yang tidak terduga');
    }
  }

  async deletePortfolio(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/portfolios/${id}`, 'DELETE');
  }

  // ── Team endpoints ──────────────────────────────────────────────────────────

  async getTeams(): Promise<ApiResponse<any[]>> {
    const response = await this.request<any>('/teams', 'GET');
    if (response.data && response.data.items) response.data = response.data.items;
    return response as ApiResponse<any[]>;
  }

  async getTeam(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/teams/${id}`, 'GET');
  }

  async createTeam(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/teams', 'POST', data);
  }

  async updateTeam(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/teams/${id}`, 'PUT', data);
  }

  async deleteTeam(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/teams/${id}`, 'DELETE');
  }

  // ── Invoice endpoints ───────────────────────────────────────────────────────

  async getInvoices(): Promise<ApiResponse<Invoice[]>> {
    const response = await this.request<any>('/invoices', 'GET');
    let invoices = response.data;
    if (response.data && response.data.items) invoices = response.data.items;
    if (invoices && Array.isArray(invoices)) {
      response.data = invoices.map((invoice: any) => ({
        ...invoice,
        clientName: invoice.client?.name || invoice.clientName || 'Unknown Client',
      }));
    }
    return response as ApiResponse<Invoice[]>;
  }

  async getInvoice(id: string): Promise<ApiResponse<Invoice>> {
    const response = await this.request<any>(`/invoices/${id}`, 'GET');
    if (response.data) {
      response.data.clientName = response.data.client?.name || response.data.clientName || 'Unknown Client';
    }
    return response as ApiResponse<Invoice>;
  }

  async createInvoice(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Invoice>> {
    return this.request<Invoice>('/invoices', 'POST', data);
  }

  async updateInvoice(id: string, data: Partial<Invoice>): Promise<ApiResponse<Invoice>> {
    return this.request<Invoice>(`/invoices/${id}`, 'PUT', data);
  }

  async deleteInvoice(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/invoices/${id}`, 'DELETE');
  }

  async updateInvoiceStatus(id: string, status: Invoice['status']): Promise<ApiResponse<Invoice>> {
    return this.request<Invoice>(`/invoices/${id}/status`, 'PUT', { status });
  }

  // ── Finance endpoints ───────────────────────────────────────────────────────

  async getFinances(): Promise<ApiResponse<Finance[]>> {
    const response = await this.request<any>('/finances', 'GET');
    if (response.data && response.data.items) response.data = response.data.items;
    return response as ApiResponse<Finance[]>;
  }

  async getFinance(id: string): Promise<ApiResponse<Finance>> {
    return this.request<Finance>(`/finances/${id}`, 'GET');
  }

  async createFinance(data: Omit<Finance, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Finance>> {
    return this.request<Finance>('/finances', 'POST', data);
  }

  async updateFinance(id: string, data: Partial<Finance>): Promise<ApiResponse<Finance>> {
    return this.request<Finance>(`/finances/${id}`, 'PUT', data);
  }

  async deleteFinance(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/finances/${id}`, 'DELETE');
  }

  async getFinanceSummary(): Promise<ApiResponse<any>> {
    return this.request<any>('/finances/summary/all', 'GET');
  }

  // ── Report endpoints ────────────────────────────────────────────────────────

  async getReports(): Promise<ApiResponse<Report[]>> {
    const response = await this.request<any>('/reports', 'GET');
    if (response.data && response.data.items) response.data = response.data.items;
    return response as ApiResponse<Report[]>;
  }

  async getReport(id: string): Promise<ApiResponse<Report>> {
    return this.request<Report>(`/reports/${id}`, 'GET');
  }

  async generateClientReport(data: any): Promise<ApiResponse<Report>> {
    return this.request<Report>('/reports/generate/clients', 'POST', data);
  }

  async generateInvoiceReport(data: any): Promise<ApiResponse<Report>> {
    return this.request<Report>('/reports/generate/invoices', 'POST', data);
  }

  async generateFinanceReport(data: any): Promise<ApiResponse<Report>> {
    return this.request<Report>('/reports/generate/finance', 'POST', data);
  }

  async deleteReport(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/reports/${id}`, 'DELETE');
  }

  // ── Package endpoints ───────────────────────────────────────────────────────

  async getPackages(type?: string): Promise<ApiResponse<any[]>> {
    let url = '/packages';
    if (type) url += `?type=${encodeURIComponent(type)}`;
    return this.request<any[]>(url, 'GET');
  }

  async getPackage(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/packages/${id}`, 'GET');
  }

  async createPackage(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/packages', 'POST', data);
  }

  async updatePackage(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/packages/${id}`, 'PUT', data);
  }

  async deletePackage(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/packages/${id}`, 'DELETE');
  }

  async uploadPackageImages(id: string, files: File[]): Promise<ApiResponse<any>> {
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    const response = await this.axiosInstance.post(`/packages/${id}/images`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async generatePackageSnapToken(id: string, payload: PackageSnapTokenPayload): Promise<ApiResponse<PackageSnapTokenResponse>> {
    return this.request<PackageSnapTokenResponse>(`/packages/${id}/snap-token`, 'POST', payload)
  }

  async getActivities(limit: number = 20): Promise<ApiResponse<any>> {
    return this.request<any>(`/activities?limit=${limit}`, 'GET');
  }
}

export const apiClient = new ApiClient();
export default apiClient;