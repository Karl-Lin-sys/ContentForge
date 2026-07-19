export type Platform = 'linkedin' | 'twitter' | 'instagram';

export interface PostData {
  text: string;
  imagePrompt: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

export interface GenerationResult {
  linkedin: PostData;
  twitter: PostData;
  instagram: PostData;
}
