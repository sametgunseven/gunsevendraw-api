import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';
import type { AuthenticatedUser } from '../security/projectAccess';

const currentUser = (req: Request): AuthenticatedUser => {
  if (!req.authenticatedUser) throw new Error('Kimlik doğrulanmadı');
  return req.authenticatedUser;
};

const handleError = (res: Response, error: unknown) => {
  const message = error instanceof Error ? error.message : '';
  if (message === 'PROJECT_NOT_FOUND') {
    res.status(404).json({ success: false, error: 'Proje bulunamadı.' });
  } else {
    console.error('Project request failed:', error);
    res.status(500).json({ success: false, error: 'İşlem gerçekleştirilemedi.' });
  }
};

export const ProjectController = {
  async save(req: Request, res: Response) {
    try {
      const result = await ProjectService.saveProject(req.body, currentUser(req));
      res.status(201).json({ success: true, message: 'Proje başarıyla kaydedildi!', data: result.project });
    } catch (error) { handleError(res, error); }
  },

  async getAll(req: Request, res: Response) {
    try {
      res.status(200).json(await ProjectService.getAllProjects(currentUser(req)));
    } catch (error) { handleError(res, error); }
  },

  async getById(req: Request, res: Response) {
    try {
      res.status(200).json(await ProjectService.getProjectById(req.params.id as string, currentUser(req)));
    } catch (error) { handleError(res, error); }
  },

  async delete(req: Request, res: Response) {
    try {
      res.status(200).json(await ProjectService.deleteProject(req.params.id as string, currentUser(req)));
    } catch (error) { handleError(res, error); }
  }
};
