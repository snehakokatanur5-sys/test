import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Copy, 
  Check, 
  Code, 
  Eye, 
  Download, 
  Edit3, 
  AlertCircle,
  Maximize2
} from 'lucide-react';

interface MermaidViewerProps {
  chart: string;
  onChartChange?: (newChart: string) => void;
  rawFlowchartSegment?: string;
}

export default function MermaidViewer({ chart, onChartChange, rawFlowchartSegment }: MermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'visual' | 'code' | 'split'>('visual');
  const [editableCode, setEditableCode] = useState<string>(chart);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    setEditableCode(chart);
  }, [chart]);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis',
      },
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      if (!editableCode.trim()) {
        setSvgHtml('');
        return;
      }

      setRenderError(null);
      const uniqueId = `mermaid-graph-${Math.random().toString(36).substring(2, 9)}`;

      try {
        // Clean markdown backticks if accidentally inserted
        let sanitized = editableCode.trim();
        sanitized = sanitized.replace(/^```mermaid\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
        if (!sanitized.startsWith('graph ') && !sanitized.startsWith('flowchart ')) {
          sanitized = 'graph TD\n' + sanitized;
        }

        const { svg } = await mermaid.render(uniqueId, sanitized);
        if (isMounted) {
          setSvgHtml(svg);
        }
      } catch (err: any) {
        console.warn('Mermaid rendering issue:', err);
        if (isMounted) {
          setRenderError(err?.message || 'Syntax error in Mermaid flowchart definition.');
        }
      }
    };

    const timeout = setTimeout(renderChart, 150);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [editableCode]);

  const handleCopyCode = async (textToCopy?: string) => {
    const text = textToCopy || rawFlowchartSegment || `[FLOWCHART]\n${editableCode}`;
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgHtml) return;
    const blob = new Blob([svgHtml], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `architecture-flowchart-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCodeChange = (newVal: string) => {
    setEditableCode(newVal);
    if (onChartChange) {
      onChartChange(newVal);
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl flex flex-col' : 'w-full'
    }`}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            Mermaid.js Flowchart (graph TD)
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Components • Data Inputs • Model Layers • Data Outputs
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium text-slate-700 mr-2">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${
                viewMode === 'visual' ? 'bg-white shadow-xs text-indigo-700 font-semibold' : 'hover:text-slate-900'
              }`}
              title="Visual Diagram"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Diagram</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${
                viewMode === 'split' ? 'bg-white shadow-xs text-indigo-700 font-semibold' : 'hover:text-slate-900'
              }`}
              title="Split View (Editor + Diagram)"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${
                viewMode === 'code' ? 'bg-white shadow-xs text-indigo-700 font-semibold' : 'hover:text-slate-900'
              }`}
              title="Raw Mermaid Code & [FLOWCHART]"
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Code</span>
            </button>
          </div>

          {/* Zoom controls for visual mode */}
          {viewMode !== 'code' && (
            <div className="flex items-center border border-slate-200 rounded-lg bg-white p-0.5 mr-1">
              <button
                onClick={() => setZoom(z => Math.max(0.4, z - 0.15))}
                className="p-1 hover:bg-slate-100 rounded text-slate-600 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-1.5 text-slate-600 min-w-10 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(2.5, z + 0.15))}
                className="p-1 hover:bg-slate-100 rounded text-slate-600 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1 hover:bg-slate-100 rounded text-slate-500 transition ml-0.5"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Download SVG */}
          <button
            onClick={handleDownloadSvg}
            disabled={!svgHtml}
            className="p-1.5 hover:bg-slate-200/70 text-slate-700 rounded-lg transition disabled:opacity-40"
            title="Download SVG Vector Diagram"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Copy Mermaid Code */}
          <button
            onClick={() => handleCopyCode()}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
            title="Copy [FLOWCHART] text segment"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-slate-200/70 text-slate-700 rounded-lg transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`relative flex-1 bg-slate-50/50 min-h-[420px] ${
        viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200' : ''
      }`}>
        {/* Editor (Split or Code mode) */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <div className="flex flex-col h-full bg-slate-900 text-slate-100">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800 text-xs text-slate-400">
              <span className="font-mono">Output Segment: [FLOWCHART]</span>
              <span className="text-[11px] text-slate-500">Edit below to live-update the diagram</span>
            </div>
            <div className="relative flex-1 p-3">
              <textarea
                value={editableCode}
                onChange={e => handleCodeChange(e.target.value)}
                spellCheck={false}
                rows={viewMode === 'code' ? 18 : 12}
                className="w-full h-full font-mono text-xs bg-transparent text-emerald-400 focus:outline-hidden resize-none leading-relaxed p-1"
                placeholder="graph TD&#10;  Input[Data Input] --> Layer[Model Layer]&#10;  Layer --> Output[Output]"
              />
            </div>
            <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Mermaid.js Flowchart syntax</span>
              <button
                onClick={() => handleCopyCode(editableCode)}
                className="text-indigo-400 hover:text-indigo-300"
              >
                Copy Raw Code
              </button>
            </div>
          </div>
        )}

        {/* Visual Graph View (Visual or Split mode) */}
        {(viewMode === 'visual' || viewMode === 'split') && (
          <div className="relative flex-1 overflow-auto p-6 flex items-center justify-center min-h-[420px] bg-radial from-slate-50 to-slate-100/80">
            {renderError ? (
              <div className="max-w-md p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 font-semibold text-rose-700">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Mermaid Syntax Warning</span>
                </div>
                <p className="text-xs text-rose-700 font-mono bg-white p-2.5 rounded border border-rose-200 overflow-x-auto">
                  {renderError}
                </p>
                <div className="text-xs text-slate-600">
                  Tip: Switch to the <strong>Split</strong> or <strong>Code</strong> tab to adjust node labels or edge syntax.
                </div>
              </div>
            ) : svgHtml ? (
              <div
                ref={containerRef}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="mermaid-svg-wrapper flex items-center justify-center select-none"
                dangerouslySetInnerHTML={{ __html: svgHtml }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Rendering system architecture diagram...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
            Data Inputs
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block"></span>
            Model Layers & Blocks
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
            Outputs & Predictions
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          Clean syntax graph TD • Spec compliant
        </div>
      </div>
    </div>
  );
}
