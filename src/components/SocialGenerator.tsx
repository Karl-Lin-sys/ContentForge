import { useState } from 'react';
import { Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { GenerationResult, Platform, PostData } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { PostCard } from './PostCard';

const TONES = [
  { id: 'professional', label: 'Professional & Insightful', icon: '💼' },
  { id: 'witty', label: 'Witty & Engaging', icon: '😄' },
  { id: 'urgent', label: 'Urgent & Action-Oriented', icon: '⚡' },
];

const IMAGE_SIZES = ['1K', '2K', '4K'];
const ASPECT_RATIOS = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'];

export function SocialGenerator() {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState(TONES[0].id);
  const [imageSize, setImageSize] = useState('1K');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateText = async () => {
    if (!idea.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, tone }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate posts');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async (platform: Platform, prompt: string) => {
    if (!result) return;
    
    setResult((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [platform]: { ...prev[platform], isGeneratingImage: true, imageUrl: undefined }
      };
    });

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio, imageSize }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      
      setResult((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [platform]: { ...prev[platform], isGeneratingImage: false, imageUrl: data.imageUrl }
        };
      });
    } catch (err) {
      console.error(err);
      setResult((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [platform]: { ...prev[platform], isGeneratingImage: false }
        };
      });
      // Optionally show a toast here in a real app
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Content Brief
          </h2>
          
          <div className="space-y-5">
            <div>
              <label htmlFor="idea" className="block text-sm font-medium text-slate-700 mb-1">
                What's your idea?
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g., Just launched a new feature that helps teams collaborate in real-time..."
                className="w-full h-32 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Desired Tone
              </label>
              <div className="space-y-2">
                {TONES.map((t) => (
                  <label
                    key={t.id}
                    className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${
                      tone === t.id 
                        ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={t.id}
                      checked={tone === t.id}
                      onChange={(e) => setTone(e.target.value)}
                      className="sr-only"
                    />
                    <span className="mr-3 text-xl">{t.icon}</span>
                    <span className={`text-sm font-medium ${tone === t.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {t.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Image Settings
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Resolution</label>
                  <select 
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {IMAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Aspect Ratio</label>
                  <select 
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {ASPECT_RATIOS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateText}
              disabled={!idea.trim() || isGenerating}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm shadow-indigo-200 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Crafting Posts...
                </>
              ) : (
                'Generate Posts'
              )}
            </button>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          {!result && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-100/50 rounded-2xl border border-slate-200 border-dashed"
            >
              <div className="w-16 h-16 mb-4 rounded-full bg-slate-200/50 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-center max-w-sm">
                Enter your idea and select a tone to generate drafted posts for LinkedIn, Twitter, and Instagram.
              </p>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full min-h-[400px] flex flex-col items-center justify-center"
            >
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-600 font-medium">Summoning Gemini...</p>
            </motion.div>
          )}

          {result && !isGenerating && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <PostCard 
                platform="linkedin"
                data={result.linkedin}
                onGenerateImage={() => generateImage('linkedin', result.linkedin.imagePrompt)}
              />
              <PostCard 
                platform="twitter"
                data={result.twitter}
                onGenerateImage={() => generateImage('twitter', result.twitter.imagePrompt)}
              />
              <PostCard 
                platform="instagram"
                data={result.instagram}
                onGenerateImage={() => generateImage('instagram', result.instagram.imagePrompt)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
