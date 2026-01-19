export type AuthenticationResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
};

export type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
};
