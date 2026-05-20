import { join } from "path";
import { existsSync, readFileSync, statSync } from "fs";
import { createServer } from "http";
import server from "./dist/server/server.js";

const PORT = process.env.PORT || 3000;
const CLIENT_DIR = join(process.cwd(), "dist/client");

// MIME types dictionary for Node.js fallback
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

if (typeof Bun !== "undefined") {
  // Bun server (extremely fast, native fetch handler)
  Bun.serve({
    port: PORT,
    async fetch(req) {
      const url = new URL(req.url);
      const filePath = join(CLIENT_DIR, url.pathname);
      
      if (!filePath.startsWith(CLIENT_DIR)) {
        return new Response("Forbidden", { status: 403 });
      }

      const file = Bun.file(filePath);
      if (await file.exists()) {
        return new Response(file);
      }

      return server.fetch(req);
    },
  });
  console.log(`Server running with Bun on http://localhost:${PORT}`);
} else {
  // Node.js fallback server using Web Standards API compatibility
  const nodeServer = createServer(async (req, res) => {
    const url = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
    const filePath = join(CLIENT_DIR, url.pathname);

    if (!filePath.startsWith(CLIENT_DIR)) {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }

    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = filePath.substring(filePath.lastIndexOf("."));
      res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
      res.end(readFileSync(filePath));
      return;
    }

    try {
      // Reconstruct standard Web Request headers
      const headers = new Headers();
      for (const [key, val] of Object.entries(req.headers)) {
        if (Array.isArray(val)) {
          val.forEach(v => headers.append(key, v));
        } else if (val !== undefined) {
          headers.set(key, val);
        }
      }

      // Reconstruct request body if present
      let body = null;
      if (req.method !== "GET" && req.method !== "HEAD") {
        const buffers = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        body = Buffer.concat(buffers);
      }

      const webReq = new Request(url.toString(), {
        method: req.method,
        headers,
        body,
        duplex: body ? "half" : undefined,
      });

      const webRes = await server.fetch(webReq);

      // Write response status and headers back to Node.js response
      res.statusCode = webRes.status;
      webRes.headers.forEach((val, key) => {
        res.setHeader(key, val);
      });

      const resBody = await webRes.arrayBuffer();
      res.end(Buffer.from(resBody));
    } catch (err) {
      console.error("Error in fetch handler:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  nodeServer.listen(PORT, () => {
    console.log(`Server running with Node.js on http://localhost:${PORT}`);
  });
}
