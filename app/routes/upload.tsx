import Navbar from "~/components/Navbar";
import { useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdftoimg";
import { generateUUID } from "~/lib/utils";
import { AIResponseFormat, prepareInstructions } from "constants/index";

const upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsUploading(true);
    setStatusText("uploading your resume...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("failed to upload file");

    setStatusText("Converting to image..");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) {
      const reason = imageFile.error ? ` (${imageFile.error})` : "";
      return setStatusText(`Error: failed to convert${reason}`);
    }
    setStatusText("uploading the image..");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("failed to upload image");
    setStatusText("Preparing data");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName: companyName,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing");
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription, AIResponseFormat })
    );

    if (!feedback) return setStatusText("failed to analyze resume");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis Complete, redirecting...");

    console.log(data);
    navigate(`/resume/${uuid}`);
    
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-no-repeat bg-cover  ">
      <Navbar />

      <section className="main-section ">
        <div className="page-heading py-16">
          <h2 className="capitalize text-gradient">
            Smart Feedback For your Dream job
          </h2>

          {isUploading ? (
            <>
              {" "}
              <h2> {statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" alt="" />
            </>
          ) : (
            <>
              <h2>Drop Your Resume for an ATS score and improvement tips</h2>
            </>
          )}

          {!isUploading && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              action=""
              className="flex flex-col  mt-8"
            >
              <div className="form-div flex flex-col gap-4">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Enter Company Name"
                  id="company-name"
                />

                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  placeholder="Enter Job Title"
                />

                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  id="job-description"
                  placeholder="Enter Job Description"
                />

                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />

                <button className="primary-button" type="submit">
                  Analyze Resume
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
