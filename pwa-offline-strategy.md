# PWA离线策略和实现方案

## PWA优势分析

### 为什么要实现PWA？
1. **减少部署依赖**：离线可用，降低服务器依赖
2. **提升用户体验**：快速启动，类原生应用体验  
3. **学习连续性**：网络不稳定时也能继续学习
4. **资源缓存**：减少重复加载，提升性能
5. **跨平台一致性**：一套代码，多平台使用

### 适用场景
- **地铁/飞机**：网络不稳定环境下学习
- **数据流量限制**：避免重复下载资源
- **企业内网**：内网环境下的培训使用
- **移动设备**：手机/平板离线学习

## PWA技术架构

### 核心组件
1. **Service Worker**: 资源缓存和离线处理
2. **Web App Manifest**: 应用安装和元数据
3. **Cache API**: 精确的缓存控制
4. **IndexedDB**: 离线数据存储

### 缓存策略设计

```javascript
// /vue/public/sw.js - Service Worker
const CACHE_NAME = '3c-learning-v1';
const STATIC_CACHE = '3c-static-v1';
const DYNAMIC_CACHE = '3c-dynamic-v1';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/main.css',
  '/assets/main.js',
  '/favicon.ico',
  '/docs/plans/web3v8c2_v1.toml'  // TOML配置文件
];

// 安装Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // 静态资源：缓存优先
  if (isStaticAsset(request.url)) {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
    );
  }
  
  // API请求：网络优先，缓存备用
  else if (isApiRequest(request.url)) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // 成功时更新缓存
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))  // 离线时使用缓存
    );
  }
  
  // 页面请求：stale-while-revalidate
  else {
    event.respondWith(
      caches.match(request)
        .then(response => {
          const fetchPromise = fetch(request)
            .then(networkResponse => {
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, networkResponse.clone()));
              return networkResponse;
            });
          
          return response || fetchPromise;
        })
    );
  }
});
```

### Web App Manifest

```json
// /vue/public/manifest.json
{
  "name": "3C数字资产学习平台",
  "short_name": "3C学习",
  "description": "创业学与数字经济核心概念学习平台",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "orientation": "portrait-primary",
  "categories": ["education", "productivity"],
  "lang": "zh-CN",
  
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  
  "shortcuts": [
    {
      "name": "开始学习",
      "short_name": "学习",
      "description": "直接进入原则学习页面",
      "url": "/principles",
      "icons": [
        { "src": "/icons/shortcut-learn.png", "sizes": "192x192" }
      ]
    },
    {
      "name": "练习闪卡",
      "short_name": "闪卡",
      "description": "练习概念闪卡",
      "url": "/flashcards",
      "icons": [
        { "src": "/icons/shortcut-cards.png", "sizes": "192x192" }
      ]
    },
    {
      "name": "知识测试",
      "short_name": "测试",
      "description": "进行知识测试",
      "url": "/quiz",
      "icons": [
        { "src": "/icons/shortcut-quiz.png", "sizes": "192x192" }
      ]
    }
  ]
}
```

## 离线数据策略

### 数据分层存储

```javascript
// /vue/src/utils/offlineStorage.js
export class OfflineStorage {
  constructor() {
    this.dbName = '3CLearningDB';
    this.dbVersion = 1;
    this.db = null;
  }
  
  // 初始化IndexedDB
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 存储TOML配置数据
        if (!db.objectStoreNames.contains('config')) {
          db.createObjectStore('config', { keyPath: 'id' });
        }
        
        // 存储用户学习进度
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'userId' });
        }
        
        // 存储闪卡练习记录
        if (!db.objectStoreNames.contains('flashcards')) {
          const flashcardStore = db.createObjectStore('flashcards', { keyPath: 'cardId' });
          flashcardStore.createIndex('stage', 'stage', { unique: false });
        }
        
        // 存储测试结果
        if (!db.objectStoreNames.contains('quizResults')) {
          const quizStore = db.createObjectStore('quizResults', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          quizStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }
  
  // 存储TOML配置
  async storeConfig(configData) {
    const transaction = this.db.transaction(['config'], 'readwrite');
    const store = transaction.objectStore('config');
    
    return store.put({
      id: 'main_config',
      data: configData,
      timestamp: Date.now()
    });
  }
  
  // 获取配置数据
  async getConfig() {
    const transaction = this.db.transaction(['config'], 'readonly');
    const store = transaction.objectStore('config');
    const request = store.get('main_config');
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = () => reject(request.error);
    });
  }
  
  // 存储用户进度
  async saveProgress(progress) {
    const transaction = this.db.transaction(['progress'], 'readwrite');
    const store = transaction.objectStore('progress');
    
    return store.put({
      userId: 'default_user',
      ...progress,
      lastUpdated: Date.now()
    });
  }
  
  // 存储测试结果
  async saveQuizResult(result) {
    const transaction = this.db.transaction(['quizResults'], 'readwrite');
    const store = transaction.objectStore('quizResults');
    
    return store.add({
      ...result,
      timestamp: Date.now()
    });
  }
}
```

### 数据同步策略

```javascript
// /vue/src/utils/syncManager.js
export class SyncManager {
  constructor(offlineStorage) {
    this.storage = offlineStorage;
    this.isOnline = navigator.onLine;
    
    // 监听网络状态
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncWhenOnline();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  
  // 在线时同步数据
  async syncWhenOnline() {
    if (!this.isOnline) return;
    
    try {
      // 检查配置文件是否有更新
      await this.syncConfig();
      
      // 未来：同步用户数据到云端
      // await this.syncUserData();
      
      console.log('数据同步完成');
    } catch (error) {
      console.warn('数据同步失败:', error);
    }
  }
  
  // 同步配置文件
  async syncConfig() {
    try {
      const response = await fetch('/docs/plans/web3v8c2_v1.toml');
      if (response.ok) {
        const configText = await response.text();
        const configData = TOML.parse(configText);
        await this.storage.storeConfig(configData);
      }
    } catch (error) {
      console.warn('配置同步失败:', error);
    }
  }
}
```

## PWA安装和更新

### 安装提示组件

```vue
<!-- /vue/src/components/common/PWAInstaller.vue -->
<template>
  <div v-if="showInstallPrompt" class="pwa-install-banner">
    <div class="banner-content">
      <div class="banner-icon">📱</div>
      <div class="banner-text">
        <h3>安装3C学习应用</h3>
        <p>离线学习，随时随地掌握创业核心思维</p>
      </div>
      <div class="banner-actions">
        <Button @click="installApp" variant="primary">安装</Button>
        <Button @click="dismissPrompt" variant="outline">稍后</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PWAInstaller',
  data() {
    return {
      showInstallPrompt: false,
      deferredPrompt: null
    };
  },
  
  mounted() {
    // 监听安装提示事件
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt = true;
    });
  },
  
  methods: {
    async installApp() {
      if (!this.deferredPrompt) return;
      
      // 显示安装提示
      this.deferredPrompt.prompt();
      
      // 等待用户响应
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('用户接受安装');
      } else {
        console.log('用户拒绝安装');
      }
      
      this.deferredPrompt = null;
      this.showInstallPrompt = false;
    },
    
    dismissPrompt() {
      this.showInstallPrompt = false;
      // 7天后再提示
      localStorage.setItem('pwa-prompt-dismissed', Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  }
};
</script>
```

### 应用更新管理

```javascript
// /vue/src/utils/updateManager.js
export class UpdateManager {
  constructor() {
    this.swRegistration = null;
    this.updateAvailable = false;
  }
  
  // 注册Service Worker
  async register() {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        
        // 监听Service Worker更新
        this.swRegistration.addEventListener('updatefound', () => {
          const newWorker = this.swRegistration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.updateAvailable = true;
              this.notifyUpdate();
            }
          });
        });
        
        console.log('Service Worker注册成功');
      } catch (error) {
        console.error('Service Worker注册失败:', error);
      }
    }
  }
  
  // 通知用户有新版本
  notifyUpdate() {
    // 可以显示通知或更新按钮
    const event = new CustomEvent('app-update-available');
    window.dispatchEvent(event);
  }
  
  // 应用更新
  async applyUpdate() {
    if (this.swRegistration && this.swRegistration.waiting) {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }
}
```

## Vite PWA配置

### 构建配置

```javascript
// /vue/vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,toml}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: '3C数字资产学习平台',
        short_name: '3C学习',
        description: '创业学与数字经济核心概念学习平台',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

### 图标生成

需要生成以下尺寸的应用图标：
- 72x72, 96x96, 128x128, 144x144, 152x152
- 192x192, 384x384, 512x512 (必需)
- apple-touch-icon.png (180x180)

## 离线体验优化

### 网络状态指示

```vue
<!-- /vue/src/components/common/NetworkStatus.vue -->
<template>
  <div v-if="!isOnline" class="network-status offline">
    <div class="status-content">
      <span class="status-icon">📡</span>
      <span class="status-text">离线模式</span>
      <span class="status-desc">数据已缓存，可继续学习</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NetworkStatus',
  data() {
    return {
      isOnline: navigator.onLine
    };
  },
  
  mounted() {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
  },
  
  beforeUnmount() {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  },
  
  methods: {
    updateOnlineStatus() {
      this.isOnline = navigator.onLine;
    }
  }
};
</script>
```

### 缓存管理

```javascript
// /vue/src/utils/cacheManager.js
export class CacheManager {
  static async clearOldCaches() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name !== CACHE_NAME && name.startsWith('3c-')
    );
    
    return Promise.all(
      oldCaches.map(cacheName => caches.delete(cacheName))
    );
  }
  
  static async getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const size = response.headers.get('content-length');
          totalSize += parseInt(size) || 0;
        }
      }
    }
    
    return totalSize;
  }
}
```

## 测试和调试

### PWA检测清单

```javascript
// /vue/src/utils/pwaChecker.js
export class PWAChecker {
  static async checkPWARequirements() {
    const results = {
      serviceWorker: 'serviceWorker' in navigator,
      manifest: await this.checkManifest(),
      https: location.protocol === 'https:' || location.hostname === 'localhost',
      icons: await this.checkIcons(),
      installable: false
    };
    
    // 检查是否可安装
    window.addEventListener('beforeinstallprompt', () => {
      results.installable = true;
    });
    
    return results;
  }
  
  static async checkManifest() {
    try {
      const response = await fetch('/manifest.json');
      return response.ok;
    } catch {
      return false;
    }
  }
  
  static async checkIcons() {
    try {
      const response = await fetch('/icons/icon-192x192.png');
      return response.ok;
    } catch {
      return false;
    }
  }
}
```

## 性能优化

### 资源预加载

```javascript
// 在Service Worker中预加载关键资源
const CRITICAL_RESOURCES = [
  '/docs/plans/web3v8c2_v1.toml',
  '/assets/main.css',
  '/assets/main.js'
];

// 安装时预加载
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(CRITICAL_RESOURCES))
  );
});
```

### 懒加载策略

```javascript
// 路由级别的代码分割
const routes = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/principles',
    component: () => import('@/views/PrinciplesView.vue')
  }
  // 其他路由按需加载
];
```

## 部署注意事项

### 服务端配置

```nginx
# Nginx配置示例
location /sw.js {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

location /manifest.json {
    add_header Content-Type "application/manifest+json";
}
```

### HTTPS要求

PWA需要HTTPS环境才能正常工作（localhost除外），部署时确保：
- 使用SSL/TLS证书
- 所有资源通过HTTPS加载
- Service Worker正确注册

通过以上PWA离线策略，3C学习平台将具备完整的离线学习能力，大幅提升用户体验和应用的实用性。