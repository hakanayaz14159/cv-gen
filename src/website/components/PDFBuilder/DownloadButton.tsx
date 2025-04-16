"use client";

import { useState } from "react";
import { CVInformations, CVGeneratorConfig } from "../../../lib/types";
import { CVGenerator } from "cv-gen";

type Props = {
  cvData: CVInformations;
  config?: Partial<CVGeneratorConfig>;
};

const DownloadButton = ({ cvData, config }: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);

      // Generate the PDF
      const pdf = new CVGenerator().generateCV(cvData, config as CVGeneratorConfig);

      // Get the filename based on the person's name or a default
      // Replace spaces with underscores for the filename, but preserve spaces in the actual CV
      const filename = cvData.name
        ? `${cvData.name.replace(/\s+/g, '_')}_CV.pdf`
        : 'CV.pdf';

      // Save the PDF
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating your PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <fieldset className="fieldset col-span-3 p-4 mt-4">
      <legend className="fieldset-legend">Download Your CV</legend>

      <div className="flex flex-col items-center justify-center p-6 bg-base-200 rounded-lg">
        <p className="text-center mb-4">
          Ready to download your CV? Click the button below to generate a PDF file.
        </p>

        <button
          className="btn btn-primary btn-lg gap-2"
          onClick={handleDownload}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="loading loading-spinner"></span>
              Generating PDF...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </>
          )}
        </button>

        <p className="text-sm mt-4 opacity-70 max-w-md text-center">
          The PDF will be generated based on the information you've provided and the current configuration settings.
        </p>
      </div>
    </fieldset>
  );
};

export default DownloadButton;
