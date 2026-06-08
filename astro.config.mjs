import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://felipe.farsystems.com.br",
  integrations: [react()],
});
