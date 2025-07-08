import React from 'react';
import { ExplorationStep, SupportStatus } from '../types';
import { CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react';

interface ExplorationStepProps {
  step: ExplorationStep;
}

const ExplorationStepComponent: React.FC<ExplorationStepProps> = ({ step }) => {
  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'loading':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (step.status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'loading':
        return 'border-blue-200 bg-blue-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const renderResult = () => {
    if (!step.result) return null;

    switch (step.id) {
      case 1:
        return (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-semibold text-gray-900">Found API:</h4>
            <p className="text-lg font-medium text-primary-600">{step.result.apiName}</p>
          </div>
        );
      
      case 2:
        return (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">API Description:</h4>
            <p className="text-gray-700 mb-3">{step.result.description}</p>
            <a 
              href={step.result.mdnUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              View MDN Documentation →
            </a>
          </div>
        );
      
      case 3:
        return (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-3">Browser Support:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(step.result.browserSupport).map(([browser, support]) => {
                const supportStatus = support as SupportStatus;
                return (
                  <div key={browser} className="text-center">
                    <div className="font-medium text-gray-700 capitalize">{browser}</div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      supportStatus.status === 'supported' ? 'bg-green-100 text-green-800' :
                      supportStatus.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {supportStatus.version}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      
      case 4:
        return step.result.explainer ? (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">Explainer Found:</h4>
            <h5 className="font-medium text-gray-800">{step.result.explainer.title}</h5>
            <p className="text-gray-700 mb-3">{step.result.explainer.description}</p>
            <a 
              href={step.result.explainer.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              View Explainer →
            </a>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <p className="text-gray-600">No public explainer found for this API.</p>
          </div>
        );
      
      case 5:
        return step.result.issues && step.result.issues.length > 0 ? (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-3">Recent GitHub Issues:</h4>
            <div className="space-y-2">
              {step.result.issues.map((issue: any) => (
                <div key={issue.id} className="p-3 bg-gray-50 rounded">
                  <a 
                    href={issue.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    #{issue.id} {issue.title}
                  </a>
                  <div className="text-sm text-gray-500 mt-1">
                    by {issue.author} • {issue.createdAt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <p className="text-gray-600">No recent GitHub issues found.</p>
          </div>
        );
      
      case 6:
        return step.result.bugs && step.result.bugs.length > 0 ? (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-3">Chromium Bugs:</h4>
            <div className="space-y-2">
              {step.result.bugs.map((bug: any) => (
                <div key={bug.id} className="p-3 bg-gray-50 rounded">
                  <div className="flex items-center justify-between">
                    <a 
                      href={bug.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {bug.title}
                    </a>
                    <span className={`text-xs px-2 py-1 rounded ${
                      bug.priority === 'P0' ? 'bg-red-100 text-red-800' :
                      bug.priority === 'P1' ? 'bg-orange-100 text-orange-800' :
                      bug.priority === 'P2' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {bug.priority}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Status: {bug.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <p className="text-gray-600">No relevant Chromium bugs found.</p>
          </div>
        );
      
      case 7:
        return (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">Chromium Status:</h4>
            <p className="text-gray-700 mb-3">{step.result.summary}</p>
            {step.result.recentChanges && step.result.recentChanges.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Recent Changes:</h5>
                <div className="space-y-2">
                  {step.result.recentChanges.map((change: any, index: number) => (
                    <div key={index} className="text-sm text-gray-600">
                      <span className="font-mono text-xs bg-gray-100 px-1 rounded">{change.commit}</span>
                      <span className="ml-2">{change.description}</span>
                      <span className="text-gray-400 ml-2">by {change.author}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 8:
        return (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">Future Prediction:</h4>
            <p className="text-gray-700">{step.result.prediction}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()} transition-all duration-300`}>
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{step.title}</h3>
          <p className="text-sm text-gray-600">{step.description}</p>
        </div>
      </div>
      
      {step.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{step.error}</p>
        </div>
      )}
      
      {renderResult()}
    </div>
  );
};

export default ExplorationStepComponent; 