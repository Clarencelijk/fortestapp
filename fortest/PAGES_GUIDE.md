# 頁面導航指南

本文檔提供項目中所有頁面的快速導航和功能說明，方便開發者快速定位和修改。

---

## 📱 主要頁面（底部導航）

### 1. 首頁 - `pages/index/index.vue`
**路徑**：`/pages/index/index`  
**功能**：應用首頁，展示推薦內容和快捷入口

**主要功能**：
- 頂部搜索欄（跳轉到搜索頁）
- 輪播圖展示
- 快捷入口網格
- 產品卡片列表
- 熱門排行榜
- 下拉刷新和上拉加載

**跳轉到**：
- 搜索頁 (`/pages/search/search`)
- 文章詳情 (`/pages/article-detail/article-detail`)

---

### 2. 文章頁 - `pages/article/article.vue`
**路徑**：`/pages/article/article`  
**功能**：趣文內容列表頁

**主要功能**：
- 分類標籤切換
- 內容列表展示
- 點贊和評論數顯示
- 下拉刷新和上拉加載

**跳轉到**：
- 文章詳情 (`/pages/article-detail/article-detail`)

---

### 3. 消息頁 - `pages/messages/messages.vue`
**路徑**：`/pages/messages/messages`  
**功能**：消息列表頁

**主要功能**：
- 系統通知
- 私信列表
- 未讀消息提示
- 在線狀態顯示

**跳轉到**：
- 聊天頁 (`/subpages/chat/chat`)

---

### 4. 我的頁面 - `pages/my/my.vue`
**路徑**：`/pages/my/my`  
**功能**：個人中心主頁

**主要功能**：
- 用戶信息卡片
- 統計數據展示
- 功能菜單網格
- 設置入口

**跳轉到**：
- 個人信息 (`/pages/profile/profile`)
- 我的作品 (`/pages/my-works/my-works`)
- 我的收藏 (`/pages/my-collection/my-collection`)
- 瀏覽歷史 (`/pages/browse-history/browse-history`)
- 我的訂單 (`/pages/my-orders/my-orders`)
- 優惠券 (`/pages/coupons/coupons`)
- 積分商城 (`/pages/points-mall/points-mall`)
- 邀請好友 (`/pages/invite/invite`)
- 客服中心 (`/pages/customer-service/customer-service`)
- 設置 (`/pages/settings/settings`)

---

## 🔍 功能頁面

### 5. 搜索頁 - `pages/search/search.vue`
**路徑**：`/pages/search/search`  
**功能**：全局搜索功能

**主要功能**：
- 搜索輸入框
- 搜索歷史記錄
- 熱門搜索推薦
- 搜索結果展示
- 歷史記錄管理

**跳轉到**：
- 文章詳情 (`/pages/article-detail/article-detail`)

---

### 6. 文章詳情頁 - `pages/article-detail/article-detail.vue`
**路徑**：`/pages/article-detail/article-detail`  
**功能**：內容詳情展示和評論互動

**主要功能**：
- 視頻/圖片展示
- 作者信息和關注
- 文章內容展示
- 統計數據展示
- 評論列表和互動
- 相關推薦
- 底部操作欄（點贊、收藏、分享）

**接收參數**：
- `id`：文章ID

---

## 📝 個人作品管理

### 7. 我的作品 - `pages/my-works/my-works.vue`
**路徑**：`/pages/my-works/my-works`  
**功能**：管理個人發布的作品

**主要功能**：
- 統計卡片（總數、獲贊、瀏覽）
- 狀態篩選（全部、已發布、草稿、審核中、未通過）
- 瀑布流佈局
- 浮動創作按鈕
- 下拉刷新和上拉加載

**跳轉到**：
- 文章詳情 (`/pages/article-detail/article-detail`)
- 創作頁面 (`/pages/create/create`)

---

### 8. 我的收藏 - `pages/my-collection/my-collection.vue`
**路徑**：`/pages/my-collection/my-collection`  
**功能**：管理收藏的內容

**主要功能**：
- 分類標籤（全部、文章、視頻、圖片）
- 收藏列表展示
- 取消收藏功能
- 收藏時間顯示

**跳轉到**：
- 文章詳情 (`/pages/article-detail/article-detail`)

---

### 9. 瀏覽歷史 - `pages/browse-history/browse-history.vue`
**路徑**：`/pages/browse-history/browse-history`  
**功能**：查看瀏覽記錄

**主要功能**：
- 按日期分組展示
- 瀏覽時間記錄
- 單條刪除功能
- 一鍵清空歷史
- 總記錄數統計

**跳轉到**：
- 文章詳情 (`/pages/article-detail/article-detail`)

---

## 🛒 交易相關

### 10. 我的訂單 - `pages/my-orders/my-orders.vue`
**路徑**：`/pages/my-orders/my-orders`  
**功能**：管理購物訂單

**主要功能**：
- 訂單狀態標籤
- 訂單列表展示
- 商品信息展示
- 訂單操作（取消、支付、查看物流、確認收貨、評價、再次購買）
- 實付款金額顯示

---

### 11. 優惠券 - `pages/coupons/coupons.vue`
**路徑**：`/pages/coupons/coupons`  
**功能**：管理優惠券

**主要功能**：
- 優惠券狀態分類
- 優惠券卡片展示
- 立即使用按鈕
- 有效期提示
- 領取優惠券入口

---

### 12. 積分商城 - `pages/points-mall/points-mall.vue`
**路徑**：`/pages/points-mall/points-mall`  
**功能**：積分兌換商城

**主要功能**：
- 積分餘額展示
- 快捷操作（簽到、明細、規則）
- 商品分類
- 商品網格展示
- 積分兌換功能
- 庫存提示

---

## 👥 社交功能

### 13. 邀請好友 - `pages/invite/invite.vue`
**路徑**：`/pages/invite/invite`  
**功能**：邀請好友獲取獎勵

**主要功能**：
- 邀請碼展示和複製
- 邀請獎勵說明
- 邀請統計數據
- 邀請記錄列表
- 分享邀請鏈接
- 多種分享方式

---

### 14. 客服中心 - `pages/customer-service/customer-service.vue`
**路徑**：`/pages/customer-service/customer-service`  
**功能**：客戶服務和幫助

**主要功能**：
- 多種聯繫方式
- 常見問題列表
- 意見反饋表單
- 快捷複製聯繫方式

**跳轉到**：
- 在線客服 (`/subpages/chat/chat`)

---

## ⚙️ 賬號設置

### 15. 個人信息 - `pages/profile/profile.vue`
**路徑**：`/pages/profile/profile`  
**功能**：編輯個人資料

**主要功能**：
- 頭像更換
- 基本信息編輯
- 用戶ID複製
- 個人簡介編輯
- 社交賬號綁定
- 保存修改功能

---

### 16. 設置 - `pages/settings/settings.vue`
**路徑**：`/pages/settings/settings`  
**功能**：應用設置中心

**主要功能**：
- 賬號安全設置
- 隱私設置
- 通知設置
- 通用設置
- 退出登錄

**跳轉到**：
- 個人信息 (`/pages/profile/profile`)
- 關於我們 (`/pages/about/about`)

---

### 17. 關於我們 - `pages/about/about.vue`
**路徑**：`/pages/about/about`  
**功能**：應用介紹和信息

**主要功能**：
- 應用Logo和版本
- 應用介紹
- 功能特色展示
- 聯繫方式
- 法律信息
- 版權信息

---

## 🔐 認證相關

### 18. 登錄頁面 - `pages/login/login.vue`
**路徑**：`/pages/login/login`  
**功能**：用戶登錄

**主要功能**：
- 雙登錄方式（密碼、驗證碼）
- 記住密碼功能
- 忘記密碼入口
- 驗證碼倒計時
- 第三方登錄
- 快捷註冊入口
- 用戶協議確認

**跳轉到**：
- 首頁 (`/pages/index/index`)
- 註冊頁 (`/pages/register/register`)

---

## 📋 頁面開發狀態

| 頁面 | 狀態 | 完成度 | 備註 |
|------|------|--------|------|
| 首頁 | ✅ 已完成 | 100% | 已優化 |
| 文章頁 | ✅ 已完成 | 100% | 已優化 |
| 消息頁 | ✅ 已完成 | 100% | 已優化 |
| 我的頁面 | ✅ 已完成 | 100% | 已優化 |
| 搜索頁 | ✅ 已完成 | 100% | 新增 |
| 文章詳情 | ✅ 已完成 | 100% | 新增 |
| 我的作品 | ✅ 已完成 | 100% | 新增 |
| 我的收藏 | ✅ 已完成 | 100% | 新增 |
| 瀏覽歷史 | ✅ 已完成 | 100% | 新增 |
| 我的訂單 | ✅ 已完成 | 100% | 新增 |
| 優惠券 | ✅ 已完成 | 100% | 新增 |
| 積分商城 | ✅ 已完成 | 100% | 新增 |
| 邀請好友 | ✅ 已完成 | 100% | 新增 |
| 客服中心 | ✅ 已完成 | 100% | 新增 |
| 個人信息 | ✅ 已完成 | 100% | 新增 |
| 設置 | ✅ 已完成 | 100% | 新增 |
| 關於我們 | ✅ 已完成 | 100% | 新增 |
| 登錄頁面 | ✅ 已完成 | 100% | 已優化 |

---

## 🔧 快速修改指南

### 修改頁面標題
在 `pages.json` 中找到對應頁面，修改 `navigationBarTitleText`：
```json
{
  "path": "pages/index/index",
  "style": {
    "navigationBarTitleText": "首頁"
  }
}
```

### 修改頁面配色
在對應頁面的 `<style>` 中修改，或在 `uni.scss` 中修改全局變量：
```scss
$primary-color: #2F7CF6;  // 主色調
$accent-color: #FFD400;   // 輔助色
```

### 添加新頁面
1. 在 `pages` 目錄下創建新文件夾和 `.vue` 文件
2. 在 `pages.json` 的 `pages` 數組中添加配置
3. 使用 `uni.navigateTo()` 進行頁面跳轉

### 修改模擬數據
在對應頁面的 `<script setup>` 中找到 `mock` 開頭的函數，修改數據結構和內容。

---

## 📞 技術支持

如有問題，請參考：
- `README.md` - 項目說明文檔
- `QUICK_START.md` - 快速開始指南
- `OPTIMIZATION_SUMMARY.md` - 優化總結報告
- `NEW_FEATURES.md` - 新功能說明文檔

---

**更新時間**：2025-10-20  
**文檔版本**：v1.0  
**項目狀態**：✅ 功能完整

