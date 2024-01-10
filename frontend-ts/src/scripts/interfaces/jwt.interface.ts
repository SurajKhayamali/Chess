export interface JwtDecodedPayload {
  userId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  username: string;
}
