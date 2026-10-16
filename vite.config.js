import os from "node:os";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const getLanOrigin = () => {
  const nets = os.networkInterfaces();
  const list = [...(nets.en0 || []), ...Object.values(nets).flat()];
  const lan = list.find((n) => n.family === "IPv4" && !n.internal);
  if (!lan) return "";
  return `http://${lan.address}:5173`;
};

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { port: 5173, host: true, open: true },
  define: {
    "import.meta.env.VITE_LAN_ORIGIN": JSON.stringify(
      command === "serve" ? getLanOrigin() : "",
    ),
  },
}));
