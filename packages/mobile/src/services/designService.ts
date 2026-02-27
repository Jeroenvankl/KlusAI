import { api } from './api';

export const designService = {
  suggest: (roomId: number, style: string, budgetMin?: number, budgetMax?: number, preferences?: string[]) =>
    api.post('/design/suggest', {
      room_id: roomId,
      style,
      budget_min: budgetMin,
      budget_max: budgetMax,
      preferences: preferences || [],
    }),

  getStyles: () =>
    api.get('/design/styles'),
};
