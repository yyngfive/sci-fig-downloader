import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import { resolve } from "path";
// See https://wxt.dev/api/config.html
export default defineConfig({
  //modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["activeTab", "downloads", "storage"],
    name: "Sci Fig Downloader",
  },
  vite: () => ({
    plugins: [mdx(), react()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "/"),
      },
    },
  }),
  browser: "edge",
  extensionApi: "chrome",
});
