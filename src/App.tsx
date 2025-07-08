import React, { useState } from 'react';
import { Search, Zap, Globe, BookOpen, Github, Bug, Code, TrendingUp } from 'lucide-react';
import { APIService } from './services/apiService';
import { ExplorationStep } from './types';
import ExplorationStepComponent from './components/ExplorationStep';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [isExploring, setIsExploring] = useState(false);
  const [explorationSteps, setExplorationSteps] = useState<ExplorationStep[]>([]);
  const [hasResults, setHasResults] = useState(false);

  const handleExplore = async () => {
    if (!userInput.trim()) return;

    setIsExploring(true);
    setHasResults(false);
    setExplorationSteps([]);

    try {
      const steps = await APIService.performExploration(userInput.trim());
      setExplorationSteps(steps);
      setHasResults(true);
    } catch (error) {
      console.error('Exploration failed:', error);
    } finally {
      setIsExploring(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExplore();
    }
  };

  const explorationStepTitles = [
    'Search Relevant API',
    'API Introduction',
    'Browser Support',
    'Explainer Search',
    'GitHub Issues',
    'Chromium Bugs',
    'Chromium Status',
    'Future Prediction'
  ];

  const explorationStepIcons = [
    <Search key="search" className="w-6 h-6" />,
    <BookOpen key="book" className="w-6 h-6" />,
    <Globe key="globe" className="w-6 h-6" />,
    <Code key="code" className="w-6 h-6" />,
    <Github key="github" className="w-6 h-6" />,
    <Bug key="bug" className="w-6 h-6" />,
    <Zap key="zap" className="w-6 h-6" />,
    <TrendingUp key="trending" className="w-6 h-6" />
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Web API Explorer</h1>
                <p className="text-sm text-gray-600">Deep Research Tool</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover & Analyze Web APIs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Input any web API and get comprehensive insights including browser support, 
            documentation, GitHub issues, Chromium bugs, and future predictions.
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="card">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a web API (e.g., Fetch API, WebSocket API, Geolocation API...)"
                  className="input-field"
                  disabled={isExploring}
                />
              </div>
              <button
                onClick={handleExplore}
                disabled={isExploring || !userInput.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isExploring ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Exploring...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Explore</span>
                  </>
                )}
              </button>
            </div>
            
            {!hasResults && !isExploring && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Try these examples:</h3>
                <div className="flex flex-wrap gap-2">
                  {['Fetch API', 'WebSocket API', 'Geolocation API', 'Web Audio API'].map((example) => (
                    <button
                      key={example}
                      onClick={() => setUserInput(example)}
                      className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Exploration Steps */}
        {hasResults && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Exploration Results</h3>
              <p className="text-gray-600">Comprehensive analysis of "{userInput}"</p>
            </div>

            <div className="grid gap-6">
              {explorationSteps.map((step, index) => (
                <div key={step.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <ExplorationStepComponent step={step} />
                </div>
              ))}
            </div>

            {/* Summary Card */}
            <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Exploration Complete! 🎉
                </h3>
                <p className="text-gray-600">
                  You now have a comprehensive understanding of the {explorationSteps[0]?.result?.apiName || userInput}. 
                  Use this information to make informed decisions about your web development projects.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!hasResults && !isExploring && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              What You'll Discover
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {explorationStepTitles.map((title, index) => (
                <div key={index} className="card text-center group hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                    {explorationStepIcons[index]}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
                  <p className="text-sm text-gray-600">
                    {index === 0 && 'Find the most relevant API from MDN documentation'}
                    {index === 1 && 'Get comprehensive introduction and documentation links'}
                    {index === 2 && 'Check browser support across all major browsers'}
                    {index === 3 && 'Discover public explainers and design documents'}
                    {index === 4 && 'Find recent GitHub issues and discussions'}
                    {index === 5 && 'Search Chromium bug portal for related issues'}
                    {index === 6 && 'Analyze current Chromium implementation status'}
                    {index === 7 && 'Get predictions about future API evolution'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Web API Explorer - Deep Research Tool for Web Developers
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Powered by MDN Web Docs, GitHub, and Chromium Bug Portal
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App; 