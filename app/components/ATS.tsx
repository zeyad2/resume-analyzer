import React from 'react';

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
  // Determine gradient based on score
  const getGradientClass = (score: number) => {
    if (score >= 80) {
      return 'bg-gradient-to-br from-emerald-300 to-emerald-500';
    } else if (score >= 60) {
      return 'bg-gradient-to-br from-amber-200 to-amber-400';
    } else {
      return 'bg-gradient-to-br from-rose-300 to-rose-500';
    }
  };

  // Get score color for text
  const getScoreColor = (score: number) => {
    if (score >= 80) {
      return 'text-emerald-900';
    } else if (score >= 60) {
      return 'text-amber-900 font-bold';
    } else {
      return 'text-rose-900';
    }
  };

  return (
    <div className={`rounded-lg p-6 shadow-lg  mt-10 shadow-xl ${getGradientClass(score)}`}>
      <div className="text-center mb-4">
        <h2 className={`text-2xl font-bold mb-2 ${getScoreColor(score)}`}>
          ATS Score
        </h2>
        <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
          {score}%
        </div>
      </div>
      
      {suggestions.length > 0 && (
        <div className="mt-6">
          <h3 className={`text-lg font-semibold mb-3 ${getScoreColor(score)}`}>
            Suggestions for Improvement
          </h3>
          <ul className="space-y-2 font-bold">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index} 
                className={`text-sm flex items-start gap-3`}
              >
                <span className={`mt-1 text-lg ${suggestion.type === 'good' ? 'text-green-600' : 'text-red-600'}`}>
                  {suggestion.type === 'good' ? '✓' : '⚠'}
                </span>
                <span className={`${suggestion.type === 'good' ? 'text-green-800' : 'text-red-800'}`}>
                  {suggestion.tip}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ATS;