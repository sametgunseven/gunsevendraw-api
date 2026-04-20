import prisma from '../config/db';

// İŞTE PATRONUN KİMLİĞİ!
const PATRON_EMAIL = "gunsevensamet@icloud.com";

export const ProjectService = {
  // 1. Yeni Proje Kaydetme (KİMİN KAYDETTİĞİNİ YAZIYORUZ)
  async saveProject(payload: any) {
    try {
      const { projectData, userEmail, userId } = payload;
      const data = projectData; 

      const savedProject = await prisma.project.create({
        data: {
          projectName: data.projectName || "İsimsiz Proje",
          customerName: data.customerName || "",
          parcelInfo: data.parcelInfo || "",
          projectDate: data.projectDate || "",
          projectData: JSON.stringify(data),
          // Kimlikleri veritabanına basıyoruz:
          userEmail: userEmail || "bilinmiyor",
          userId: userId || "anonim"
        }
      });
      return { success: true, project: savedProject };
    } catch (error: any) {
      throw new Error("Proje kaydedilemedi: " + error.message);
    }
  },

  // 2. Projeleri Listeleme (PATRONA HEPSİ, MÜŞTERİYE KENDİSİNİNKİ)
  async getAllProjects(userEmail: string) {
    try {
      let projects;
      
      if (userEmail === PATRON_EMAIL) {
        // PATRON GİRDİ: Herkesin projesini getir
        projects = await prisma.project.findMany({
          select: { id: true, projectName: true, customerName: true, projectDate: true, userEmail: true, createdAt: true },
          orderBy: { createdAt: 'desc' }
        });
      } else {
        // MÜŞTERİ GİRDİ: Sadece kendi mailine ait projeleri getir
        projects = await prisma.project.findMany({
          where: { userEmail: userEmail },
          select: { id: true, projectName: true, customerName: true, projectDate: true, userEmail: true, createdAt: true },
          orderBy: { createdAt: 'desc' }
        });
      }
      return { success: true, projects };
    } catch (error: any) {
      throw new Error("Projeler getirilemedi: " + error.message);
    }
  },

  // 3. Tekil Proje (Aynı Kaldı)
  async getProjectById(id: string) {
    try {
      const project = await prisma.project.findUnique({ where: { id } });
      if (!project) throw new Error("Proje bulunamadı!");
      return { success: true, projectData: JSON.parse(project.projectData) };
    } catch (error: any) {
      throw new Error("Proje detayı okunamadı: " + error.message);
    }
  },

  // 4. Proje Silme (Aynı Kaldı)
  async deleteProject(id: string) {
    try {
      await prisma.project.delete({ where: { id } });
      return { success: true, message: "Proje başarıyla silindi!" };
    } catch (error: any) {
      throw new Error("Proje silinemedi: " + error.message);
    }
  }
};