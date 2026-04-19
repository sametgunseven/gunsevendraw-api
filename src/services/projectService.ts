import prisma from '../config/db';

export const ProjectService = {
  // 1. Yeni Proje Kaydetme / Güncelleme
  async saveProject(data: any) {
    try {
      const savedProject = await prisma.project.create({
        data: {
          projectName: data.projectName || "İsimsiz Proje",
          customerName: data.customerName || "",
          parcelInfo: data.parcelInfo || "",
          projectDate: data.projectDate || "",
          projectData: JSON.stringify(data) // Tüm JSON paketini string olarak gömüyoruz
        }
      });
      return { success: true, project: savedProject };
    } catch (error: any) {
      throw new Error("Proje kaydedilemedi: " + error.message);
    }
  },

  // 2. Tüm Projeleri Listeleme
  async getAllProjects() {
    try {
      const projects = await prisma.project.findMany({
        select: {
          id: true,
          projectName: true,
          customerName: true,
          projectDate: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });
      return { success: true, projects };
    } catch (error: any) {
      throw new Error("Projeler getirilemedi: " + error.message);
    }
  },

  // 3. Tek Bir Projenin Detayını Çekme
  async getProjectById(id: string) {
    try {
      const project = await prisma.project.findUnique({
        where: { id }
      });
      if (!project) throw new Error("Proje bulunamadı!");
      
      return { success: true, projectData: JSON.parse(project.projectData) };
    } catch (error: any) {
      throw new Error("Proje detayı okunamadı: " + error.message);
    }
  },

  // 4. Proje Silme
  async deleteProject(id: string) {
    try {
      await prisma.project.delete({
        where: { id }
      });
      return { success: true, message: "Proje başarıyla silindi!" };
    } catch (error: any) {
      throw new Error("Proje silinemedi: " + error.message);
    }
  }
};