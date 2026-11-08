import { useState } from 'react';
import { CoreConcept } from '../types';
import { BookOpen, CheckCircle, Lightbulb, Target, Sparkles, Copy, Check } from 'lucide-react';

interface CoreConceptViewProps {
  concept: CoreConcept;
  paperTitle: string;
}

export default function CoreConceptView({ concept, paperTitle }: CoreConceptViewProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Compute total word count
  const allText = `${concept.problemStatement} ${concept.primaryMethodology} ${concept.keyBreakthroughs}`.trim();
  const wordCount = allText ? allText.split(/\s+/).filter(Boolean).length : 0;
  const isUnder300 = wordCount <= 300;

  const handleCopySection = async (title: string, content: string) => {
    await navigator.clipboard.writeText(`${title}:\n${content}`);
    setCopiedSection(title);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-slate-100 bg-linear-to-r from-slate-50 to-indigo-50/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm md:text-base flex items-center gap-2">
              Core Concept Extraction
              <span className="text-xs font-normal text-slate-500 hidden sm:inline">
                (Accessible Plain-Language Synthesis)
              </span>
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-md">
              {paperTitle}
            </p>
          </div>
        </div>

        {/* Word count compliance badge */}
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 ${
            isUnder300 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isUnder300 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{wordCount} / &lt;300 Words</span>
            {isUnder300 && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
          </div>
        </div>
      </div>

      {/* Grid of 3 key facets */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Problem Statement */}
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4.5 flex flex-col justify-between relative group hover:border-amber-300 transition shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" />
                1. Problem Statement
              </span>
              <button
                onClick={() => handleCopySection('Problem Statement', concept.problemStatement)}
                className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-slate-700 p-1 rounded"
                title="Copy section"
              >
                {copiedSection === 'Problem Statement' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
              {concept.problemStatement}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-200/50 text-[11px] text-amber-700/80 font-medium">
            Bottlenecks & Prior Work Limits
          </div>
        </div>

        {/* 2. Primary Methodology */}
        <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/40 p-4.5 flex flex-col justify-between relative group hover:border-indigo-300 transition shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                2. Primary Methodology
              </span>
              <button
                onClick={() => handleCopySection('Primary Methodology', concept.primaryMethodology)}
                className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-slate-700 p-1 rounded"
                title="Copy section"
              >
                {copiedSection === 'Primary Methodology' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
              {concept.primaryMethodology}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-indigo-200/50 text-[11px] text-indigo-700/80 font-medium">
            Core Architectural Paradigm
          </div>
        </div>

        {/* 3. Mathematical & Algorithmic Breakthroughs */}
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4.5 flex flex-col justify-between relative group hover:border-emerald-300 transition shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                3. Key Breakthroughs
              </span>
              <button
                onClick={() => handleCopySection('Key Breakthroughs', concept.keyBreakthroughs)}
                className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-slate-700 p-1 rounded"
                title="Copy section"
              >
                {copiedSection === 'Key Breakthroughs' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
              {concept.keyBreakthroughs}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-200/50 text-[11px] text-emerald-700/80 font-medium">
            Mathematical & Algorithmic Novelty
          </div>
        </div>
      </div>
    </div>
  );
}
