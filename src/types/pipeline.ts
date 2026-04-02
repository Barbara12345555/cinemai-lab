export interface Scene {
  id: string;
  durationInSeconds: number;
  text: string;
  imagePrompt: string;
  imagePath?: string;
  type: "text" | "image" | "image+text";
}

export interface VideoScript {
  title: string;
  totalDurationInSeconds: number;
  style: string;
  scenes: Scene[];
  audioMetadata: AudioMetadata;
}

export interface AudioMetadata {
  genre: string;
  bpm: number;
  mood: string;
  durationInSeconds: number;
  prompt: string;
  filePath?: string;
}

export interface PipelineInput {
  prompt: string;
}

export interface PipelineResult {
  script: VideoScript;
  audioPath?: string;
  imagePaths: string[];
  status: "success" | "partial" | "error";
  error?: string;
}
