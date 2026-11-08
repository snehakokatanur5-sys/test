import { useState } from 'react';
import { StudentOpportunity } from '../types';
import { 
  GraduationCap, 
  Cpu, 
  Gauge, 
  Layers, 
  Terminal, 
  FileText, 
  Copy, 
  Check, 
  ChevronRight,
  Code2,
  Calendar,
  Sparkles
} from 'lucide-react';

interface StudentOpportunitiesProps {
  opportunities: StudentOpportunity[];
  paperTitle: string;
  onOpenStarterKit: (opp: StudentOpportunity) => void;
}

export default function StudentOpportunities({ 
  opportunities, 
  paperTitle,
  onOpenStarterKit 
}: StudentOpportunitiesProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyResumeBullet = async (opp: StudentOpportunity) => {
    await navigator.clipboard.writeText(opp.resumeBullet);
    setCopiedId(opp.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-linear-to-r from-slate-50 to-violet-50/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600/10 text-violet-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm md:text-base flex items-center gap-2">
              Future Work & Internship Opportunities
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                3rd-Year CS Student Focus
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              3 realistic research extensions engineered for undergraduate portfolios and internship interviews.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Resume-ready metrics & code scaffolds</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {opportunities.map((opp, idx) => (
          <div 
            key={opp.id || idx}
            className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/30 hover:bg-white hover:border-violet-300 hover:shadow-md transition-all duration-200 p-5 group"
          >
            <div className="space-y-4">
              {/* Card Badge & Title */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-2 py-0.5 rounded-md">
                  Idea #{idx + 1}
                </span>
                {opp.difficulty && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    opp.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                    opp.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {opp.difficulty}
                  </span>
                )}
              </div>

              <h4 className="font-bold text-slate-900 text-sm md:text-base leading-snug group-hover:text-violet-700 transition-colors">
                {opp.title}
              </h4>

              {/* Exact Extension */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Layers className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  <span>The Exact Extension</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-slate-200/70">
                  {opp.extension}
                </p>
              </div>

              {/* Targeted Performance Metric */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Gauge className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Targeted Performance Metric</span>
                </div>
                <div className="text-xs font-medium text-emerald-800 bg-emerald-50/80 px-2.5 py-2 rounded-lg border border-emerald-200/60 leading-relaxed">
                  {opp.targetMetric}
                </div>
              </div>

              {/* Recommended Tech Stack */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Cpu className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Recommended Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {opp.techStack && opp.techStack.map((tech, tIdx) => (
                    <span 
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-800 font-mono text-[11px] font-semibold border border-slate-300/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume Bullet Point */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>Resume Bullet Formulation</span>
                  </span>
                  <button
                    onClick={() => handleCopyResumeBullet(opp)}
                    className="text-[11px] font-medium text-violet-600 hover:text-violet-800 flex items-center gap-1 transition"
                    title="Copy bullet point to clipboard"
                  >
                    {copiedId === opp.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-[11px] text-slate-700 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60 italic leading-relaxed">
                  "{opp.resumeBullet}"
                </div>
              </div>

              {/* Implementation Roadmap */}
              {opp.implementationPlan && (
                <div className="text-[11px] text-slate-500 pt-1 flex items-start gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{opp.implementationPlan}</span>
                </div>
              )}
            </div>

            {/* Bottom Starter Kit Action */}
            <div className="mt-5 pt-3 border-t border-slate-200/70">
              <button
                onClick={() => onOpenStarterKit(opp)}
                className="w-full py-2 px-3 rounded-lg bg-violet-50 hover:bg-violet-600 text-violet-700 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs group/btn"
              >
                <Code2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                <span>Generate Python Starter Kit</span>
                <ChevronRight className="w-3 h-3 ml-auto text-violet-400 group-hover/btn:text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
