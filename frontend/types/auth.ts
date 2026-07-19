export interface AuthUser {
  id?: string;
  email?: string;
  fullName?: string;
  name?: string;
  businessId?: string;
  role?: string;
  [key: string]: unknown;
}

export interface AuthSession {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken?: string | null;
  remember: boolean;
  updatedAt: number;
}

export interface AuthSessionInput {
  user?: AuthUser | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  remember?: boolean;
}

export type AuthSessionListener = (session: AuthSession | null) => void;

export interface AuthApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  companyName: string;
  phone?: string;
  industry?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyRequest {
  token: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface AuthUserResponse {
  user: AuthUser | null;
}

export interface AuthTokenResponse extends AuthUserResponse {
  accessToken: string | null;
  refreshToken?: string | null;
}

export interface AuthRegisterResponse extends AuthUserResponse {
  verificationRequired: boolean;
  verificationToken: string;
  verificationLink: string;
  message: string;
}

export interface AuthMessageResponse {
  message: string;
}

export type AuthPayload = AuthTokenResponse;
