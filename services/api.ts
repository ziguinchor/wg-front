
import { LoginResponse, Client, CreateClientResponse, SyncResponse, HealthResponse } from '../types';

const BASE_URL = 'http://51.222.139.224:9191';

export class ApiService {
  private static getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  static async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'invalid_credentials');
    }

    return response.json();
  }

  static async getClients(token: string): Promise<Client[]> {
    const response = await fetch(`${BASE_URL}/api/clients`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('unauthorized');
      throw new Error('Failed to fetch clients');
    }

    return response.json();
  }

  static async createClient(token: string, name: string): Promise<CreateClientResponse> {
    const response = await fetch(`${BASE_URL}/api/clients`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) throw new Error('Failed to create client');
    return response.json();
  }

  static async createClientWithKey(token: string, name: string, publicKey: string): Promise<CreateClientResponse> {
    const response = await fetch(`${BASE_URL}/api/clients/by-public-key`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ name, publicKey }),
    });

    if (!response.ok) {
      if (response.status === 400) throw new Error('invalid_public_key');
      throw new Error('Failed to create client');
    }
    return response.json();
  }

  static async deleteClient(token: string, id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/clients/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      if (response.status === 404) throw new Error('not_found');
      throw new Error('Failed to delete client');
    }
  }

  static async sync(token: string): Promise<SyncResponse> {
    const response = await fetch(`${BASE_URL}/api/sync`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });

    if (!response.ok) throw new Error('Failed to sync');
    return response.json();
  }

  static async checkHealth(): Promise<HealthResponse> {
    const response = await fetch(`${BASE_URL}/health`);
    return response.json();
  }
}
