
export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

export enum PromptMode {
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Structured = 'structured' // Used for prompts generated from the 5-field input
}

export interface GeneratedPrompt {
  id: string;
  english: string;
  vietnamese: string;
  mode: PromptMode;
  timestamp: number;
  originalInput?: string; // For structured text mode, this holds the combined user input.
  fileInfo?: { // For image/video modes
    name: string;
    type: string;
  };
  userHint?: string; // Optional user hint for media-based generation
}

export interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// For Gemini API response structure (simplified)
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  // Other types of chunks can be added here
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // Other grounding metadata fields can be added
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
  // Other candidate fields
}

export interface GenerateContentResponsePart {
  text?: string;
  // Potentially other parts for different mimeTypes
}
