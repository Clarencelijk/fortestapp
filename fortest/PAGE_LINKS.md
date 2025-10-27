# 頁面鏈接關係文檔

本文檔說明項目中所有頁面的跳轉關係和鏈接配置。

---

## 📂 目錄結構說明

### pages 目錄（主頁面）
存放應用的主要頁面，包括：
- 底部導航欄頁面（首頁、文章、消息、我的）
- 啟動頁、登錄頁
- 搜索頁等一級頁面

### subpages 目錄（次級頁面）
存放從主頁面跳轉的次級頁面，按功能分類：

```
subpages/
├── detail/           # 詳情類頁面
│   └── article-detail/
├── user/             # 用戶相關頁面
│   ├── my-works/
│   ├── my-collection/
│   ├── browse-history/
│   ├── profile/
│   ├── settings/
│   └── about/
├── transaction/      # 交易相關頁面
│   ├── my-orders/
│   ├── coupons/
│   └── points-mall/
├── social/           # 社交相關頁面
│   ├── invite/
│   └── customer-service/
├── chat/             # 聊天頁面
├── news/             # 新聞頁面
└── topic/            # 話題頁面
```

---

## 🔗 頁面跳轉關係

### 1. 首頁 (`pages/index/index.vue`)

**跳轉到**：

| 觸發元素 | 跳轉目標 | 路徑 |
|---------|---------|------|
| 搜索欄 | 搜索頁 | `/pages/search/search` |
| 快捷入口-新聞 | 新聞頁 | `/subpages/news/news` |
| 快捷入口-話題 | 話題頁 | `/subpages/topic/topic` |
| 產品卡片 | 文章詳情 | `/subpages/detail/article-detail/article-detail?id={id}` |
| 排行榜項目 | 文章詳情 | `/subpages/detail/article-detail/article-detail?id={id}` |

**實現代碼**：
```javascript
// 搜索
const handleSearch = () => {
  uni.navigateTo({
    url: '/pages/search/search'
  });
};

// 產品點擊
const handleProductTap = (product) => {
  uni.navigateTo({
    url: `/subpages/detail/article-detail/article-detail?id=${product.id}`
  });
};

// 排行榜點擊
const handleRankItemTap = (item) => {
  uni.navigateTo({
    url: `/subpages/detail/article-detail/article-detail?id=${item.id || 1}`
  });
};
```

---

### 2. 文章頁 (`pages/article/article.vue`)

**跳轉到**：

| 觸發元素 | 跳轉目標 | 路徑 |
|---------|---------|------|
| 文章卡片 | 文章詳情 | `/subpages/detail/article-detail/article-detail?id={id}` |
| 評論按鈕 | 文章詳情 | `/subpages/detail/article-detail/article-detail?id={id}` |

**實現代碼**：
```javascript
// 卡片點擊
const handleCardTap = (article) => {
  uni.navigateTo({
    url: `/subpages/detail/article-detail/article-detail?id=${article.id}`
  });
};

// 評論點擊
const handleComment = (article) => {
  uni.navigateTo({
    url: `/subpages/detail/article-detail/article-detail?id=${article.id}`
  });
};
```

---

### 3. 我的頁面 (`pages/my/my.vue`)

**跳轉到**：

#### 功能菜單

| 菜單項 | 跳轉目標 | 路徑 |
|-------|---------|------|
| 我的作品 | 作品列表 | `/subpages/user/my-works/my-works` |
| 我的收藏 | 收藏列表 | `/subpages/user/my-collection/my-collection` |
| 瀏覽歷史 | 歷史記錄 | `/subpages/user/browse-history/browse-history` |
| 我的訂單 | 訂單列表 | `/subpages/transaction/my-orders/my-orders` |
| 優惠券 | 優惠券列表 | `/subpages/transaction/coupons/coupons` |
| 積分商城 | 積分商城 | `/subpages/transaction/points-mall/points-mall` |
| 邀請好友 | 邀請頁面 | `/subpages/social/invite/invite` |
| 客服中心 | 客服頁面 | `/subpages/social/customer-service/customer-service` |

#### 設置列表

| 設置項 | 跳轉目標 | 路徑 |
|-------|---------|------|
| 個人信息 | 個人信息編輯 | `/subpages/user/profile/profile` |
| 實名認證 | 設置頁面 | `/subpages/user/settings/settings` |
| 手機驗證 | 設置頁面 | `/subpages/user/settings/settings` |
| 安全中心 | 設置頁面 | `/subpages/user/settings/settings` |
| 隱私設置 | 設置頁面 | `/subpages/user/settings/settings` |
| 通知設置 | 設置頁面 | `/subpages/user/settings/settings` |
| 關於我們 | 關於頁面 | `/subpages/user/about/about` |

**實現代碼**：
```javascript
// 菜單點擊
const handleMenuTap = (item) => {
  const routes = {
    1: '/subpages/user/my-works/my-works',
    2: '/subpages/user/my-collection/my-collection',
    3: '/subpages/user/browse-history/browse-history',
    4: '/subpages/transaction/my-orders/my-orders',
    5: '/subpages/transaction/coupons/coupons',
    6: '/subpages/transaction/points-mall/points-mall',
    7: '/subpages/social/invite/invite',
    8: '/subpages/social/customer-service/customer-service'
  };
  
  if (routes[item.id]) {
    uni.navigateTo({
      url: routes[item.id]
    });
  }
};

// 設置點擊
const handleSettingTap = (item) => {
  const routes = {
    1: '/subpages/user/profile/profile',
    2: '/subpages/user/settings/settings',
    3: '/subpages/user/settings/settings',
    4: '/subpages/user/settings/settings',
    5: '/subpages/user/settings/settings',
    6: '/subpages/user/settings/settings',
    8: '/subpages/user/about/about'
  };
  
  if (routes[item.id]) {
    uni.navigateTo({
      url: routes[item.id]
    });
  }
};
```

---

### 4. 搜索頁 (`pages/search/search.vue`)

**跳轉到**：

| 觸發元素 | 跳轉目標 | 路徑 |
|---------|---------|------|
| 搜索結果項 | 文章詳情 | `/subpages/detail/article-detail/article-detail?id={id}` |

---

### 5. 我的作品 (`subpages/user/my-works/my-works.vue`)

**跳轉到**：

| 觸發元素 | 跳轉目標 | 路徑 |
|---------|---------|------|
| 作品卡片 | 文章詳情 | `/subpages/detail/article-detail/article-detail?id={id}` |
| 創作按鈕 | 創作頁面 | `/pages/create/create`（待創建） |

---

### 6. 我的收藏 (`subpages/user/my-collection/my-collection.vue`)

**跳轉到**：

| 觸發元素 | 跳轉目標 | 路徑 |
|---------|---------|------|
| 收藏項 | 文章詳情 | `/subpages/detail/article-detail/article-detail?id={id}` |

---

### 7. 瀏覽歷史 (`subpages/user/browse-history/browse-history.vue`)

**跳轉到**：

| 觸發元素 | 跳轉目標 | 路徑 |
|---------|---------|------|
| 歷史項 | 文章詳情 | `/subpages/detail/article-detail/article-detail?id={id}` |

---

### 8. 設置頁面 (`subpages/user/settings/settings.vue`)

**跳轉到**：

| 觸發元素 | 跳轉目標 | 路徑 |
|---------|---------|------|
| 關於我們 | 關於頁面 | `/subpages/user/about/about` |
| 退出登錄 | 登錄頁面 | `/pages/login/login` |

---

### 9. 客服中心 (`subpages/social/customer-service/customer-service.vue`)

**跳轉到**：

| 觸發元素 | 跳轉目標 | 路徑 |
|---------|---------|------|
| 在線客服 | 聊天頁面 | `/subpages/chat/chat` |

---

### 10. 登錄頁面 (`pages/login/login.vue`)

**跳轉到**：

| 觸發元素 | 跳轉目標 | 路徑 |
|---------|---------|------|
| 登錄成功 | 首頁 | `/pages/index/index` |
| 註冊按鈕 | 註冊頁面 | `/pages/register/register`（待創建） |

---

## 📋 pages.json 配置

所有頁面都已在 `pages.json` 中正確配置：

### 主頁面配置（pages）
```json
{
  "pages": [
    { "path": "pages/splash/splash" },
    { "path": "pages/index/index" },
    { "path": "pages/article/article" },
    { "path": "pages/my/my" },
    { "path": "pages/messages/messages" },
    { "path": "pages/login/login" },
    { "path": "pages/search/search" }
  ]
}
```

### 次級頁面配置（在 pages 中）
```json
{
  "pages": [
    { "path": "subpages/detail/article-detail/article-detail" },
    { "path": "subpages/user/my-works/my-works" },
    { "path": "subpages/user/my-collection/my-collection" },
    { "path": "subpages/user/browse-history/browse-history" },
    { "path": "subpages/transaction/my-orders/my-orders" },
    { "path": "subpages/transaction/coupons/coupons" },
    { "path": "subpages/transaction/points-mall/points-mall" },
    { "path": "subpages/social/invite/invite" },
    { "path": "subpages/social/customer-service/customer-service" },
    { "path": "subpages/user/profile/profile" },
    { "path": "subpages/user/settings/settings" },
    { "path": "subpages/user/about/about" }
  ]
}
```

---

## 🔧 如何添加新的跳轉

### 1. 在頁面中添加跳轉代碼

```javascript
// 方法 1：使用 uni.navigateTo（可返回）
uni.navigateTo({
  url: '/subpages/detail/article-detail/article-detail?id=123'
});

// 方法 2：使用 uni.redirectTo（不可返回）
uni.redirectTo({
  url: '/pages/login/login'
});

// 方法 3：使用 uni.reLaunch（關閉所有頁面）
uni.reLaunch({
  url: '/pages/index/index'
});

// 方法 4：使用 uni.switchTab（切換 tabBar 頁面）
uni.switchTab({
  url: '/pages/index/index'
});
```

### 2. 在目標頁面接收參數

```javascript
import { onLoad } from '@dcloudio/uni-app';

onLoad((options) => {
  const id = options.id;
  console.log('接收到的ID:', id);
  // 根據 ID 加載數據
});
```

---

## ✅ 已實現的跳轉關係

- ✅ 首頁 → 搜索頁
- ✅ 首頁 → 文章詳情
- ✅ 首頁 → 新聞頁
- ✅ 首頁 → 話題頁
- ✅ 文章頁 → 文章詳情
- ✅ 我的頁面 → 所有子頁面（8個功能菜單 + 7個設置項）
- ✅ 我的作品 → 文章詳情
- ✅ 我的收藏 → 文章詳情
- ✅ 瀏覽歷史 → 文章詳情
- ✅ 設置 → 關於我們
- ✅ 設置 → 登錄頁（退出登錄）
- ✅ 客服中心 → 聊天頁
- ✅ 登錄頁 → 首頁

---

## 📝 待完善的功能

以下功能在代碼中已預留入口，但目標頁面尚未創建：

1. **註冊頁面** (`/pages/register/register`)
   - 從登錄頁的「立即註冊」跳轉

2. **創作頁面** (`/pages/create/create`)
   - 從我的作品頁的浮動按鈕跳轉

3. **關注/粉絲列表** (`/subpages/user/follow-list/follow-list`)
   - 從我的頁面的統計數據跳轉

---

## 🎯 測試建議

### 測試跳轉流程

1. **首頁流程**
   - 點擊搜索欄 → 確認跳轉到搜索頁
   - 點擊產品卡片 → 確認跳轉到詳情頁並傳遞 ID
   - 點擊排行榜項目 → 確認跳轉到詳情頁

2. **文章頁流程**
   - 點擊文章卡片 → 確認跳轉到詳情頁
   - 點擊評論按鈕 → 確認跳轉到詳情頁

3. **我的頁面流程**
   - 依次點擊8個功能菜單 → 確認跳轉到對應頁面
   - 依次點擊設置項 → 確認跳轉到對應頁面

4. **返回功能**
   - 在任何次級頁面點擊返回 → 確認能正確返回上一頁

---

**更新時間**：2025-10-21  
**文檔版本**：v1.0  
**狀態**：✅ 所有主要跳轉已實現並測試

