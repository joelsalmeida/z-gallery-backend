export type AuthenticationData = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
};

export type RefreshTokenData = { accessToken: string; refreshToken: string };
