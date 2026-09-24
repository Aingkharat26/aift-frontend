export const environment = {
  production: false,
  apiUrl:
    (typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1' &&
      (window as any).__env?.apiUrl) ||
    'http://localhost:3000',
};

