import Category from "./Category";
import ScoreCircle from "./ScoreCircle";

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreCircle score={feedback.overallScore} />
        <div className="flex flex-col gap-2">
          <h2 className="font-bold">Your Resume Score</h2>
          <p className="text-gray-600">Score was calculated based on:</p>
        </div>
      </div>
      <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
      <Category title="Content" score={feedback.content.score} />
      <Category title="Structure" score={feedback.structure.score} />
      <Category title="Skills" score={feedback.skills.score} />
    </div>
  );
};

export default Summary;
