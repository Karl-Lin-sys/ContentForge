import { Loader2, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { Platform, PostData } from '../types';
import { useState } from 'react';

interface PostCardProps {
  platform: Platform;
  data: PostData;
  onGenerateImage: () => void;
}

const PLATFORM_CONFIG = {
  linkedin: {
    name: 'LinkedIn',
    color: 'bg-[#0A66C2]',
    textColor: 'text-[#0A66C2]',
    icon: (
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  twitter: {
    name: 'Twitter / X',
    color: 'bg-black',
    textColor: 'text-black',
    icon: (
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  instagram: {
    name: 'Instagram',
    color: 'bg-gradient-to-tr from-[#FFDC80] via-[#F56040] to-[#C13584]',
    textColor: 'text-[#E1306C]',
    icon: (
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    )
  }
};

export function PostCard({ platform, data, onGenerateImage }: PostCardProps) {
  const config = PLATFORM_CONFIG[platform];
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color}`}>
            {config.icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{config.name}</h3>
            <p className="text-xs text-slate-500 capitalize">{platform} Post</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          title="Copy text"
        >
          {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text Content */}
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-800 whitespace-pre-wrap leading-relaxed border border-slate-100">
            {data.text}
          </div>
        </div>

        {/* Image Content */}
        <div className="space-y-4 flex flex-col">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Image Generation Prompt
          </div>
          <p className="text-sm text-slate-600 italic">
            "{data.imagePrompt}"
          </p>
          
          <div className="flex-1 mt-4">
            {data.imageUrl ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group">
                <img 
                  src={data.imageUrl} 
                  alt="Generated content" 
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a 
                    href={data.imageUrl} 
                    download={`${platform}-image.png`}
                    className="px-4 py-2 bg-white text-slate-900 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors"
                    target="_blank" 
                    rel="noreferrer"
                  >
                    Open Image
                  </a>
                </div>
              </div>
            ) : (
              <button
                onClick={onGenerateImage}
                disabled={data.isGeneratingImage}
                className={`w-full h-48 md:h-full min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-colors ${
                  data.isGeneratingImage 
                    ? 'border-indigo-300 bg-indigo-50' 
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                }`}
              >
                {data.isGeneratingImage ? (
                  <>
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    <span className="text-sm font-medium text-indigo-700">Generating Image...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">Generate Image for {config.name}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
