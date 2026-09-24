(function (window) {
  window.__env = window.__env || {};
  // -------------------------------------------------------------
  // Runtime Environment Configuration for Frontend
  // ตรวจสอบ Hostname: หากเปิดบน localhost / local machine ให้ชี้ไปที่ Local Backend
  // หากเปิดจากภายนอกหรือบน Vercel ให้ชี้ไปที่ Render Production Backend
  // -------------------------------------------------------------
  var host = window.location.hostname;
  var isLocal =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '' ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    host.endsWith('.local');

  window.__env.apiUrl = isLocal
    ? 'http://' + (host === 'localhost' || host === '127.0.0.1' ? 'localhost' : host) + ':3000'
    : 'https://aift-backend-hkbz.onrender.com';
})(this);

