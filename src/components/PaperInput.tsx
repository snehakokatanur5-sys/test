import { useState } from 'react';
import { PRESET_PAPERS, PresetPaper } from '../data/samplePapers';
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  Link as LinkIcon, 
  Sliders, 
  Loader2, 
  FileText,
  BookmarkCheck
} from 'lucide-react';

interface PaperInputProps {
  onAnalyze: (url: string, title?: string, studentContext?: string) => void;
  loading: boolean;
  currentUrl: string;
}

export default function PaperInput({ onAnalyze, loading, currentUrl }: PaperInputProps) {
  const [inputUrl, setInputUrl] = useState<string>(currentUrl || '');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [studentContext, setStudentContext] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || loading) return;
    onAnalyze(inputUrl.trim(), undefined, studentContext.trim() || undefined);
  };

  const handleSelectPreset = (preset: PresetPaper) => {
    setSelectedPreset(preset.id);
    setInputUrl(preset.url);
    onAnalyze(preset.url, preset.title, studentContext.trim() || undefined);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 md:p-6 space-y-5">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="paper-url" className="text-xs md:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4 text-indigo-600" />
            <span>Research Paper URL or ArXiv Reference</span>
          </label>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Accepts: arxiv.org/abs/*, OpenReview, PDF links, or Paper Title
          </span>
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="paper-url"
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="e.g., https://arxiv.org/abs/2312.00752 or https://arxiv.org/abs/1706.03762"
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs md:text-sm text-slate-900 placeholder:text-slate-400 transition bg-slate-50/50 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={!inputUrl.trim() || loading}
            className="px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Parsing Architecture...</span>
              </>
            ) : (
              <>
                <span>Extract Architecture</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Advanced student personalization toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1.5 transition"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide Student Customization' : '+ Personalize for my Student Hardware / Course (Optional)'}</span>
        </button>

        {showAdvanced && (
          <div className="mt-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 animate-in fade-in duration-150">
            <label className="block text-slate-700 font-medium">
              Student Hardware & Interests (Optional Context for Idea Generation):
            </label>
            <input
              type="text"
              value={studentContext}
              onChange={(e) => setStudentContext(e.target.value)}
              placeholder="e.g. Single RTX 3060 12GB; Interested in Edge Robotics; Taking Operating Systems / Distributed Systems"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 placeholder:text-slate-400 focus:outline-indigo-500"
            />
            <p className="text-[11px] text-slate-500">
              The agent will adapt the 3 project extensions and recommended tech stack to fit your constraints.
            </p>
          </div>
        )}
      </div>

      {/* 1-Click Preset Papers */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <BookmarkCheck className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">
            Or test instantly with landmark CS research papers:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_PAPERS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              disabled={loading}
              className={`text-left px-3 py-1.5 rounded-lg border text-xs transition flex items-center gap-2 ${
                selectedPreset === preset.id && inputUrl === preset.url
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-semibold'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-slate-100 text-slate-700'
              } disabled:opacity-50`}
            >
              <FileText className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="font-medium truncate max-w-[200px] sm:max-w-none">{preset.title}</span>
              <span className="text-[10px] text-slate-400 font-mono hidden md:inline">({preset.venue})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
