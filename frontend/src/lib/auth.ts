const TOKEN_KEY = 'jobtrack_token';
const EMAIL_KEY = 'jobtrack_email';

export const saveSession = (token: string, email: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, email);
};

export const getToken = () =>
  typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);

export const getEmail = () =>
  typeof window === 'undefined' ? null : localStorage.getItem(EMAIL_KEY);

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
};