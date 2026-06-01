"use client";

import { useEffect } from "react";

/**
 * Service Worker 注册组件
 * 仅在生产环境中注册 SW
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    // 只在生产环境且浏览器支持时注册
    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      registerSW();
    }
  }, []);

  return null;
}

async function registerSW() {
  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    // 监听 SW 更新
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;

      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "activated" &&
            navigator.serviceWorker.controller
          ) {
            // 可以在这里提示用户刷新
            console.log("New content available, please refresh.");
          }
        });
      }
    });

    console.log("Service Worker registered successfully");
  } catch (error) {
    console.error("Service Worker registration failed:", error);
  }
}
