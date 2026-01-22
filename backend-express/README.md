# ALIVE Backend Express

獨立的後端 API 服務器，使用 Express.js 實現。

## 本地開發

1. 安裝依賴：
```bash
cd backend-express
npm install
```

2. 配置環境變數：
```bash
cp .env.example .env
# 編輯 .env 填入實際值
```

3. 啟動服務器：
```bash
npm run dev
```

服務器將在 http://localhost:3000 運行。

## Railway 部署

1. 推送代碼到 GitHub
2. 在 Railway 創建新項目
3. 連接 GitHub 倉庫
4. 配置環境變數
5. 自動部署

## API Endpoints

- `POST /api/auth/register` - 用戶註冊
- `POST /api/auth/login` - 用戶登入
- `GET /api/auth/me` - 獲取當前用戶
- `GET/PUT /api/user/profile` - 個人資料
- `POST /api/user/password` - 修改密碼
- `POST /api/checkin` - 簽到
- `GET /api/checkin/history` - 簽到歷史
- `GET/POST /api/contacts` - 緊急聯絡人
- `PUT/DELETE /api/contacts/:id` - 更新/刪除聯絡人
- `GET/PUT /api/notifications/settings` - 通知設定
- `POST /api/notifications/verify-email` - 發送驗證碼
- `POST /api/notifications/confirm-email` - 確認驗證碼
