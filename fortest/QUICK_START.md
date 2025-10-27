# 快速開始指南

## 🚀 5 分鐘快速上手

本指南將幫助你快速運行和了解 ForTest 項目。

## 📋 前置要求

在開始之前，請確保你的開發環境已安裝：

- **HBuilderX** 3.x 或更高版本（推薦使用最新版）
- **Node.js** 14.x 或更高版本（可選，用於命令行構建）
- **微信開發者工具**（如果需要運行微信小程序）

## 📦 步驟 1：導入項目

### 方法一：使用 HBuilderX（推薦）

1. 打開 HBuilderX
2. 點擊 `文件` → `導入` → `從本地目錄導入`
3. 選擇解壓後的 `fortest` 文件夾
4. 點擊 `確定` 完成導入

### 方法二：使用命令行

```bash
# 解壓項目
tar -xzf fortest-optimized.tar.gz

# 進入項目目錄
cd fortest

# 安裝依賴（可選）
npm install
```

## 🎯 步驟 2：運行項目

### 運行微信小程序

1. 在 HBuilderX 中打開項目
2. 點擊工具欄的 `運行` → `運行到小程序模擬器` → `微信開發者工具`
3. 首次運行會自動打開微信開發者工具
4. 在微信開發者工具中查看效果

### 運行 H5

1. 在 HBuilderX 中打開項目
2. 點擊工具欄的 `運行` → `運行到瀏覽器` → `Chrome`
3. 瀏覽器會自動打開並顯示應用

### 運行 App

1. 在 HBuilderX 中打開項目
2. 點擊工具欄的 `運行` → `運行到手機或模擬器`
3. 選擇已連接的設備或模擬器
4. 等待編譯完成後在設備上查看

## 📱 步驟 3：瀏覽功能

項目包含 4 個主要頁面，可以通過底部 TabBar 切換：

### 1. 首頁（index）
- 點擊頂部搜索欄可進入搜索頁面
- 點擊興趣標籤可篩選內容
- 點擊 `+` 按鈕可添加新興趣
- 點擊產品卡片查看詳情（演示）
- 橫向滑動查看不同分類的排行榜

### 2. 趣文（article）
- 垂直滑動切換不同文章
- 點擊視頻播放/暫停
- 點擊作者頭像查看資料（演示）
- 點擊關注按鈕關注作者
- 點擊底部圖標進行點贊、評論、收藏、分享

### 3. 消息（messages）
- 點擊頂部搜索欄搜索聊天記錄（演示）
- 點擊消息項進入聊天（第一個可跳轉）
- 點擊右下角按鈕新建聊天（演示）

### 4. 我的（my）
- 點擊頭像更換頭像
- 點擊統計數據查看詳情（演示）
- 點擊功能菜單進入對應頁面（演示）
- 點擊設置項進入設置（演示）
- 點擊登錄/登出按鈕切換登錄狀態

## 🎨 步驟 4：自定義配置

### 修改主題顏色

編輯 `uni.scss` 文件：

```scss
/* 主題配色 */
$primary-color: #2F7CF6;        // 主色調
$secondary-color: #FFD400;      // 輔助色
$accent-color: #FF6B9D;         // 強調色
```

修改後重新運行項目即可看到效果。

### 修改應用名稱

編輯 `manifest.json` 文件：

```json
{
  "name": "你的應用名稱",
  "appid": "__UNI__AB1CC9E",
  "description": "你的應用描述"
}
```

### 修改頁面標題

編輯 `pages.json` 文件：

```json
{
  "path": "pages/index/index",
  "style": {
    "navigationBarTitleText": "你的標題"
  }
}
```

## 🔧 步驟 5：連接後端 API

### 修改 API 地址

編輯 `utils/request.js` 文件：

```javascript
// API 基礎地址
const BASE_URL = 'https://your-api-domain.com';
```

### 使用網絡請求

在頁面中導入並使用：

```javascript
import { get, post } from '@/utils/request.js';

// GET 請求
async function fetchData() {
  try {
    const data = await get('/api/articles');
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// POST 請求
async function submitData() {
  try {
    const result = await post('/api/articles', {
      title: '標題',
      content: '內容'
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

## 📚 步驟 6：了解項目結構

```
fortest/
├── pages/              # 頁面目錄
│   ├── index/          # 首頁
│   ├── article/        # 文章頁
│   ├── messages/       # 消息頁
│   ├── my/            # 個人中心
│   └── search/        # 搜索頁
├── components/         # 組件目錄
│   └── AddInterestModal.vue  # 興趣彈窗
├── utils/             # 工具函數
│   ├── common.js      # 通用工具
│   └── request.js     # 網絡請求
├── static/            # 靜態資源
├── store/             # 狀態管理
├── App.vue            # 應用入口
├── main.js            # 主入口
├── pages.json         # 頁面配置
├── manifest.json      # 應用配置
└── uni.scss           # 全局樣式
```

## 🎓 步驟 7：學習資源

### 官方文檔
- [uni-app 官方文檔](https://uniapp.dcloud.net.cn/)
- [Vue 3 官方文檔](https://cn.vuejs.org/)
- [Vuex 官方文檔](https://vuex.vuejs.org/zh/)

### 項目文檔
- `README.md` - 項目完整文檔
- `PROJECT_ANALYSIS.md` - 項目分析報告
- `OPTIMIZATION_SUMMARY.md` - 優化總結報告

### 代碼示例
查看 `pages/` 目錄下的各個頁面文件，學習：
- Vue 3 Composition API 用法
- uni-app 組件使用
- 樣式編寫技巧
- 狀態管理方法

## ❓ 常見問題

### Q1: 運行時提示找不到模塊？
**A**: 確保已經安裝依賴，運行 `npm install`。

### Q2: 微信開發者工具無法打開？
**A**: 
1. 確保已安裝微信開發者工具
2. 在 HBuilderX 中配置微信開發者工具路徑
3. 路徑：`工具` → `設置` → `運行配置` → `小程序運行配置`

### Q3: 樣式不生效？
**A**: 
1. 檢查是否正確導入了 `@/uni.scss`
2. 確保使用了 `lang="scss"` 屬性
3. 重新運行項目

### Q4: 圖片無法顯示？
**A**: 
1. 檢查圖片路徑是否正確
2. 確保圖片資源存在於 `static/` 目錄
3. 使用絕對路徑：`/static/image.png`

### Q5: 如何調試？
**A**: 
1. **H5**: 使用瀏覽器開發者工具（F12）
2. **微信小程序**: 使用微信開發者工具的調試器
3. **App**: 使用 HBuilderX 的真機調試功能

## 🎉 下一步

恭喜！你已經成功運行了 ForTest 項目。接下來你可以：

1. ✅ 瀏覽所有頁面，熟悉功能
2. ✅ 閱讀 `README.md` 了解完整功能
3. ✅ 查看 `OPTIMIZATION_SUMMARY.md` 了解優化內容
4. ✅ 修改代碼，添加自己的功能
5. ✅ 連接後端 API，實現真實數據交互

## 💡 提示

- 項目中的數據都是模擬數據，實際使用需要連接真實 API
- 部分功能只提供了入口，需要自己實現完整邏輯
- 建議先熟悉項目結構，再進行二次開發
- 遇到問題可以查看官方文檔或搜索解決方案

## 📞 需要幫助？

如果遇到問題，可以：
1. 查看項目文檔（README.md）
2. 閱讀 uni-app 官方文檔
3. 搜索相關問題和解決方案
4. 在項目 Issues 中提問

祝你開發愉快！🚀

