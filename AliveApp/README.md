# ALIVE愛來 APP

## 專案簡介

ALIVE愛來 是一款專為關心家人安全而設計的雙平台（iOS/Android）應用程式。透過每日簽到機制，讓家人確認彼此平安。

**核心理念**: 「每日一開，平安已達」

## 技術棧

- **前端框架**: React Native 0.83.1
- **語言**: TypeScript
- **後端服務**: Firebase
  - Authentication（用戶認證）
  - Cloud Firestore（資料庫）
  - Cloud Messaging（推播通知）
  - Cloud Functions（排程任務）
- **導航**: React Navigation 7
- **狀態管理**: React Hooks

## 專案結構

```
AliveApp/
├── src/
│   ├── components/           # 可重用 UI 元件
│   │   ├── CheckInButton/    # 一鍵簽到按鈕
│   │   ├── StatusCard/       # 狀態卡片
│   │   └── GradientBackground/ # 漸層背景
│   ├── screens/              # 頁面
│   │   ├── HomeScreen/       # 首頁
│   │   ├── SettingsScreen/   # 設置中心
│   │   ├── EmergencyContactsScreen/ # 緊急聯絡人
│   │   └── LoginScreen/      # 登入頁
│   ├── navigation/           # 導航配置
│   ├── services/             # 服務層
│   │   └── firebase/         # Firebase 服務
│   ├── hooks/                # 自訂 Hooks
│   ├── theme/                # 設計系統
│   ├── types/                # TypeScript 類型
│   └── constants/            # 常數配置
├── App.tsx                   # 應用入口
└── package.json
```

## 開發指南

### 環境需求

- Node.js >= 20
- React Native CLI
- Android Studio（Android 開發）
- Xcode（iOS 開發，僅 macOS）

### 安裝依賴

```bash
cd AliveApp
npm install
```

### 啟動開發伺服器

```bash
npm start
```

### 執行 Android

```bash
npm run android
```

### 執行 iOS

```bash
npm run ios
```

## Firebase 配置

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案
3. 啟用 Authentication、Firestore、Cloud Messaging
4. 下載配置檔案並更新 `src/services/firebase/config.ts`

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

## 核心功能

- ✅ 一鍵簽到
- ✅ 緊急聯絡人管理
- ✅ 安全狀態顯示
- ✅ 多渠道通知（LINE、Email、Push）
- ✅ 預設訊息模板
- ✅ 異常規則監控

## 授權

私有專案
