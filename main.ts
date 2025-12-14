// Re-export from main.tsx for Fresh build compatibility
// The Fresh build process generates _fresh/server.js that imports from main.ts
export * from "./main.tsx";
export { app } from "./main.tsx";
