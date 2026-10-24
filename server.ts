import express from 'express';
import { createServer as createViteServer } from 'vite';
import { put } from '@vercel/blob';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Ensure Vercel Blob credentials are set in environment
process.env.BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || "vercel_blob_rw_C1371fcA5qKqGfTR_k8zo6LeZIY9Ci207AgJgRpvvpMXtnP";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Vercel Blob Upload Endpoint
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      }

      const filename = `mirage-parfum-${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const blob = await put(filename, file.buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      return res.json({ url: blob.url });
    } catch (error: any) {
      console.error('Vercel Blob Upload Error:', error);
      return res.status(500).json({ error: error.message || 'Erro ao enviar imagem para o Vercel Blob.' });
    }
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
