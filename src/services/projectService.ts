import prisma from '../config/db';
import {
  canAccessProject,
  projectAccessWhere,
  type AuthenticatedUser,
} from '../security/projectAccess';

const findAuthorizedProject = async (id: string, user: AuthenticatedUser) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || !canAccessProject(user, project)) {
    throw new Error('PROJECT_NOT_FOUND');
  }
  return project;
};

export const ProjectService = {
  async saveProject(payload: any, user: AuthenticatedUser) {
    const data = payload?.projectData;
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('INVALID_PROJECT_DATA');
    }

    const project = await prisma.project.create({
      data: {
        projectName: String(data.projectName || 'İsimsiz Proje'),
        customerName: String(data.customerName || ''),
        parcelInfo: String(data.parcelInfo || ''),
        projectDate: String(data.projectDate || ''),
        projectData: JSON.stringify(data),
        userId: user.id,
        userEmail: user.email || 'bilinmiyor',
      },
    });
    return { success: true, project };
  },

  async getAllProjects(user: AuthenticatedUser) {
    const projects = await prisma.project.findMany({
      where: projectAccessWhere(user),
      select: {
        id: true,
        projectName: true,
        customerName: true,
        projectDate: true,
        userEmail: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, projects };
  },

  async getProjectById(id: string, user: AuthenticatedUser) {
    const project = await findAuthorizedProject(id, user);
    return { success: true, projectData: JSON.parse(project.projectData) };
  },

  async deleteProject(id: string, user: AuthenticatedUser) {
    await findAuthorizedProject(id, user);
    // Recheck authorization in the actual DELETE query to avoid an access TOCTOU gap.
    const result = await prisma.project.deleteMany({
      where: { id, ...projectAccessWhere(user) },
    });
    if (result.count === 0) throw new Error('PROJECT_NOT_FOUND');
    return { success: true, message: 'Proje başarıyla silindi!' };
  },
};
