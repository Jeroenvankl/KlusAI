import { create } from 'zustand';

interface ProjectState {
  activeProjectId: number | null;
  projects: any[];
  rooms: any[];
  setActiveProject: (id: number) => void;
  setProjects: (projects: any[]) => void;
  setRooms: (rooms: any[]) => void;
  addRoom: (room: any) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  activeProjectId: 1,
  projects: [],
  rooms: [],
  setActiveProject: (id) => set({ activeProjectId: id }),
  setProjects: (projects) => set({ projects }),
  setRooms: (rooms) => set({ rooms }),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
}));
