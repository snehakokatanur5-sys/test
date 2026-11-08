import { TokenStats } from '../types';
import { 
  Network, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  Zap
} from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  tokenStats: TokenStats | null;
  loading: boolean;
}

export default function Header({ tokenStats, loading }: HeaderProps) {
  const [showConstraintModal, setShowConstraintModal] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-violet-600 to-emerald-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Network className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-base md:text-lg tracking-tight flex items-center gap-1.5">
                <span>CS Research Agent</span>
              </h1>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                v2.5 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Architectural Flowcharts • Core Concepts • 3rd-Year CS Student Resume Projects
            </p>
          </div>
        </div>

        {/* Operational Constraint Monitor: <25,000 Tokens */}
        <div className="flex items-center gap-3">
          {tokenStats ? (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1 justify-end">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
                  Token Budget Efficiency
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {tokenStats.totalTokens.toLocaleString()} / {tokenStats.budgetLimit.toLocaleString()} tokens
                  <span className="text-emerald-600 font-semibold ml-1.5">
                    ({tokenStats.efficiencyPercent}%)
                  </span>
                </span>
              </div>
              <div className="w-10 h-10 relative flex items-center justify-center">
                <svg className="w-8 h-8 transform -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    stroke={tokenStats.efficiencyPercent < 50 ? '#10b981' : '#f59e0b'}
                    strokeWidth="3"
                    strokeDasharray={2 * Math.PI * 12}
                    strokeDashoffset={2 * Math.PI * 12 * (1 - tokenStats.efficiencyPercent / 100)}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-[9px] font-mono font-bold text-slate-700">
                  {tokenStats.efficiencyPercent}%
                </span>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50/70 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Token Limit &lt;25k Enforced</span>
            </div>
          )}

          {/* Operational Constraints Guide Button */}
          <button
            onClick={() => setShowConstraintModal(true)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="View Agent Operational Protocol"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Constraints Modal */}
      {showConstraintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Agent Operational Directives</h3>
              </div>
              <button
                onClick={() => setShowConstraintModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg leading-none"
              >
                &times;
              </button>
            </div>
            
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p className="font-medium text-slate-900">
                This agent strictly operates under the following academic constraints:
              </p>
              <ul className="list-disc pl-4 space-y-2">
                <li>
                  <strong>Token Efficiency:</strong> Total ingestion, tool execution, and analysis remains strictly under <strong>25,000 tokens</strong>.
                </li>
                <li>
                  <strong>Web Search Grounding:</strong> For lengthy or frontier papers, Google Search grounding automatically retrieves abstracts, benchmarks, and GitHub open-source repositories.
                </li>
                <li>
                  <strong>Core Concept Extraction:</strong> Synthesizes Problem Statement, Primary Methodology, and Algorithmic Breakthroughs in <strong>under 300 words</strong> in plain, accessible language.
                </li>
                <li>
                  <strong>Architectural Flowchart:</strong> Produces syntactically verified Mermaid.js <code>graph TD</code> diagrams depicting components, inputs, layers, and outputs labeled <code>[FLOWCHART]</code>.
                </li>
                <li>
                  <strong>Future Work & Internship Opportunities:</strong> Crafts 3 concrete extensions for 3rd-year CS students featuring exact architectural modifications, targeted metrics (e.g. latency/throughput), and tech stacks (PyTorch, ONNX, etc.).
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowConstraintModal(false)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-medium text-xs hover:bg-indigo-700 transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
