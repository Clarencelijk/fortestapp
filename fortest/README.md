# ForTest - Uni-app 跨平台應用

一個基於 uni-app 框架開發的現代化跨平台移動應用，支持微信小程序、H5、App 等多個平台。

## 📱 項目簡介

ForTest 是一個功能豐富的內容社交平台，提供個性化推薦、視頻瀏覽、消息互動等核心功能。

### 主要特性

- 🎨 **現代化 UI 設計**：採用漸變色、圓角卡片、微動畫等現代設計元素
- 📊 **個性化推薦**：基於用戶興趣的智能內容推薦
- 🎬 **短視頻瀏覽**：類似抖音的垂直滑動視頻體驗
- 💬 **即時通訊**：支持文字、圖片、視頻等多種消息類型
- 👤 **完整用戶系統**：包含個人中心、關注粉絲、統計數據等
- 🔍 **全局搜索**：支持搜索內容、用戶、話題等
- ⭐ **互動功能**：點贊、評論、收藏、分享等社交互動

## 🏗️ 項目結構

```
fortest/
├── components/          # 組件目錄
│   ├── Module/         # 模塊組件
│   ├── AddInterestModal.vue  # 興趣添加彈窗
│   └── child.vue       # 子組件
├── pages/              # 頁面目錄
│   ├── index/          # 首頁（興趣推薦）
│   ├── article/        # 文章/視頻頁
│   ├── messages/       # 消息列表頁
│   ├── my/            # 個人中心頁
│   ├── login/         # 登錄頁
│   ├── search/        # 搜索頁
│   └── splash/        # 啟動頁
├── subpages/          # 分包頁面
│   ├── chat/          # 聊天機器人
│   ├── news/          # 新聞中心
│   └── topic/         # 話題
├── static/            # 靜態資源
├── store/             # Vuex 狀態管理
├── utils/             # 工具函數
│   ├── common.js      # 通用工具
│   └── request.js     # 網絡請求封裝
├── uniCloud-aliyun/   # 雲函數
├── App.vue            # 應用入口
├── main.js            # 主入口文件
├── pages.json         # 頁面配置
├── manifest.json      # 應用配置
├── uni.scss           # 全局樣式變量
└── package.json       # 依賴配置
```

## 🎯 核心功能

### 1. 首頁（index）
- ✅ 頂部搜索欄
- ✅ 橫向滾動的興趣標籤
- ✅ 動態添加興趣
- ✅ 輪播圖展示
- ✅ 快捷入口（新聞、話題、直播、活動）
- ✅ 產品網格展示（含價格、銷量、標籤）
- ✅ 分類排行榜（橫向滾動）
- ✅ 下拉刷新、上拉加載

### 2. 文章頁（article）
- ✅ 垂直滑動卡片
- ✅ 視頻自動播放控制
- ✅ 作者信息展示
- ✅ 關注/取消關注
- ✅ 原創性標籤
- ✅ 內容標籤
- ✅ 點贊、評論、收藏、分享
- ✅ 側邊快捷操作欄

### 3. 消息頁（messages）
- ✅ 搜索聊天記錄
- ✅ 消息列表展示
- ✅ 未讀消息提示
- ✅ 在線狀態顯示
- ✅ 消息置頂
- ✅ 消息免打擾
- ✅ 新建聊天入口

### 4. 個人中心（my）
- ✅ 用戶信息卡片
- ✅ 更換頭像
- ✅ 統計數據（關注、粉絲、獲贊）
- ✅ 功能菜單網格（8個快捷入口）
- ✅ 設置列表
- ✅ 登錄/登出功能
- ✅ Vuex 狀態管理

### 5. 搜索頁（search）
- ✅ 實時搜索
- ✅ 搜索歷史記錄
- ✅ 熱門搜索推薦
- ✅ 多標籤結果展示（綜合、用戶、文章、視頻）
- ✅ 關鍵詞高亮
- ✅ 空狀態提示

## 🎨 設計規範

### 配色方案
- **主色調**：#2F7CF6（藍色）
- **輔助色**：#FFD400（黃色）
- **強調色**：#FF6B9D（粉色）
- **成功色**：#52C41A（綠色）
- **警告色**：#FAAD14（橙色）
- **錯誤色**：#F5222D（紅色）

### 設計元素
- **圓角**：8-24rpx 不等
- **陰影**：多層次陰影系統
- **漸變**：135度線性漸變
- **動畫**：0.15-0.5s 過渡動畫
- **字體**：20-40rpx 響應式字體

## 🛠️ 技術棧

- **框架**：uni-app (Vue 3)
- **狀態管理**：Vuex 4.x
- **樣式**：SCSS + 自定義主題變量
- **圖片處理**：cropperjs
- **雲服務**：uniCloud (阿里雲)
- **工具函數**：防抖節流、時間格式化、本地存儲等

## 📦 安裝與運行

### 環境要求
- Node.js 14.x 或更高版本
- HBuilderX 3.x 或更高版本（推薦）

### 安裝依賴
```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 運行項目

#### 微信小程序
```bash
npm run dev:mp-weixin
```

#### H5
```bash
npm run dev:h5
```

#### App
```bash
npm run dev:app
```

### 構建發布
```bash
# 微信小程序
npm run build:mp-weixin

# H5
npm run build:h5

# App
npm run build:app
```

## 🔧 配置說明

### 修改 API 地址
在 `utils/request.js` 中修改 `BASE_URL`：
```javascript
const BASE_URL = 'https://your-api-domain.com';
```

### 修改主題配色
在 `uni.scss` 中修改顏色變量：
```scss
$primary-color: #2F7CF6;
$secondary-color: #FFD400;
// ...
```

## 📝 開發指南

### 添加新頁面
1. 在 `pages/` 目錄下創建頁面文件
2. 在 `pages.json` 中註冊頁面
3. 配置頁面樣式和導航欄

### 使用工具函數
```javascript
import { formatNumber, formatDate, showToast } from '@/utils/common.js';

// 格式化數字
formatNumber(12345); // "12.3k"

// 格式化日期
formatDate(new Date()); // "2025-10-20 12:30:45"

// 顯示提示
showToast('操作成功', 'success');
```

### 發起網絡請求
```javascript
import { get, post } from '@/utils/request.js';

// GET 請求
const data = await get('/api/user/info');

// POST 請求
const result = await post('/api/user/update', { name: '張三' });
```

## 🎯 優化內容

### 代碼質量
- ✅ 添加 package.json 依賴管理
- ✅ 統一代碼風格和命名規範
- ✅ 提取公共組件和工具函數
- ✅ 清理調試代碼和無用註釋
- ✅ 添加錯誤處理和邊界情況

### UI/UX 優化
- ✅ 統一配色方案和設計語言
- ✅ 優化卡片、按鈕、表單等基礎組件
- ✅ 添加微動畫和過渡效果
- ✅ 統一圖標和 emoji 使用
- ✅ 優化排版和間距
- ✅ 添加加載和空狀態提示

### 功能增強
- ✅ 實現全局搜索功能
- ✅ 添加用戶互動功能（點贊、評論、收藏、分享）
- ✅ 完善個人中心（統計、設置、編輯資料）
- ✅ 優化消息列表（未讀提示、在線狀態）
- ✅ 添加搜索歷史和熱門搜索
- ✅ 實現興趣標籤動態管理

## 📄 License

MIT License

## 👥 貢獻

歡迎提交 Issue 和 Pull Request！

## 📮 聯繫方式

如有問題或建議，請通過以下方式聯繫：
- Email: your-email@example.com
- GitHub: https://github.com/your-username/fortest

---

**注意**：本項目為演示項目，部分功能使用模擬數據，實際使用時需要連接真實的後端 API。

