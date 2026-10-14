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
    shop/      หน้าร้านค้า: orders, menus, reports, customers
    customer/  หน้าลูกค้า (ยังเป็นหน้าเปล่า)
    rider/     หน้าคนส่ง (ยังเป็นหน้าเปล่า)
  components/  ของกลาง: Button, Card, StatusBadge, Form/, Use/
  layouts/     ShopLayout (เมนูข้าง + แถบล่าง), PagePattern (หัวหน้า)
  hooks/       useNotify, useDropdown, useSearch
  mock/        mockData.js ข้อมูลตัวอย่าง และฟังก์ชัน fetchSave... แทน API
  services/    sound.js เสียงแจ้งเตือน, dropdown.js
  utils/       format.js, geo.js, pagination.js
```

แต่ละหน้าแบ่งไฟล์แบบ AquaDAT เช่น `menu.jsx` (หน้าหลัก ถือ state และบันทึก), `menuSearch.jsx`, `menuList.jsx`, `modalAddMenu.jsx`

ตอนนี้ยังไม่ได้ต่อ backend ทุกหน้าใช้ข้อมูลใน `mock/mockData.js` ตอนต่อ API จริงให้เปลี่ยนฟังก์ชัน `fetchSave...` ในไฟล์นั้น

## UI

- แบบหน้าจอทั้งหมดอยู่ใน Figma: https://www.figma.com/design/gk1UshVN3cFTILbsyl8EIf/FOM
- สีใน Tailwind ใช้ชื่อเดียวกับ Figma เช่น `bg-brand`, `text-ink`, `border-line`
- ปิด preflight ของ Tailwind ไว้ ถ้าใส่ `border` ต้องใส่ `border-solid` ด้วย
- ไอคอนใช้ `@ant-design/icons`
