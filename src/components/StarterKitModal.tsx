import { useState, useEffect } from 'react';
import { StudentOpportunity, StarterKit } from '../types';
import { 
  X, 
  Terminal, 
  FileCode, 
  BookOpen, 
  Copy, 
  Check, 
  Download, 
  Cpu, 
  Gauge, 
  Sparkles, 
  CheckCircle2,
  Loader2 
} from 'lucide-react';

interface StarterKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: StudentOpportunity | null;
  paperTitle: string;
}

export default function StarterKitModal({
  isOpen,
  onClose,
  opportunity,
  paperTitle,
}: StarterKitModalProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'test' | 'readme'>('code');
  const [loading, setLoading] = useState<boolean>(false);
  const [starterKit, setStarterKit] = useState<StarterKit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !opportunity) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setStarterKit(null);

    fetch('/api/generate-starter-kit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paperTitle,
        opportunity,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to generate starter kit');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setStarterKit(data.starterKit);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error generating starter code.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, opportunity, paperTitle]);

  if (!isOpen || !opportunity) return null;

  const currentContent =
    activeTab === 'code'
      ? starterKit?.pythonScaffold || '# Loading Python PyTorch scaffold...'
      : activeTab === 'test'
      ? starterKit?.testHarness || '# Loading benchmark test harness...'
      : starterKit?.readmeMarkdown || '# Loading GitHub README template...';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentContent);
    setCopiedTab(activeTab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleDownload = () => {
    const filename =
      activeTab === 'code'
        ? 'model_extension.py'
        : activeTab === 'test'
        ? 'test_benchmark.py'
        : 'README.md';

    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  Project Starter Kit: {opportunity.title}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">
                  3rd-Year CS Student Scaffold
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-xl">
                Base Paper: {paperTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Context Bar */}
        <div className="px-6 py-3 bg-violet-50/50 border-b border-violet-100 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Gauge className="w-4 h-4 text-emerald-600" />
              <strong className="text-slate-900">Target Metric:</strong> {opportunity.targetMetric}
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Cpu className="w-4 h-4 text-blue-600" />
              <strong className="text-slate-900">Stack:</strong> {opportunity.techStack.join(', ')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-violet-700 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>Colab / Local GPU Ready</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 border-b-2 font-medium text-xs flex items-center gap-2 transition ${
                activeTab === 'code'
                  ? 'border-violet-600 text-violet-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>model_extension.py</span>
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`px-4 py-2 border-b-2 font-medium text-xs flex items-center gap-2 transition ${
                activeTab === 'test'
                  ? 'border-violet-600 text-violet-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>test_benchmark.py</span>
            </button>
            <button
              onClick={() => setActiveTab('readme')}
              className={`px-4 py-2 border-b-2 font-medium text-xs flex items-center gap-2 transition ${
                activeTab === 'readme'
                  ? 'border-violet-600 text-violet-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>README.md (Portfolio)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleCopy}
              disabled={loading || !starterKit}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition disabled:opacity-50"
            >
              {copiedTab === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              disabled={loading || !starterKit}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium transition disabled:opacity-50 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 bg-slate-950 p-4 overflow-auto min-h-[350px] font-mono text-xs">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 py-16">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
              <p className="text-sm font-sans font-medium text-slate-300">
                Generating student implementation starter kit with PyTorch scaffold & test harness...
              </p>
              <p className="text-xs font-sans text-slate-500">
                Tailored for {opportunity.techStack.join(', ')} benchmarks
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 font-sans">
              <p className="font-semibold text-rose-200">Error generating starter kit:</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          ) : (
            <pre className="text-slate-100 leading-relaxed overflow-x-auto whitespace-pre">
              <code>{currentContent}</code>
            </pre>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ready to commit to your GitHub student portfolio</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
