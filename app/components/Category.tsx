import ScoreBadge from "./ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 70
      ? "text-green-600"
      : score > 49
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="resume-summary">
      <div className="category !justify-between">
        <div className="flex flex-row gap-2 items-center">
          <p>{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="font-bold">
          <span className={textColor} >{score}/100</span>
        </p>
      </div>
    </div>
  );
};

export default Category;
