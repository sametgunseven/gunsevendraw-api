import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projectRoutes'; // YENİ EKLENDİ

dotenv.config();

const app: Application = express();
app.use(cors());
const PORT = process.env.PORT || 5001; // "Render port verirse onu kullan, yoksa 5001 kullan"

// GÜVENLİK VE AYARLAR
app.use(cors());
app.use(express.json());

// ANA KONTROL NOKTASI
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'GunsevenDraw API Tıkır Tıkır Çalışıyor! 🚀',
    version: '1.0.0'
  });
});

// PROJE ROTALARINI (API ENDPOINT) BAĞLA
app.use('/api/projects', projectRoutes); // YENİ EKLENDİ

// SUNUCUYU ATEŞLE
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 GunsevenDraw API Başlatıldı!`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`=================================`);
});