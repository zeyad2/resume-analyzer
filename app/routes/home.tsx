import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import ScoreCircle from "~/components/ScoreCircle";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuFlow" },
    { name: "description", content: "Smart Resume Analyzer" },
  ];
}

export default function Home() {
  const { isLoading, auth } = usePuterStore();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);

  return (

    <main className="bg-[url('/images/bg-main.svg')] bg-no-repeat bg-cover  ">
      <Navbar />



      <section className="main-section ">
        <div className="page-heading py-16">
          <h1>Let AI Rethink Your Resume</h1>
          <h2>
            Resuflow analyzes your resume with machine precision to give you
            human results.
          </h2>
        </div>

        {resumes.length > 0 && (
          <div className="resumes-section flex flex-row justify-center">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}


          </div>

          
        )}
      </section>
      


      {/* 
    <section className="resumes-section">
     <div className="resumes-container flex flex-row justify-evenly">
        {resumes.map((resume)=>(  
          <div key={resume.id} className="h-[150px] p-4 bg-white backdrop-blur-lg mx-10">

            <h2>{resume.companyName}</h2>
            <h3>{resume.jobTitle}</h3>

            <h3>{resume.feedback.ATS.score}/100</h3>

            <div>
              <img src={resume.imagePath} alt="" />
            </div>





          </div>
        ))}
     </div>

    </section> */}
    </main>
  );
}
