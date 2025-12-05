import axios, { AxiosInstance, AxiosResponse } from 'axios';

/// <reference types="vite/client" />

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

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
  status: 'new' | 'read' | 'responded';
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

class ApiClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
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
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
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
      console.error('API Error:', error);
      
      if (error.response) {
        // Server responded with error status
        throw new Error(error.response.data?.message || `HTTP error! status: ${error.response.status}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error - please check your internet connection');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred');
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
    return this.request<User>('/auth/profile', 'GET');
  }

  // Contact endpoints
  async submitContact(data: Omit<Contact, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Contact>> {
    return this.request<Contact>('/contacts', 'POST', data);
  }

  async getContacts(): Promise<ApiResponse<Contact[]>> {
    return this.request<Contact[]>('/contacts', 'GET');
  }

  async getContact(id: string): Promise<ApiResponse<Contact>> {
    return this.request<Contact>(`/contacts/${id}`, 'GET');
  }

  async updateContactStatus(id: string, status: Contact['status']): Promise<ApiResponse<Contact>> {
    return this.request<Contact>(`/contacts/${id}/status`, 'PUT', { status });
  }

  // Portfolio endpoints
  async getPortfolios(category?: Portfolio['category'], featured?: boolean): Promise<ApiResponse<Portfolio[]>> {
    let url = '/portfolios';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (featured) params.append('featured', 'true');
    if (params.toString()) url += `?${params.toString()}`;
    return this.request<Portfolio[]>(url, 'GET');
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
}

export const apiClient = new ApiClient();
export default apiClient;
