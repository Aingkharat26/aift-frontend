# 📝 Development & Change Log (บันทึกประวัติการแก้ไขระบบ)

> เอกสารนี้บันทึกประวัติการแก้ไข บั๊กฟิกซ์ และการเพิ่มฟีเจอร์ทั้งหมดของโปรเจกต์ AI Finance Tracker (AIFT) อย่างเป็นระบบ

---

## 📌 สรุปรูปแบบการบันทึก
- **[Feature]**: เพิ่มฟังก์ชันหรือฟีเจอร์ใหม่
- **[Fix]**: แก้ไขข้อผิดพลาดหรือบั๊ก
- **[Config / Infra]**: ปรับแต่งการตั้งค่า Environment, Docker หรือ Database
- **[Docs]**: จัดทำหรืออัปเดตเอกสาร

---

## 🕒 บันทึกรายการเปลี่ยนแปลง (Change History)

### 📅 2026-09-29 16:50:00 (Local Time)
**ประเภท:** `[Feature / UI / Theme]` `[Frontend]`  
**หัวข้อ:** รองรับ Dynamic Theme ใน Animated Splash Screen (ปรับสีหน้าจอต้อนรับและ Status Bar ตาม Dark Mode / Light Mode อัตโนมัติ)  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้ต้องการให้หน้าจอ Splash Screen เปลี่ยนสีตามธีมที่เลือกไว้ เพื่อความกลมกลืน (หากใช้ธีมสว่าง เมื่อเปิดแอปจะเป็นพื้นหลังสีขาวนวล `#f8fafc` สะอาดตา หากใช้ธีมมืด จะเป็นโทน Obsidian `#0a0f1a` เรืองแสงพรีเมียม)
**สิ่งที่แก้ไข (Changes Detail):**
1. **เพิ่ม Dynamic Theme Binding ใน `SplashScreenComponent` (`splash-screen.component.ts` & `.html`):**
   - Inject `SicThemeService` เพื่ออ่านสถานะธีมแบบเรียลไทม์
   - ผูกคลาส `[class.dark-mode]="themeService.isDark()"` และ `[class.light-mode]="!themeService.isDark()"` บน overlay
2. **ออกแบบและปรับแต่งสไตล์ Light Mode ใน `splash-screen.component.scss`:**
   - พื้นหลังสีขาวนวล `#f8fafc`
   - เอฟเฟกต์รัศมีและแสงกึ่งกลางจอ (Ambient Glow & Halo) โทนฟ้านุ่มนวลระดับ 12-18%
   - เงาและขอบโลโก้ทรงกลมปรับโทนให้คมชัดบนพื้นสว่าง (`box-shadow: 0 12px 28px rgba(14, 165, 233, 0.22)`)
   - ข้อความชื่อระบบ "AI Finance Tracker" เปลี่ยนเป็นข้อความไล่เฉดเข้ม Dark Slate (`#0f172a` ถึง `#334155`) และสโลแกนสี `#64748b`
   - จุดโหลด 3 จุด (Pulsing Dots) ปรับสีเป็น Deep Blue `#0284c7` พร้อมแอนิเมชัน `dotPulseLight`
3. **ปรับแต่งแถบสถานะมือถือ (Status Bar Meta Theme Color) ใน `index.html` และ `app.ts`:**
   - ซิงก์ค่า `<meta name="theme-color">` อัตโนมัติตามโหมดธีมที่เลือก (`#0a0f1a` สำหรับ Dark Mode และ `#f8fafc` สำหรับ Light Mode) ตั้งแต่ก่อนแอปโหลดเสร็จ
   - ซิงก์ค่าคีย์ `sic-ng-theme` ใน `localStorage` อย่างถูกต้อง
4. **การตรวจสอบและทดสอบ (Verification & Testing):**
   - รันคำสั่ง `npm run build` ผ่านสมบูรณ์ 100% (Exit code 0)
   - ทดสอบจับภาพหน้าจอจริงด้วย Playwright บนทั้ง Mobile และ Desktop ในทั้งสองโหมด ยืนยันการสลับสีและการแสดงผลที่คมชัดระดับพรีเมียม
**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/components/splash-screen/splash-screen.component.ts`
- `aift-frontend/src/app/components/splash-screen/splash-screen.component.html`
- `aift-frontend/src/app/components/splash-screen/splash-screen.component.scss`
- `aift-frontend/src/app/app.ts`
- `aift-frontend/src/index.html`
- `aift-frontend/CHANGELOG.md`
- `CHANGELOG.md`

### 📅 2026-09-29 16:30:00 (Local Time)
**ประเภท:** `[Feature / UI / Mobile]` `[Frontend]`  
**หัวข้อ:** เพิ่มระบบ Full Brand Animated Splash Screen (แบบที่ 3) และแก้ไขปัญหาไอคอนโดนตีกรอบตัดขอบบน PWA Splash Screen ของมือถือ  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้เลือกแบบที่ 3 (Full Brand Splash Screen) เพื่อให้หน้าจอตอนกดเข้าแอปบนมือถือมีความหรูหรา เป็นมืออาชีพ สไตล์ FinTech ระดับสากล
- แก้ปัญหาที่ระบบ Android นำกรอบสี่เหลี่ยมมน (Squircle) มาครอบทับไอคอนและตัดขอบวงแหวนนีออนด้านข้าง
**สิ่งที่แก้ไข (Changes Detail):**
1. **สร้างคอมโพเนนต์หน้าจอต้อนรับแบบแอนิเมชัน (`SplashScreenComponent`):**
   - ออกแบบหน้าจอ Overlay พื้นหลังโทน Obsidian Dark (`#0a0f1a`) พร้อมเอฟเฟกต์แสง Ambient Glow สีฟ้าเรืองแสงกึ่งกลางจอ
   - แสดงไอคอนทรงกลมพร้อมวงแหวนรัศมีส่องแสง (Halo Pulse)
   - แสดงชื่อระบบ "AI Finance Tracker" และสโลแกน "Smart Financial AI" อย่างประณีต
   - แสดงจุดโหลดนีออนสีฟ้า (Pulsing Dots) ที่มีแอนิเมชันเคลื่อนไหวนุ่มนวล
   - มีระบบ Transition Fade-out ออกอย่างนุ่มนวลหลังแสดง 2.0 วินาที (พร้อมฟังก์ชันแตะหน้าจอเพื่อข้ามทันที) และแสดงผลในทุกการเปิดแอป/รีเฟรชหน้าจอ Desktop & Mobile โดยไม่รบกวนการสลับหน้าระหว่างใช้งาน
2. **แก้ไขการแสดงผล Native PWA Splash Screen ใน Web Manifest (`manifest.webmanifest` & `index.html`):**
   - เปลี่ยน `purpose: "any maskable"` เป็น `purpose: "any"` เพื่อไม่ให้ Android บังคับครอบตัดกรอบสี่เหลี่ยมมนตัดขอบวงแหวน
   - ปรับ `background_color` และ `theme_color` เป็น `#0a0f1a` ให้กลืนเป็นเนื้อเดียวกับหน้าจอแอป
3. **การตรวจสอบและทดสอบ (Verification & Testing):**
   - รันคำสั่ง `npm run build` ผ่านสมบูรณ์ 100% (Exit code 0)
   - ทดสอบจับภาพหน้าจอจริงด้วย Playwright ทั้ง Desktop และ Mobile 360px ยืนยันว่าหน้าจอต้อนรับและแอนิเมชัน Fade-out ทำงานได้อย่างสมบูรณ์แบบ
**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/components/splash-screen/splash-screen.component.ts`
- `aift-frontend/src/app/components/splash-screen/splash-screen.component.html`
- `aift-frontend/src/app/components/splash-screen/splash-screen.component.scss`
- `aift-frontend/src/app/app.ts`
- `aift-frontend/public/manifest.webmanifest`
- `aift-frontend/CHANGELOG.md`
- `CHANGELOG.md`

### 📅 2026-09-29 15:45:00 (Local Time)
**ประเภท:** `[Feature / UI / Brand]` `[Frontend]`  
**หัวข้อ:** ปรับรูปทรงไอคอนแอปและโลโก้ใน Header Nav เป็นทรงกลม (Circular Mobile App Icon) สไตล์แอปมือถือ  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้ต้องการให้รูปไอคอนมีลักษณะเป็นทรงกลมเหมือนไอคอนแอปพลิเคชันบนมือถือ (เช่น Android Round Adaptive Icon และแอป FinTech ชั้นนำ)
**สิ่งที่แก้ไข (Changes Detail):**
1. **ออกแบบและสร้างรูปไอคอนทรงกลมความละเอียดสูง (`public/aift_logo/`):**
   - สร้างภาพไอคอนทรงกลมพื้นหลังโปร่งใส (Transparent Circular Badge) ขนาด 1024x1024, 512x512, 192x192 พร้อมขอบไทเทเนียมทรงกลมเงางามและเส้นวงแหวนนีออนเรืองแสง
   - อัปเดตไฟล์ `aift_logo.png`, `aift_logo_dark.png`, `aift_logo_light.png` และ `favicon.ico`
2. **ปรับแต่งสไตล์ใน Header Nav (`app.scss`):**
   - กำหนด `.nav-logo-img` ให้เป็น `border-radius: 50%` บนทุก Breakpoint (Desktop, Tablet, Mobile 360px, 340px)
   - เพิ่มมิติรัศมีเรืองแสงทรงกลม (`box-shadow: 0 0 10px rgba(14, 165, 233, 0.35)`) และ Hover Animation นุ่มนวล
3. **การตรวจสอบและทดสอบ (Verification & Testing):**
   - รันคำสั่ง `npm run build` ผ่านสมบูรณ์ 100% (Exit code 0)
   - ทดสอบจับภาพหน้าจอผ่าน Playwright ทั้งใน Light Mode, Dark Mode และมุมมองมือถือ 360px
**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/public/aift_logo/aift_logo.png`
- `aift-frontend/public/aift_logo/aift_logo_192.png`
- `aift-frontend/public/aift_logo/aift_logo_512.png`
- `aift-frontend/public/aift_logo/aift_logo_dark.png`
- `aift-frontend/public/aift_logo/aift_logo_light.png`
- `aift-frontend/public/favicon.ico`
- `aift-frontend/src/app/app.scss`
- `aift-frontend/CHANGELOG.md`
- `CHANGELOG.md`

### 📅 2026-09-29 15:30:00 (Local Time)
**ประเภท:** `[Feature / UI / Brand]` `[Frontend]`  
**หัวข้อ:** อัปเดตรูปไอคอนแบรนด์ใหม่สไตล์ Futuristic Monogram "A" (แบบที่ 3) พร้อมนำไปแสดงผลบนแถบ Header Nav และปรับแต่ง Web App Manifest  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้เลือกดีไซน์ไอคอนแบบที่ 3 (Futuristic Monogram "A": ตัวอักษร "A" จาก AIFT ขึ้นรูปด้วยเส้นกราฟนีออนและประกายดาว AI บนฐาน Squircle สีเข้ม)
- ผู้ใช้ต้องการให้นำรูปไอคอนนี้ไปประดับแสดงผลในแถบนำทางด้านบน (Header Nav) ของโปรเจกต์ด้วย
**สิ่งที่แก้ไข (Changes Detail):**
1. **สร้างและแปลงชุด Asset ไอคอนความละเอียดสูง (`public/aift_logo/` และ `public/favicon.ico`):**
   - นำภาพต้นแบบ Concept 3 (1024x1024) แปลงเป็น `aift_logo.png`, `aift_logo_dark.png`, `aift_logo_light.png`
   - สร้างไฟล์ความละเอียดเฉพาะ `aift_logo_192.png` (192x192) และ `aift_logo_512.png` (512x512)
   - สร้างไฟล์ `public/favicon.ico` แบบ Multi-resolution (16px, 32px, 48px, 64px, 128px, 256px)
   - ปรับแต่ง `public/manifest.webmanifest` ให้ผูกโยงกับชุดไอคอนใหม่และรองรับ Maskable Icon
2. **เพิ่มการแสดงผลรูปไอคอนใน Header Nav (`app.ts`, `app.scss`):**
   - แก้ไข `.nav-logo` ใน `app.ts` ให้บรรจุแท็ก `<img>` ชี้ไปยัง `aift_logo/aift_logo.png` ควบคู่กับชื่อระบบ "AI Finance Tracker"
   - ปรับแต่ง CSS Flexbox และ Micro-interaction (Hover/Active) ของ `.nav-logo` และ `.nav-logo-img` ให้มีเอฟเฟกต์นุ่มนวล พร้อมขอบมน Squircle และเงามิติเรืองแสงสีฟ้า
   - ปรับแต่ง Responsive Layout ในขนาดหน้าจอต่างๆ:
     - Desktop: ไอคอนขนาด 32x32px
     - Tablet / Mobile `<= 768px`: ไอคอนขนาด 28x28px
     - Mobile `<= 380px`: ไอคอนขนาด 25x25px
     - Mobile `<= 340px`: ไอคอนขนาด 22x22px
3. **การตรวจสอบและทดสอบ (Verification & Testing):**
   - รันคำสั่ง `npm run build` ผ่านสมบูรณ์ 100% (Exit code 0)
   - ทดสอบจับภาพหน้าจอผ่าน Playwright ทั้งบน Desktop (1280px) และ Mobile (360px) ทั้งใน Light Mode และ Dark Mode ยืนยันว่าไอคอนแสดงผลคมชัด สัดส่วนลงตัว ไม่เบียดองค์ประกอบอื่น และไม่มีปัญหา Overflow
**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/public/aift_logo/aift_logo.png`
- `aift-frontend/public/aift_logo/aift_logo_192.png`
- `aift-frontend/public/aift_logo/aift_logo_512.png`
- `aift-frontend/public/aift_logo/aift_logo_dark.png`
- `aift-frontend/public/aift_logo/aift_logo_light.png`
- `aift-frontend/public/favicon.ico`
- `aift-frontend/public/manifest.webmanifest`
- `aift-frontend/src/app/app.ts`
- `aift-frontend/src/app/app.scss`
- `aift-frontend/CHANGELOG.md`
- `CHANGELOG.md`

### 📅 2026-09-29 13:58:00 (Local Time)
**ประเภท:** `[Fix / UI / Dialog]` `[Frontend]`  
**หัวข้อ:** แก้ไขบั๊ก Dialog ถูกตัดขอบล่าง จมหาย และปุ่ม "ตกลง" ถูกบดบังบนหน้าจอมือถือ (Containing Block & Stacking Context Fix)  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้แจ้งและแนบภาพถ่ายหน้าจอมือถือจริง: เมื่อมี Dialog แจ้งเตือนสถานะขึ้นมา (เช่น "สแกนใบเสร็จสำเร็จ") ตัวกล่อง Dialog แสดงผลจมอยู่ที่ก้นหน้าจอ เนื้อหาด้านล่างถูกตัดขาด และปุ่มกด "ตกลง" หายไปหลังแถบเมนูด้านล่าง
- พื้นหลังไม่ได้ถูกดิม (Dim) หรือเบลอครอบคลุมทั้งหน้าจอ
**สิ่งที่แก้ไข (Changes Detail):**
1. **แก้ปัญหา Containing Block & Stacking Context Trap (`main-dashboard.component.css`, `chat-input.component.css`):**
   - สืบหาสาเหตุเชิงลึก: พบว่า `.bottom-section` บนมือถือมีการใส่ `backdrop-filter: blur(...)` และ `position: fixed` ซึ่งตามสเปก W3C CSS จะสร้าง New Containing Block กักขังองค์ประกอบลูกที่มี `position: fixed; inset: 0;` (อย่าง `.sic-dialog__backdrop`) ไม่ให้ขยายตัวเต็ม Viewport และจำกัด z-index ไว้ที่ 90 ทำให้ถูก Bottom Tab Bar (z-index 100) ทับ
   - ย้ายสไตล์ Docking แบบ Fixed ไปผูกไว้ที่ `.inputs-grid` ภายใน `chat-input.component.css` โดยตรง แทนที่จะครอบทั้งคอมโพเนนต์
   - ปรับ `.bottom-section` ใน `main-dashboard.component.css` ให้เป็น `position: static` ในโฟลว์ปกติ ทำให้ `<sic-dialog>` เป็นอิสระ และอ้างอิงตำแหน่งกับ Viewport จริงของเบราว์เซอร์
2. **เพิ่ม Universal Dialog Responsiveness ในระดับ Global (`styles.scss`):**
   - กำหนดให้ `.sic-dialog__backdrop` ใช้ `position: fixed !important; inset: 0 !important; z-index: 9999 !important;` ครอบคลุมทั้งหน้าจอพร้อมม่านเบลอระดับพรีเมียม
   - กำหนดให้ `.sic-dialog__panel` มีขนาด `max-width: calc(100vw - 24px) !important; max-height: calc(100dvh - 32px) !important;` กึ่งกลางหน้าจออย่างสมบูรณ์แบบ
   - กำหนดให้ `.sic-dialog__body` รองรับ `overflow-y: auto !important` และ `.sic-dialog__footer` มี `flex-shrink: 0 !important` รับประกันว่าส่วนหัวและปุ่ม "ตกลง" จะมองเห็นและกดได้เสมอ ไม่ว่าจะเปิดบนหน้าจอมือถือขนาดใด
3. **Verification & Testing:**
   - ทดสอบจำลองเปิด Status Dialog บนหน้าจอ 360px x 800px (Android) ผ่าน Playwright
   - ยืนยันผลจากภาพ `dialog_360px_dark.png`: Dialog อยู่กึ่งกลางหน้าจอ 100%, พื้นหลังดิมเบลอทั้งหน้าจอ, ปุ่ม "ตกลง" แสดงผลชัดเจนสวยงาม
   - ตรวจสอบผ่านการ Build ด้วย `cmd.exe /c "npm run build"` สำเร็จสมบูรณ์ (Exit code 0)
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/components/main-dashboard/main-dashboard.component.css`
- `src/app/components/chat-input/chat-input.component.css`
- `src/styles.scss`
- `CHANGELOG.md`

### 📅 2026-09-29 13:40:00 (Local Time)
**ประเภท:** `[Fix / UI / Responsive]` `[Frontend]`  
**หัวข้อ:** ปรับปรุงความยืดหยุ่นของหน้าจอแดชบอร์ดให้รองรับมือถือทุกขนาด (Multi-Screen Responsive Support: 320px – 430px+)  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้เปิดใช้งานจริงบนมือถือ Android และพบว่าหน้าจอมือถือขนาด 360px – 380px เกิดปัญหา Horizontal Overflow
- แถบอินพุต AI ด้านล่างยาวเกินหน้าจอ ดันปุ่ม "บันทึก" ทะลุขอบขวาไป (เห็นเพียงขอบปุ่มตัว "บ...") ผู้ใช้กดบันทึกไม่ได้
- หัวการ์ด `💳 รายจ่าย (AI)` แสดงผลซ้ำซ้อนกับ Tab Switcher ด้านบน
- กราฟสรุป Donut Chart ถูกตัดขอบขวาและบดบัง Legend รายการหมวดหมู่ด้านล่าง (เช่น "บิล")
**สิ่งที่แก้ไข (Changes Detail):**
1. **จัดโครงสร้าง CSS Cascade ใน `chat-input.component.css` ใหม่:**
   - ย้าย `@media (max-width: 768px)` ไปไว้ด้านล่างของ Base Styles แก้ปัญหา CSS Cascade ทับกฎของ Mobile
   - ซ่อน `.card-header` ซ้ำซ้อนบนมือถืออย่างสมบูรณ์ (`display: none !important`)
   - กำหนดให้ `.chat-input` ใช้ `flex: 1 1 0 !important; width: 0 !important; min-width: 0 !important;` เพื่อให้ย่อ-ขยายตามความกว้างหน้าจอจริงได้อย่างอิสระ ไม่ดันปุ่มบันทึกหลุดขอบ
   - เพิ่ม Breakpoint พิเศษสำหรับหน้าจอมือถือขนาดเล็ก `<= 380px` (เช่น Android 360px) และ `<= 330px` (หน้าจอแคบพิเศษ) ให้ปรับขนาดปุ่ม Tool-btn เป็น 34px/32px และแปลงเป็นปุ่มส่งแบบไอคอนเมื่อจอแคบมาก
2. **ปรับปรุงข้อความ Placeholder และเนื้อหาปุ่มบันทึก (`chat-input.component.html`):**
   - ปรับ Placeholder ให้สั้นกระชับ (`พิมพ์หรือกดไมค์ (เช่น ข้าว 50)`) ลด Intrinsic Width ของ Browser Input
   - ห่อข้อความปุ่มบันทึกด้วย `<span class="btn-text">` และเพิ่ม SVG `<svg class="btn-send-icon">` รองรับการปรับเปลี่ยน Responsive
3. **ปรับปรุงกราฟสรุป Donut Chart ให้ตอบสนองความกว้างหน้าจอ (`summary-chart.component.ts`, `summary-chart.component.css`):**
   - เพิ่มระบบตรวจจับขนาดหน้าจอ (`HostListener('window:resize')`) ปรับตำแหน่ง Legend ของกราฟเป็น `'bottom'` อัตโนมัติเมื่อหน้าจอน้อยกว่า 640px เพื่อไม่ให้เบียดกับตัวกราฟ
   - ปรับความสูง `.chart-wrapper` ให้พอดี (160px – 180px) ทำให้แสดงผลครบทุกหมวดหมู่ ไม่โดนขอบการ์ดตัดทอน
4. **ป้องกัน Horizontal Overflow ทั่วทั้งระบบ (`styles.scss`, `main-dashboard.component.css`, `app.scss`):**
   - เพิ่ม `html, body { max-width: 100%; overflow-x: hidden; }`
   - ปรับ Padding ของ `.dashboard-wrapper` และ `.bottom-section` ให้กระชับบนหน้าจอเล็ก
   - เพิ่มการปรับตัวของ Top Navbar User Badge บนหน้าจอขนาด `<= 340px`
5. **Verification & Testing:**
   - ทดสอบรัน Automated Playwright Viewport Testing บนขนาด 360px (Standard Android) และ 390px (Standard iPhone)
   - ผลการวัด: `body.scrollWidth` เท่ากับ `innerWidth` (360px / 390px) พอดี 100% ไม่มี Horizontal Overflow
   - ปุ่มบันทึกแสดงผลครบถ้วน ขอบขวาอยู่ที่ 347px บนจอ 360px (มีระยะขอบสวยงาม 13px)
   - ทดสอบทั้ง Light Theme และ Dark Theme สวยงามคมชัด
   - ตรวจสอบผ่านการ Build ด้วย `cmd.exe /c "npm run build"` สำเร็จสมบูรณ์ (Exit code 0)
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/components/chat-input/chat-input.component.html`
- `src/app/components/chat-input/chat-input.component.css`
- `src/app/components/summary-chart/summary-chart.component.ts`
- `src/app/components/summary-chart/summary-chart.component.css`
- `src/app/components/main-dashboard/main-dashboard.component.css`
- `src/app/app.scss`
- `src/styles.scss`
- `CHANGELOG.md`

### 📅 2026-09-29 12:00:00 (Local Time)
**ประเภท:** `[Fix / UI / Responsive]` `[Frontend]`  
**หัวข้อ:** ปรับแต่งขนาดและความสูงของปุ่มบนมือถือให้เท่ากันและสมดุล (ปุ่มออกจากระบบ, ปุ่มสแกนใบเสร็จ, ไมค์, บันทึก, และแท็บสลับโหมด)  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้แจ้งว่าปุ่มบนมุมมองมือถือบางปุ่มมีขนาดไม่เท่ากัน โดยเฉพาะปุ่มออกจากระบบและปุ่มแนบไฟล์ที่ดูใหญ่เทอะทะและไม่สมดุลกับองค์ประกอบข้างเคียง
**สิ่งที่แก้ไข (Changes Detail):**
1. **ปุ่มออกจากระบบในแถบนำทางด้านบน (`app.ts`, `app.scss`):**
   - ปรับปุ่มออกจากระบบบนมือถือเป็น Compact Icon Button ขนาด 34x34px (รัศมี 8px) ซ่อนข้อความยาวที่ไม่จำเป็น ทำให้มีความสูงระดับเดียวกับปุ่มสลับธีม (`☀️`/`🌙`) และ User Badge พอดี
   - บนหน้าจอเดสก์ท็อปคงความสูงมาตรฐาน 40px พร้อมข้อความ "ออกจากระบบ" ไว้อย่างสวยงาม
2. **ปุ่มแนบ/สแกนใบเสร็จ และปุ่มไมโครโฟน (`chat-input.component.html`, `chat-input.component.css`):**
   - เปลี่ยนปุ่มสแกนใบเสร็จจากการใช้ `<sic-button>` (ซึ่งมี padding หนาและถูกโอเวอร์ไรด์จนกลายเป็นกล่องสี่เหลี่ยมผืนผ้าขนาดใหญ่) มาเป็นคลาส `.tool-btn` ที่ใช้สเปกเดียวกับปุ่มไมค์
   - ปุ่มทั้งสองเป็น Square Tool Button ขนาด 38x38px (รัศมี 8px) บนมือถือ และ 40x40px บนเดสก์ท็อป มีขนาดเท่ากันทุกประการ
3. **กล่องข้อความและปุ่มบันทึก (`chat-input.component.html`, `chat-input.component.css`):**
   - ปรับความสูงของ `.chat-input` และปุ่ม `[ บันทึก ]` บนมือถือให้เป็น 38px พอดี ทำให้แถบอินพุตทั้งแถว (ปุ่มแนบไฟล์, ปุ่มไมค์, กล่องพิมพ์, ปุ่มบันทึก) เรียงตัวด้วยความสูง 38px เท่ากันทั้งหมดอย่างไร้รอยต่อ
4. **แท็บสลับ รายจ่าย (AI) / รายรับ บนมือถือ (`chat-input.component.html`, `chat-input.component.css`):**
   - เปลี่ยนจากปุ่ม ghost/solid ที่ขนาดไม่เท่ากันและไม่สมมาตร มาเป็น Segmented Control แบบ Grid 50/50 ความสูง 34px มีแถบรางครอบคลุมและ Active Pill คมชัด
5. **ปุ่มตั้งงบประมาณในแถบแจ้งเตือน (`mini-budget.component.html`, `mini-budget.component.scss`):**
   - ปรับปุ่ม `＋ ตั้งงบประมาณเลย` ให้เป็น `.btn-ribbon-action` ความสูง 32px พอเหมาะ ไม่ล้นหรือบดบังข้อความบนหน้าจอมือถือ
6. **Verification:**
   - ทดสอบรัน `cmd.exe /c "npm run build"` สำเร็จสมบูรณ์ (Exit code 0)
**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/app.ts`
- `aift-frontend/src/app/app.scss`
- `aift-frontend/src/app/components/chat-input/chat-input.component.html`
- `aift-frontend/src/app/components/chat-input/chat-input.component.css`
- `aift-frontend/src/app/components/mini-budget/mini-budget.component.html`
- `aift-frontend/src/app/components/mini-budget/mini-budget.component.scss`
- `aift-frontend/CHANGELOG.md`
- `CHANGELOG.md`

### 📅 2026-09-29 11:43:00 (Local Time)
**ประเภท:** `[Fix / UI / Layout]` `[Frontend]`  
**หัวข้อ:** ปรับปรุง Mode Switch Tab (เข้าสู่ระบบ / สมัครสมาชิก) ให้เป็นแบบ Full-Width 50/50 Segmented Control สมบูรณ์แบบ  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- แท็บสลับโหมดระหว่าง "เข้าสู่ระบบ" และ "สมัครสมาชิก" บนหน้าจอ Auth แสดงผลไม่เต็มความกว้าง โดยปุ่มทั้งสองเบียดไปชิดด้านซ้าย และเหลือช่องว่างว่างเปล่าขนาดใหญ่ทางด้านขวา ส่งผลให้หน้าตาไม่สมดุลและดูขัดใจ
**สิ่งที่แก้ไข (Changes Detail):**
1. **ปรับโครงสร้างใน `auth.component.html`:**
   - เปลี่ยนจากการใช้ `<sic-button>` (ซึ่งมีพฤติกรรม fit-content และไม่ขยายเต็มแถว) มาใช้โครงสร้าง Accessible Tab `<button type="button" class="tab-btn" role="tab">`
2. **ปรับแต่งสไตล์ใน `auth.component.scss`:**
   - เปลี่ยน `.tab-switcher` ให้เป็นเลย์เอาต์ `display: grid; grid-template-columns: 1fr 1fr;` เต็มความกว้าง 100%
   - ทั้ง 2 แท็บแบ่งพื้นที่คนละ 50% พอดี จัดวางไอคอนและข้อความให้อยู่ตรงกลางอย่างสวยงาม
   - ออกแบบ Active State เป็น Smooth Pill ที่มีเงาความลึกระดับพรีเมียม สอดคล้องทั้ง Light Mode และ Dark Mode
3. **Verification:**
   - สั่ง `cmd.exe /c "npm run build"` สำเร็จสมบูรณ์ 100%
**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/components/auth/auth.component.html`
- `aift-frontend/src/app/components/auth/auth.component.scss`
- `aift-frontend/CHANGELOG.md`
- `CHANGELOG.md`

### 📅 2026-09-29 11:38:00 (Local Time)
**ประเภท:** `[Fix / UI / Error Handling]` `[Frontend]`  
**หัวข้อ:** ถอดปุ่มและแถบ "ดูสาเหตุ / รายละเอียดทางเทคนิค" ออกจากระบบแจ้งเตือนข้อผิดพลาดทั้งหมดอย่างสมบูรณ์  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้ไม่ต้องการให้มีลิงก์หรือปุ่ม "▼ ดูสาเหตุ / รายละเอียดทางเทคนิค" ปรากฏบนหน้าจอ Error ทั้งในหน้าเข้าสู่ระบบ (Login/Register) และคอมโพเนนต์แจ้งเตือน โดยต้องการให้แสดงเฉพาะข้อความภาษาไทยที่สุภาพ กระชับ และเข้าใจง่ายเท่านั้น
**สิ่งที่แก้ไข (Changes Detail):**
1. **หน้าเข้าสู่ระบบและสมัครสมาชิก (`auth.component.html`, `.ts`, `.scss`):**
   - ถอดปุ่ม toggle `▼ ดูสาเหตุ / รายละเอียดทางเทคนิค` และบล็อกแสดงผล Technical Detail (`error-detail-wrapper`) ออกทั้งหมด
   - ลบสัญญาณ `errorDetail`, `showErrorDetail`, เมธอด `toggleErrorDetail()` และ CSS สไตล์ที่เกี่ยวข้อง
   - ปรับฟังก์ชัน `parseAuthError` ให้คืนค่าข้อความภาษาไทยที่เรียบง่าย ชัดเจน โดยไม่มีข้อมูลเทคนิคหรือ Stack Trace ปนเปื้อน
2. **คอมโพเนนต์ `ErrorBannerComponent` (`error-banner.component.ts`):**
   - ถอดแถบปุ่ม `▼ ดูรายละเอียดทางเทคนิค` และโค้ดบ็อกซ์ `raw-code-box` ออกทั้งหมด
   - ถอดป้ายแสดงผลรหัส HTTP (`status-pill`) ออก เพื่อไม่ให้มีรหัสทางเทคนิคแสดงต่อผู้ใช้ทั่วไป
3. **Verification:**
   - ทดสอบรัน `cmd.exe /c "npm run build"` สำเร็จสมบูรณ์ ไร้ข้อผิดพลาด
**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/components/auth/auth.component.html`
- `aift-frontend/src/app/components/auth/auth.component.ts`
- `aift-frontend/src/app/components/auth/auth.component.scss`
- `aift-frontend/src/app/components/error-banner/error-banner.component.ts`
- `aift-frontend/CHANGELOG.md`
- `CHANGELOG.md`

### 📅 2026-09-29 11:35:00 (Local Time)
**ประเภท:** `[Feature / UX / Error Handling]` `[Frontend]`  
**หัวข้อ:** ปรับปรุงระบบแสดงผล Error Response ทั่วทั้งแอปพลิเคชันให้เป็นมิตรและเข้าใจง่ายในภาษาไทย พร้อมคำแนะนำแก้ไข (User-Friendly Error Handling & Actionable Suggestions)  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้ต้องการให้ข้อความแสดงข้อผิดพลาด (Error Response) ทั่วทั้งระบบอ่านเข้าใจง่ายเหมือนหน้าเข้าสู่ระบบตอนใส่รหัสผ่านผิด ไม่ส่งข้อความภาษาอังกฤษดิบหรือ HTTP Status Code ดิบจาก Backend (เช่น "Http failure response for http://... 0 Unknown Error", "Cannot GET /...", "Unauthorized", "Validation failed") มาแสดงต่อผู้ใช้
**สิ่งที่แก้ไข (Changes Detail):**
1. **สร้างบริการกลาง `ErrorHandlerService` (`error-handler.service.ts`):**
   - แปลงทุก HTTP Error Status Code (0 Network Offline/Backend Down, 400 ข้อมูลไม่ถูกต้อง, 401 เซสชันหมดอายุ, 403 ไม่มีสิทธิ์, 404 ไม่พบข้อมูล, 409 ข้อมูลซ้ำ, 413 รูปใหญ่เกิน, 429 AI คิวเต็ม, 500 ระบบขัดข้อง)
   - รองรับแยกตามบริบทการทำงาน: `transactions`, `categories`, `budgets`, `chat`, `receipt`, `voice`, `general`
   - คืนค่าออบเจกต์ `AppErrorInfo` มี `title`, `message`, `suggestion` (💡 คำแนะนำแก้ไขปัญหา), `canRetry`, และ `technical` (ซ่อน Error ดิบไว้ใน Accordion รายละเอียดทางเทคนิค ให้กดเปิดดูได้เฉพาะเมื่อต้องการ)
2. **สร้าง Standalone Component `ErrorBannerComponent` (`error-banner/`):**
   - การ์ดแจ้งเตือน Error ออกแบบสไตล์ Modern Glassmorphism สอดคล้องกับ Sic Theme และ Dark Mode
   - รองรับโหมดปกติ และโหมด `compact` สำหรับแสดงใน Form Dialog
   - มีปุ่ม "🔄 ลองใหม่อีกครั้ง" (Retry) และ Accordion "รายละเอียดทางเทคนิค"
3. **ปรับปรุงหน้ารวมรายการ (`transactions.component.ts` & `.html`):**
   - แสดง `<app-error-banner>` ด้านบนตารางเมื่อเกิดข้อผิดพลาดในการโหลดรายการ พร้อมปุ่มโหลดใหม่
   - แสดง Error Banner ใน Modal แก้ไขรายการ และใน Modal ยืนยันการลบรายการ
4. **ปรับปรุงหน้าจัดการหมวดหมู่ (`categories.component.ts` & `.html`):**
   - แสดง Error Banner ใน Create/Edit Category Dialog
   - ปรับปรุง Notice Warning Modal กรณีหมวดหมู่เริ่มต้น หรือมีรายการผูกค้างอยู่ ให้เข้าใจง่ายพร้อมคำแนะนำ
5. **ปรับปรุงหน้างบประมาณ (`budget-panel.component.ts` & `.html`):**
   - ยกเลิกการใช้คำสั่ง `alert(...)` ทั้งหมด แทนที่ด้วย Error Banner
   - เพิ่มการจัดการ Error ในหน้าแสดงผล, Dialog ตั้งงบ, Dialog แนะนำงบจากพฤติกรรม และ Dialog ยืนยันการลบ
6. **ปรับปรุงแถบป้อนข้อมูล AI, เสียง, และใบเสร็จ (`chat-input.component.ts` & `.html`):**
   - Speech Recognition: แสดงคำแนะนำการเปิดสิทธิ์ไมโครโฟนในเบราว์เซอร์เมื่อถูกบล็อก
   - AI Chat (รายจ่าย/รายรับ/ชุดรายการ) & ใบเสร็จ: แปลง Error ทั้งหมดเป็นคำแนะนำที่ชัดเจน
7. **ปรับปรุงรายการวันนี้ (`daily-log.component.ts` & `.html`):**
   - ยกเลิกการใช้คำสั่ง `alert(...)` ทั้งหมดในการแก้ไขและลบรายการ
   - เพิ่ม Error Banner พร้อมปุ่ม Retry
8. **ปรับปรุงหน้า Admin Model Limits (`admin-model-limits.component.ts`):**
   - แสดงข้อความสิทธิ์ Admin และข้อผิดพลาดเป็นภาษาไทยอย่างชัดเจน
**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/services/error-handler.service.ts`
- `aift-frontend/src/app/components/error-banner/error-banner.component.ts`
- `aift-frontend/src/app/components/error-banner/error-banner.component.html`
- `aift-frontend/src/app/components/error-banner/error-banner.component.css`
- `aift-frontend/src/app/components/transactions/transactions.component.ts`
- `aift-frontend/src/app/components/transactions/transactions.component.html`
- `aift-frontend/src/app/components/categories/categories.component.ts`
- `aift-frontend/src/app/components/categories/categories.component.html`
- `aift-frontend/src/app/components/budget-panel/budget-panel.component.ts`
- `aift-frontend/src/app/components/budget-panel/budget-panel.component.html`
- `aift-frontend/src/app/components/chat-input/chat-input.component.ts`
- `aift-frontend/src/app/components/chat-input/chat-input.component.html`
- `aift-frontend/src/app/components/daily-log/daily-log.component.ts`
- `aift-frontend/src/app/components/daily-log/daily-log.component.html`
- `aift-frontend/src/app/components/admin-model-limits/admin-model-limits.component.ts`
- `aift-frontend/CHANGELOG.md`
- `CHANGELOG.md`

### 📅 2026-09-29 10:50:00 (Local Time)
**ประเภท:** `[Feature / UI / Responsive]` `[Frontend]`  
**หัวข้อ:** ปรับปรุง Responsive สำหรับหน้าจอมือถือ (Focus: iPhone 17 & Modern Mobile Viewport) รองรับ iOS Safe Area และ Mobile Bottom Tab Bar  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- การแสดงผลบนมือถือ (โดยเฉพาะ iPhone 17 / iPhone รุ่นใหม่ กว้าง 393px-402px) ไม่สวยงามและใช้งานยาก:
  - Header ด้านบนกินพื้นที่ 2 แถว บดบังเนื้อหา
  - แถบพิมพ์ AI ด้านล่างของ Dashboard บังรายการ Daily Log ด้านล่างสุด
  - ปุ่มบนการ์ด Daily Log และตัวเลขเบียดกันจนชื่อรายการถูกตัดทอนมากเกินไป
  - ไม่มี Safe Area รองรับ Dynamic Island และ Home Indicator Bar
**สิ่งที่แก้ไข (Changes Detail):**
1. **Mobile Bottom Navigation Bar (iOS Tab Bar Style):**
   - เพิ่มแถบนำทาง 4 แท็บด้านล่างใน `app.ts` และ `app.scss`: แดชบอร์ด, งบประมาณ, หมวดหมู่, รายการทั้งหมด พร้อมไอคอน SVG คมชัด และสไตล์ Glassmorphism
   - ย้ายเมนูนำทาง 4 หน้าออกจาก Header ด้านบนบนมือถือ เหลือเฉพาะ Logo, สลับธีม, และ User Profile / Logout ทำให้ Header สูงเพียง ~52px
   - รองรับ `padding-top: max(4px, env(safe-area-inset-top, 0px))` ด้านบน และ `padding-bottom: max(8px, env(safe-area-inset-bottom, 12px))` ด้านล่าง
2. **Main Dashboard & Docked AI Chat Bar:**
   - ปรับ `dashboard-wrapper` ใช้ `min-height: calc(100dvh - 54px)` และ `-webkit-overflow-scrolling: touch`
   - ปรับตำแหน่ง Docking ของ Chat Input ให้ลอยอยู่เหนือ Bottom Nav Bar พอดี: `bottom: calc(54px + max(6px, env(safe-area-inset-bottom, 12px)))`
   - เพิ่ม `padding-bottom: calc(160px + env(safe-area-inset-bottom, 16px))` บน `.main-content` เพื่อให้เลื่อนดูรายการธุรกรรมได้ครบถ้วนโดยไม่ถูกแถบพิมพ์บัง
   - ปรับ Chat Input และ Tab Switcher ให้กระชับ ปุ่มควบคุม 38px เข้าถึงง่ายบนจอสัมผัส
3. **Daily Log & Summary Chart:**
   - ปรับลด padding การ์ดในจอเล็ก เพิ่มพื้นที่ให้ชื่อรายการแสดงผลได้ยาวขึ้น
   - จัดระเบียบปุ่ม Edit และ Delete ขนาด 32px ไม่แย่งพื้นที่ยอดเงิน
   - ปรับ Donut Chart และ Stats Grid ใน `summary-chart` ให้พอดีกับหน้าจอมือถือ
4. **Budget, Categories & Transactions Pages:**
   - เพิ่ม Bottom Safe Area Padding ในทุกหน้า เพื่อให้คอนเทนต์และการแบ่งหน้า (Pagination) ไม่ถูก Bottom Tab Bar ทับ
   - ปรับปรุง Filter bar, search input, type pills และ category dropdown บนมือถือ
5. **Verification:**
   - รัน `npm run build` ผ่านสมบูรณ์ (Exit code 0)
**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/app.ts`
- `aift-frontend/src/app/app.scss`
- `aift-frontend/src/app/components/main-dashboard/main-dashboard.component.css`
- `aift-frontend/src/app/components/chat-input/chat-input.component.css`
- `aift-frontend/src/app/components/summary-chart/summary-chart.component.css`
- `aift-frontend/src/app/components/daily-log/daily-log.component.css`
- `aift-frontend/src/app/components/budget-page/budget-page.component.css`
- `aift-frontend/src/app/components/budget-panel/budget-panel.component.css`
- `aift-frontend/src/app/components/categories/categories.component.css`
- `aift-frontend/src/app/components/transactions/transactions.component.css`
- `aift-frontend/src/app/components/admin-model-limits/admin-model-limits.component.scss`
- `aift-frontend/src/app/components/auth/auth.component.scss`
- `mobile-responsive-redesign.md`
- `aift-frontend/CHANGELOG.md`
- `CHANGELOG.md`

### 📅 2026-09-25 13:48:00 (Local Time)
**ประเภท:** `[Fix / Build / Deploy]` `[Frontend]`  
**หัวข้อ:** แก้ไขปัญหา Vercel ติดสิทธิ์ Permission denied (publickey) ขณะติดตั้ง sic-ng จาก Private GitHub Repo โดยการ Bundle เป็น Local Tarball Package  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- บน Vercel CI/CD เกิด Error: `npm error git@github.com: Permission denied (publickey). fatal: Could not read from remote repository ssh://git@github.com/softinter-chiangrai/sic-ng.git` (Exit code 128)
- เนื่องจาก `softinter-chiangrai/sic-ng` เป็น Private Repository ทำให้เซิร์ฟเวอร์ Build ของ Vercel ไม่มี SSH Key เข้าถึง
**สิ่งที่แก้ไข (Changes Detail):**
1. **Package Bundling (`libs/sic-ng-22.2.5.tgz`):**
   - ทำการ Pack ไลบรารี `sic-ng` เวอร์ชันปัจจุบัน (22.2.5) ให้กลายเป็น Compressed Tarball ขนาดกะทัดรัด (เพียง 635 KB) บันทึกไว้ในโฟลเดอร์ `libs/` ของโปรเจกต์
2. **Update Dependency Definition (`package.json` & `package-lock.json`):**
   - เปลี่ยนจาก `"sic-ng": "github:softinter-chiangrai/sic-ng#release/22"` เป็น `"sic-ng": "file:./libs/sic-ng-22.2.5.tgz"`
   - ทำให้ `npm install` บนเครื่องใดๆ รวมถึง Vercel สามารถติดตั้งไลบรารีได้โดยตรงทันที ไม่ต้องพึ่งพา SSH Key หรือ GitHub Personal Access Token (PAT)
3. **Verification:**
   - ทดสอบ `npm install` ผ่านฉลุย 100%
   - ทดสอบ `npm run build` สำเร็จ 100% ได้ไฟล์พร้อม Deploy ใน `dist/frontend/browser`
**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/libs/sic-ng-22.2.5.tgz`
- `aift-frontend/package.json`
- `aift-frontend/package-lock.json`
- `aift-frontend/CHANGELOG.md`
- `CHANGELOG.md`

### 📅 2026-09-25 13:25:00 (Local Time)
**ประเภท:** `[UI / Enhancement]` `[Frontend]`  
**หัวข้อ:** ปรับการแสดงผลรูปภาพหมวดหมู่ที่อัปโหลดเองให้โปร่งใสและเต็มขนาด ไม่ใส่สีกรอบทับซ้อน (Clean Custom Image Display)  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- เมื่อผู้ใช้อัปโหลดรูปภาพจากเครื่องตนเองมาใช้เป็นไอคอนหมวดหมู่ ตัวรูปจะถูกลดขนาดเหลือ 22px และถูกตีกรอบสี่เหลี่ยมสีพื้นหลังทับ (`background-color` และ `border-color`) ทำให้รูปภาพมีขนาดเล็กมากจนมองไม่เห็นรายละเอียดของภาพ
- ผู้ใช้ต้องการให้กรณีที่เป็นรูปภาพจากเครื่อง ไม่ต้องมีสีกรอบหรือสีพื้นหลังมาทับซ้อน เพื่อให้เห็นรูปภาพได้อย่างชัดเจนและสวยงาม
**สิ่งที่แก้ไข (Changes Detail):**
1. **`CategoryIconComponent` (`src/app/components/category-icon/category-icon.component.ts`):**
   - เมื่อตรวจพบว่าเป็นรูปภาพจากเครื่อง (`isCustomImage = true`):
     - ปลด `background-color` และ `border-color` ออกทั้งหมด (`transparent`)
     - กำหนดให้รูปภาพขยายเต็มขนาดคอนเทนเนอร์ (`containerDimension` 38px - 48px) พร้อม `border-radius: 10px` แทนการถูกบีบให้เล็กลงในกรอบ
     - เพิ่มเงาละมุน (subtle shadow) เพื่อให้รูปภาพเด่นชัดบนทั้งธีมมืดและธีมสว่าง
2. **หน้าหมวดหมู่และพรีวิว (`src/app/components/categories/`):**
   - ในการ์ดหมวดหมู่และการ์ดพรีวิว ปรับ `.cat-icon-badge` ให้มีพื้นหลังโปร่งใสเมื่อเป็นรูปภาพอัปโหลด และขยายขนาดรูปเป็น 48x48 เต็มพื้นที่
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/components/category-icon/category-icon.component.ts`
- `src/app/components/categories/categories.component.ts`
- `src/app/components/categories/categories.component.html`
- `src/app/components/categories/categories.component.css`
- `CHANGELOG.md`


### 📅 2026-09-25 12:30:00 (Local Time)
**ประเภท:** `[Fix / UI]` `[Frontend]`  
**หัวข้อ:** แก้ไขไอคอนและรูปภาพถูกบีบเพี้ยนบน Responsive Mobile (ลูกศรแท็บรายรับเพี้ยนเป็นตัวคล้าย '亻' และป้องกันไอคอนรูปภาพถูกบีบสัดส่วน)  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
1. บนหน้าจอมือถือ ไอคอนลูกศรบนแท็บ "รายรับ" เพี้ยน แบน บิดเบี้ยวจนดูเหมือนตัวอักษร '亻'
2. ตรวจสอบ Responsive ทั้งระบบ ป้องกันไม่ให้รูปภาพและไอคอนถูกบีบหรือผิดสัดส่วน (Aspect Ratio Distortion)
**สิ่งที่แก้ไข (Changes Detail):**
1. **SVG Path & Layout Fix (`src/app/components/chat-input/chat-input.component.html` & `.css`):**
   - แก้ไขโค้ดเวกเตอร์ลูกศร `รายรับ` (จากเดิมเขียน Path `l7-7 7-7` สองทอดผิดพิกัด ทำให้เส้นทะแยงพุ่งขึ้นสองครั้งกลายเป็นรูปคล้าย '亻') มาใช้ SVG `<line>` + `<polyline>` มาตรฐานพร้อม `stroke-linecap="round"` และ `stroke-linejoin="round"`
   - แก้ไขลูกศร `รายจ่าย (AI)` ให้เป็นลูกศรชี้ลงที่มีสมมาตรสวยงามระดับพิกเซล
   - ใส่ `flex-shrink: 0` ให้กับ `.tab-icon` และปรับ `.mobile-tab-switcher` ให้กระจายปุ่มด้วย `flex: 1` และจัดกึ่งกลาง
2. **Category Icon Anti-Distortion (`src/app/components/category-icon/category-icon.component.ts`):**
   - เพิ่ม `aspect-ratio: 1 / 1`, `object-fit: cover`, `max-width: 100%`, `max-height: 100%` และ `flex-shrink: 0` ให้กับ `:host`, `.cat-icon-container`, `.custom-cat-img` และ `svg`
   - การันตีว่ารูปภาพอัปโหลดและไอคอนหมวดหมู่จะรักษาสัดส่วนจัตุรัส 1:1 เสมอ ไม่มีวันโดน Parent Flex บีบหรือยืด
3. **Daily Log & Categories Responsive (`src/app/components/daily-log/` & `src/app/components/categories/`):**
   - กำหนด `min-width: 0` และ `text-overflow: ellipsis` ให้ชื่อรายการ เพื่อป้องกันไม่ให้ข้อความยาวดันและบีบไอคอนหรือปุ่มจัดการ
   - เพิ่ม Mobile Breakpoint (`@media (max-width: 600px)`) ให้หน้าหมวดหมู่จัดคอลัมน์แบบ 1 คอลัมน์ และปุ่มเพิ่มหมวดหมู่ยืดเต็มความกว้างอย่างสวยงาม
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/components/chat-input/chat-input.component.html`
- `src/app/components/chat-input/chat-input.component.css`
- `src/app/components/category-icon/category-icon.component.ts`
- `src/app/components/daily-log/daily-log.component.css`
- `src/app/components/categories/categories.component.css`
- `CHANGELOG.md`


### 📅 2026-09-25 12:20:00 (Local Time)
**ประเภท:** `[Fix / Bug]` `[Frontend]`  
**หัวข้อ:** แก้ไขบั๊กตัวอักษรภาษาไทยเพี้ยนในช่องแชต (คำว่า "กาชา" กลายเป็น "กา=า" และ "ข้าว" กลายเป็น "-้าว")  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้พิมพ์ "กาชา 200" หรือ "กาชา 300" แล้วได้ชื่อรายการเป็น "กา=า" และจัดเข้าหมวดหมู่ "อื่นๆ"
- ผู้ใช้พิมพ์ "ข้าว 50" แล้วได้ชื่อรายการเป็น "-้าว" และจัดเข้าหมวดหมู่ "อื่นๆ"
- เกิดจากฟังก์ชัน `fixThaiKeyboard` เดิมแปลงตัวอักษรแบบทั้งสตริง (global map) โดยแมปตัว 'ช' เป็น '=' และ 'ข' เป็น '-' ทำให้คำภาษาไทยที่มีพยัญชนะเหล่านี้พังเสียหาย
**สิ่งที่แก้ไข (Changes Detail):**
1. **`ChatInputComponent` (`src/app/components/chat-input/chat-input.component.ts`):**
   - แก้ไข `fixThaiKeyboard` ให้ตรวจจับและแปลงเฉพาะกลุ่มตัวอักษรตัวเลขที่พิมพ์ผิดแถวบนแป้นพิมพ์ไทย (Pure numeric tokens เช่น `ถจ` -> `50`, `คจจ` -> `800`) เท่านั้น
   - ยกเลิกการแมปพยัญชนะ 'ช' และ 'ข' อย่างเด็ดขาด และไม่แปลงตัวอักษรที่อยู่ในคำภาษาไทย (เช่น "กาชา", "ข้าว", "ค่าน้ำ", "ต้มยำ", "จิ้มจุ่ม" ยังคงรูปเดิม 100%)
   - เมื่อส่งข้อความ "กาชา 200" ตัว AI จะได้รับข้อความที่ถูกต้อง และจัดหมวดหมู่เข้า "กาชาปอง" หรือ "บันเทิง" ได้อย่างสมบูรณ์
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/components/chat-input/chat-input.component.ts`
- `CHANGELOG.md`


### 📅 2026-09-25 11:52:00 (Local Time)
**ประเภท:** `[UI / Enhancement]` `[Frontend]`  
**หัวข้อ:** ปรับปรุงหน้าระบบจัดการหมวดหมู่และเชื่อมต่อไอคอน/สีเข้าสู่หน้า Dashboard: จัดตำแหน่งปุ่ม เพิ่มฟังก์ชันอัปโหลดรูปภาพจากเครื่อง ตัวเลือกสีอิสระ อัปเดตไอคอนอาหาร และแสดงผลบนหน้า Dashboard ทั่วทั้งระบบ  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
1. ปุ่ม "+ เพิ่มหมวดหมู่" เครื่องหมายบวกไม่ตรงกับข้อความ
2. ต้องการให้ผู้ใช้สามารถเลือก/อัปโหลดรูปภาพหรือไอคอนจากเครื่องตัวเองได้
3. ต้องการให้ผู้ใช้สามารถเลือกสีเองได้อย่างอิสระ (Custom Color Picker)
4. ปรับเปลี่ยนไอคอนหมวดหมู่อาหารให้ดูสวยงาม เป็นสากล ไม่แปลกตา
5. ให้นำไอคอนและสีสันของหมวดหมู่ไปแสดงผลบนหน้า Dashboard (Daily Log, Mini Budget Ribbon, Summary Donut Chart)
**สิ่งที่แก้ไข (Changes Detail):**
1. **`CategoryIconComponent` (`src/app/components/category-icon/`):**
   - พัฒนา Reusable Component แสดงผลไอคอนเวกเตอร์ SVG, รูปภาพจากเครื่องที่อัปโหลด (Data URL), และไอคอนสถานะรายรับ
   - รองรับกรอบ Container สีกำกับแบบโปร่งแสงตามหมวดหมู่
2. **`CategoriesComponent` (`src/app/components/categories/`):**
   - จัดตำแหน่งไอคอนและตัวอักษรบนปุ่ม "+ เพิ่มหมวดหมู่" ด้วย flexbox vertical-align ที่สมบูรณ์
   - เพิ่มปุ่มและระบบอัปโหลดไฟล์รูปภาพจากเครื่อง (`PNG`, `JPG`, `WebP`, `SVG`) พร้อม auto-resize เป็น 128x128
   - เพิ่มเครื่องมือเลือกสีอิสระ Native Color Picker + Hex Input ทำงานคู่กับจานสี Preset
   - เปลี่ยนไอคอนอาหารเป็นรูปมีดส้อม (Fork & Knife) และเพิ่มไอคอนชามซุป (Soup bowl)
3. **เชื่อมต่อเข้ากับ Dashboard และหน้ารายการ:**
   - `DailyLogComponent`: เปลี่ยนไอคอน Emoji เป็นไอคอนเวกเตอร์/รูปภาพของแต่ละหมวดหมู่พร้อมกรอบสีตรงหมวด
   - `MiniBudgetComponent`: แถบ Ribbon แสดงไอคอนเวกเตอร์แทน Emoji
   - `SummaryChartComponent`: ซิงค์สี Donut Chart ตามโทนสีหมวดหมู่จริง
   - `TransactionsComponent`: แสดงไอคอนหมวดหมู่ในตารางธุรกรรม
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/components/category-icon/category-icon.component.ts`
- `src/app/services/category.service.ts`
- `src/app/components/categories/categories.component.ts`
- `src/app/components/categories/categories.component.html`
- `src/app/components/categories/categories.component.css`
- `src/app/components/daily-log/daily-log.component.ts`
- `src/app/components/daily-log/daily-log.component.html`
- `src/app/components/daily-log/daily-log.component.css`
- `src/app/components/summary-chart/summary-chart.component.ts`
- `src/app/components/mini-budget/mini-budget.component.ts`
- `src/app/components/mini-budget/mini-budget.component.html`
- `src/app/components/transactions/transactions.component.ts`
- `src/app/components/transactions/transactions.component.html`
- `src/app/components/transactions/transactions.component.css`
- `CHANGELOG.md`

### 📅 2026-09-25 11:35:00 (Local Time)
**ประเภท:** `[Feature / UI]` `[Frontend]`  
**หัวข้อ:** เพิ่มหน้าระบบจัดการหมวดหมู่ค่าใช้จ่าย (`/categories`) พร้อมไดอะล็อกเพิ่ม/แก้ไข, ตัวเลือกไอคอน SVG และจานสี, ระบบพรีวิว Real-time และไดอะล็อกแจ้งเตือนความปลอดภัย  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้ต้องการหน้าเพิ่มและบริหารจัดการหมวดหมู่ค่าใช้จ่าย (Custom Categories) ที่เข้าถึงได้ผ่าน Navbar
- รองรับการเลือกไอคอนและเลือกสีสันสำหรับหมวดหมู่ โดยคงมาตรฐาน Zero-Emoji และ Purple Ban
- แสดงสรุปสถิติจำนวนรายการและยอดค่าใช้จ่ายที่เกิดขึ้นจริงในแต่ละหมวดหมู่
- ป้องกันการลบหมวดหมู่เริ่มต้น และแจ้งเตือนพร้อมจำนวนรายการหากพยายามลบหมวดหมู่ที่มีการใช้งาน
**สิ่งที่แก้ไข (Changes Detail):**
1. **`CategoryService` (`src/app/services/category.service.ts`):**
   - API client สำหรับดึง สร้าง แก้ไข ลบหมวดหมู่
   - กำหนดชุด Preset Colors 11 สีสวยงาม (ไม่ใช้สีม่วง) และ Preset Icons 16 ไอคอน SVG
2. **`CategoriesComponent` (`src/app/components/categories/`):**
   - Summary Cards สรุปหมวดหมู่ทั้งหมด, ระบบเริ่มต้น, สร้างเอง
   - Grid การ์ดหมวดหมู่พร้อม Color Stripe ด้านบน, แสดงไอคอน SVG และสถิติจำนวนรายการ/ยอดเงิน
   - Dialog สร้าง/แก้ไขหมวดหมู่ (`sic-dialog`) พร้อม Live Preview การ์ดจำลองแบบ Real-Time
   - Dialog ยืนยันการลบ และ Dialog แจ้งเตือนความปลอดภัยกรณีมีรายการค่าใช้จ่ายผูกอยู่
3. **Routing & Navbar (`src/app/app.routes.ts`, `src/app/app.ts`):**
   - เพิ่ม Route `/categories` กำกับด้วย `authGuard`
   - เพิ่มลิงก์เมนู "หมวดหมู่" บน Navbar
**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/services/category.service.ts`
- `aift-frontend/src/app/components/categories/categories.component.ts`
- `aift-frontend/src/app/components/categories/categories.component.html`
- `aift-frontend/src/app/components/categories/categories.component.css`
- `aift-frontend/src/app/app.routes.ts`
- `aift-frontend/src/app/app.ts`
- `aift-frontend/CHANGELOG.md`

### 📅 2026-09-25 10:49:00 (Local Time)
**ประเภท:** `[Feature / AI / UI]` `[Frontend]`  
**หัวข้อ:** พัฒนาระบบ Smart AI Input: รองรับการบันทึกด้วยเสียงภาษาไทย (Voice-to-Text), หน้าต่าง Preview ยืนยันรายการหลายรายการ (Multi-Item Batch Modal) และ Zero-Emoji UI  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- เพิ่มความสะดวกในการบันทึกให้รวดเร็วด้วยเสียงภาษาไทยผ่าน Web Speech API
- รองรับการแสดงผล Preview Modal เมื่อผู้ใช้พิมพ์หรือพูดหลายรายการในข้อความเดียว
- ปรับปรุง Zero-Emoji UI เปลี่ยนไอคอนทั้งหมดเป็น SVG Vector มาตรฐานระบบ
**สิ่งที่แก้ไข (Changes Detail):**
1. **`chat-input.component.ts`:**
   - เชื่อมต่อ Web Speech API รองรับภาษาไทย (`th-TH`) สำหรับทั้งรายจ่ายและรายรับ
   - เพิ่มระบบจัดการ Batch Preview Modal (`batchItems`, `addBatchItem`, `removeBatchItem`, `getBatchTotal`, `confirmSaveBatch`)
   - รองรับสถานะ Modal ด้วย SVG Icon ตามประเภท (Success, Warning, Error, Info)
2. **`chat-input.component.html` & `.css`:**
   - เพิ่มปุ่มไมโครโฟน SVG Vector พร้อมแอนิเมชัน Pulse วงแหวนสีแดงขณะฟังเสียง
   - เพิ่มหน้าต่าง `sic-dialog` พรีวิวหลายรายการ สามารถแก้ไขชื่อ ยอดเงิน เปลี่ยนหมวดหมู่ และกดลบรายการได้ในตัว
   - เปลี่ยนไอคอนทั้งหมดเป็น SVG Vector ไร้ Emoji
3. **`expense.service.ts`:**
   - เพิ่มฟังก์ชัน `saveBatch(items)` สำหรับส่งรายการไปบันทึกที่ `POST /expenses/batch`
**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/services/expense.service.ts`
- `aift-frontend/src/app/components/chat-input/chat-input.component.ts`
- `aift-frontend/src/app/components/chat-input/chat-input.component.html`
- `aift-frontend/src/app/components/chat-input/chat-input.component.css`
- `aift-frontend/CHANGELOG.md`
**ประเภท:** `[Fix / UI / Theme]` `[Frontend]`  
**หัวข้อ:** กู้คืนชุดสีธีมมืดเดิม (Slate Theme: Deep Midnight Navy) แทนที่สีดำสนิท (Pitch Black) ตามความต้องการของผู้ใช้  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้แจ้ง: "background theme มืดชอบเป็นสีแบบเดิมมากกว่าอะที่ไม่ใช่สีดำ" พร้อมแนบภาพหน้าจอธีมมืดเดิมที่มีโทนสีน้ำเงินกรมท่าเข้ม (Slate 900/800)
- ในรอบก่อนหน้าที่มีการแมปเข้ากับ sic-ng default theme มีการใช้ค่าสีดำเทาเข้ม (#101215, #17191d) ทำให้สูญเสียเอกลักษณ์โทนสี Slate เดิมไป
**สิ่งที่แก้ไข (Changes Detail):**
1. **กู้คืน Color Tokens ใน `src/styles.scss`:**
   - `--bg-color: #0f172a;` (Slate 900) สำหรับพื้นหลังหลักของแอป
   - `--bg-surface: #1e293b;` (Slate 800) สำหรับการ์ดและพื้นผิวคอนเทนเนอร์
   - `--border-color: #334155;` (Slate 700) สำหรับเส้นขอบตัด
   - `--text-color: #f8fafc;` (Slate 50) และ `--text-muted: #94a3b8;` (Slate 400)
   - แมปเข้ากับตัวแปร `--sic-color-*` ทุกตัวเพื่อให้คอมโพเนนต์ sic-card, sic-dialog, sic-button ซิงค์เป็นโทนสี Slate เดียวกันทั้งหมด
2. **ปรับแต่ง Dropdown options & Stat-cards:**
   - ปรับตัวเลือก `<option>` ในโหมดมืดให้ใช้พื้นหลัง `#1e293b`
   - ปรับ `.stat-card` ใน `summary-chart` ให้ใช้ `var(--bg-color)` เพื่อให้กลืนเข้ากับการ์ดเหมือน `.expense-item` ใน `daily-log`
3. **การตรวจสอบและ Build:**
   - รันคำสั่ง `npm run build` ผ่านสมบูรณ์ (Exit Code 0)
   - ตรวจสอบผ่าน Browser Subagent ยืนยันว่าค่าสีตรงตาม Slate Theme เดิม (`rgb(15, 23, 42)` และ `rgb(30, 41, 59)`) เหมือนภาพอ้างอิงของผู้ใช้ทุกประการ
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/styles.scss`
- `src/app/components/summary-chart/summary-chart.component.css`
- `CHANGELOG.md`

---

### 📅 2026-09-24 16:45:00 (Local Time)
**ประเภท:** `[Fix / UI / Layout]` `[Frontend]`  
**หัวข้อ:** แก้ไขขนาดและความสูงของการ์ดสรุปรายจ่ายเดือน (`app-summary-chart`) ให้เท่ากันพอดีกับการ์ดรายการวันนี้ (`app-daily-log`), นำการครอบกล่องซ้อนออก และลบคำว่า "ภาพรวม" พร้อม Emoji ทั้งหมด  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้แจ้ง: "เช็คกล่อง สรุปรายจ่ายเดือน ด้วย กล่องมันใหญ่ไม่ตรงกล่องอื่น คำว่าภาพรวมก็เอาออก"
- สาเหตุของขนาดกล่องไม่ตรงและดูใหญ่เทอะทะ: ใน `summary-chart.component.html` มีการนำ `<sic-card>` มาครอบทับ `<div class="chart-container">` ซ้ำซ้อน ทำให้เกิดกรอบซ้อนสองชั้น (Double card) และมี padding ซ้อนกันถึง 38px
- ความสูงไม่เท่ากัน: การ์ดฝั่งซ้าย (`summary-chart`) หยุดอยู่ที่ 508px ขณะที่การ์ดฝั่งขวา (`daily-log`) ยืดไปถึง 598px ทำให้ขอบล่างไม่เสมอกัน
- ปัญหาข้อความ: มี Badge คำว่า "ภาพรวม" และอีโมจิ `📊` ติดอยู่บนหัวข้อการ์ด
**สิ่งที่แก้ไข (Changes Detail):**
1. **`summary-chart` Component (`summary-chart.component.html`, `summary-chart.component.css`, `summary-chart.component.ts`):**
   - นำ `<div class="chart-container">` ที่ครอบซ้อนออก ให้ `<sic-card [elevated]="true" class="summary-card">` เป็นการ์ดชั้นเดียวมาตรฐาน
   - ลบอีโมจิ `📊` และ Badge `<sic-badge>ภาพรวม</sic-badge>` ออกจากหัวข้อ
   - ปรับ `:host` และ `.summary-card` ให้ใช้ `flex: 1; height: 100%; min-height: 0;` ยืดเต็มความสูงของแถว `.top-section` เสมอกันกับฝั่ง `daily-log` พอดีทุกพิกเซล (598px)
   - ปรับขนาดและอัตราส่วน Doughnut Chart ให้สมดุล (`max-width: 270px; max-height: 250px;`) จัดกึ่งกลางแนวตั้ง ไม่ล้นและไม่ดันการ์ด
   - นำการ import `SicBadgeComponent` ที่ไม่ได้ใช้ออก
2. **`daily-log` Component (`daily-log.component.css`):**
   - เชื่อมโยง `:host` และ `.daily-log-container` ให้ยืดความสูงเต็ม `height: 100%` และจัดการ Scrollbar ภายใน `.sic-card__content` อย่างสมบูรณ์
3. **`ai-insight` Component (`ai-insight.component.html`):**
   - ลบอีโมจิ `🤖` และคำว่า "ภาพรวม" ออกจากปุ่มและหัวข้อ Dialog ("บทวิเคราะห์การเงินจาก AI")
4. **`mini-budget` Component & `app.ts`:**
   - เปลี่ยนอีโมจิ `🎯` และ `⚠️` ใน Mini Budget เป็นไอคอนเวกเตอร์ SVG
   - ลบอีโมจิ `📊`, `🎯`, `📝`, `👑` ในแถบนำทาง Navigation Bar
5. **การตรวจสอบและ Build:**
   - รันคำสั่ง `npm run build` ผ่านสมบูรณ์ (Exit Code 0)
   - ตรวจสอบผ่าน Browser Subagent ทั้ง Light และ Dark Mode ยืนยันว่าขอบบน-ล่างของการ์ดทั้งสองฝั่งตรงกัน 100%, ไม่มีกรอบซ้อน และไม่มีคำว่า "ภาพรวม"
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/components/summary-chart/summary-chart.component.html`
- `src/app/components/summary-chart/summary-chart.component.css`
- `src/app/components/summary-chart/summary-chart.component.ts`
- `src/app/components/daily-log/daily-log.component.css`
- `src/app/components/ai-insight/ai-insight.component.html`
- `src/app/components/mini-budget/mini-budget.component.html`
- `src/app/app.ts`
- `CHANGELOG.md`

---

### 📅 2026-09-24 16:25:00 (Local Time)
**ประเภท:** `[Fix / UI / Refactor]` `[Frontend]`  
**หัวข้อ:** ยกเลิกการใช้ Emoji ทั้งหมด (Zero-Emoji UI) และปรับปรุงระบบปุ่มจัดการ (Edit & Delete Action Buttons) ให้เป็น SVG Vector พร้อมพื้นหลังและกรอบตัดตามมาตรฐานระบบครบทุกหน้า  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้ตักเตือน: "ปุ่มแก้ไขกับปุ่มลบอีกละไม่จำไม่รอบคอบเลยเคยบอกแล้วว่าไม่ใช้รูปนี้มันดูมักง่ายไป"
- ในรอบก่อนหน้าที่อัปเกรดคอมโพเนนต์ มีการใส่ Emoji ✏️, 🗑️, ⚠️, 🎯, 🟢, 🔴, 💰, 🔢 ลงในปุ่ม หัวข้อ Modal และ Metric Cards ซึ่งดูไม่เรียบร้อยและไม่ตรงตามมาตรฐาน SaaS ดีไซน์ระบบ
- ปุ่มใน `daily-log` เคยมีปัญหาเลย์เอาต์จากการครอบ `div` ซ้อน ทำให้แอนิเมชันเลื่อนสไลด์ (Hover Slide-in) หลุดหาย และปุ่มกลายเป็นปุ่มลอยโปร่งใสไม่มีกรอบ
**สิ่งที่แก้ไข (Changes Detail):**
1. **`daily-log` Component (`daily-log.component.html`, `daily-log.component.css`):**
   - นำ `div` ที่ครอบปุ่มออกเพื่อคืนโครงสร้าง Flexbox ที่ถูกต้องให้ `.expense-item`
   - ปรับใช้ปุ่ม `.edit-btn` และ `.delete-btn` ด้วยไอคอน Feather/Lucide SVG ขนาด 16x16px (Pencil & Trash-2)
   - ใส่พื้นหลังโปร่งแสงและเส้นขอบประณีต: ปุ่มแก้ไข (Sky Blue tint `#0284c7`, border `#bae6fd`), ปุ่มลบ (Red tint `#dc2626`, border `#fecaca`) พร้อมรองรับ Dark Mode
   - กู้คืน Desktop Hover Slide-in Animation ให้เลื่อนเข้ามาจากขวาอย่างนุ่มนวล พร้อมผลักตัวเลขยอดเงินหลบอัตโนมัติ และแสดงผลปกติบน Touch/Mobile
   - ปรับหัวข้อ Modal ยืนยันการลบให้สะอาด ลบอีโมจิ `⚠️` ออก
2. **`budget-panel` Component (`budget-panel.component.html`, `budget-panel.component.css`):**
   - ลบอีโมจิออกจากหัวข้อ Dialog ทั้งหมด (`ตั้งงบประมาณรายหมวด`, `แนะนำงบประมาณจากพฤติกรรม`, `ยืนยันการลบงบประมาณ`)
   - ลบอีโมจิจากปุ่มด้านบน (`แนะนำจากพฤติกรรม`, `＋ ตั้งงบประมาณ`)
   - สไตล์ปุ่มลบ `.delete-btn` ให้มีขนาด 32px โค้งมน พื้นหลังสีแดงอ่อน และมีกรอบชัดเจนสวยงาม
3. **`transactions` Component (`transactions.component.html`, `transactions.component.css`):**
   - เปลี่ยน Metric Cards ทั้ง 4 ใบ จาก Emoji `🟢`, `🔴`, `💰`, `🔢` มาใช้ไอคอนเวกเตอร์ SVG (ArrowUpRight, ArrowDownRight, Wallet, List) บรรจุในกล่อง `.metric-icon` สีพาสเทล
   - เปลี่ยนไอคอนช่องค้นหาจาก `🔍` มาเป็น Search SVG
   - ปรับปรุงตารางคอลัมน์จัดการให้ใช้ปุ่ม `.edit-btn` และ `.delete-btn` สไตล์เดียวกับ `daily-log`
   - ปรับ Empty State จาก `📂` มาเป็น Folder SVG
   - ปรับหัวข้อ Dialog ลบรายการให้สะอาด ไม่มีอีโมจิตกค้าง
4. **`admin-model-limits` Component (`admin-model-limits.component.html`):**
   - ลบอีโมจิ `👑` ออกจากหัวข้อ Modal
5. **Universal Styles (`src/styles.scss`):**
   - กำหนดคลาส `.edit-btn` และ `.delete-btn` ไว้เป็นมาตรฐานกลางระดับ Global
6. **การตรวจสอบและ Build:**
   - รันคำสั่ง `npm run build` ผ่านสมบูรณ์ (Exit Code 0)
   - ทดสอบจำลองหน้าเว็บผ่าน Browser Subagent ในทั้งโหมด Light และ Dark Mode บันทึกภาพ Screenshot ตรวจสอบเรียบร้อยทุกจุด
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/components/daily-log/daily-log.component.html`
- `src/app/components/daily-log/daily-log.component.css`
- `src/app/components/budget-panel/budget-panel.component.html`
- `src/app/components/budget-panel/budget-panel.component.css`
- `src/app/components/transactions/transactions.component.html`
- `src/app/components/transactions/transactions.component.css`
- `src/app/components/admin-model-limits/admin-model-limits.component.html`
- `src/styles.scss`
- `CHANGELOG.md`

---

### 📅 2026-09-24 15:25:00 (Local Time)
**ประเภท:** `[Fix / UI / UX]` `[Frontend]`  
**หัวข้อ:** แก้ไขบั๊กธีมมืด/สว่างค้าง (Dark/Light Sync), ดีไซน์ Custom Dropdowns ใหม่ทั้งหมด และยกเครื่อง Pagination Bar ให้สวยงามทันสมัย  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้แจ้งปัญหา: "ธีมดำสว่างบัค dropdown ไม่โอเคไม่สวย paging ก็บัคไม่สวย"
- สาเหตุของบั๊กธีม: `SicThemeService` สลับคลาส `.dark` แต่ `data-theme` บน `<html>` ไม่ถูกอัปเดต และมี CSS override โหมดมืดแบบฮาร์ดโค้ดค้าง ทำให้สลับไปสว่างแล้วพื้นหลังยังเป็นสีดำ หรือสลับไปมืดแล้วพื้นหลังขาว
- สาเหตุของ Dropdown: ใช้ `<select>` พื้นฐานของเบราว์เซอร์ ทำให้ดูหยาบ ลูกศรแข็ง และในโหมดมืดกล่องตัวเลือกแสดงผลผิดเพี้ยน
- สาเหตุของ Paging: แสดงผลปุ่มข้อความภาษาอังกฤษ First/Prev/Next/Last ที่ถูก disabled ทั้งหมดเมื่อมี 1 หน้า และวางโครงสร้าง layout แยกกระจัดกระจาย
**สิ่งที่แก้ไข (Changes Detail):**
1. **แก้บั๊กและเชื่อมต่อ Theme System ให้สมบูรณ์แบบ:**
   - ใน `src/app/app.ts`: เพิ่ม `effect()` เชื่อมโยงสถานะ `isDark()` ของ `SicThemeService` เข้ากับทั้งคลาส `.dark`, แอตทริบิวต์ `data-theme`, และจัดเก็บลง `localStorage` ทั้งสองคีย์ (`aift-theme`, `sic-ng-theme-mode`) อัตโนมัติทุกครั้งที่กดสลับ
   - ใน `src/index.html`: อัปเดตสคริปต์ Pre-bootstrap ให้อ่านค่าและซิงค์ทั้งคลาส `.dark` และ `data-theme` ป้องกันหน้าจอวาบ (FOUC)
   - ใน `src/styles.scss`: ลบ CSS Overrides สี Slate ที่ขัดแย้งออก เชื่อมโยงตัวแปร `--bg-color`, `--bg-surface`, `--text-color`, `--text-muted`, `--border-color` เข้ากับ Design Tokens `--sic-color-*` โดยตรง ทั้งโหมดสว่างและมืด
2. **ออกแบบและตกแต่ง Dropdown ใหม่ทั้งระบบ (Universal High-End Select):**
   - เพิ่ม Custom SVG Chevron สีม่วงคราม (Indigo) สำหรับโหมดสว่าง และสี Lavender สำหรับโหมดมืด
   - กำหนดขอบโค้งมน `var(--sic-radius-md)` พร้อมพื้นผิว Glass/Surface ที่เข้ากับโทนสี
   - เพิ่ม Hover & Focus Ring Effect ด้วย `box-shadow` นุ่มนวล
   - รองรับการแสดงผลของ `<option>` ในโหมดมืดด้วยพื้นหลังสีเข้ม ไม่หลุดขาว
3. **ยกเครื่อง Pagination Bar หน้า Transactions ให้สวยงามสไตล์ Modern SaaS:**
   - เปลี่ยนจากปุ่มข้อความอังกฤษ "First/Prev/Next/Last" เป็นชุดปุ่มนำทางพร้อมสัญลักษณ์สากล `«`, `‹`, ตัวเลขหน้า, `›`, `»`
   - ไฮไลต์หน้าปัจจุบันด้วยสี Primary Solid และ Soft Glow Shadow
   - หากมีหน้าเดียว (`totalPages <= 1`) จะแสดงป้ายสถานะ `หน้า 1 / 1` แทนการแสดงปุ่ม disable ที่ดูเหมือนฟังก์ชันพัง
   - รวมยอดสรุปรายการ (แสดง X - Y จาก Z รายการ), ชุดปุ่มเปลี่ยนหน้า, และกล่องเลือกจำนวนรายการต่อหน้า (20, 50, 100) ให้อยู่ในแถบ Card Bar แถวเดียวกันอย่างสวยงาม รองรับ Responsive บนมือถือ
4. **การตรวจสอบและ Build:**
   - รันคำสั่ง `npm run build` ผ่านสมบูรณ์ (0 Errors, 0 Warnings)
   - ตรวจสอบผ่าน Browser ทั้งโหมดมืดและสว่าง ผลการแสดงผลสอดคล้อง นุ่มนวล และอ่านง่าย
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/index.html`
- `src/styles.scss`
- `src/app/app.ts`
- `src/app/components/transactions/transactions.component.ts`
- `src/app/components/transactions/transactions.component.html`
- `src/app/components/transactions/transactions.component.css`
- `CHANGELOG.md`

---

### 📅 2026-09-24 14:35:00 (Local Time)
**ประเภท:** `[Feature / Upgrade / UI]` `[Frontend]`  
**หัวข้อ:** อัปเกรดระบบเป็น Angular 22 และเปลี่ยนผ่าน UI/Design System ทั้งระบบเข้าสู่ `sic-ng` (v22.2.5)  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้ต้องการนำ Component Framework `sic-ng` (จาก https://github.com/softinter-chiangrai/sic-ng.git) มาใช้งานในโปรเจกต์ AIFT และปรับปรุงแก้ไขทุกหน้าให้สอดคล้องกัน
**สิ่งที่แก้ไข (Changes Detail):**
1. **Core Upgrade & Dependencies:**
   - ติดตั้ง Agent Skills สำหรับ `sic-ng` จำนวน 8 ชุด (`sic-ng`, `sic-theme`, `sic-provide-config`, `sic-layout`, `sic-generate`, `sic-project-setup`, `sic-update`, `sic-figma`)
   - อัปเกรด Angular Core, Compiler, Forms, Router, CDK และ CLI สู่เวอร์ชัน 22 (`@angular/*@^22.2.0`)
   - อัปเกรด TypeScript เป็น `~6.0.2` เพื่อรองรับ Angular 22 เต็มรูปแบบ
   - ติดตั้งแพ็กเกจ `sic-ng` จาก Release branch `github:softinter-chiangrai/sic-ng#release/22` (v22.2.5)
2. **Global Styles & Providers Configuration:**
   - ใน `src/styles.scss`: Import CSS Theme กลาง `sic-ng/theme/all-themes.css` พร้อม Map Design Tokens (`--sic-color-*`, `--sic-radius-*`, `--sic-font-family`) เชื่อมกับธีมเดิมของ AIFT
   - ใน `src/app/app.config.ts`: ติดตั้ง `provideSicTheme({ theme: 'default', mode: 'light' })` และ `provideSicConfig()`
3. **Refactor ทุกหน้าและคอมโพเนนต์สู่ `sic-ng` Components:**
   - **App Shell (`app.ts`):** ใช้งาน `SicThemeService`, `SicButtonComponent`, `SicBadgeComponent` และปุ่มสลับธีม sic-ng
   - **Authentication (`auth`):** เปลี่ยนมาใช้ `SicCardComponent`, `SicInputComponent`, `SicInputPasswordComponent`, `SicButtonComponent`, `SicBadgeComponent`
   - **Date Selector (`date-selector`):** ใช้ `SicButtonComponent` ในการสลับมุมมองวัน/เดือน/ปี
   - **Mini Budget (`mini-budget`):** ใช้ `SicProgressBarComponent`, `SicBadgeComponent`, `SicButtonComponent`
   - **AI Insight (`ai-insight`):** ใช้ `SicDialogComponent` และ `SicButtonComponent`
   - **Summary Chart (`summary-chart`):** ครอบการแสดงผลด้วย `SicCardComponent` และ `SicBadgeComponent`
   - **Daily Log (`daily-log`):** ใช้ `SicCardComponent`, `SicBadgeComponent`, `SicButtonComponent`, `SicDialogComponent`, `SicInputComponent` สำหรับการดู แก้ไข และลบรายการ
   - **Chat Input (`chat-input`):** ปรับปุ่มแท็บ ปุ่มส่งเสียง/ส่งข้อความ และ Dialog สถานะด้วย `SicButtonComponent` และ `SicDialogComponent`
   - **Budget Panel (`budget-panel`):** ปรับการแสดงผลการ์ดงบประมาณ, Progress bar, Modal เพิ่มงบ, Modal ขอคำแนะนำ AI และ Modal ยืนยันการลบ ด้วยชุดคอมโพเนนต์ `sic-ng`
   - **Transactions (`transactions`):** ปรับการ์ดสรุปยอด, แถบตัวกรอง, ตารางรายการ, ป้ายสถานะ, Pagination (`SicPaginationComponent`), และ Dialogs แก้ไข/ลบ ด้วย `sic-ng`
   - **Admin Model Limits (`admin-model-limits`):** ปรับเปลี่ยน Modal Backdrop มาเป็น `SicDialogComponent`, `SicBadgeComponent`, `SicButtonComponent`
4. **Build Verification:**
   - ทดสอบคอมไพล์โปรเจกต์ด้วย `npm run build` ผ่านสมบูรณ์ 100% ไร้ข้อผิดพลาด (0 Errors)
**ไฟล์ที่แก้ไข (Affected Files):**
- `package.json`
- `src/styles.scss`
- `src/app/app.config.ts`
- `src/app/app.ts`
- `src/app/components/auth/auth.component.ts` & `html`
- `src/app/components/date-selector/date-selector.component.ts` & `html`
- `src/app/components/mini-budget/mini-budget.component.ts` & `html`
- `src/app/components/ai-insight/ai-insight.component.ts` & `html`
- `src/app/components/summary-chart/summary-chart.component.ts` & `html`
- `src/app/components/daily-log/daily-log.component.ts` & `html`
- `src/app/components/chat-input/chat-input.component.ts` & `html`
- `src/app/components/budget-panel/budget-panel.component.ts` & `html`
- `src/app/components/transactions/transactions.component.ts` & `html`
- `src/app/components/admin-model-limits/admin-model-limits.component.ts` & `html`
- `CHANGELOG.md`

---

### 📅 2026-09-24 13:41:00 (Local Time)
**ประเภท:** `[UI / Refactor]` `[Frontend / UI]`  
**หัวข้อ:** ปรับปรุงปุ่มแก้ไข (Edit) ปุ่มลบถังขยะ (Delete) และหน้าต่าง Modal ในหน้า `/transactions` ให้ตรงตามดีไซน์หลักของระบบ  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้ระบุว่าปุ่มแก้ไขและปุ่มลบถังขยะในหน้ารายการธุรกรรมต้องสวยงามและเป็นสไตล์เดียวกับหน้าอื่น (`daily-log`)
**สิ่งที่แก้ไข (Changes Detail):**
1. **`transactions.component.html`:**
   - เปลี่ยนปุ่ม Emoji ✏️ และ 🗑️ มาใช้ SVG Feather/Lucide icons (Pencil และ Trash-2) เช่นเดียวกับใน `daily-log`
   - ปรับปรุงโครงสร้าง Edit Modal และ Delete Confirmation Dialog ให้มี SVG Warning Icon ขนาดใหญ่, กล่องไฮไลต์ชื่อรายการ `.item-highlight`, และปุ่มแอคชัน `.dialog-actions` แบบโค้งมน
2. **`transactions.component.css`:**
   - ใช้คลาส `.edit-btn` (สีฟ้า `#0ea5e9` พื้นหลังจาง `rgba(14, 165, 233, 0.08)`) และ `.delete-btn` (สีแดง `#ef4444` พื้นหลังจาง `rgba(239, 68, 68, 0.08)`)
   - ใส่ Hover effect นุ่มนวล `transform: scale(1.1)` พร้อมเงา Glow และ active animation `scale(0.92)`
   - สไตล์ Modal Dialog โค้งมน (`border-radius: 24px`), มี Backdrop Blur, และปุ่ม `.btn-confirm` / `.btn-cancel` ตามมาตรฐานของระบบ
3. **ทดสอบ Build:** สั่งรัน `npm run build` ผ่านสมบูรณ์ (Exit Code 0)
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/components/transactions/transactions.component.html`
- `src/app/components/transactions/transactions.component.css`
- `CHANGELOG.md`

---

### 📅 2026-09-24 13:35:00 (Local Time)
**ประเภท:** `[Feature]` `[Frontend / UI]`  
**หัวข้อ:** เพิ่มหน้าประวัติและค้นหารายการธุรกรรม (`/transactions`) พร้อมฟังก์ชัน Export CSV รองรับ Excel ภาษาไทย  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- พัฒนาฟีเจอร์ที่ 1 ตาม Roadmap ให้ผู้ใช้สามารถค้นหารายการย้อนหลัง กรองตามหมวดหมู่/ช่วงเวลา สรุปยอด และดาวน์โหลด CSV ได้
**สิ่งที่แก้ไข (Changes Detail):**
1. **`TransactionService` (`src/app/services/transaction.service.ts`):**
   - เชื่อมต่อ API `/transactions` เพื่อดึงข้อมูลพร้อม Filter & Pagination
   - รองรับฟังก์ชันดาวน์โหลด Export CSV และคำสั่ง Update/Delete รายการ
2. **`TransactionsComponent` (`src/app/components/transactions/`):**
   - แดชบอร์ดสรุปยอด Realtime: รายรับรวม, รายจ่ายรวม, ยอดสุทธิ, จำนวนรายการ
   - แถบเครื่องมือ Filter: ค้นหาคำแบบ Debounce, สลับประเภท (ทั้งหมด/รายจ่าย/รายรับ), เลือกหมวดหมู่, Quick Date Presets (เดือนนี้, เดือนก่อน, 7 วัน, 30 วัน, ทั้งหมด, กำหนดเอง)
   - ตารางรายการธุรกรรมแบบ Responsive พร้อมปุ่มแก้ไข (Modal Popup) และปุ่มลบ (Confirmation Dialog)
   - ปุ่ม `📥 ส่งออก CSV (Excel)` สำหรับดาวน์โหลดรายงานทันที
3. **`App` & `app.routes.ts`:**
   - ลงทะเบียนเส้นทาง `/transactions` ป้องกันด้วย `authGuard`
   - เพิ่มลิงก์ `📝 รายการทั้งหมด` ในแถบเมนูหลักของแอป
4. **`angular.json`:** ปรับงบประมาณ Component Style Warning ให้เหมาะสมกับหน้า Page Complex Component
5. **ทดสอบ Build:** รัน `npm run build` ผ่านสมบูรณ์ ไร้ข้อผิดพลาดและไม่มีคำเตือน (0 Errors, 0 Warnings)
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/services/transaction.service.ts`
- `src/app/components/transactions/transactions.component.ts`
- `src/app/components/transactions/transactions.component.html`
- `src/app/components/transactions/transactions.component.css`
- `src/app/app.routes.ts`
- `src/app/app.ts`
- `angular.json`
- `CHANGELOG.md`

---

### 📅 2026-09-24 11:32:00 (Local Time)
**ประเภท:** `[UI / Refactor]` `[Frontend / Auth]`  
**หัวข้อ:** นำฟิลด์ "ชื่อเล่น / ชื่อที่ต้องการให้แสดง" ออกจากฟอร์มสมัครสมาชิก (Register)  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้ระบุว่าฟิลด์ชื่อเล่นไม่จำเป็น ต้องการนำออกจากฟอร์มสมัครสมาชิกเพื่อลดขั้นตอนและความซ้ำซ้อน
**สิ่งที่แก้ไข (Changes Detail):**
1. **`auth.component.html`:** ลบ Input Field "ชื่อเล่น / ชื่อที่ต้องการให้แสดง (ทางเลือก)" (`displayName`) ออกจากฟอร์มสมัครสมาชิก
2. **`auth.component.ts`:** ลบตัวแปรโมเดล `displayName` ออก และปรับปรุงขั้นตอน Register ให้ส่ง `displayName: u` (ใช้ username เป็นชื่อแสดงผลเริ่มต้นโดยอัตโนมัติ)
3. **ทดสอบ Build:** สั่งรัน `npm run build` ตรวจสอบแล้ว Bundle ทำงานได้สมบูรณ์และไม่มี Error (Exit Code 0)
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/components/auth/auth.component.html`
- `src/app/components/auth/auth.component.ts`
- `CHANGELOG.md`

---

### 📅 2026-09-24 11:25:00 (Local Time)
**ประเภท:** `[Fix / UI]` `[Frontend / Auth]`  
**หัวข้อ:** นำกล่องข้อความแจ้งเตือนสีส้ม "เซสชันการใช้งานหมดอายุ..." ออกจากหน้าล็อกอิน (Login Page)  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้ต้องการนำกล่องข้อความแจ้งเตือน "เซสชันการใช้งานหมดอายุ กรุณาเข้าสู่ระบบอีกครั้งเพื่อดำเนินการต่อ (ระบบจะพากลับไปยังหน้างบประมาณหลังล็อกอิน)" ออก ไม่ต้องแสดงบนหน้าล็อกอินอีกต่อไป
**สิ่งที่แก้ไข (Changes Detail):**
1. **`auth.component.html`:** ลบกล่องข้อความแจ้งเตือน `@if (sessionExpired()) { ... }` (Alert Warning สีส้ม) ออกจากหน้าจอ
2. **`auth.component.ts`:** ลบ Signal `sessionExpired` และ Logic การตรวจจับ Query Param `reason === 'session_expired'` ออก เพื่อความกระชับและคลีนของโค้ด (คง `returnUrl` ไว้ตามเดิม เพื่อให้เมื่อเข้าสู่ระบบสำเร็จระบบยังคงพากลับมายังหน้าที่ค้างอยู่ได้โดยอัตโนมัติ)
3. **`auth.interceptor.ts`:** ปรับปรุงการเรียก `authService.logout(router.url)` โดยไม่ส่งพารามิเตอร์ `'session_expired'` ไปยัง Query Params เพื่อความสะอาดของ URL
4. **ทดสอบ Build:** สั่งรัน `npm run build` ตรวจสอบแล้ว Bundle ทำงานได้สมบูรณ์และไม่มี Error
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/components/auth/auth.component.html`
- `src/app/components/auth/auth.component.ts`
- `src/app/interceptors/auth.interceptor.ts`
- `CHANGELOG.md`

---

### 📅 2026-09-24 10:52:00 (Local Time)
**ประเภท:** `[Refactor]` `[Frontend / Config]`  
**หัวข้อ:** ปรับระบบ Environment ให้เป็นไปตามมาตรฐาน Angular (Build-time Configuration) และยกเลิกการใช้ `env.js`  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- แยก Environment ให้เด็ดขาดและปลอดภัยตามมาตรฐาน Angular ไม่ต้องใช้ runtime check ผ่าน window property เพื่อไม่ให้เกิดความสับสนหรือมีปัญหากับ tunnel/LAN/domain ในอนาคต
**สิ่งที่แก้ไข (Changes Detail):**
1. **ลบ `public/env.js`:** ถอด script tag `<script src="env.js"></script>` ออกจาก `src/index.html` และลบไฟล์ `public/env.js` ออกจาก repository
2. **แยกค่าอย่างเป็นระบบใน `environment.ts` และ `environment.production.ts`:**
   - `src/environments/environment.ts` (Dev): กำหนด `apiUrl: 'http://localhost:3000'` สำหรับ Local Development 100%
   - `src/environments/environment.production.ts` (Prod): กำหนด `apiUrl: 'https://aift-backend-hkbz.onrender.com'` สำหรับ Production Build (Vercel) 100%
3. **ทดสอบ Build:** สั่งรัน `npm run build` ตรวจสอบแล้ว Bundle ทำงานได้สมบูรณ์และสลับไฟล์ด้วย `fileReplacements` ตามมาตรฐาน Angular CLI
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/environments/environment.ts`
- `src/environments/environment.production.ts`
- `src/index.html`
- `public/env.js` (Deleted)
- `CHANGELOG.md`

---

### 📅 2026-09-24 10:47:00 (Local Time)
**ประเภท:** `[Fix]` `[Frontend / Config]`  
**หัวข้อ:** แยกการเชื่อมต่อ Backend ระหว่าง Local (`http://localhost:3000`) และ Production (`onrender.com`) ป้องกันการยิงขึ้น Cloud ขณะพัฒนา  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- การรัน Frontend ในโหมด Local Development ยิงคำขอ API ไปยัง Backend บน Production (Render) โดยไม่ได้ตั้งใจ
- สาเหตุเกิดจากใน `public/env.js` มีการกำหนดค่า `window.__env.apiUrl = 'https://aift-backend-hkbz.onrender.com'` แบบตายตัว ทำให้เมื่อรันบนเครื่องตนเอง ค่านี้จะไปแทนที่ Default ของ `environment.ts`
**สิ่งที่แก้ไข (Changes Detail):**
1. **Dynamic Host Detection (`public/env.js`):**
   - ตรวจสอบ `window.location.hostname` หากเข้าถึงผ่าน `localhost`, `127.0.0.1` หรือ IP ภายในเครื่อง ให้ชี้ไปที่ `http://localhost:3000`
   - หากเปิดใช้งานบน Domain ภายนอก (เช่น Vercel) จะชี้ไปยัง `https://aift-backend-hkbz.onrender.com` อัตโนมัติ
2. **Safe Fallback Guard (`environment.ts`):**
   - เพิ่มเงื่อนไขป้องกันไม่ให้ค่าภายนอกมาเขียนทับ `http://localhost:3000` ขณะทดสอบบนเครื่อง Local
**ไฟล์ที่แก้ไข (Affected Files):**
- `public/env.js`
- `src/environments/environment.ts`
- `CHANGELOG.md`

---

### 📅 2026-09-23 17:40:00 (Local Time)
**ประเภท:** `[Fix]` `[Frontend / Auth]`  
**หัวข้อ:** แก้ไขปัญหารีเฟรชหน้าจอแล้วเด้งออกจากระบบ (Prevent Session Logout on Page Refresh)  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้แจ้งว่า "ทุกครั้งที่ Refresh มันเด้งออกตลอด" ทำให้น่ารำคาญและต้องล็อกอินใหม่อยู่เสมอ
- สาเหตุเกิดจากใน `restoreSession()` ของ `AuthService` มีการเรียกเช็ค `/auth/me` และกำหนดว่าหากเกิดข้อผิดพลาดใดๆ ให้สั่ง `logout()` ทันที ประกอบกับ `authInterceptor` สั่ง logout เมื่อเกิด 401 ในจังหวะโหลดหน้าจอ ทำให้เวลาที่เกิด network jitter หรือการ refresh หน้าจอ ระบบจะล้าง Token และเตะผู้ใช้ออก
**สิ่งที่แก้ไข (Changes Detail):**
1. **ปรับปรุง `restoreSession()` ใน `auth.service.ts`:**
   - โหลด Session จาก `localStorage` (`aift_token`, `aift_user`) มาใช้งานทันทีอย่างต่อเนื่อง
   - ให้การซิงค์ข้อมูลโปรไฟล์ `/auth/me` ทำงานแบบ Background โดยหากตรวจสอบไม่สำเร็จหรือเน็ตกระตุก จะไม่เตะผู้ใช้ออก (คงสถานะล็อกอินเดิมไว้)
2. **ปรับปรุง `authInterceptor` ใน `auth.interceptor.ts`:**
   - ยกเว้น route `/auth/me` จากการทริกเกอร์ Auto-Logout ป้องกันการเด้งออกในจังหวะรีเฟรชหน้าจอ
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/services/auth.service.ts`
- `src/app/interceptors/auth.interceptor.ts`
- `CHANGELOG.md`

---

### 📅 2026-09-23 17:18:00 (Local Time)
**ประเภท:** `[Fix]` `[Config / Infra]` `[Frontend]`  
**หัวข้อ:** กำหนด Production Backend URL จริง (`https://aift-backend-hkbz.onrender.com`) ให้ Frontend บน Vercel  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- เข้าใช้งานหน้าเว็บ `https://aift-frontend.vercel.app/login` แล้วกดสมัครสมาชิกไม่มีอะไรเกิดขึ้น
- สาเหตุเกิดจากใน `public/env.js` ตัวแปร `window.__env.apiUrl` ยังคงเป็นค่าว่าง `''` และใน `environment.production.ts` ชี้ไปที่ URL เริ่มต้นซึ่งไม่ใช่ URL ของ Render Web Service ที่แท้จริง ทำให้ Frontend ส่งคำขอไปผิดเซิร์ฟเวอร์
**สิ่งที่แก้ไข (Changes Detail):**
1. **กำหนด Backend URL ใน `public/env.js`:**
   - ตั้งค่า `window.__env.apiUrl = 'https://aift-backend-hkbz.onrender.com'`
2. **อัปเดต Fallback URL ใน `environment.production.ts`:**
   - ชี้ไปยัง `https://aift-backend-hkbz.onrender.com`
**ไฟล์ที่แก้ไข (Affected Files):**
- `public/env.js`
- `src/environments/environment.production.ts`
- `CHANGELOG.md`

---

### 📅 2026-09-23 16:30:00 (Local Time)
**ประเภท:** `[Fix]` `[Frontend / Auth]`  
**หัวข้อ:** ปรับปรุงระบบแจ้งเตือนข้อผิดพลาดการเข้าสู่ระบบและสมัครสมาชิก แสดงสาเหตุชัดเจน พร้อมกลไก Timeout  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- เข้าสู่ระบบไม่ผ่านแล้วไม่มีสาเหตุแจ้งเตือน ปุ่มหมุนค้าง "กำลังประมวลผล..." ไม่ทราบสาเหตุที่แท้จริง
**สิ่งที่แก้ไข (Changes Detail):**
1. **RxJS Timeout & Finalize (`auth.service.ts`, `auth.component.ts`):**
   - กำหนด timeout 20 วินาที ป้องกันปุ่มค้างตลอดไป
   - ใช้ `finalize()` รีเซ็ต `isLoading` เป็น false ทุกกรณี
2. **Error Diagnostic Details (`auth.component.ts`, `auth.component.html`, `auth.component.scss`):**
   - ตรวจจับ HTTP Status (0: Network / Mixed Content, 401: รหัสผ่านผิด, 404, 500, 502/503/504)
   - เพิ่ม UI แสดงรายละเอียดทางเทคนิค พร้อมแจ้งเตือนหากเกิด Mixed Content หรือ Cold Start
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/app/services/auth.service.ts`
- `src/app/components/auth/auth.component.ts`
- `src/app/components/auth/auth.component.html`
- `src/app/components/auth/auth.component.scss`
- `CHANGELOG.md`

---

### 📅 2026-09-23 16:15:00 (Local Time)
**ประเภท:** `[Feature]` `[Config / Infra]`  
**หัวข้อ:** เพิ่ม Runtime Environment Configuration (public/env.js) สำหรับ Frontend  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ป้องกันการต้อง Rebuild หรือแก้ไขโค้ดเมื่อเปลี่ยน Backend URL ใน Production
**สิ่งที่แก้ไข (Changes Detail):**
1. **Runtime env.js:**
   - สร้าง `public/env.js` สำหรับกำหนดค่า Backend URL ได้อย่างอิสระโดยไม่ต้องแตะโค้ด Angular
   - โหลด `env.js` ใน `index.html` ก่อนที่ bundle จะเริ่มทำงาน
2. **Environment Fallback:**
   - ปรับปรุง `environment.ts` (Dev: fallback เป็น `http://localhost:3000`)
   - ปรับปรุง `environment.production.ts` (Prod: ตรวจจับ `window.__env.apiUrl` หรือใช้ default Render URL)
**ไฟล์ที่แก้ไข (Affected Files):**
- `public/env.js`
- `src/index.html`
- `src/environments/environment.ts`
- `src/environments/environment.production.ts`
- `CHANGELOG.md`

---

### 📅 2026-09-23 15:36:00 (Local Time)
**ประเภท:** `[Feature]` `[Config / Infra]` `[Mobile PWA]`  
**หัวข้อ:** เพิ่มการรองรับ PWA (Add to Home Screen) และ Environment Config สำหรับ Cloud Deployment  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- เตรียมความพร้อม Frontend ให้สามารถ Deploy บน Vercel และติดตั้งบนมือถือได้
**สิ่งที่แก้ไข (Changes Detail):**
1. **PWA & Web App Manifest (`manifest.webmanifest`, `index.html`):**
   - สร้างไฟล์ Web Manifest รองรับ standalone display, theme color, icons
   - เพิ่ม iOS meta tags (`apple-mobile-web-app-capable`, `apple-touch-icon`, `viewport-fit=cover`)
2. **Dynamic Environment (`src/environments/`):**
   - สร้าง `environment.ts` และ `environment.production.ts`
   - ปรับแต่ง `angular.json` เพิ่ม `fileReplacements`
   - ปรับปรุง Service ทั้งหมด (`ExpenseService`, `IncomeService`, `BudgetService`, `AuthService`, `AdminService`) ให้เรียก API ผ่าน `environment.apiUrl`
3. **Vercel SPA Rewrites (`vercel.json`):**
   - เพิ่ม rewrite rules ป้องกัน 404 เมื่อ refresh หน้า Angular
**ไฟล์ที่แก้ไข (Affected Files):**
- `src/environments/environment.ts`
- `src/environments/environment.production.ts`
- `angular.json`
- `public/manifest.webmanifest`
- `src/index.html`
- `vercel.json`
- `src/app/services/`
- `CHANGELOG.md`

---

### 📅 2026-09-23 15:19:00 (Local Time)
**ประเภท:** `[Fix]` `[Frontend / Mobile Responsive]`  
**หัวข้อ:** แก้ไขปัญหาการแสดงผลและตัดขอบของแถบ Mini Budget Ribbon บนมือถือ  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- พบปัญหาใน Mini Budget Ribbon เมื่อเปิดบนหน้าจอมือถือ/หน้าจอแคบ:
  - ปุ่ม `[จัดการงบ ->]` ไปอยู่ตรงกลาง และมีขอบของชิปหมวดหมู่โผล่มาตัดขอบที่มุมขวา (`(`) เนื่องจากข้อจำกัดของ Flexbox `order` ร่วมกับ `flex: 1`
  - แถบ Progress bar มีความสว่างน้อยในโหมดมืด (Dark Mode) และเมื่อยอดใช้จ่ายน้อย (เช่น 1-2%) ตัวหลอดจะมองไม่เห็น
**สิ่งที่แก้ไข (Changes Detail):**
1. **CSS Grid Layout on Mobile (`mini-budget.component.scss`):**
   - ปรับเลย์เอาต์บนมือถือ (`<= 900px`) ให้เป็น 2 แถวแบบ CSS Grid ชัดเจน:
     - **แถวบน:** หัวข้อ "🎯 งบเดือน..." + ป้าย % (ซ้าย) จัดคู่กับปุ่ม `[จัดการงบ ->]` (ขวา) ชิดขอบอย่างลงตัว
     - **แถวกลาง:** หลอด Progress bar เต็มความกว้าง พร้อมยอดเงิน `฿103 / ฿6,000` ชัดเจน
     - **แถวล่าง:** ชิปหมวดหมู่งบประมาณเลื่อนแนวนอนได้อย่างอิสระ ไม่ดันหรือซ้อนทับปุ่มจัดการงบ
2. **Dark Mode Visibility:**
   - ปรับพื้นหลัง track ในโหมดมืดให้คมชัดขึ้น (`rgba(255, 255, 255, 0.16)`) และกำหนด `min-width: 4px` ให้กับ `progress-fill` เพื่อให้เห็นแถบสีสถานะเสมอแม้ยอดใช้จ่าย 1-2%
3. **Template Condition (`mini-budget.component.html`):**
   - เพิ่ม `*ngIf="sortedStatuses.length > 0"` ซ่อนโซนชิปอัตโนมัติเมื่อยังไม่มีข้อมูลหมวดหมู่ย่อย

**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/components/mini-budget/mini-budget.component.html`
- `aift-frontend/src/app/components/mini-budget/mini-budget.component.scss`
- `CHANGELOG.md`

---

### 📅 2026-09-23 15:15:00 (Local Time)
**ประเภท:** `[Feature]` `[Fix]` `[Frontend / Mobile Responsive]`  
**หัวข้อ:** ปรับปรุงระบบ Mobile Responsive ครอบคลุมทั้งแอปพลิเคชัน (Mobile Responsive Overhaul)  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ตรวจสอบพบปัญหาการแสดงผลบนหน้าจอมือถือ (320px - 768px):
  - แถบ Chat Input Sticky ด้านล่างซ้อนกัน 2 กล่องสูง ~220px กินพื้นที่กว่า 40% ของจอ และบังเนื้อหาเมื่อพิมพ์
  - แถบเมนูด้านบน (Top Nav) ตัดบรรทัด 3 แถว ปุ่ม Admin Model Limits ไม่ซ่อนข้อความ
  - Modal Dialogs (แก้ไข/ลบรายการ, ตั้งงบประมาณ) ล้นขอบจอและเลื่อนไม่ได้เมื่อเปิดคีย์บอร์ดเสมือน
  - หน้า Login/Register มี padding ซ้อนกันจนช่องกรอกข้อมูลแคบเกินไปบนจอ 360px - 390px
  - ปุ่มแก้ไข/ลบใน Daily Log พึ่งพา hover state บน touch device บางประเภท

**สิ่งที่แก้ไข (Changes Detail):**
1. **Top Navigation (`app.scss`):**
   - ออกแบบ Mobile Header เป็น 2 แถวกะทัดรัด แถวบนรวมโลโก้ + ปุ่มไอคอน + แบดจ์ผู้ใช้ + ธีม
   - ซ่อนข้อความปุ่ม Admin Model Limits (`.admin-models-text { display: none }`) และปุ่ม Logout
   - ปรับลิงก์นำทาง ("📊 แดชบอร์ด" / "🎯 งบประมาณ") เป็น Segmented Tabs เต็มความกว้างหน้าจอ แตะง่าย
2. **Chat Input (`chat-input.component.*`):**
   - เพิ่ม `mobile-tab-switcher` สำหรับมือถือ สลับระหว่าง "💸 รายจ่าย (AI)" กับ "💰 รายรับ"
   - ซ่อนการ์ดที่ไม่ได้เลือกบนมือถือ ช่วยลดความสูงของแถบ Sticky จาก ~220px เหลือเพียง ~75px คืนพื้นที่หน้าจอ
   - ปรับ touch targets ของปุ่มบันทึกและสแกนใบเสร็จให้ได้มาตรฐาน min 44px
3. **Main Dashboard (`main-dashboard.component.css`):**
   - ปรับ `.bottom-section` ให้ตรึงล่างจออย่างเรียบหรูพร้อม backdrop-filter
   - เพิ่ม padding-bottom ให้กับเนื้อหาเพื่อป้องกันแถบพิมพ์ทับรายการด้านล่าง
   - ปรับการจัดวาง Date Selector ให้กว้างเต็มจอสวยงาม
4. **Daily Log & Modals (`daily-log.component.css`):**
   - กำหนดให้ปุ่มแก้ไขและลบแสดงผลคงที่ ไม่พึ่งพา hover บนจอเล็ก
   - ปรับ `.modal-dialog` ให้มี `max-height: 85vh` และ `overflow-y: auto` เลื่อนดูได้เสมอ
5. **Budget Panel & Page (`budget-panel.component.css`, `budget-page.component.css`):**
   - ปรับ `.modal-dialog` สำหรับตั้งงบและแนะนำงบให้ scrollable
   - ปรับปุ่ม Header Actions ให้ยืดหยุ่นเต็มกว้างบนมือถือ
6. **Authentication (`auth.component.scss`):**
   - เพิ่ม mobile media query ลด padding จาก 120px รวมเหลือพื้นที่กรอกกว้างสบายตา
7. **Date Selector (`date-selector.component.*`):**
   - เพิ่ม `calendar-backdrop` เมื่อเปิดปฏิทินแบบ modal บนมือถือ
8. **Mini Budget Ribbon (`mini-budget.component.scss`):**
   - ย่อ progress bar และปุ่มจัดการงบให้พอดีกับจอแคบ < 480px

**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/app.scss`
- `aift-frontend/src/app/components/chat-input/chat-input.component.ts`
- `aift-frontend/src/app/components/chat-input/chat-input.component.html`
- `aift-frontend/src/app/components/chat-input/chat-input.component.css`
- `aift-frontend/src/app/components/main-dashboard/main-dashboard.component.css`
- `aift-frontend/src/app/components/daily-log/daily-log.component.css`
- `aift-frontend/src/app/components/budget-panel/budget-panel.component.css`
- `aift-frontend/src/app/components/budget-page/budget-page.component.css`
- `aift-frontend/src/app/components/auth/auth.component.scss`
- `aift-frontend/src/app/components/date-selector/date-selector.component.html`
- `aift-frontend/src/app/components/date-selector/date-selector.component.css`
- `aift-frontend/src/app/components/mini-budget/mini-budget.component.scss`
- `CHANGELOG.md`

---

### 📅 2026-09-23 14:58:00 (Local Time)
**ประเภท:** `[Enhancement]` `[Frontend / UI / Redesign]`  
**หัวข้อ:** ปรับเปลี่ยนการแสดงผลงบประมาณบน Dashboard เป็น "Slim Budget Ribbon" แนวนอนด้านบน  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- การ์ดงบประมาณแนวตั้งตรงกลางทำให้เลย์เอาต์ดูโปร่ง มีพื้นที่ว่างโหวง และบีบพื้นที่ของกราฟวงกลมและรายการรายจ่าย
- ผู้ใช้ต้องการรูปแบบใหม่ที่ไม่เกะกะสายตาและลงตัวกับหน้า Dashboard

**สิ่งที่แก้ไข (Changes Detail):**
1. **Slim Budget Ribbon (Horizontal):** ออกแบบ `mini-budget` ใหม่เป็นแถบริบบอนแนวนอนกะทัดรัด (สูง ~44px) วางอยู่ใต้ส่วนหัวของ Dashboard:
   - **ด้านซ้าย:** ไอคอน 🎯, ป้าย "งบเดือนนี้", Progress Bar กะทัดรัด พร้อมตัวเลขใช้ไป/งบรวม และเปอร์เซ็นต์
   - **ตรงกลาง:** ชิปหมวดหมู่เด่นพร้อมสถานะ % แยกสี (🟢 ปกติ / 🟡 เตือน / 🔴 เกินงบ)
   - **ด้านขวา:** ป้ายเตือนและปุ่มลัด "จัดการงบ →"
2. **Restored 2-Column Balance:** คืนพื้นที่เต็มให้ `app-summary-chart` (กราฟวงกลม) และ `app-daily-log` (รายการวันนี้) เป็น 2 คอลัมน์หลักเต็มความสูงหน้าจอ ไม่ถูกบีบหรือแย่งพื้นที่อีกต่อไป

**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/components/mini-budget/mini-budget.component.html`
- `aift-frontend/src/app/components/mini-budget/mini-budget.component.scss`
- `aift-frontend/src/app/components/main-dashboard/main-dashboard.component.html`
- `aift-frontend/src/app/components/main-dashboard/main-dashboard.component.css`
- `CHANGELOG.md`

---

### 📅 2026-09-23 14:53:00 (Local Time)
**ประเภท:** `[Enhancement]` `[Frontend / UI]`  
**หัวข้อ:** ปรับย่อขนาดความกว้างของการ์ดมินิวิดเจ็ตงบประมาณบนหน้า Dashboard ให้กะทัดรัดและสมดุล  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- การ์ดมินิวิดเจ็ตงบประมาณมีความกว้างมากเกินไป (ยืดเต็ม 1 ใน 3 ของหน้าจอ 1920px) ทำให้ดูโปร่งและกินพื้นที่ส่วนอื่นมากเกินไป

**สิ่งที่แก้ไข (Changes Detail):**
1. **Compact Fixed Width:** ปรับขนาด `.budget-section` ใน `main-dashboard.component.css` ให้เป็นขนาดกะทัดรัด `flex: 0 0 250px; max-width: 260px;` เพื่อไม่ให้ยืดกว้างเกินความจำเป็น
2. **Rebalanced Columns:** เพิ่มพื้นที่ให้ `.log-section` เป็น `flex: 1.8` และ `.chart-section` เป็น `flex: 1.1` ทำให้รายการรายจ่ายและกราฟวงกลมมีพื้นที่แสดงผลอย่างเหมาะสมและสบายตายิ่งขึ้น
3. **Paddings & Spacing:** ปรับแต่ง padding ใน `mini-budget.component.scss` ให้พอดีกับขนาดการ์ดใหม่

**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/components/main-dashboard/main-dashboard.component.css`
- `aift-frontend/src/app/components/mini-budget/mini-budget.component.scss`
- `CHANGELOG.md`

---

### 📅 2026-09-23 14:50:00 (Local Time)
**ประเภท:** `[Feature]` `[Frontend / Dashboard / Budgets]`  
**หัวข้อ:** เพิ่มมินิวิดเจ็ตงบประมาณรายหมวด (Mini Budget Widget) บนหน้า Dashboard  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้ต้องการดูสถานะงบประมาณได้ทันทีจากหน้า Dashboard โดยไม่ต้องกดสลับไปหน้างบประมาณทุกครั้ง

**สิ่งที่แก้ไข (Changes Detail):**
1. **MiniBudgetComponent:** สร้างคอมโพเนนต์ Standalone ใหม่ (`mini-budget`) แสดง:
   - แถบสรุปภาพรวมการใช้งบทั้งเดือน (Total Spent / Total Budget) พร้อม % และสถานะสี
   - รายการงบประมาณหมวดเด่น (Top Categories) พร้อม Progress Bar แยกสีตามเกณฑ์ (🟢 ปกติ <80% / 🟡 ใกล้เกิน 80-100% / 🔴 เกินงบ >100%)
   - ป้าย Badge เตือนเมื่อมีหมวดใกล้เกิน/เกินงบ
   - ปุ่มลัด "จัดการงบ →" เชื่อมต่อไปยังหน้างบประมาณเต็ม (`/budgets`)
   - Empty State สวยงามเมื่อยังไม่ได้ตั้งงบ
2. **Dashboard Layout Update:** ปรับ `MainDashboardComponent` จัดวางการ์ดมินิวิดเจ็ตไว้ในแถวบน (`top-section`) ควบคู่กับกราฟวงกลมและรายการประจำวันอย่างลงตัว พร้อมรองรับ Responsive บนแท็บเล็ตและมือถือ
3. **Real-time Sync:** อัปเดตข้อมูลอัตโนมัติตามเดือนที่เลือกจาก Date Selector และเมื่อมีการบันทึกรายจ่ายใหม่

**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/components/mini-budget/mini-budget.component.ts`
- `aift-frontend/src/app/components/mini-budget/mini-budget.component.html`
- `aift-frontend/src/app/components/mini-budget/mini-budget.component.scss`
- `aift-frontend/src/app/components/main-dashboard/main-dashboard.component.ts`
- `aift-frontend/src/app/components/main-dashboard/main-dashboard.component.html`
- `aift-frontend/src/app/components/main-dashboard/main-dashboard.component.css`
- `CHANGELOG.md`

---

### 📅 2026-09-23 14:40:00 (Local Time)
**ประเภท:** `[Fix]` `[Frontend / Budgets]`  
**หัวข้อ:** แก้ไขบั๊กกดปุ่มตั้งงบไม่ได้ และ `TypeError: this.statuses.filter / map is not a function`  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้กดปุ่ม "＋ ตั้งงบ" ไม่ได้ และพบ Error ใน DevTools Console:
  - `TypeError: this.statuses.filter is not a function`
  - `TypeError: next is not iterable`
  - `TypeError: this.statuses.map is not a function`
- สาเหตุเกิดจาก API `GET /budgets/status` ส่งข้อมูลกลับมาเป็น Object `{ year, month, items: [...] }` แต่ `budget.service.ts` คืนค่า Object ทั้งตัวให้ `this.statuses` แทนที่จะเป็น Array ของ `items`

**สิ่งที่แก้ไข (Changes Detail):**
1. **BudgetService Response Mapping:** ปรับปรุง `budget.service.ts` ในฟังก์ชัน `getStatus()` ให้ดึง `res.data.items` ออกมาเป็น Array พร้อมแปลงฟิลด์ `percentUsed` ให้อัตโนมัติ
2. **Defensive Array Checking:** ปรับปรุง `budget-panel.component.ts` เพิ่มการตรวจเช็ค `Array.isArray()` ใน `alerts`, `hasBudgets`, `reloadStatus`, `checkNotifications` และ `openAddDialog` ป้องกัน Error หลุดในกรณีที่ข้อมูลไม่ใช่อาร์เรย์
3. **Backend Field Alignment:** เพิ่ม `percentUsed` ใน `aift-backend/src/budgets/budgets.service.ts` ควบคู่กับ `percent` เพื่อรองรับความเข้ากันได้ 100%

**ไฟล์ที่แก้ไข (Affected Files):**
- `aift-frontend/src/app/services/budget.service.ts`
- `aift-frontend/src/app/components/budget-panel/budget-panel.component.ts`
- `aift-backend/src/budgets/budgets.service.ts`
- `CHANGELOG.md`

---

### 📅 2026-09-23 14:35:00 (Local Time)
**ประเภท:** `[Fix]` `[Frontend / Auth / UX]`  
**หัวข้อ:** ปรับปรุง Graceful Session Expiration และระบบจดจำหน้างบประมาณ (Return URL) เมื่อเกิด 401 Unauthorized  
**ปัญหาหรือความต้องการ (Issue / Requirement):**
- ผู้ใช้พบข้อผิดพลาด `Failed to load resource: the server responded with a status of 401 (Unauthorized)` เมื่อกดตั้งงบประมาณโดยที่ยังไม่ได้ล็อกอินหรือเซสชันหมดอายุ
- ระบบเดิมพาตัดไปหน้า Login โดยไม่แจ้งสาเหตุที่ชัดเจน และขึ้น Popup alert กวนใจ ทำให้ผู้ใช้สับสนว่าเกิดอะไรขึ้น
- เมื่อล็อกอินสำเร็จ ระบบเดิมจะพาไปหน้า Dashboard เสมอ ทำให้ต้องกดกลับมาหน้างบประมาณใหม่อีกครั้ง

**สิ่งที่แก้ไข (Changes Detail):**
1. **Friendly Session Expiry Warning:** ปรับแต่งหน้า Login (`auth.component.html`/`scss`) ให้แสดงกล่องข้อความแจ้งเตือนสีส้มแบบเป็นมิตรเมื่อเซสชันหมดอายุ ระบุชัดเจนว่า *"เซสชันการใช้งานหมดอายุ กรุณาเข้าสู่ระบบอีกครั้งเพื่อดำเนินการต่อ"*
2. **Smart Return URL:** ปรับปรุง `auth.interceptor.ts` และ `auth.service.ts` ให้แนบ URL ปัจจุบัน (`returnUrl`) ไปกับ Query Params เมื่อเกิด 401 และเมื่อล็อกอิน/สมัครสมาชิกสำเร็จ ระบบจะพากลับไปยังหน้าที่กำลังใช้งานอยู่ (เช่น `/budgets`) ทันที
3. **Suppressed Duplicate Alerts:** ปรับปรุง `budget-panel.component.ts` ไม่ให้ขึ้น Popup alert กวนใจเมื่อเกิด 401 โดยปล่อยให้ระบบนำทางไปหน้า Login พร้อมคำอธิบายอย่างราบรื่น

**ไฟล์ที่เกี่ยวข้อง (Affected Files):**
- `aift-frontend/src/app/services/auth.service.ts`
- `aift-frontend/src/app/interceptors/auth.interceptor.ts`
- `aift-frontend/src/app/components/auth/auth.component.ts`
- `aift-frontend/src/app/components/auth/auth.component.html`
- `aift-frontend/src/app/components/auth/auth.component.scss`
- `aift-frontend/src/app/components/budget-panel/budget-panel.component.ts`
- `CHANGELOG.md`

---

### 📅 2026-09-23 14:19:00 (Local Time)
**ประเภท:** `[Enhancement]` `[Frontend / UI]`  
**หัวข้อ:** ปรับปรุง UI หน้าต่าง Model Limits Console ให้เป็นสไตล์ Minimal สะอาดตา ลดความแออัดของข้อมูล  
**ความต้องการ:**
- ผู้ใช้แจ้งว่าหน้าต่าง Limit โมเดล AI ดูรกและแน่นเกินไป ต้องการให้ดูง่าย สบายตา และจัดระเบียบข้อมูลใหม่

**สิ่งที่แก้ไข:**
1. **Compact Quota Ribbon:** รวมการ์ดโควตาสี่เหลี่ยมขนาดใหญ่ 4 ใบ ให้เป็นแถบสรุปข้อมูลแถวเดียว (RPM 15, RPD 1,500, TPM 1M, Context 1M In/65K Out) ประหยัดพื้นที่ในแนวตั้ง
2. **Clean Row & Expandable List:** ออกแบบรายการโมเดล Waterfall ใหม่เป็นแถวกะทัดรัด แยกสีโมเดลหลักอย่างชัดเจน แสดงเฉพาะสาระสำคัญ และสามารถคลิกที่แถวเพื่อกางดูรายละเอียด (Collapsible) เพิ่มเติมได้ตามต้องการ
3. **Refined Header & Controls:** ปรับป้ายกำกับด้านบนให้เรียบหรู ลดความซ้ำซ้อนของคำอธิบาย เพิ่มจุดสถานะ API เชื่อมต่อแบบ Minimal และเปลี่ยนตัวสลับแท็บเป็น Segmented Switch ที่ทันสมัย
4. **Spacing & Contrast:** จัดระเบียบช่องไฟ (Whitespace) และปรับขนาดฟอนต์ให้อ่านง่าย ไม่รบกวนสายตา

**ไฟล์ที่แก้ไข:**
- `aift-frontend/src/app/components/admin-model-limits/admin-model-limits.component.ts`
- `aift-frontend/src/app/components/admin-model-limits/admin-model-limits.component.html`
- `aift-frontend/src/app/components/admin-model-limits/admin-model-limits.component.scss`
- `CHANGELOG.md`

---

### 📅 2026-09-23 14:10:00 (Local Time)
**ประเภท:** `[Feature]` `[Role / Admin / AI Monitoring]`  
**หัวข้อ:** เพิ่มสิทธิ์ Admin ให้บัญชี Aingkharat และสร้างหน้าต่างตรวจสอบขีดจำกัดโมเดล AI (Model Limits & Waterfall Console)  
**ความต้องการ:**
- กำหนดให้บัญชีผู้ใช้ `Aingkharat` เป็น Role `admin`
- สร้างหน้าต่าง/Console สำหรับ Admin เพื่อดูขีดจำกัดโมเดล AI (Google Gemini Quotas, Token Limits, Waterfall Priority 4 ลำดับ, สถานะ API Key) พร้อมปุ่มทดสอบ Ping เช็คความเร็วของโมเดล
- บล็อกผู้ใช้งานทั่วไปไม่ให้เข้าถึงข้อมูลและ Endpoint ของผู้ดูแลระบบ (403 Forbidden)

**สิ่งที่แก้ไข:**
1. **Database & Entity Migration:**
   - เพิ่มฟิลด์ `role: string` (default `'user'`) ลงใน `User` entity
   - อัปเดตข้อมูลในตาราง PostgreSQL: `UPDATE users SET role = 'admin' WHERE username = 'Aingkharat';`
2. **Backend Admin Module & Security Guard:**
   - สร้าง `AdminGuard` ตรวจสอบ JWT Payload หาก `role !== 'admin'` จะปฏิเสธคำขอด้วย `403 Forbidden` ทันที
   - สร้าง `AdminService` และ `AdminController`:
     - `GET /admin/models`: ดึงข้อมูลขีดจำกัดของระบบ (15 RPM, 1,500 RPD, 1,000,000 TPM), ลำดับโมเดล Waterfall 4 ตัว (`gemini-3.5-flash-lite`, `gemini-3.6-flash`, `gemini-3.1-flash-lite`, `gemini-2.5-flash-lite`), ขีดจำกัด Input (1M) / Output (65K) และดึงรายชื่อโมเดลสดจาก Google API
     - `POST /admin/ping`: ทดสอบ Ping ยิงทดสอบโมเดลและวัดค่า Latency (ms) แบบเรียลไทม์
   - ลงทะเบียน `AdminModule` ใน `AppModule`
3. **Frontend AuthService & Admin Service:**
   - เพิ่มฟิลด์ `role?: string` ใน `User` interface
   - เพิ่ม Signal `isAdmin = computed(() => this.currentUser()?.role === 'admin')`
   - สร้าง `AdminService` สำหรับดึงข้อมูลโมเดลและยิงทดสอบ Ping
4. **Admin Model Limits UI Component:**
   - สร้าง `AdminModelLimitsComponent` (Modal Dialog):
     - การ์ดสถิติโควตา: สถานะ API Key, RPM (15 ครั้ง/นาที), RPD (1,500 ครั้ง/วัน), TPM (1M โทเค็น/นาที)
     - แท็บระบบ Waterfall: แสดงโมเดลทั้ง 4 ลำดับ พร้อมคำอธิบาย, ขีดจำกัด Input/Output tokens, และปุ่ม `⚡ ทดสอบ Ping` แสดงผลความหน่วงแบบสด
     - แท็บโมเดลทั้งหมดจาก Google: ตารางแสดงรายชื่อโมเดลที่ Google รองรับ
   - อัปเดต Top Navbar (`app.ts` & `app.scss`):
     - แสดงป้าย `ADMIN` สีเขียวข้างชื่อผู้ใช้
     - แสดงปุ่ม `👑 สถานะโมเดล AI` เฉพาะผู้ใช้ที่มีสิทธิ์ Admin เท่านั้น เมื่อคลิกจะเปิด Modal ทันที

**ไฟล์ที่แก้ไข:**
- `aift-backend/src/auth/entities/user.entity.ts`
- `aift-backend/src/auth/auth.service.ts`
- `aift-backend/src/admin/admin-auth.guard.ts`
- `aift-backend/src/admin/admin.service.ts`
- `aift-backend/src/admin/admin.controller.ts`
- `aift-backend/src/admin/admin.module.ts`
- `aift-backend/src/app.module.ts`
- `aift-frontend/src/app/services/auth.service.ts`
- `aift-frontend/src/app/services/admin.service.ts`
- `aift-frontend/src/app/components/admin-model-limits/*`
- `aift-frontend/src/app/app.ts`
- `aift-frontend/src/app/app.scss`
- `aift-frontend/angular.json`
- `CHANGELOG.md`

---

### 📅 2026-09-23 13:58:00 (Local Time)
**ประเภท:** `[Fix]` `[Frontend / UI]`  
**หัวข้อ:** แก้ไขกล่องแจ้งเตือน Error ในหน้า Login / Register ไม่แสดงผลบนจอ (Zoneless Angular)  
**ปัญหาที่พบ:**
- เมื่อสมัครสมาชิกด้วย Username ซ้ำ (409 Conflict) หรือกรอกรหัสผ่านผิด หน้าเว็บไม่แสดงกล่องแจ้งเตือนสีแดง (Alert Box) โดยค้างเงียบ
- สาเหตุมาจาก Angular 21 ทำงานในโหมด Zoneless เมื่อเกิด Error ใน RxJS callback การเปลี่ยนค่าตัวแปรคลาสธรรมดาจะไม่กระตุ้นให้ Angular วาดหน้าจอใหม่

**สิ่งที่แก้ไข:**
1. **Migration to Signals:** เปลี่ยน State ใน `AuthComponent` มาใช้ Angular Signals (`errorMessage`, `isLoading`, `isRegisterMode`)
2. **Explicit Change Detection:** ฉีด `ChangeDetectorRef` และสั่ง `cdr.detectChanges()` ทันทีเมื่อเกิด Error
3. **Control Flow Syntax:** ปรับ Template ใน `auth.component.html` มาใช้ `@if (errorMessage())` แสดงกล่องข้อความเตือนสีแดงชัดเจน

**ไฟล์ที่แก้ไข:**
- `aift-frontend/src/app/components/auth/auth.component.ts`
- `aift-frontend/src/app/components/auth/auth.component.html`

---
**ประเภท:** `[Fix]` `[Backend / Frontend]`  
**หัวข้อ:** แก้ไขปัญหาบันทึกรายรับไม่ได้ (AI Could Not Understand & Error Handling)  
**ปัญหาที่พบ:**
- ผู้ใช้พิมพ์บันทึกรายรับสั้นๆ เช่น `"500 บาท"`, `"1000"`, หรือตัวเลขล้วน แล้วระบบแจ้งเตือนว่า AI อ่านไม่ออก และมี Error `500 Internal Server Error` หลุดออกมาใน Log
- ช่องกรอกรายรับใน Frontend ไม่มีการแปลงตัวเลขกรณีเผลอพิมพ์ภาษาไทย (`ถจจ` -> `500`)

**สิ่งที่แก้ไข:**
1. **AI Prompt Tuning:** ปรับ Prompt ใน `extractIncomeData` ให้เข้าใจว่าข้อความในช่องนี้คือรายรับเสมอ หากมีแต่ตัวเลขให้ดึงเป็นยอดเงินและตั้งชื่อที่มาเป็น `"รายรับทั่วไป"` อัตโนมัติ
2. **Smart Fallback (Regex Parser):** เพิ่มระบบ Regex สกัดตัวเลขเงินอัตโนมัติใน `AiService` หาก AI เกิดขัดข้องหรือตอบกลับไม่ทัน ระบบจะดึงยอดเงินและข้อความที่พิมพ์มาบันทึกให้ทันที
3. **Controller Error Handling:** เพิ่มบล็อก `try/catch` ใน `IncomeController.processChat` ให้ส่ง Error `400 BadRequest` พร้อมโค้ดที่ถูกต้อง
4. **Thai Keyboard Fix:** เพิ่มฟังก์ชัน `this.fixThaiKeyboard()` ในฟังก์ชัน `onAddIncome()` ของ Frontend

**ไฟล์ที่แก้ไข:**
- `aift-backend/src/ai/ai.service.ts`
- `aift-backend/src/income/income.controller.ts`
- `aift-frontend/src/app/components/chat-input/chat-input.component.ts`

---

### 📅 2026-09-23 13:40:00 (Local Time)
**ประเภท:** `[Feature]` `[Backend / Frontend / Auth]`  
**หัวข้อ:** พัฒนาระบบ Login / Register และแยกข้อมูลราย Account (100% Data Isolation)  
**ความต้องการ:**
- รองรับการสมัครและเข้าสู่ระบบด้วย Username & Password แบบรวดเร็ว
- แยกข้อมูลรายจ่าย รายรับ งบประมาณ และสรุป AI ของแต่ละบัญชีออกจากกันอย่างเด็ดขาด
- จำสถานะการล็อกอินผ่าน LocalStorage (Persistent Login)

**สิ่งที่แก้ไข:**
1. **Backend Auth Module:**
   - ติดตั้ง `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`
   - สร้าง `User` entity (`id`, `username`, `password`, `displayName`)
   - สร้าง `AuthService`, `AuthController`, `JwtStrategy`, `JwtAuthGuard`, และ `@CurrentUser()` decorator
2. **Database Scoping:**
   - เพิ่ม `userId` ใน `Expense`, `Income`, `Budget`, และ `AiSummaryCache`
   - ปรับ Unique constraint ของ Budget เป็น `[category, userId]`
   - Scope ทุกการค้นหา สร้าง แก้ไข ลบ ใน Controller และ Service ด้วย `userId`
3. **Frontend Auth System:**
   - สร้าง `AuthService` จัดการ State ด้วย Signals (`currentUser`, `isLoggedIn`)
   - สร้าง `authInterceptor` แนบ Bearer Token ทุก Request อัตโนมัติ
   - สร้าง `authGuard` และ `guestGuard` ป้องกันหน้า Dashboard และ Budgets
   - สร้าง `AuthComponent` (หน้า Login/Register ดีไซน์ Card สวยงาม สลับแท็บได้)
   - อัปเดต Top Navbar แสดง Badge ชื่อผู้ใช้และปุ่ม Logout

**ไฟล์ที่เกี่ยวข้อง:**
- `aift-backend/src/auth/*`
- `aift-backend/src/app.module.ts`
- `aift-backend/src/expenses/*`
- `aift-backend/src/income/*`
- `aift-backend/src/budgets/*`
- `aift-frontend/src/app/services/auth.service.ts`
- `aift-frontend/src/app/interceptors/auth.interceptor.ts`
- `aift-frontend/src/app/guards/auth.guard.ts`
- `aift-frontend/src/app/components/auth/*`
- `aift-frontend/src/app/app.ts` & `app.scss`
- `aift-frontend/src/app/app.routes.ts`
- `aift-frontend/src/app/app.config.ts`

---

### 📅 2026-09-23 11:55:00 (Local Time)
**ประเภท:** `[Fix]` `[Config / Infra / DB]`  
**หัวข้อ:** แก้ไขปัญหาการเชื่อมต่อ Database ใน Docker (`ECONNREFUSED`) และรองรับ Dual Database  
**ปัญหาที่พบ:**
- Backend ใน Docker ไม่สามารถเชื่อมต่อ PostgreSQL ได้ (`connect ECONNREFUSED 127.0.0.1:5432`) เนื่องจากไฟล์ `.env` ชี้ไปที่ `localhost`
- โค้ดใน `app.module.ts` มีการฮาร์ดโค้ด SQLite ไว้ และ Dockerfile ขาด C/C++ compiler สำหรับคอมไพล์ `better-sqlite3` บน Alpine Linux

**สิ่งที่แก้ไข:**
1. **Dynamic Database Switch:** ปรับ `app.module.ts` ให้เลือก Engine ตามตัวแปร `DB_TYPE`:
   - รันใน Docker หรือ `DB_TYPE=postgres` -> ต่อ **PostgreSQL**
   - รัน Local ทั่วไป (`npm run start:dev`) -> สลับไปใช้ **SQLite** (`data/aift.sqlite`) อัตโนมัติ
2. **Docker Compose:** กำหนด `DB_HOST=postgres` และ `DB_TYPE=postgres` ใน `docker-compose.yml`
3. **Dockerfile Alpine Build:** ติดตั้ง `python3 make g++` เพื่อคอมไพล์ native dependencies
4. **Documentation:** จัดทำเอกสารส่งมอบงานฉบับสมบูรณ์ [HANDOFF.md](file:///c:/Project/AIFT/HANDOFF.md)

**ไฟล์ที่แก้ไข:**
- `aift-backend/src/app.module.ts`
- `aift-backend/Docker/docker-compose.yml`
- `aift-backend/Docker/Dockerfile`
- `HANDOFF.md`
