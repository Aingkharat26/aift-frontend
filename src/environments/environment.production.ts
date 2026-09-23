export const environment = {
  production: true,
  // ตั้งค่า Backend URL จริงเมื่อนำขึ้น Cloud (เช่น https://aift-backend.onrender.com)
  apiUrl:
    typeof window !== 'undefined' && (window as any).__env?.apiUrl
      ? (window as any).__env.apiUrl
      : 'https://aift-backend-hkbz.onrender.com',
};
