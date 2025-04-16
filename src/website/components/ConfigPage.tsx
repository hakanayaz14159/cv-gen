"use client";

const ConfigPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <h1 className="text-4xl font-bold mb-6">Configuration</h1>
      <p className="text-xl text-center max-w-2xl mb-8">
        This page will contain advanced configuration options for your CV.
        Coming soon!
      </p>
      <div className="card bg-base-200 shadow-xl w-full max-w-2xl">
        <div className="card-body">
          <h2 className="card-title">Future Configuration Options</h2>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>Custom color schemes</li>
            <li>Font selection</li>
            <li>Layout customization</li>
            <li>Section ordering</li>
            <li>Export options</li>
            <li>Template selection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;
