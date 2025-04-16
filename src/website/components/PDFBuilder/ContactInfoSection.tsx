"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { CVInformations } from "../../../lib/types";
import { formatPhoneNumberPart, formatUrl, isValidEmail, COMMON_COUNTRY_CODES } from "../../helper/formatters";

type Props = {
  personalCV: Partial<CVInformations>;
  setPersonalCV: Dispatch<SetStateAction<Partial<CVInformations>>>;
};

const ContactInfoSection = ({ personalCV, setPersonalCV }: Props) => {
  // Contact information state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");

  // Initialize phone number from CV data if it exists
  useEffect(() => {
    if (personalCV.contactInformations?.phoneNumber) {
      const phoneStr = personalCV.contactInformations.phoneNumber;
      // Extract country code and phone number
      const countryCodeMatch = phoneStr.match(/^\+\d+/);
      if (countryCodeMatch) {
        const countryCode = countryCodeMatch[0];
        setSelectedCountryCode(countryCode);
        setPhoneNumber(phoneStr.replace(countryCode, "").trim());
      } else {
        setPhoneNumber(phoneStr);
      }
    }
  }, [personalCV.contactInformations?.phoneNumber]);

  return (
    <fieldset className="fieldset grid grid-cols-2 col-span-2 p-4">
      <legend className="fieldset-legend">
        Contact Informations
      </legend>
      <label className="fieldset-label">Email</label>
      <div className="relative">
        <input
          type="text"
          className={`input w-full ${personalCV.contactInformations?.email && !isValidEmail(personalCV.contactInformations.email) ? 'border-red-500' : ''}`}
          placeholder="alexandra.johnson@example.com"
          value={personalCV.contactInformations?.email || ""}
          onChange={(e) => {
            const email = e.target.value.trim();
            setPersonalCV((p) => {
              if (p.contactInformations === undefined) {
                p.contactInformations = {};
              }

              if (email.length > 0) {
                // Store the email and validate it
                p.contactInformations.email = email;
              } else {
                delete p.contactInformations.email;
              }

              return Object.assign({}, p);
            });
          }}
        />
        {personalCV.contactInformations?.email && !isValidEmail(personalCV.contactInformations.email) && (
          <div className="text-xs text-red-500 mt-1">
            Please enter a valid email address
          </div>
        )}
      </div>
      <label className="fieldset-label">Phone Number</label>
      <div className="relative">
        <div className="flex mb-1">
          <select
            className="select select-bordered w-1/3 mr-2"
            value={selectedCountryCode}
            onChange={(e) => {
              setSelectedCountryCode(e.target.value);

              // Update the CV data with the new country code
              setPersonalCV((p) => {
                if (p.contactInformations === undefined) {
                  p.contactInformations = {};
                }

                // Combine country code with existing phone number
                if (phoneNumber.trim().length > 0) {
                  p.contactInformations.phoneNumber = `${e.target.value} ${phoneNumber}`.trim();
                }

                return Object.assign({}, p);
              });
            }}
          >
            {COMMON_COUNTRY_CODES.map((country) => (
              <option key={country.name} value={country.code}>
                {country.flag} {country.code} ({country.name})
              </option>
            ))}
          </select>
          <input
            type="text"
            className="input w-full"
            placeholder="123 456 7890"
            value={phoneNumber}
            onChange={(e) => {
              const formattedNumber = formatPhoneNumberPart(e.target.value);
              setPhoneNumber(formattedNumber);

              // Update the CV data with the new phone number
              setPersonalCV((p) => {
                if (p.contactInformations === undefined) {
                  p.contactInformations = {};
                }

                if (formattedNumber.trim().length > 0) {
                  p.contactInformations.phoneNumber = `${selectedCountryCode} ${formattedNumber}`.trim();
                } else {
                  delete p.contactInformations.phoneNumber;
                }

                return Object.assign({}, p);
              });
            }}
          />
        </div>
      </div>
      <label className="fieldset-label">Website</label>
      <input
        type="text"
        className="input w-full"
        placeholder="https://www.example.com"
        value={personalCV.contactInformations?.webpage || ""}
        onChange={(e) => {
          const website = formatUrl(e.target.value);
          setPersonalCV((p) => {
            if (p.contactInformations === undefined) {
              p.contactInformations = {};
            }

            if (website.trim().length > 0) {
              p.contactInformations.webpage = website;
            } else {
              delete p.contactInformations.webpage;
            }

            return Object.assign({}, p);
          });
        }}
      />
      <label className="fieldset-label">LinkedIn</label>
      <input
        type="text"
        className="input w-full"
        placeholder="https://www.linkedin.com/in/username"
        value={personalCV.contactInformations?.linkedIn || ""}
        onChange={(e) => {
          const linkedin = formatUrl(e.target.value);
          setPersonalCV((p) => {
            if (p.contactInformations === undefined) {
              p.contactInformations = {};
            }

            if (linkedin.trim().length > 0) {
              p.contactInformations.linkedIn = linkedin;
            } else {
              delete p.contactInformations.linkedIn;
            }

            return Object.assign({}, p);
          });
        }}
      />
      <label className="fieldset-label">GitHub</label>
      <input
        type="text"
        className="input w-full"
        placeholder="https://github.com/username"
        value={personalCV.contactInformations?.github || ""}
        onChange={(e) => {
          const github = formatUrl(e.target.value);
          setPersonalCV((p) => {
            if (p.contactInformations === undefined) {
              p.contactInformations = {};
            }

            if (github.trim().length > 0) {
              p.contactInformations.github = github;
            } else {
              delete p.contactInformations.github;
            }

            return Object.assign({}, p);
          });
        }}
      />
    </fieldset>
  );
};

export default ContactInfoSection;
