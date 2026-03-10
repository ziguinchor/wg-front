import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createProxyMiddleware } from 'http-proxy-middleware';

const TARGET_URL = 'http://51.222.139.224:9191';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy API and Auth requests to avoid mixed content
  app.use(['/api', '/auth', '/health'], createProxyMiddleware({
    target: TARGET_URL,
    changeOrigin: true,
    secure: false, // Since it's an IP-based HTTP endpoint
  }));

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving (if needed)
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Proxying /api, /auth, /health to ${TARGET_URL}`);
  });
}

startServer();
