export interface User {
  id?: number;
  StudentID?: number;
  Name: string;
  Email: string;
  Password: string;
  RegistrationDate?: Date;
  role?: 'admin' | 'student';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Omit<User, 'Password'>;
}
