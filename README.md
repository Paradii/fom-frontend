# FOM · Frontend

หน้าเว็บของระบบ FOM ทำด้วย React + Vite (JavaScript), Ant Design, Tailwind และ pnpm

## เริ่มต้น

ต้องมี Node.js 20 ขึ้นไป และ pnpm (`npm install -g pnpm`)

1. `pnpm install`
2. `pnpm dev` แล้วเปิด http://localhost:5173 จะเข้าหน้าคำสั่งซื้อของร้านค้า

ใช้ pnpm อย่างเดียว ไม่ใช้ `npm install`

## ไฟล์ตั้งค่า

- `.env.development` ใช้ตอน `pnpm dev`
- `.env.production` ใช้ตอน `pnpm build`

## โครงสร้าง

```
src/
  app/         App.jsx, routes.jsx (รายการหน้าทั้งหมด), theme.js (สีของ Ant Design)
  pages/
    shop/      หน้าร้านค้า: login, orders, menus, reports, customers, settings
    customer/  หน้าลูกค้า (ยังเป็นหน้าเปล่า)
    rider/     หน้าคนส่ง (ยังเป็นหน้าเปล่า)
  components/  ของกลาง: Button, Card, StatusBadge, Form/, Use/
  layouts/     ShopLayout (เมนูข้าง + แถบล่าง), PagePattern (หัวหน้า), ShopAccount (รายการบัญชี), LoginLayout (หน้าเข้าสู่ระบบ)
  hooks/       useNotify, useDropdown, useSearch
  mock/        mockData.js ข้อมูลตัวอย่าง (ใช้เมื่อ VITE_USE_MOCK=true)
  services/    data.js ชั้นข้อมูลกลาง (เรียก backend แล้วเติม store), http.js, mapper.js, token.js, sound.js, dropdown.js
  utils/       format.js, pagination.js
```

แต่ละหน้าแบ่งไฟล์แบบ AquaDAT เช่น `menu.jsx` (หน้าหลัก ถือ state และบันทึก), `menuSearch.jsx`, `menuList.jsx`, `menuForm.jsx`

## ต่อ backend

ทุกหน้า import ข้อมูลจาก `@/services/data` ไม่ใช่จาก mock โดยตรง

- `VITE_USE_MOCK=false` (ค่าเริ่มต้น) เรียก FOMBackend ที่ `VITE_API_URL` แล้วแปลงข้อมูลให้อยู่ในรูปแบบเดียวกับ mock (`services/mapper.js`)
- `VITE_USE_MOCK=true` ใช้ข้อมูลใน `mock/mockData.js` เหมือนเดิม ไม่ต้องเปิด backend
- `fetchSave...` คืน Promise ต้อง `await` และเช็ก `resp.success` ถ้าไม่สำเร็จมี `resp.message`
- หน้าฝั่งลูกค้าและคนส่งห่อด้วย `withLoad` (`utils/withLoad.jsx`) โหลดข้อมูลเสร็จก่อนค่อยแสดง หน้าร้านเรียก `load...` เองใน `useEffect`
- เข้าสู่ระบบด้วย LINE (LIFF) อย่างเดียว ต้องตั้ง `VITE_LIFF_ID` ก่อน
- รูปสลิป รูปส่งของ และรูปเมนูต้องมีบริการอัปโหลด ตั้ง `VITE_UPLOAD_URL` (backend ยังไม่มี API นี้)

## UI

- แบบหน้าจอทั้งหมดอยู่ใน Figma: https://www.figma.com/design/gk1UshVN3cFTILbsyl8EIf/FOM
- สีใน Tailwind ใช้ชื่อเดียวกับ Figma เช่น `bg-brand`, `text-ink`, `border-line`
- ปิด preflight ของ Tailwind ไว้ ถ้าใส่ `border` ต้องใส่ `border-solid` ด้วย
- ไอคอนใช้ `@ant-design/icons`
