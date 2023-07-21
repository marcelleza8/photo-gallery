import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    cors: {
      origin: "*",
    },
    https: {
      key: fs.readFileSync("./.docker/nginx/certs/localhost-key.pem"),
      cert: fs.readFileSync("./.docker/nginx/certs/localhost.pem"),
    },
  },
});
