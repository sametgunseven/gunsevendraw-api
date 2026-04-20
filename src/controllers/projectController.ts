import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';

export const ProjectController = {
  async save(req: Request, res: Response) {
    try {
      // Artık frontend'den payload geliyor: { projectData, userEmail, userId }
      const result = await ProjectService.saveProject(req.body);
      res.status(201).json({ success: true, message: "Proje başarıyla kaydedildi!", data: result.project });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      // API İsteğinden soran kişinin mailini alıyoruz
      const userEmail = (req.query.email as string) || "bilinmiyor";
      const result = await ProjectService.getAllProjects(userEmail);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string; 
      const result = await ProjectService.getProjectById(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const result = await ProjectService.deleteProject(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};