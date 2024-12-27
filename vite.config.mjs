import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.', // 專案根目錄
  build: {
    outDir: 'public', // 輸出到 public 資料夾
    rollupOptions: {
      input: {
        login: path.resolve(__dirname, './pages/Login/login.html'), // 指定 Login 頁面為入口
        todo: path.resolve(__dirname, './pages/ToDoList/to_do_list.html'), // 指定 ToDoList 頁面為入口
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./assets/scss/base/_colors.scss";`, // 自動導入全域 SCSS 樣式
      },
    },
  },
  server: {
    open: '/pages/Login/login.html', // 啟動時自動開啟 Login 頁面
  },
});
