export const API_CONFIG = {
  // MDN API settings
  MDN_API_BASE: 'https://developer.mozilla.org/api/v1',
  MDN_TIMEOUT: 5000,
  
  // GitHub API settings
  GITHUB_API_BASE: 'https://api.github.com',
  GITHUB_TIMEOUT: 5000,
  // Add your GitHub token here for higher rate limits
  GITHUB_TOKEN: process.env.REACT_APP_GITHUB_TOKEN || '',
  
  // Chromium API settings
  CHROMIUM_BUGS_API: 'https://bugs.chromium.org/rest-api/v1',
  CHROMIUM_TIMEOUT: 5000,
  
  // Web scraping settings
  SCRAPING_TIMEOUT: 10000,
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  
  // Rate limiting
  RATE_LIMIT_DELAY: 1000, // 1 second between requests
  
  // Fallback settings
  USE_WEB_SCRAPING: true,
  USE_MOCK_DATA: true,
  
  // Search settings
  MAX_SEARCH_RESULTS: 5,
  SEARCH_TIMEOUT: 5000
};

export const API_ENDPOINTS = {
  MDN_SEARCH: `${API_CONFIG.MDN_API_BASE}/search`,
  MDN_DOCUMENTS: `${API_CONFIG.MDN_API_BASE}/documents`,
  GITHUB_SEARCH_REPOS: `${API_CONFIG.GITHUB_API_BASE}/search/repositories`,
  GITHUB_SEARCH_ISSUES: `${API_CONFIG.GITHUB_API_BASE}/search/issues`,
  CHROMIUM_BUGS: `${API_CONFIG.CHROMIUM_BUGS_API}/bugs`
};

export const getGitHubHeaders = () => {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json'
  };
  
  if (API_CONFIG.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${API_CONFIG.GITHUB_TOKEN}`;
  }
  
  return headers;
}; 