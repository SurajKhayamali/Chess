export interface NavbarContext {
  isLoggedIn: boolean;
  userInfo?: {
    username: string;
    email: string;
    // avatar: string;
  };
}
