import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    host: true,
    port: 8080,
  },
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({ customViteReactPlugin: true }),
    nitro(),
    viteReact(),
  ],
});
