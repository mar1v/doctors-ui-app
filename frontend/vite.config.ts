import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "#api": path.resolve(__dirname, "src/api/"),
      "#assets": path.resolve(__dirname, "src/assets/"),
      "#components": path.resolve(__dirname, "src/components/"),
      "#components/Auth": path.resolve(__dirname, "src/components/Auth/"),
      "#components/Exams": path.resolve(__dirname, "src/components/Exams/"),
      "#components/HomeCare": path.resolve(
        __dirname,
        "src/components/HomeCare/"
      ),
      "#components/Medications": path.resolve(
        __dirname,
        "src/components/Medications/"
      ),
      "#components/PatientList": path.resolve(
        __dirname,
        "src/components/PatientList/"
      ),
      "#components/Procedures": path.resolve(
        __dirname,
        "src/components/Procedures/"
      ),
      "#components/ReportForm": path.resolve(
        __dirname,
        "src/components/ReportForm/"
      ),
      "#components/pdf": path.resolve(
        __dirname,
        "src/components/ReportForm/pdf/"
      ),
      "#components/Specialists": path.resolve(
        __dirname,
        "src/components/Specialists/"
      ),
      "#context": path.resolve(__dirname, "src/context/"),
      "#fonts": path.resolve(__dirname, "src/fonts/"),
      "#hooks": path.resolve(__dirname, "src/hooks/"),
      "#layouts": path.resolve(__dirname, "src/layouts/"),
      "#pages": path.resolve(__dirname, "src/pages/"),
      "#router": path.resolve(__dirname, "src/router/"),
      "#types": path.resolve(__dirname, "src/types/"),
    },
  },
  plugins: [react(), tailwindcss()],
});
