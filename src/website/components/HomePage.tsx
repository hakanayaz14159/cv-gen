"use client";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="hero bg-base-200 rounded-xl mb-10 p-8">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">CV-Gen</h1>
            <p className="text-xl mb-8">
              Free, open-source CV generator that creates ATS-compatible resumes to help you land your dream job.
            </p>
            <button className="btn btn-primary" onClick={() => {
              // Find the CV tab input and click it
              const cvTab = document.querySelector('input[aria-label="CV"]') as HTMLInputElement;
              if (cvTab) cvTab.click();
            }}>Get Started</button>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">Why Choose CV-Gen?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
        <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all">
          <div className="card-body">
            <h3 className="card-title text-primary">ATS Optimized</h3>
            <p>Our templates are designed to pass through Applicant Tracking Systems with ease, ensuring your resume gets seen by human recruiters.</p>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all">
          <div className="card-body">
            <h3 className="card-title text-primary">100% Free</h3>
            <p>Unlike other CV builders, CV-Gen is completely free with no hidden fees, premium templates, or watermarks.</p>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all">
          <div className="card-body">
            <h3 className="card-title text-primary">Privacy First</h3>
            <p>Your data never leaves your browser. We don't store your personal information on any servers.</p>
          </div>
        </div>
      </div>

      <div className="bg-base-200 p-8 rounded-xl w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
        <div className="steps steps-vertical lg:steps-horizontal w-full">
          <div className="step step-primary">Fill in your details</div>
          <div className="step step-primary">Preview your CV in real-time</div>
          <div className="step step-primary">Download as PDF</div>
          <div className="step">Land your dream job</div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm opacity-70 mb-3">CV-Gen is an open-source project. Contributions are welcome.</p>
        <a
          href="https://github.com/hakanayaz14159/cv-gen"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          View on GitHub
        </a>
      </div>
    </div>
  );
};

export default HomePage;
