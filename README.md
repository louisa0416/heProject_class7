## Node.js 第七堂 Firebase 檔案與空間上傳

## 操作步驟

1. 加入 `multer`、`uuid`、`firebase-admin` NPM
2. 開啟一個 [Firebase](https://firebase.google.com/) 專案
3. 建立 ENV 檔，放入環境變數，並新增一個 `firebase.js` 設置 firebase 環境初始化
4. 設置一個 `images.js` 的 middleware，來過濾資訊
5. 在 `app.js`，設置一個 `upload.js` router
6. 在 upload.js 設置整合 Firebase 上傳功能

### 使用專案

- npm install
