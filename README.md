# Web API Explorer - Deep Research Tool

A comprehensive web application that allows users to input any web API and performs an 8-step deep exploration to provide detailed insights about the API's current status, browser support, documentation, and future predictions.

## Features

### 8-Step Exploration Process

1. **Search Relevant API** - Finds the most relevant API from MDN Web API documentation
2. **API Introduction** - Provides comprehensive introduction and documentation links
3. **Browser Support** - Analyzes browser support across all major browsers
4. **Explainer Search** - Discovers public explainers and design documents
5. **GitHub Issues** - Finds recent GitHub issues and discussions
6. **Chromium Bugs** - Searches Chromium bug portal for related issues
7. **Chromium Status** - Analyzes current Chromium implementation status
8. **Future Prediction** - Provides predictions about future API evolution

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Create React App
- **Package Manager**: npm

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tonynash/WebApiDeepResearchWebsite_Cursor.git
   cd WebApiDeepResearchWebsite_Cursor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

1. **Enter an API name** in the input field (e.g., "Fetch API", "WebSocket API", "Geolocation API")
2. **Click "Explore"** or press Enter to start the exploration
3. **Watch the 8-step process** unfold in real-time
4. **Review comprehensive results** including:
   - API documentation and links
   - Browser support matrix
   - Public explainers
   - GitHub issues
   - Chromium bugs and status
   - Future predictions

## Example APIs to Try

- Fetch API
- WebSocket API
- Geolocation API
- Web Audio API
- Service Workers API
- Push API
- Notifications API
- File API
- IndexedDB API
- Web Storage API

## Production Build

To create a production build:

```bash
npm run build
```

The build files will be created in the `build` folder, ready for deployment.

## Project Structure

```
src/
├── components/
│   └── ExplorationStep.tsx    # Individual step component
├── services/
│   ├── apiService.ts          # API exploration logic
│   └── webScraper.ts          # Web scraping fallbacks
├── config/
│   └── apiConfig.ts           # API configuration
├── types/
│   └── index.ts              # TypeScript type definitions
├── App.tsx                   # Main application component
├── index.tsx                 # Application entry point
└── index.css                 # Global styles and Tailwind imports
```

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

### Code Style

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## Real API Integrations

This application includes real API integrations with:

- **MDN Web Docs API** - Fetches actual API documentation
- **GitHub API** - Searches for real issues and repositories
- **Web Scraping Fallbacks** - When APIs fail, scrapes public web pages
- **Mock Data Safety Net** - Ensures the app always works

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- MDN Web Docs for API documentation
- GitHub for issue tracking
- Chromium Bug Portal for browser implementation details
- Web Platform Incubator Community Group for explainers
