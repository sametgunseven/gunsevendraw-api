import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';

export const ProjectController = {
  // POST: Yeni proje kaydet
  async save(req: Request, res: Response) {
    try {
      const projectData = req.body;
      const result = await ProjectService.saveProject(projectData);
      res.status(201).json({ success: true, message: "Proje başarıyla kaydedildi!", data: result.project });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET: Projeleri listele
  async getAll(req: Request, res: Response) {
    try {
      const result = await ProjectService.getAllProjects();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET: Tekil proje detayını getir
  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string; 
      
      const result = await ProjectService.getProjectById(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  // DELETE: Projeyi sil
  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const result = await ProjectService.deleteProject(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };