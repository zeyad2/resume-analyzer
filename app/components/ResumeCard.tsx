import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({ resume }: { resume: Resume }) => {
  return (
    <Link
      className="resume-card animate-in fade-in duration-1000"
      to={`/resume/${resume.id}`}
    >
      {/* Header section with company info and score */}
      <div className="resume-card-header">
        <div className="flex flex-col gap-2 flex-1">
          <h2 className="font-bold text-gradient break-words max-md:text-center">
            {resume.companyName}
          </h2>
          <h3 className="text-slate-400 font-bold">{resume.jobTitle}</h3>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={resume.feedback.overallScore} />
        </div>
      </div>

      {/* Image section */}
      <div className="resume-card-image">
        <img
          src={resume.imagePath}
          alt={`${resume.companyName} resume`}
          className="w-full h-[350px max-sm:h-[200px] object-cover object-top "
        />
      </div>
    </Link>
  );
};

export default ResumeCard;
