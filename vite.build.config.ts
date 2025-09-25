import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist/cdn",
        lib: {
            name: "ilw-modal",
            entry: "ilw-modal.ts",
            fileName: "ilw-modal",
            formats: ["es"],
        },
        rollupOptions: {
            output: {
                assetFileNames: () => {
                    return "[name][extname]";
                }
            },
        },
    },
    server: {
        hmr: false,
    },
});
