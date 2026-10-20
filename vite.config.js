import os from "node:os";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const getLanOrigin = () => {
  const nets = os.networkInterfaces();
  const list = [...(nets.en0 || []), ...Object.values(nets).flat()];
  const lan = list.find((n) => n.family === "IPv4" && !n.internal);
  if (!lan) return "";
  return `http://${lan.address}:5173`;
};

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    server: {
      port: 5173,
      host: true,
      open: true,
      // ตอน pnpm dev ส่ง /api ต่อไปที่ backend หน้าเว็บกับ API จึงอยู่ origin เดียวกัน ไม่ติด CORS ไม่ว่าจะเปิดพอร์ตไหน
      proxy: env.VITE_API_PROXY
        ? { "/api": { target: env.VITE_API_PROXY, changeOrigin: true } }
        : undefined,
    },
    define: {
      "import.meta.env.VITE_LAN_ORIGIN": JSON.stringify(
        command === "serve" ? getLanOrigin() : "",
      ),
    },
  };
});
