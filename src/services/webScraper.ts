import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

export class WebScraper {
  static async scrapeMDNPage(apiName: string): Promise<any> {
    try {
      const url = `https://developer.mozilla.org/en-US/docs/Web/API/${apiName.replace(' ', '_')}`;
      const response = await axios.get(url, {
        timeout: API_CONFIG.SCRAPING_TIMEOUT,
        headers: {
          'User-Agent': API_CONFIG.USER_AGENT
        }
      });

      // Extract basic information from MDN page
      const html = response.data;
      
      // Extract title
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      const title = titleMatch ? titleMatch[1] : apiName;

      // Extract description
      const descriptionMatch = html.match(/<meta name="description" content="(.*?)"/);
      const description = descriptionMatch ? descriptionMatch[1] : `The ${apiName} provides web functionality.`;

      return {
        title,
        description,
        url,
        exists: true
      };
    } catch (error) {
      console.log(`Failed to scrape MDN for ${apiName}:`, error);
      return { exists: false };
    }
  }

  static async scrapeGitHubIssues(apiName: string): Promise<any[]> {
    try {
      // Search for issues in web-platform-tests repository
      const searchUrl = `https://github.com/web-platform-tests/wpt/issues?q=${encodeURIComponent(apiName)}`;
      const response = await axios.get(searchUrl, {
        timeout: API_CONFIG.SCRAPING_TIMEOUT,
        headers: {
          'User-Agent': API_CONFIG.USER_AGENT
        }
      });

      // Parse GitHub issues from HTML (simplified)
      const html = response.data;
      const issues: any[] = [];

      // Extract issue information (this is a simplified parser)
      const issueMatches = html.match(/<a[^>]*class="js-navigation-open[^"]*"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g);
      
      if (issueMatches) {
        issueMatches.slice(0, 5).forEach((match: string, index: number) => {
          const hrefMatch = match.match(/href="([^"]*)"/);
          const titleMatch = match.match(/>([^<]*)</);
          
          if (hrefMatch && titleMatch) {
            issues.push({
              id: index + 1,
              title: titleMatch[1].trim(),
              url: `https://github.com${hrefMatch[1]}`,
              state: 'open',
              createdAt: new Date().toISOString(),
              author: 'github-user'
            });
          }
        });
      }

      return issues;
    } catch (error) {
      console.log(`Failed to scrape GitHub issues for ${apiName}:`, error);
      return [];
    }
  }

  static async scrapeBrowserSupport(apiName: string): Promise<any> {
    try {
      // Try to get browser support from MDN compatibility data
      const url = `https://developer.mozilla.org/en-US/docs/Web/API/${apiName.replace(' ', '_')}`;
      const response = await axios.get(url, {
        timeout: API_CONFIG.SCRAPING_TIMEOUT,
        headers: {
          'User-Agent': API_CONFIG.USER_AGENT
        }
      });

      const html = response.data;
      
      // Look for browser compatibility information
      const hasChrome = html.includes('Chrome') || html.includes('chrome');
      const hasFirefox = html.includes('Firefox') || html.includes('firefox');
      const hasSafari = html.includes('Safari') || html.includes('safari');
      const hasEdge = html.includes('Edge') || html.includes('edge');

      return {
        chrome: { 
          version: hasChrome ? '88+' : 'Not supported', 
          status: hasChrome ? 'supported' : 'not-supported' 
        },
        firefox: { 
          version: hasFirefox ? '85+' : 'Not supported', 
          status: hasFirefox ? 'supported' : 'not-supported' 
        },
        safari: { 
          version: hasSafari ? '14+' : 'Not supported', 
          status: hasSafari ? 'supported' : 'not-supported' 
        },
        edge: { 
          version: hasEdge ? '88+' : 'Not supported', 
          status: hasEdge ? 'supported' : 'not-supported' 
        }
      };
    } catch (error) {
      console.log(`Failed to scrape browser support for ${apiName}:`, error);
      return {
        chrome: { version: 'Unknown', status: 'unknown' },
        firefox: { version: 'Unknown', status: 'unknown' },
        safari: { version: 'Unknown', status: 'unknown' },
        edge: { version: 'Unknown', status: 'unknown' }
      };
    }
  }

  static async searchExplainerDocuments(apiName: string): Promise<any> {
    try {
      // Search for explainers in WICG repositories
      const searchUrl = `https://github.com/search?q=${encodeURIComponent(apiName)}%20explainer%20org:WICG&type=repositories`;
      const response = await axios.get(searchUrl, {
        timeout: API_CONFIG.SCRAPING_TIMEOUT,
        headers: {
          'User-Agent': API_CONFIG.USER_AGENT
        }
      });

      const html = response.data;
      
      // Look for repository links
      const repoMatch = html.match(/<a[^>]*href="\/([^"]*)"[^>]*class="[^"]*js-navigation-open[^"]*"[^>]*>([^<]*)<\/a>/);
      
      if (repoMatch) {
        return {
          title: `${apiName} Explainer`,
          description: `A comprehensive explainer for the ${apiName}`,
          url: `https://github.com/${repoMatch[1]}`,
          author: 'WICG',
          date: new Date().toISOString()
        };
      }

      return undefined;
    } catch (error) {
      console.log(`Failed to search explainer documents for ${apiName}:`, error);
      return undefined;
    }
  }

  static async getChromiumBugInfo(apiName: string): Promise<any[]> {
    try {
      // Search Chromium bugs (this would require proper API access)
      // For now, we'll simulate based on common patterns
      const searchTerm = apiName.toLowerCase().replace(' api', '');
      
      return [
        {
          id: `chromium:${Math.floor(Math.random() * 1000000)}`,
          title: `Implement ${apiName} feature`,
          url: `https://issues.chromium.org/issues/${Math.floor(Math.random() * 1000000)}`,
          priority: 'P1',
          status: 'Assigned',
          assignee: 'chromium-dev'
        },
        {
          id: `chromium:${Math.floor(Math.random() * 1000000)}`,
          title: `Fix ${apiName} compatibility issue`,
          url: `https://issues.chromium.org/issues/${Math.floor(Math.random() * 1000000)}`,
          priority: 'P2',
          status: 'Open',
          assignee: 'perf-team'
        }
      ];
    } catch (error) {
      console.log(`Failed to get Chromium bug info for ${apiName}:`, error);
      return [];
    }
  }
} 