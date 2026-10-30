import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projectRoutes'; // YENİ EKLENDİ
import prisma from './config/db';

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

/**
 * Staging-only startup diagnostics: checks configuration presence and a read-only
 * database SELECT. No connection strings, tokens, or customer data are logged.
 * Enable explicitly with STAGING_DIAGNOSTICS=true on the staging Render service.
 */
if (process.env.STAGING_DIAGNOSTICS === 'true') {
  void (async () => {
    const configured = {
      databaseUrl: Boolean(process.env.DATABASE_URL),
      directUrl: Boolean(process.env.DIRECT_URL),
      supabaseUrl: Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
      publishableKey: Boolean(
        process.env.SUPABASE_PUBLISHABLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ),
    };
    console.info('STAGING_CONFIGURED_FLAGS', JSON.stringify(configured));

    try {
      await prisma.$queryRaw`SELECT 1`;
      console.info('STAGING_DATABASE_CHECK=OK');
    } catch (error) {
      const errorCode =
        typeof error === 'object' && error !== null && 'code' in error &&
        typeof error.code === 'string' && /^P[0-9]{4}$/.test(error.code)
          ? error.code
          : 'UNCLASSIFIED';
      console.error('STAGING_DATABASE_CHECK=FAILED', errorCode);
    }
  })();
}
