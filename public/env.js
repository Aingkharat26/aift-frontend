(function (window) {
  window.__env = window.__env || {};
  // -------------------------------------------------------------
  // Runtime Environment Configuration for Frontend
  // หากต้องการเปลี่ยน Backend URL ใน Production โดยไม่ต้อง Rebuild โค้ดใหม่
  // สามารถกำหนดค่าตรงนี้ได้ เช่น:
  // window.__env.apiUrl = 'https://aift-backend.onrender.com';
  // -------------------------------------------------------------
  window.__env.apiUrl = '';
})(this);
