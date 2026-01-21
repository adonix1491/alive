# ALIVE 愛來專案

個人安全簽到應用 - 透過定期簽到機制確保使用者安全，並在異常時通知緊急聯絡人。

## 專案架構

### 前端
- **iOS/Android**: React Native 0.83.1
- **Web**: React Native Web（部署到 Vercel）
- **共用代碼**: 100% UI 和業務邏輯重用

### 後端
- **平台**: Vercel Serverless Functions
- **語言**: TypeScript
- **API**: RESTful API Routes

### 資料庫
- **Vercel Postgres**: PostgreSQL 資料庫
- **ORM**: Drizzle ORM

### 第三方服務
- **Email**: Gmail SMTP（Nodemailer）
- **LINE 推播**: LINE Messaging API

## 專案結構

```
alive/
├── AliveApp/              # React Native 應用（iOS/Android/Web）
│   ├── ios/               # iOS 原生代碼
│   ├── android/           # Android 原生代碼
│   ├── src/               # 共用業務邏輯
│   │   ├── components/    # UI 元件
│   │   ├── screens/       # 頁面
│   │   ├── services/      # API 客戶端
│   │   └── utils/         # 工具函數
│   └── public/            # Web 靜態資源
│
├── backend/               # Vercel 後端
│   ├── api/               # Serverless Functions
│   ├── lib/               # 共用工具庫
│   └── schema/            # 資料庫 Schema
│
└── README.md
```

## 開發環境設定

### 前置需求
- Node.js 20+
- npm 或 yarn
- Git

### 安裝依賴

```bash
# 安裝前端依賴
cd AliveApp
npm install

# 安裝後端依賴
cd ../backend
npm install
```

### 環境變數設定

複製 `.env.example` 為 `.env.local` 並填入您的設定：

```bash
# 資料庫
POSTGRES_URL=your-postgres-url

# JWT
JWT_SECRET=your-secret-key

# Gmail SMTP
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# LINE Messaging API
LINE_CHANNEL_ACCESS_TOKEN=your-line-token
LINE_CHANNEL_SECRET=your-line-secret
```

## 本地開發

### 執行 React Native App（iOS/Android）

```bash
cd AliveApp

# iOS
npm run ios

# Android
npm run android
```

### 執行 Web 版

```bash
cd AliveApp
npm run web
```

瀏覽器開啟 http://localhost:3000

### 執行後端（本地測試）

```bash
cd backend
vercel dev
```

## 部署

### 部署到 Vercel

```bash
# 連接 Vercel
vercel

# 部署到生產環境
vercel --prod
```

## 功能特性

- ✅ 使用者註冊與登入
- ✅ 個人資料管理（含頭像上傳）
- ✅ 定期簽到機制
- ✅ 緊急聯絡人管理
- ✅ Email 通知（Gmail SMTP）
- ✅ LINE 推播通知
- ✅ 異常檢測與自動通知
- ✅ 跨平台支援（iOS/Android/Web）

## 授權

Private - All rights reserved

## 聯絡方式

如有問題請聯繫專案維護者。
