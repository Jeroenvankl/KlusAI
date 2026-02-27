import { api } from './api';

export const buildPlanService = {
  create: (projectId: number, description: string, roomId?: number, skillLevel?: string) =>
    api.post('/build-plan/create', {
      project_id: projectId,
      description,
      room_id: roomId,
      skill_level: skillLevel || 'beginner',
    }),
};
