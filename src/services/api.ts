import axios, { AxiosInstance, AxiosResponse } from 'axios';

/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly VITE_API_TIMEOUT?: string;
    readonly DEV: boolean;
    readonly MODE: string;
    readonly PROD: boolean;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('[API Config] Base URL:', API_BASE_URL);
  console.log('[API Config] Environment:', import.meta.env.MODE);
}

// Log API URL for debugging
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

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
  password?: string; // Password tidak perlu di frontend untuk display
  name: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
  createdAt?: string; // API returns as string, convert to Date as needed
  updatedAt?: string; // API returns as string, convert to Date as needed
}

// Type alias untuk compatibility
export type User = IUser;

export interface AuthResponse {
  user: User;
  token: string;
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
  category: 'website' | 'undangan' | 'desain' | 'katalog';
  description: string;
  image: string;
  client: string;
  technologies?: string;
  link?: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

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

  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
      if (this.token) {
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      }
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        // Log request in development
        if (import.meta.env.DEV) {
          console.log('[API Request]', config.method?.toUpperCase(), config.url);
        }
        // increment active requests and notify
        this.activeRequests = this.activeRequests + 1
        this.emitLoading(true)
        return config;
      },
      (error) => {
        // decrement on request error
        this.activeRequests = Math.max(0, this.activeRequests - 1)
        if (this.activeRequests === 0) this.emitLoading(false)
        return Promise.reject(error)
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // decrement active requests and notify
        this.activeRequests = Math.max(0, this.activeRequests - 1)
        if (this.activeRequests === 0) this.emitLoading(false)
        return response
      },
      (error) => {
        // decrement on response error
        this.activeRequests = Math.max(0, this.activeRequests - 1)
        if (this.activeRequests === 0) this.emitLoading(false)

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

  // Loading listeners
  onLoadingChange(cb: (loading: boolean) => void) {
    this.loadingListeners.push(cb)
  }

  offLoadingChange(cb: (loading: boolean) => void) {
    this.loadingListeners = this.loadingListeners.filter((f) => f !== cb)
  }

  private emitLoading(loading: boolean) {
    try {
      this.loadingListeners.forEach((cb) => {
        try { cb(loading) } catch (e) { /* ignore listener errors */ }
      })
    } catch { }
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('authToken');
      delete this.axiosInstance.defaults.headers.common['Authorization'];
    }
  }

  async request<T>(
    endpoint: string,
    method: string = 'GET',
    data?: any
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
        // Server responded with error status
        const message = error.response.data?.message || error.response.data?.error || `HTTP error! status: ${error.response.status}`;
        throw new Error(message);
      } else if (error.request) {
        // Request was made but no response received (CORS, network, etc.)
        console.error('[API Error] No response received:', error.request);
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau hubungi administrator.');
      } else {
        // Something else happened
        throw new Error(error.message || 'Terjadi kesalahan yang tidak terduga');
      }
    }
  }

  // Auth endpoints
  async register(email: string, password: string, name: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', 'POST', { email, password, name });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', 'POST', { email, password });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    this.setToken(null);
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.request<any>('/auth/profile', 'GET');
    // Backend returns { user: {...} }, so we need to extract it
    if (response.data && response.data.user) {
      response.data = response.data.user;
    }
    return response as ApiResponse<User>;
  }

  // Contact endpoints
  async submitContact(data: Omit<Contact, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Contact>> {
    return this.request<Contact>('/contacts', 'POST', data);
  }

  async getContacts(): Promise<ApiResponse<Contact[]>> {
    const response = await this.request<any>('/contacts', 'GET');
    // Backend returns { items: [], meta: {} }, extract items
    if (response.data && response.data.items) {
      response.data = response.data.items;
    }
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

  // Portfolio endpoints
  async getPortfolios(category?: Portfolio['category'], featured?: boolean): Promise<ApiResponse<Portfolio[]>> {
    let url = '/portfolios';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (featured) params.append('featured', 'true');
    if (params.toString()) url += `?${params.toString()}`;
    const response = await this.request<any>(url, 'GET');
    // Backend returns { items: [], meta: {} }, extract items
    if (response.data && response.data.items) {
      response.data = response.data.items;
    }
    return response as ApiResponse<Portfolio[]>;
  }

  // Team endpoints
  async getTeams(): Promise<ApiResponse<any[]>> {
    const response = await this.request<any>('/teams', 'GET');
    // Backend returns { items: [], meta: {} }, extract items
    if (response.data && response.data.items) {
      response.data = response.data.items;
    }
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

  async createPortfolio(data: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Portfolio>> {
    return this.request<Portfolio>('/portfolios', 'POST', data);
  }

  async updatePortfolio(id: string, data: Partial<Portfolio>): Promise<ApiResponse<Portfolio>> {
    return this.request<Portfolio>(`/portfolios/${id}`, 'PUT', data);
  }

  async deletePortfolio(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/portfolios/${id}`, 'DELETE');
  }

  // Invoice endpoints
  async getInvoices(): Promise<ApiResponse<Invoice[]>> {
    const response = await this.request<any>('/invoices', 'GET');
    // Backend returns { items: [], meta: {} }, extract items
    let invoices = response.data;
    if (response.data && response.data.items) {
      invoices = response.data.items;
    }
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

  // Finance endpoints
  async getFinances(): Promise<ApiResponse<Finance[]>> {
    const response = await this.request<any>('/finances', 'GET');
    // Backend returns { items: [], meta: {} }, extract items
    if (response.data && response.data.items) {
      response.data = response.data.items;
    }
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

  // Report endpoints
  async getReports(): Promise<ApiResponse<Report[]>> {
    const response = await this.request<any>('/reports', 'GET');
    // Backend returns { items: [], meta: {} }, extract items
    if (response.data && response.data.items) {
      response.data = response.data.items;
    }
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

  // Package endpoints
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
    const form = new FormData()
    files.forEach((f) => form.append('images', f))
    const response = await this.axiosInstance.post(`/packages/${id}/images`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  async getActivities(limit: number = 20): Promise<ApiResponse<any>> {
    return this.request<any>(`/activities?limit=${limit}`, 'GET');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
