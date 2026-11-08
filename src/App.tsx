import { useState, useEffect } from 'react';
import Header from './components/Header';
import PaperInput from './components/PaperInput';
import CoreConceptView from './components/CoreConceptView';
import MermaidViewer from './components/MermaidViewer';
import StudentOpportunities from './components/StudentOpportunities';
import StarterKitModal from './components/StarterKitModal';
import ExportDossierModal from './components/ExportDossierModal';
import { 
  PaperAnalysisData, 
  TokenStats, 
  StudentOpportunity, 
  SearchSource 
} from './types';
import { PRESET_PAPERS } from './data/samplePapers';
import { 
  FileText, 
  ExternalLink, 
  Share2, 
  Download, 
  Github, 
  BookMarked, 
  Sparkles, 
  AlertCircle, 
  Zap, 
  Layers, 
  GraduationCap, 
  CheckCircle,
  Copy,
  Check,
  Code
} from 'lucide-react';

export default function App() {
  const [currentUrl, setCurrentUrl] = useState<string>('https://arxiv.org/abs/2312.00752');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(1);
  const [analysisData, setAnalysisData] = useState<PaperAnalysisData | null>(null);
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const [sources, setSources] = useState<SearchSource[]>([]);
  const [rawFlowchartSegment, setRawFlowchartSegment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [selectedOpportunity, setSelectedOpportunity] = useState<StudentOpportunity | null>(null);
  const [isStarterKitOpen, setIsStarterKitOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [copiedBibtex, setCopiedBibtex] = useState<boolean>(false);

  // Active view tab for deep dive
  const [activeTab, setActiveTab] = useState<'all' | 'concept' | 'architecture' | 'opportunities'>('all');

  // Handle Paper Analysis request
  const handleAnalyze = async (url: string, title?: string, studentContext?: string) => {
    setCurrentUrl(url);
    setLoading(true);
    setError(null);
    setLoadingStep(1);

    // Simulate agent task phases for UX feedback
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          paperTitle: title,
          customContext: studentContext,
        }),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with ${res.status}`);
      }

      const responseJson = await res.json();
      if (!responseJson.success || !responseJson.data) {
        throw new Error('Analysis returned invalid schema.');
      }

      setAnalysisData(responseJson.data);
      setTokenStats(responseJson.tokenStats);
      setSources(responseJson.sources || []);
      setRawFlowchartSegment(responseJson.rawFlowchart || '');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to process academic paper.');
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  // Initial load: automatically analyze the first preset (Mamba SSM) on mount if none loaded
  useEffect(() => {
    handleAnalyze('https://arxiv.org/abs/2312.00752', 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces');
  }, []);

  const handleCopyBibtex = async () => {
    if (!analysisData) return;
    const key = (analysisData.paper.authors?.[0]?.split(' ').pop() || 'author') + (analysisData.paper.yearOrVenue?.match(/\d{4}/)?.[0] || '2024');
    const bibtex = `@article{${key.toLowerCase()},
  title={${analysisData.paper.title}},
  author={${analysisData.paper.authors?.join(' and ') || 'Unknown'}},
  journal={${analysisData.paper.yearOrVenue || 'arXiv preprint'}},
  year={${analysisData.paper.yearOrVenue?.match(/\d{4}/)?.[0] || '2024'}},
  url={${analysisData.paper.url || ''}}
}`;
    await navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const handleOpenStarterKit = (opp: StudentOpportunity) => {
    setSelectedOpportunity(opp);
    setIsStarterKitOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Header tokenStats={tokenStats} loading={loading} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Paper Input Module */}
        <PaperInput 
          onAnalyze={handleAnalyze} 
          loading={loading} 
          currentUrl={currentUrl} 
        />

        {/* Loading Progress State */}
        {loading && (
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-md p-8 flex flex-col items-center justify-center space-y-5 animate-in fade-in">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
              </div>
            </div>

            <div className="text-center space-y-1.5 max-w-md">
              <h3 className="font-bold text-slate-900 text-base">
                Computer Science Research Agent Working
              </h3>
              <p className="text-xs text-slate-500">
                Operating strictly under token efficiency directives (&lt;25k tokens).
              </p>
            </div>

            {/* Stepper */}
            <div className="w-full max-w-lg grid grid-cols-4 gap-2 pt-2">
              <div className={`p-2 rounded-lg text-center text-xs transition ${
                loadingStep >= 1 ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200' : 'bg-slate-50 text-slate-400'
              }`}>
                1. Ingest ArXiv
              </div>
              <div className={`p-2 rounded-lg text-center text-xs transition ${
                loadingStep >= 2 ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200' : 'bg-slate-50 text-slate-400'
              }`}>
                2. Core Extract
              </div>
              <div className={`p-2 rounded-lg text-center text-xs transition ${
                loadingStep >= 3 ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200' : 'bg-slate-50 text-slate-400'
              }`}>
                3. Flowchart
              </div>
              <div className={`p-2 rounded-lg text-center text-xs transition ${
                loadingStep >= 4 ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200' : 'bg-slate-50 text-slate-400'
              }`}>
                4. CS Projects
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm">
              <span className="font-bold">Analysis Notice: </span>
              {error}
              <div className="mt-1 text-xs text-rose-700">
                Try selecting one of the landmark preset papers above or ensure the URL/title is accessible.
              </div>
            </div>
          </div>
        )}

        {/* Results View */}
        {analysisData && !loading && (
          <div className="space-y-6">
            {/* Paper Overview Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-100 text-indigo-700">
                      {analysisData.paper.yearOrVenue || 'Research Publication'}
                    </span>
                    {analysisData.paper.arxivId && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                        arXiv:{analysisData.paper.arxivId}
                      </span>
                    )}
                    {tokenStats && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        <span>{tokenStats.totalTokens.toLocaleString()} tokens (&lt;25k budget)</span>
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                    {analysisData.paper.title}
                  </h2>

                  <p className="text-xs md:text-sm text-slate-600">
                    <span className="font-semibold text-slate-700">Authors:</span>{' '}
                    {analysisData.paper.authors?.join(', ') || 'Academic Researchers'}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {analysisData.paper.arxivId && (
                    <a
                      href={`https://arxiv.org/abs/${analysisData.paper.arxivId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>ArXiv Abs</span>
                    </a>
                  )}
                  {analysisData.paper.arxivId && (
                    <a
                      href={`https://arxiv.org/pdf/${analysisData.paper.arxivId}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-600" />
                      <span>PDF</span>
                    </a>
                  )}
                  <button
                    onClick={handleCopyBibtex}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBibtex ? 'BibTeX Copied' : 'BibTeX'}</span>
                  </button>
                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Dossier</span>
                  </button>
                </div>
              </div>

              {/* Web Grounding Sources (if used for efficiency) */}
              {sources && sources.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Web Search Grounding:</span>
                  {sources.slice(0, 4).map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 text-indigo-700 truncate max-w-[200px] border border-slate-200 text-[11px]"
                    >
                      {source.title || source.uri}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* View Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                Complete Analysis Dossier
              </button>
              <button
                onClick={() => setActiveTab('concept')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'concept'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                1. Core Concepts (&lt;300 Words)
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'architecture'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                2. Architectural Flowchart (Mermaid)
              </button>
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'opportunities'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                3. Student Opportunities (Resume Projects)
              </button>
            </div>

            {/* Section 1: CORE CONCEPT EXTRACTION */}
            {(activeTab === 'all' || activeTab === 'concept') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Step 1: Core Concept Extraction
                  </h3>
                </div>
                <CoreConceptView 
                  concept={analysisData.coreConcept} 
                  paperTitle={analysisData.paper.title} 
                />
              </div>
            )}

            {/* Section 2: ARCHITECTURAL FLOWCHART (Mermaid.js) */}
            {(activeTab === 'all' || activeTab === 'architecture') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Step 2: Architectural Flowchart (Mermaid.js)
                  </h3>
                </div>
                <MermaidViewer 
                  chart={analysisData.mermaidFlowchart} 
                  onChartChange={(newChart) => {
                    setAnalysisData((prev) => prev ? { ...prev, mermaidFlowchart: newChart } : null);
                  }}
                  rawFlowchartSegment={rawFlowchartSegment}
                />
              </div>
            )}

            {/* Section 3: FUTURE WORK & INTERNSHIP OPPORTUNITIES */}
            {(activeTab === 'all' || activeTab === 'opportunities') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    Step 3: Future Work & Internship Opportunities (3rd-Year CS Student)
                  </h3>
                </div>
                <StudentOpportunities 
                  opportunities={analysisData.studentOpportunities} 
                  paperTitle={analysisData.paper.title}
                  onOpenStarterKit={handleOpenStarterKit}
                />
              </div>
            )}

            {/* Open Source Grounding & Implementation Links */}
            {analysisData.openSourceRepos && analysisData.openSourceRepos.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Github className="w-4 h-4" />
                  <span>Open-Source Repositories & Implementations</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysisData.openSourceRepos.map((repo, rIdx) => (
                    <a
                      key={rIdx}
                      href={repo.url || `https://github.com/search?q=${encodeURIComponent(repo.searchQuery || repo.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition flex items-start justify-between group"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-900 text-xs group-hover:text-indigo-600 flex items-center gap-1">
                          <span>{repo.name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {repo.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Starter Kit Code Generation Modal */}
      <StarterKitModal
        isOpen={isStarterKitOpen}
        onClose={() => setIsStarterKitOpen(false)}
        opportunity={selectedOpportunity}
        paperTitle={analysisData?.paper.title || ''}
      />

      {/* Export Dossier Modal */}
      {analysisData && (
        <ExportDossierModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          data={analysisData}
          tokenStats={tokenStats || undefined}
        />
      )}
    </div>
  );
}
