import { CVGenerator } from "cv-gen";
import { ComponentProps, useEffect, useState } from "react";
import { CVGeneratorConfig, CVInformations } from "../../lib/types";

type Props = ComponentProps<"iframe"> & {
  cvData: CVInformations;
  configOverride: CVGeneratorConfig;
};

const PDFViewer = ({ cvData, configOverride, ...props }: Props) => {
  const generator = new CVGenerator();

  return cvData !== null ? (
    <iframe
      title="pdf-view"
      className="basis-1 grow h-lvh"
      src={generator.generateCV(cvData, configOverride)}
    ></iframe>
  ) : (
    <div className="basis-1 grow h-lvh flex flex-col justify-center items-center">
      <span className="loading loading-ring loading-xl"></span>
    </div>
  );
};

export default PDFViewer;
