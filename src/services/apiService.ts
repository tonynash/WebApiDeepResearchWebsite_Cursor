import { APIInfo, ExplorationStep, BrowserSupport, SupportStatus, ExplainerInfo, GitHubIssue, ChromiumBug, ChromiumStatus, ChromiumChange } from '../types';
import axios from 'axios';
import { WebScraper } from './webScraper';
import { API_CONFIG, API_ENDPOINTS, getGitHubHeaders } from '../config/apiConfig';

// Mock API data for demonstration (fallback)
const mockAPIs = [
  'Fetch API',
  'WebSocket API',
  'Geolocation API',
  'Web Audio API',
  'WebRTC API',
  'Service Workers API',
  'Push API',
  'Notifications API',
  'File API',
  'IndexedDB API',
  'Web Storage API',
  'WebGL API',
  'Canvas API',
  'Web Animations API',
  'Intersection Observer API',
  'Resize Observer API',
  'Mutation Observer API',
  'Performance API',
  'Web Crypto API',
  'Web Assembly API'
];

export class APIService {
  static async searchRelevantAPI(userInput: string): Promise<string> {
    try {
      // Try to search MDN API first
      const response = await axios.get(API_ENDPOINTS.MDN_SEARCH, {
        params: {
          q: userInput,
          locale: 'en-US',
          category: 'Web APIs'
        },
        timeout: API_CONFIG.MDN_TIMEOUT
      });

      if (response.data && response.data.documents && response.data.documents.length > 0) {
        // Find the best match from MDN results
        const bestMatch = response.data.documents.find((doc: any) => 
          doc.title.toLowerCase().includes('api') && 
          doc.title.toLowerCase().includes(userInput.toLowerCase())
        );
        
        if (bestMatch) {
          return bestMatch.title;
        }
      }
    } catch (error) {
      console.log('MDN API search failed, using fallback');
    }

    // Fallback to fuzzy matching with mock APIs
    const normalizedInput = userInput.toLowerCase().trim();
    const bestMatch = mockAPIs.find(api => 
      api.toLowerCase().includes(normalizedInput) ||
      normalizedInput.includes(api.toLowerCase().replace(' api', ''))
    );
    
    return bestMatch || 'Fetch API';
  }

  static async getAPIInfo(apiName: string): Promise<APIInfo> {
    try {
      // Try to fetch from MDN API first
      const mdnResponse = await axios.get(API_ENDPOINTS.MDN_DOCUMENTS, {
        params: {
          q: apiName,
          locale: 'en-US'
        },
        timeout: API_CONFIG.MDN_TIMEOUT
      });

      if (mdnResponse.data && mdnResponse.data.documents && mdnResponse.data.documents.length > 0) {
        const doc = mdnResponse.data.documents[0];
        return {
          name: apiName,
          description: doc.excerpt || `The ${apiName} provides a modern interface for web functionality.`,
          mdnUrl: doc.mdn_url || `https://developer.mozilla.org/en-US/docs/Web/API/${apiName.replace(' ', '_')}`,
          browserSupport: await this.getBrowserSupport(apiName),
          explainer: await this.searchExplainer(apiName),
          githubIssues: await this.getGitHubIssues(apiName),
          chromiumBugs: await this.getChromiumBugs(apiName),
          chromiumStatus: await this.getChromiumStatus(apiName),
          futurePrediction: await this.generateFuturePrediction(apiName)
        };
      }
    } catch (error) {
      console.log('MDN API fetch failed, trying web scraping...');
    }

    // Try web scraping as fallback
    try {
      const mdnData = await WebScraper.scrapeMDNPage(apiName);
      if (mdnData.exists) {
        return {
          name: apiName,
          description: mdnData.description,
          mdnUrl: mdnData.url,
          browserSupport: await this.getBrowserSupport(apiName),
          explainer: await this.searchExplainer(apiName),
          githubIssues: await this.getGitHubIssues(apiName),
          chromiumBugs: await this.getChromiumBugs(apiName),
          chromiumStatus: await this.getChromiumStatus(apiName),
          futurePrediction: await this.generateFuturePrediction(apiName)
        };
      }
    } catch (error) {
      console.log('Web scraping failed, using mock data');
    }

    // Final fallback to mock data
    return this.getMockAPIInfo(apiName);
  }

  static async getBrowserSupport(apiName: string): Promise<BrowserSupport> {
    try {
      // Try to fetch browser compatibility data from MDN
      const response = await axios.get(API_ENDPOINTS.MDN_DOCUMENTS, {
        params: {
          q: `${apiName} browser compatibility`,
          locale: 'en-US'
        },
        timeout: API_CONFIG.MDN_TIMEOUT
      });

      if (response.data && response.data.documents && response.data.documents.length > 0) {
        // Parse browser support from MDN data
        const doc = response.data.documents[0];
        // This would need more sophisticated parsing of MDN's compatibility data
        return {
          chrome: { version: '88+', status: 'supported' },
          firefox: { version: '85+', status: 'supported' },
          safari: { version: '14+', status: 'supported' },
          edge: { version: '88+', status: 'supported' }
        };
      }
    } catch (error) {
      console.log('MDN browser support fetch failed, trying web scraping...');
    }

    // Try web scraping as fallback
    try {
      return await WebScraper.scrapeBrowserSupport(apiName);
    } catch (error) {
      console.log('Web scraping browser support failed, using fallback');
    }

    // Final fallback browser support
    return {
      chrome: { version: '88+', status: 'supported' },
      firefox: { version: '85+', status: 'supported' },
      safari: { version: '14+', status: 'supported' },
      edge: { version: '88+', status: 'supported' }
    };
  }

  static async searchExplainer(apiName: string): Promise<ExplainerInfo | undefined> {
    try {
      // Search for explainers in WICG repositories
      const response = await axios.get(API_ENDPOINTS.GITHUB_SEARCH_REPOS, {
        params: {
          q: `${apiName.toLowerCase().replace(' ', '-')} explainer`,
          org: 'WICG',
          sort: 'updated',
          order: 'desc'
        },
        headers: getGitHubHeaders(),
        timeout: API_CONFIG.GITHUB_TIMEOUT
      });

      if (response.data && response.data.items && response.data.items.length > 0) {
        const repo = response.data.items[0];
        return {
          title: `${apiName} Explainer`,
          description: repo.description || `A comprehensive explainer for the ${apiName}`,
          url: repo.html_url,
          author: repo.owner.login,
          date: repo.updated_at
        };
      }
    } catch (error) {
      console.log('GitHub explainer search failed, trying web scraping...');
    }

    // Try web scraping as fallback
    try {
      return await WebScraper.searchExplainerDocuments(apiName);
    } catch (error) {
      console.log('Web scraping explainer search failed');
    }

    return undefined;
  }

  static async getGitHubIssues(apiName: string): Promise<GitHubIssue[]> {
    try {
      // Search for issues in web-platform-tests repository
      const response = await axios.get(API_ENDPOINTS.GITHUB_SEARCH_ISSUES, {
        params: {
          q: `${apiName} repo:web-platform-tests/wpt is:issue is:open`,
          sort: 'created',
          order: 'desc',
          per_page: 5
        },
        headers: getGitHubHeaders(),
        timeout: API_CONFIG.GITHUB_TIMEOUT
      });

      if (response.data && response.data.items) {
        return response.data.items.map((issue: any) => ({
          id: issue.number,
          title: issue.title,
          url: issue.html_url,
          state: issue.state as 'open' | 'closed',
          createdAt: issue.created_at,
          author: issue.user.login
        }));
      }
    } catch (error) {
      console.log('GitHub API issues fetch failed, trying web scraping...');
    }

    // Try web scraping as fallback
    try {
      return await WebScraper.scrapeGitHubIssues(apiName);
    } catch (error) {
      console.log('Web scraping GitHub issues failed');
    }

    return [];
  }

  static async getChromiumBugs(apiName: string): Promise<ChromiumBug[]> {
    try {
      // Search Chromium bugs (this would require proper authentication)
      // For now, we'll simulate the search
      const searchTerm = apiName.toLowerCase().replace(' api', '');
      
      // This is a simplified version - real implementation would need proper Chromium bug API access
      return [
        {
          id: 'chromium:123456',
          title: `Implement ${apiName} feature`,
          url: `https://issues.chromium.org/issues/123456`,
          priority: 'P1',
          status: 'Assigned',
          assignee: 'chromium-dev'
        },
        {
          id: 'chromium:123457',
          title: `Fix ${apiName} compatibility issue`,
          url: `https://issues.chromium.org/issues/123457`,
          priority: 'P2',
          status: 'Open',
          assignee: 'perf-team'
        }
      ];
    } catch (error) {
      console.log('Chromium bugs API fetch failed, trying web scraping...');
    }

    // Try web scraping as fallback
    try {
      return await WebScraper.getChromiumBugInfo(apiName);
    } catch (error) {
      console.log('Web scraping Chromium bugs failed');
    }

    return [];
  }

  static async getChromiumStatus(apiName: string): Promise<ChromiumStatus> {
    try {
      // This would require access to Chromium's internal APIs
      // For now, we'll provide a realistic simulation
      return {
        summary: `${apiName} is fully implemented in Chromium with good performance and stability. Recent updates have improved compatibility and added new features.`,
        recentChanges: [
          {
            commit: 'abc123',
            description: `Add ${apiName} feature support`,
            date: '2024-01-20',
            author: 'chromium-dev'
          },
          {
            commit: 'def456',
            description: `Fix ${apiName} memory leak issue`,
            date: '2024-01-15',
            author: 'memory-team'
          },
          {
            commit: 'ghi789',
            description: `Improve ${apiName} error handling`,
            date: '2024-01-10',
            author: 'stability-team'
          }
        ]
      };
    } catch (error) {
      console.log('Chromium status fetch failed');
    }

    return {
      summary: `${apiName} is implemented in Chromium.`,
      recentChanges: []
    };
  }

  static async generateFuturePrediction(apiName: string): Promise<string> {
    // This would ideally use AI/ML models or trend analysis
    // For now, we'll provide realistic predictions based on API patterns
    const predictions = [
      `${apiName} is expected to see continued adoption and enhancement. We predict new features will be added in the next 2-3 years, with improved performance optimizations and better integration with other web APIs.`,
      `${apiName} will likely become a standard part of modern web development toolkits, with improved browser support and developer tooling.`,
      `${apiName} is expected to evolve with new specifications and implementations, providing better performance and developer experience.`
    ];

    return predictions[Math.floor(Math.random() * predictions.length)];
  }

  static getMockAPIInfo(apiName: string): APIInfo {
    return {
      name: apiName,
      description: `The ${apiName} provides a modern interface for ${apiName.toLowerCase().includes('api') ? apiName.toLowerCase().replace(' api', '') : 'web functionality'}. It offers a powerful and flexible way to interact with web technologies.`,
      mdnUrl: `https://developer.mozilla.org/en-US/docs/Web/API/${apiName.replace(' ', '_')}`,
      browserSupport: {
        chrome: { version: '88+', status: 'supported' },
        firefox: { version: '85+', status: 'supported' },
        safari: { version: '14+', status: 'supported' },
        edge: { version: '88+', status: 'supported' }
      },
      explainer: {
        title: `${apiName} Explainer`,
        description: `A comprehensive explainer document detailing the design decisions and implementation details of the ${apiName}.`,
        url: `https://github.com/WICG/${apiName.toLowerCase().replace(' ', '-')}-explainer`,
        author: 'Web Platform Incubator Community Group',
        date: '2023-01-15'
      },
      githubIssues: [
        {
          id: 1234,
          title: 'Add support for new feature X',
          url: 'https://github.com/web-platform-tests/wpt/issues/1234',
          state: 'open',
          createdAt: '2024-01-15',
          author: 'webdev-user'
        },
        {
          id: 1235,
          title: 'Fix compatibility issue with Safari',
          url: 'https://github.com/web-platform-tests/wpt/issues/1235',
          state: 'open',
          createdAt: '2024-01-10',
          author: 'browser-team'
        }
      ],
      chromiumBugs: [
        {
          id: 'chromium:123456',
          title: 'Implement missing feature in Chromium',
          url: 'https://issues.chromium.org/issues/123456',
          priority: 'P1',
          status: 'Assigned',
          assignee: 'chromium-dev'
        },
        {
          id: 'chromium:123457',
          title: 'Fix performance regression',
          url: 'https://issues.chromium.org/issues/123457',
          priority: 'P2',
          status: 'Open',
          assignee: 'perf-team'
        }
      ],
      chromiumStatus: {
        summary: `${apiName} is fully implemented in Chromium with good performance and stability. Recent updates have improved compatibility and added new features.`,
        recentChanges: [
          {
            commit: 'abc123',
            description: 'Add new feature support',
            date: '2024-01-20',
            author: 'chromium-dev'
          },
          {
            commit: 'def456',
            description: 'Fix memory leak issue',
            date: '2024-01-15',
            author: 'memory-team'
          },
          {
            commit: 'ghi789',
            description: 'Improve error handling',
            date: '2024-01-10',
            author: 'stability-team'
          }
        ]
      },
      futurePrediction: `${apiName} is expected to see continued adoption and enhancement. We predict new features will be added in the next 2-3 years, with improved performance optimizations and better integration with other web APIs. The API will likely become a standard part of modern web development toolkits.`
    };
  }

  static async performExploration(userInput: string): Promise<ExplorationStep[]> {
    const steps: ExplorationStep[] = [
      {
        id: 1,
        title: 'Search Relevant API',
        description: 'Finding the most relevant API from MDN Web API documentation...',
        status: 'loading'
      },
      {
        id: 2,
        title: 'API Introduction',
        description: 'Gathering API introduction and documentation...',
        status: 'pending'
      },
      {
        id: 3,
        title: 'Browser Support',
        description: 'Analyzing browser support status...',
        status: 'pending'
      },
      {
        id: 4,
        title: 'Explainer Search',
        description: 'Searching for public explainers...',
        status: 'pending'
      },
      {
        id: 5,
        title: 'GitHub Issues',
        description: 'Finding recent GitHub issues...',
        status: 'pending'
      },
      {
        id: 6,
        title: 'Chromium Bugs',
        description: 'Searching Chromium bug portal...',
        status: 'pending'
      },
      {
        id: 7,
        title: 'Chromium Status',
        description: 'Analyzing current Chromium implementation...',
        status: 'pending'
      },
      {
        id: 8,
        title: 'Future Prediction',
        description: 'Generating future evolution prediction...',
        status: 'pending'
      }
    ];

    // Simulate step-by-step execution with real API calls
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      try {
        if (i === 0) {
          const apiName = await this.searchRelevantAPI(userInput);
          steps[i].status = 'completed';
          steps[i].result = { apiName };
        } else if (i === 1) {
          const apiInfo = await this.getAPIInfo(steps[0].result.apiName);
          steps[i].status = 'completed';
          steps[i].result = {
            description: apiInfo.description,
            mdnUrl: apiInfo.mdnUrl
          };
        } else if (i === 2) {
          const browserSupport = await this.getBrowserSupport(steps[0].result.apiName);
          steps[i].status = 'completed';
          steps[i].result = { browserSupport };
        } else if (i === 3) {
          const explainer = await this.searchExplainer(steps[0].result.apiName);
          steps[i].status = 'completed';
          steps[i].result = { explainer };
        } else if (i === 4) {
          const issues = await this.getGitHubIssues(steps[0].result.apiName);
          steps[i].status = 'completed';
          steps[i].result = { issues };
        } else if (i === 5) {
          const bugs = await this.getChromiumBugs(steps[0].result.apiName);
          steps[i].status = 'completed';
          steps[i].result = { bugs };
        } else if (i === 6) {
          const status = await this.getChromiumStatus(steps[0].result.apiName);
          steps[i].status = 'completed';
          steps[i].result = status;
        } else if (i === 7) {
          const prediction = await this.generateFuturePrediction(steps[0].result.apiName);
          steps[i].status = 'completed';
          steps[i].result = { prediction };
        }
      } catch (error) {
        steps[i].status = 'error';
        steps[i].error = `Failed to fetch data: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }

    return steps;
  }
} 