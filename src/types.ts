export interface PaperMetadata {
  title: string;
  authors: string[];
  yearOrVenue: string;
  url: string;
  arxivId?: string;
  pdfUrl?: string;
}

export interface CoreConcept {
  problemStatement: string;
  primaryMethodology: string;
  keyBreakthroughs: string;
  wordCount?: number;
}

export interface StudentOpportunity {
  id: number;
  title: string;
  extension: string;
  targetMetric: string;
  techStack: string[];
  implementationPlan: string;
  resumeBullet: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedWeeks?: number;
}

export interface OpenSourceRepo {
  name: string;
  description: string;
  searchQuery: string;
  url?: string;
}

export interface PaperAnalysisData {
  paper: PaperMetadata;
  coreConcept: CoreConcept;
  mermaidFlowchart: string;
  studentOpportunities: StudentOpportunity[];
  openSourceRepos?: OpenSourceRepo[];
}

export interface TokenStats {
  promptTokens: number;
  candidateTokens: number;
  totalTokens: number;
  budgetLimit: number;
  efficiencyPercent: number;
}

export interface SearchSource {
  title: string;
  uri: string;
}

export interface AnalysisResponse {
  success: boolean;
  data: PaperAnalysisData;
  tokenStats: TokenStats;
  sources: SearchSource[];
  rawFlowchart: string;
}

export interface StarterKit {
  pythonScaffold: string;
  testHarness: string;
  readmeMarkdown: string;
}
