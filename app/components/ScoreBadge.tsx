const ScoreBadge = ({ score }: { score: number }) => {
  const getBadgeStyle = () => {
    if (score > 70) {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (score > 49) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else {
      return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getBadgeText = () => {
    if (score > 70) {
      return "Strong";
    } else if (score > 49) {
      return "Good Start";
    } else {
      return "Needs Work";
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getBadgeStyle()}`}>
      {getBadgeText()}
    </span>
  );
};

export default ScoreBadge;
