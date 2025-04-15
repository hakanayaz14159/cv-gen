"use client";
import PDFViewer from "@/components/PDFViewer";
import { softwareEngineerCV as dummyCV } from "helper/dummyCV";
import { useCallback, useEffect, useState } from "react";
import { CVGeneratorConfig, CVInformations } from "../../lib/types";
import PDFBuilder from "@/components/PDFBuilder";

export default function Page() {
  const [mergedCV, setMergedCV] = useState<CVInformations>(null);
  const [config, setConfig] = useState<Partial<CVGeneratorConfig>>({});

  const onCVChange = useCallback(
    (personalCV: Partial<CVInformations>) => {
      setMergedCV((p) => Object.assign({}, dummyCV, personalCV));
    },
    [setMergedCV],
  );

  const onConfigChange = useCallback(
    (config: CVGeneratorConfig) => {
      setConfig(config);
    },
    [setConfig],
  );

  return (
    <div className="flex flex-row bg-neutral">
      <div className="basis-1 grow h-lvh flex flex-col">
        <header className="p-2 flex flex-row bg-base-300 items-baseline">
          <div className="text-4xl text-white font-bold p-2">CV-Gen</div>
          <div className="text-white">Create & Optimize a standardized CV</div>
        </header>
        <main className="px-4 py-2 grow overflow-y-scroll">
          <PDFBuilder changeCB={onCVChange} onConfigChange={onConfigChange} />
        </main>
      </div>
      <PDFViewer cvData={mergedCV} configOverride={config} />
    </div>
  );
}
