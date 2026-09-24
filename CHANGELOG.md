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

### 📅 2026-09-24 16:55:00 (Local Time)
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
