// Service Worker - INFINITE
const CACHE_NAME = "infinite-blog-v1";

// 需要预缓存的资源
const PRECACHE_ASSETS = [
  "/",
  "/zh",
  "/en",
  "/manifest.json",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
];

// 安装事件 - 预缓存关键资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// 获取事件 - Network First 策略
self.addEventListener("fetch", (event) => {
  // 只处理 GET 请求
  if (event.request.method !== "GET") return;

  // 跳过非同源请求
  if (!event.request.url.startsWith(self.location.origin)) return;

  // 跳过 API 请求和动态内容
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("/_next/")
  ) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        // 先尝试网络请求
        const networkResponse = await fetch(event.request);

        // 如果成功，更新缓存
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        // 网络失败，尝试从缓存获取
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
          return cachedResponse;
        }

        // 如果是页面请求，返回离线页面
        if (event.request.headers.get("accept")?.includes("text/html")) {
          return cache.match("/");
        }

        throw error;
      }
    })
  );
});
