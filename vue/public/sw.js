// Service Worker for CSS数创学习平台
// 版本：1.0.0

const CACHE_NAME = '3c-learning-v1.0.0'
const DATA_CACHE_NAME = '3c-learning-data-v1.0.0'

// 需要缓存的静态资源
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json',
  // 这些会在构建时被替换为实际的文件名
  '/assets/index.css',
  '/assets/index.js',
  // 常用页面
  '/principles',
  '/flashcards',
  '/quiz',
  '/analytics',
  '/achievements'
]

// 需要缓存的数据文件
const DATA_CACHE_URLS = [
  '/data/w3sc8_index.json'
]

// 安装事件 - 预缓存关键资源
self.addEventListener('install', event => {
  console.log('[ServiceWorker] 安装中...')
  
  event.waitUntil(
    Promise.all([
      // 缓存静态资源
      caches.open(CACHE_NAME).then(cache => {
        console.log('[ServiceWorker] 缓存静态资源')
        return cache.addAll(STATIC_CACHE_URLS.filter(url => 
          !url.includes('assets') // 跳过构建时的资源文件，它们会在运行时缓存
        ))
      }),
      // 缓存数据文件
      caches.open(DATA_CACHE_NAME).then(cache => {
        console.log('[ServiceWorker] 缓存数据文件')
        return cache.addAll(DATA_CACHE_URLS)
      })
    ])
  )
  
  // 强制激活新的 Service Worker
  self.skipWaiting()
})

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] 激活中...')
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 删除旧版本的缓存
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('[ServiceWorker] 删除旧缓存:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  // 立即控制所有页面
  self.clients.claim()
})

// 拦截网络请求
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // 处理数据API请求
  if (url.pathname.startsWith('/data/')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            // 从缓存返回，同时在后台更新
            fetch(request).then(fetchResponse => {
              if (fetchResponse.status === 200) {
                cache.put(request, fetchResponse.clone())
              }
            }).catch(() => {
              // 网络错误时忽略，继续使用缓存
            })
            return response
          } else {
            // 缓存中没有，尝试从网络获取
            return fetch(request).then(fetchResponse => {
              if (fetchResponse.status === 200) {
                cache.put(request, fetchResponse.clone())
              }
              return fetchResponse
            }).catch(() => {
              // 网络失败，返回离线提示数据
              return new Response(JSON.stringify({
                error: 'offline',
                message: '当前处于离线模式，部分功能可能不可用'
              }), {
                headers: { 'Content-Type': 'application/json' }
              })
            })
          }
        })
      })
    )
    return
  }
  
  // 处理页面和静态资源请求
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response
        }
        
        return fetch(request).then(fetchResponse => {
          // 检查响应是否有效
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse
          }
          
          // 克隆响应用于缓存
          const responseToCache = fetchResponse.clone()
          
          // 决定使用哪个缓存
          const cacheName = url.pathname.startsWith('/data/') ? DATA_CACHE_NAME : CACHE_NAME
          
          caches.open(cacheName).then(cache => {
            cache.put(request, responseToCache)
          })
          
          return fetchResponse
        }).catch(() => {
          // 网络请求失败，尝试返回离线页面
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/') || new Response(
              getOfflineFallbackHTML(),
              { headers: { 'Content-Type': 'text/html' } }
            )
          }
          
          // 对于其他资源，返回缓存或空响应
          return caches.match(request) || new Response('', { status: 404 })
        })
      })
    )
  }
})

// 监听消息事件
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then(size => {
      event.ports[0].postMessage({ type: 'CACHE_SIZE', size })
    })
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearAllCaches().then(() => {
      event.ports[0].postMessage({ type: 'CACHE_CLEARED' })
    })
  }
})

// 后台同步事件（用于离线时的数据同步）
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// 推送通知事件
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body || '你有新的学习提醒',
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      tag: 'learning-reminder',
      requireInteraction: true,
      actions: [
        {
          action: 'open',
          title: '开始学习',
          icon: '/action-learn.png'
        },
        {
          action: 'dismiss',
          title: '稍后提醒',
          icon: '/action-dismiss.png'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title || '学习提醒', options)
    )
  }
})

// 处理通知点击事件
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/principles')
    )
  } else if (event.action === 'dismiss') {
    // 设置稍后提醒
    console.log('用户选择稍后提醒')
  } else {
    // 默认操作：打开应用
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// 辅助函数

// 获取缓存大小
async function getCacheSize() {
  const cacheNames = await caches.keys()
  let totalSize = 0
  
  for (const name of cacheNames) {
    const cache = await caches.open(name)
    const requests = await cache.keys()
    
    for (const request of requests) {
      const response = await cache.match(request)
      if (response) {
        const text = await response.text()
        totalSize += text.length
      }
    }
  }
  
  return totalSize
}

// 清理所有缓存
async function clearAllCaches() {
  const cacheNames = await caches.keys()
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  )
}

// 后台同步处理
async function doBackgroundSync() {
  try {
    // 这里可以添加离线时需要同步的数据
    console.log('[ServiceWorker] 执行后台同步')
    
    // 例如：同步用户进度数据
    const progressData = await getStoredProgressData()
    if (progressData && progressData.needsSync) {
      await syncProgressData(progressData)
    }
    
    return Promise.resolve()
  } catch (error) {
    console.error('[ServiceWorker] 后台同步失败:', error)
    return Promise.reject(error)
  }
}

// 获取存储的进度数据
async function getStoredProgressData() {
  // 这里应该从 IndexedDB 或其他存储中获取待同步的数据
  return null
}

// 同步进度数据
async function syncProgressData(data) {
  try {
    const response = await fetch('/api/sync/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (response.ok) {
      // 标记数据已同步
      console.log('[ServiceWorker] 进度数据同步成功')
    }
  } catch (error) {
    console.error('[ServiceWorker] 进度数据同步失败:', error)
    throw error
  }
}

// 离线时的备用HTML
function getOfflineFallbackHTML() {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>离线模式 - 3C数创学习平台</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 40px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .container {
            max-width: 400px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        h1 {
            margin: 0 0 20px;
            font-size: 24px;
        }
        p {
            margin: 0 0 30px;
            opacity: 0.9;
            line-height: 1.6;
        }
        .retry-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid white;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .retry-btn:hover {
            background: white;
            color: #667eea;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📱</div>
        <h1>离线模式</h1>
        <p>当前网络连接不可用，但你仍可以访问已缓存的学习内容。</p>
        <button class="retry-btn" onclick="window.location.reload()">
            重新连接
        </button>
    </div>
</body>
</html>
  `
}

console.log('[ServiceWorker] 服务工作线程已加载')