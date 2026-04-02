import type { VideoScript } from "@/src/types/pipeline";

export interface ProjectState {
  prompt: string;
  script: VideoScript | null;
  imagePaths: string[];
  audioPath: string | null;
}

const KEY = "cinemai_project";

const EMPTY: ProjectState = {
  prompt: "",
  script: null,
  imagePaths: [],
  audioPath: null,
};

export function loadProject(): ProjectState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProjectState) : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function saveProject(data: Partial<ProjectState>): void {
  const current = loadProject();
  localStorage.setItem(KEY, JSON.stringify({ ...current, ...data }));
}

export function clearProject(): void {
  localStorage.removeItem(KEY);
}
