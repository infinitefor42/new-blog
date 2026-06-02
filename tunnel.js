const localtunnel = require("localtunnel");

(async () => {
  try {
    const tunnel = await localtunnel({ port: 3000, subdomain: "infinite-blog-preview" });
    console.log("✅ 预览地址:", tunnel.url);
    console.log("按 Ctrl+C 停止");
    tunnel.on("close", () => {
      console.log("Tunnel closed");
    });
  } catch (err) {
    console.error("Tunnel error:", err.message);
    process.exit(1);
  }
})();
