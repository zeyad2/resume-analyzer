// Import necessary React hooks and routing utilities
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";
// Import the Puter store for cloud storage and authentication

/**
 * Resume Component
 *
 * This component displays a specific resume based on the ID from the URL parameters.
 * It loads the resume data from cloud storage, converts it to displayable formats,
 * and shows both the PDF and image versions of the resume along with feedback.
 */
const resume = () => {
  // Extract the resume ID from the URL parameters
  const { id } = useParams();
  const { auth, isLoading, fs, kv } = usePuterStore();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume:${id}`);
  }, [isLoading]);

  // Access Puter store for authentication, loading state, file system, and key-value storage

  // State to store the URL for the resume image (converted from PDF)
  const [imageUrl, setImageUrl] = useState("");

  // State to store the feedback/analysis results for the resume
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // State to store the URL for the original PDF resume
  const [resumeUrl, setResumeUrl] = useState("");

  // Navigation hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * useEffect hook to load resume data when the component mounts or ID changes
   * This effect fetches the resume data from cloud storage and converts it to displayable formats
   */
  useEffect(() => {
    /**
     * Async function to load and process the resume data
     * 1. Retrieves resume metadata from key-value storage
     * 2. Loads the PDF file and creates a blob URL
     * 3. Loads the image file and creates a blob URL
     * 4. Sets the feedback data
     */
    const loadResume = async () => {
      // Retrieve resume metadata from key-value storage using the resume ID
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return; // Exit if no resume data found

      // Parse the JSON metadata to get file paths and feedback
      const data = JSON.parse(resume);

      // Load the PDF file from cloud storage
      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return; // Exit if PDF file not found

      // Create a blob URL for the PDF to display it in the browser
      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeURL = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeURL);

      // Load the image file (converted from PDF) from cloud storage
      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return; // Exit if image file not found

      // Create a blob URL for the image to display it
      const imageUrl = URL.createObjectURL(new Blob([imageBlob]));
      setImageUrl(imageUrl);

      // Set the feedback/analysis results
      setFeedback(data.feedback);
    };

    // Execute the resume loading function
    loadResume();
  }, [id]); // Dependency array: re-run effect when ID changes

  return (
    <main className="!pt-0 ">
      {/* Navigation bar with back button */}
      <nav className="resume-nav">
        {/* Back button that links to the home page */}
        <Link to="/" className="back-btn flex flex-row p-3 border rounded-2xl ">
          {" "}
          {/* Back arrow icon */}
          <img
            src="/icons/back.svg"
            alt="logo"
            className="w-2.5 h-2.5 mt-[7px] mr-3"
          />
          {/* Back button text */}
          <span className="text-gray-800 font-bold ">Back to Home</span>{" "}
        </Link>
      </nav>

      {/* Main content container */}
      <div className="flex w-full max-lg:flex-col-reverse">
        {/* Feedback section with background styling */}
        <section className="feedback-section bg-[url('/images/bg-small.svg)] sticky top-0 items-center ">
          {/* Conditional rendering: Only show content when both image and PDF URLs are available */}
          {imageUrl && resumeUrl && (
            /* Animated container with gradient border for displaying resume content */
            <div className="animate-in fade-in duration-1000 gradient-border h-[90%]">
              <a href={resumeUrl} target="_blank">
                <img
                  src={imageUrl}
                  className="w-full h-full object-contain"
                  alt=""
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>

        <section className="feedback-section">
          <h2 className="text-4xl font-bold !text-black"> Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />

              <Details feedback={feedback} />
            </div>
          ) : (
            <div>
              {" "}
              <img src="/images/resume-scan-2.gif" className="w-full" alt="" />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

// Export the component as default
export default resume;
