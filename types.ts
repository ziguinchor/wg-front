
export interface LoginResponse {
  tokenType: string;
  token: string;
  expiresIn: string;
}

export interface Client {
  id: string;
  name: string;
  publicKey: string;
  ip: string;
  createdAt: string;
  revoked: number;
}

export interface CreateClientResponse extends Client {
  config?: string;
  privateKey?: string;
}

export interface SyncResponse {
  ok: boolean;
  appliedPeers: number;
}

export interface HealthResponse {
  ok: boolean;
}

export type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
};
