import { useState } from "react";
import ScoreBadge from "./ScoreBadge";

interface DetailsProps {
  feedback: Feedback;
}

const Details = ({ feedback }: DetailsProps) => {
  const [openSection, setOpenSection] = useState<string | null>("toneAndStyle");

  const sections = [
    {
      key: "toneAndStyle",
      title: "Tone & Style",
      data: feedback.toneAndStyle,
    },
    {
      key: "content",
      title: "Content",
      data: feedback.content,
    },
    {
      key: "structure",
      title: "Structure",
      data: feedback.structure,
    },
    {
      key: "skills",
      title: "Skills",
      data: feedback.skills,
    },
  ];

  const toggleSection = (sectionKey: string) => {
    setOpenSection(openSection === sectionKey ? null : sectionKey);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md w-full mt-15">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Detailed Feedback</h2>
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.key} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <ScoreBadge score={section.data.score} />
                </div>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    openSection === section.key ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {openSection === section.key && (
                <div className="px-6 pb-4 border-t border-gray-200">
                  <div className="pt-4 space-y-4">
                    {section.data.tips.map((tip, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          tip.type === "good"
                            ? "bg-green-50 border-green-400"
                            : "bg-yellow-50 border-yellow-400"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              tip.type === "good"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {tip.type === "good" ? (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">{tip.tip}</p>
                            {tip.explanation && (
                              <p className="text-sm text-gray-600">{tip.explanation}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Details;