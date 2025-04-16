"use client";

import { Dispatch, SetStateAction, useState, useRef } from "react";
import { CVInformations, CVCertificate } from "../../../lib/types";

type Props = {
  personalCV: Partial<CVInformations>;
  setPersonalCV: Dispatch<SetStateAction<Partial<CVInformations>>>;
};

const CertificatesSection = ({ personalCV, setPersonalCV }: Props) => {
  // Certificate state
  const [certificateName, setCertificateName] = useState("");
  const [issuingOrganization, setIssuingOrganization] = useState("");
  const [acquiredDate, setAcquiredDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [hasExpiry, setHasExpiry] = useState(false);
  const [verificationId, setVerificationId] = useState("");

  // Refs to prevent double submissions
  const isAddingCertificate = useRef(false);

  // Function to handle adding certificate
  const handleAddCertificate = () => {
    if (isAddingCertificate.current || !certificateName.trim() || !issuingOrganization.trim() || !acquiredDate) {
      return;
    }

    isAddingCertificate.current = true;

    // Capture current values
    const certificateData = {
      certificateName: certificateName.trim(),
      issuingOrganization: issuingOrganization.trim(),
      acquiredDate,
      expiryDate,
      hasExpiry,
      verificationId: verificationId.trim()
    };

    // Reset form fields immediately
    setCertificateName("");
    setIssuingOrganization("");
    setAcquiredDate("");
    setExpiryDate("");
    setHasExpiry(false);
    setVerificationId("");

    // Create certificate object
    const certificate: CVCertificate = {
      name: certificateData.certificateName,
      issuingOrganization: certificateData.issuingOrganization,
      acquiredWhen: new Date(certificateData.acquiredDate)
    };

    if (certificateData.hasExpiry && certificateData.expiryDate) {
      certificate.endsWhen = new Date(certificateData.expiryDate);
    }

    if (certificateData.verificationId !== "") {
      certificate.verificationId = certificateData.verificationId;
    }

    // Update CV state
    setPersonalCV((p) => {
      const newCV = { ...p };
      if (!newCV.certificates) {
        newCV.certificates = [];
      }
      newCV.certificates = [...newCV.certificates, certificate];
      return newCV;
    });

    // Reset flag after a delay
    setTimeout(() => {
      isAddingCertificate.current = false;
    }, 200);
  };

  return (
    <fieldset className="fieldset col-span-3 p-4">
      <legend className="fieldset-legend">
        Certificates
      </legend>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="fieldset-label">Certificate Name</label>
          <input
            type="text"
            className="input w-full mb-2"
            placeholder="AWS Certified Solutions Architect"
            value={certificateName}
            onChange={(e) => setCertificateName(e.target.value)}
          />

          <label className="fieldset-label">Issuing Organization</label>
          <input
            type="text"
            className="input w-full mb-2"
            placeholder="Amazon Web Services"
            value={issuingOrganization}
            onChange={(e) => setIssuingOrganization(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="fieldset-label">Acquired Date</label>
              <input
                type="date"
                className="input w-full"
                value={acquiredDate}
                onChange={(e) => setAcquiredDate(e.target.value)}
              />
            </div>
            <div>
              <label className="fieldset-label">Expiry Date</label>
              <div className="flex flex-col">
                <input
                  type="date"
                  className="input w-full"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  disabled={!hasExpiry}
                />
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    className="checkbox mr-2"
                    checked={hasExpiry}
                    onChange={(e) => setHasExpiry(e.target.checked)}
                  />
                  <span className="text-sm">Has Expiry Date</span>
                </div>
              </div>
            </div>
          </div>

          <label className="fieldset-label">Verification ID (optional)</label>
          <input
            type="text"
            className="input w-full mb-2"
            placeholder="ABC123XYZ"
            value={verificationId}
            onChange={(e) => setVerificationId(e.target.value)}
          />

          <button
            className="btn btn-action w-full mt-4"
            onClick={handleAddCertificate}
            disabled={!certificateName.trim() || !issuingOrganization.trim() || !acquiredDate}
          >
            Add Certificate
          </button>
        </div>

        <div>
          <label className="fieldset-label">Current Certificates</label>
          <div className="overflow-y-auto max-h-96 border border-base-300 rounded-lg p-3">
            {personalCV.certificates && personalCV.certificates.length > 0 ? (
              personalCV.certificates.map((cert, certIdx) => (
                <div key={certIdx} className="mb-6 pb-4 border-b border-base-300 last:border-b-0 last:mb-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{cert.name}</h3>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => {
                        setPersonalCV((p) => {
                          if (p.certificates) {
                            p.certificates = p.certificates.filter((_, i) => i !== certIdx);
                          }
                          return Object.assign({}, p);
                        });
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="ml-2 p-3 bg-base-200 rounded-md">
                    <div className="font-semibold">{cert.issuingOrganization}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="badge badge-sm bg-base-100">
                        Acquired: {new Date(cert.acquiredWhen).toLocaleDateString()}
                      </span>
                      {cert.endsWhen && (
                        <span className="badge badge-sm bg-base-100">
                          Expires: {new Date(cert.endsWhen).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {cert.verificationId && (
                      <div className="text-sm mt-2 opacity-80">
                        <span className="font-semibold">Verification ID:</span> {cert.verificationId}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-base-content/70 italic">
                No certificates added yet. Add your certificates to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default CertificatesSection;
