export interface APIInfo {
  name: string;
  description: string;
  mdnUrl: string;
  browserSupport: BrowserSupport;
  explainer?: ExplainerInfo;
  githubIssues?: GitHubIssue[];
  chromiumBugs?: ChromiumBug[];
  chromiumStatus: ChromiumStatus;
  futurePrediction: string;
}

export interface BrowserSupport {
  chrome: SupportStatus;
  firefox: SupportStatus;
  safari: SupportStatus;
  edge: SupportStatus;
}

export interface SupportStatus {
  version: string;
  status: 'supported' | 'partial' | 'not-supported' | 'unknown';
  notes?: string;
}

export interface ExplainerInfo {
  title: string;
  description: string;
  url: string;
  author?: string;
  date?: string;
}

export interface GitHubIssue {
  id: number;
  title: string;
  url: string;
  state: 'open' | 'closed';
  createdAt: string;
  author: string;
}

export interface ChromiumBug {
  id: string;
  title: string;
  url: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
  status: string;
  assignee?: string;
}

export interface ChromiumStatus {
  summary: string;
  recentChanges: ChromiumChange[];
}

export interface ChromiumChange {
  commit: string;
  description: string;
  date: string;
  author: string;
}

export interface ExplorationStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  result?: any;
  error?: string;
} 