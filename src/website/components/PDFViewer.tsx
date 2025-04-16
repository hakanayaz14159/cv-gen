import { CVGenerator } from "cv-gen";
import { ComponentProps, useEffect, useState, useRef, useCallback } from "react";
import { CVGeneratorConfig, CVInformations } from "../../lib/types";

// Animation duration in milliseconds
const FADE_DURATION = 500;
// Debounce delay in milliseconds
const DEBOUNCE_DELAY = 800;

type Props = ComponentProps<"iframe"> & {
  cvData: CVInformations;
  configOverride: CVGeneratorConfig;
};

const PDFViewer = ({ cvData, configOverride }: Props) => {
  // Create generator ref to avoid recreating it on each render
  const generatorRef = useRef<CVGenerator>(new CVGenerator());
  const [isLoading, setIsLoading] = useState(true); // Start with loading true for initial render
  const [pdfSrc, setPdfSrc] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use a ref to track the previous data for comparison
  const prevDataRef = useRef<string>("");
  // Ref for debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to track if we're currently showing loading state
  const isLoadingRef = useRef(false);

  // Function to generate PDF
  const generatePDF = useCallback(() => {
    if (!cvData) return;

    try {
      // Generate the PDF
      const newPdfSrc = generatorRef.current.generateCV(cvData, configOverride);

      // Update the PDF source
      setPdfSrc(newPdfSrc);

      // Clear any error message
      setErrorMessage(null);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setErrorMessage('Failed to generate PDF. Please try again.');
    } finally {
      // Hide loading state after a delay
      setTimeout(() => {
        setIsLoading(false);
        isLoadingRef.current = false;
      }, FADE_DURATION);
    }
  }, [cvData, configOverride]);

  // Handle initial PDF generation
  useEffect(() => {
    // Skip if no data or already initialized
    if (!cvData || isInitialized) return;

    setIsInitialized(true);
    isLoadingRef.current = true;

    // Generate PDF immediately for initial render
    setTimeout(() => {
      generatePDF();
    }, 100);

  }, [cvData, isInitialized, generatePDF]);

  // Debounced PDF generation when data changes
  useEffect(() => {
    // Skip if no data or not initialized yet (let the initialization effect handle the first render)
    if (!cvData || !isInitialized) return;

    // Create a serialized version of the data for comparison
    const serializedData = JSON.stringify({ cvData, configOverride });

    // Skip if the data hasn't changed
    if (serializedData === prevDataRef.current) return;

    // Update the previous data ref
    prevDataRef.current = serializedData;

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only show loading if we're not already in loading state
    if (!isLoadingRef.current) {
      setIsLoading(true);
      isLoadingRef.current = true;
    }

    // Set a new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      generatePDF();
    }, DEBOUNCE_DELAY);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [cvData, configOverride, generatePDF, isInitialized]);

  return (
    <div className="basis-1 grow h-lvh relative">
      {cvData ? (
        <iframe
          title="pdf-view"
          className="w-full h-full"
          src={pdfSrc}
        ></iframe>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <span className="loading loading-ring loading-xl"></span>
        </div>
      )}

      {/* Loading overlay with fade transition */}
      {isLoading && (
        <div className="absolute inset-0 bg-base-300 bg-opacity-70 flex flex-col justify-center items-center transition-all duration-500">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <span className="loading loading-ring loading-lg mb-4"></span>
            <p className="text-lg font-semibold">Generating PDF...</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="absolute bottom-4 right-4 bg-error text-white p-4 rounded-lg shadow-lg">
          <p>{errorMessage}</p>
          <button
            className="btn btn-sm btn-ghost text-white mt-2"
            onClick={() => setErrorMessage(null)}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default PDFViewer;
