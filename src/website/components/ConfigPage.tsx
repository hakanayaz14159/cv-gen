"use client";

import { useEffect, useState, useCallback } from "react";
import { CVGeneratorConfig } from "../../lib/types";
import { CVSection } from "../../lib/enum";
import { jsPDF } from "jspdf";
import DataManagement from "./DataManagement";

type Props = {
  onConfigChange?: (config: CVGeneratorConfig) => void;
};

const ConfigPage = ({ onConfigChange }: Props = {}) => {
  // Get the initial config from localStorage
  const getInitialConfig = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedConfig = localStorage.getItem('cv-gen-config');
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          console.log('ConfigPage: Initializing with saved config:', parsedConfig);
          return parsedConfig;
        }
      } catch (error) {
        console.error('Error loading initial config:', error);
      }
    }
    return {
      marginX: 10,
      marginY: 15,
      lineSpacing: 7,
      font: "Helvetica",
      fontScale: 1,
      titleLocation: "left",
      languageGrader: "common",
      contactOrientation: "horizontal",
      layout: [
        CVSection.ABOUT,
        CVSection.SKILLS,
        CVSection.EXPERIENCES,
        CVSection.PROJECTS,
        CVSection.EDUCATION,
        CVSection.CERTIFICATES,
        CVSection.LANGUAGES,
      ],
    };
  };

  const [config, setConfig] = useState<CVGeneratorConfig>(getInitialConfig());
  const [isInitialized, setIsInitialized] = useState(false);
  const [availableFonts, setAvailableFonts] = useState<string[]>([]);
  const [sectionOrder, setSectionOrder] = useState<CVSection[]>(config.layout || []);

  // Get available fonts from jsPDF
  useEffect(() => {
    try {
      const doc = new jsPDF();
      const fontList = doc.getFontList();
      const fonts = Object.keys(fontList);

      // Filter out duplicate font names (case-insensitive)
      const uniqueFonts = fonts.reduce((acc: string[], font) => {
        const lowerCaseFont = font.toLowerCase();
        // Check if we already have this font in a different case
        const exists = acc.some(f => f.toLowerCase() === lowerCaseFont);
        if (!exists) {
          acc.push(font);
        }
        return acc;
      }, []);

      // Sort alphabetically
      uniqueFonts.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

      setAvailableFonts(uniqueFonts);
    } catch (error) {
      console.error("Error getting font list:", error);
      // Fallback to common fonts
      setAvailableFonts(["Helvetica", "Courier", "Times"]);
    }
  }, []);

  // Update config when any value changes
  useEffect(() => {
    // Only update the parent if we've already initialized or have non-default config
    if (onConfigChange && (isInitialized || Object.keys(config).length > 0)) {
      console.log('ConfigPage: Calling onConfigChange with:', config);
      onConfigChange(config);
      setIsInitialized(true);
    }
  }, [config, onConfigChange, isInitialized]);

  // Update section order in config
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      layout: sectionOrder
    }));
  }, [sectionOrder]);

  // Handle moving a section up in the order
  const moveSectionUp = useCallback((index: number) => {
    if (index <= 0) return;
    setSectionOrder(prev => {
      const newOrder = [...prev];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      return newOrder;
    });
  }, []);

  // Handle moving a section down in the order
  const moveSectionDown = useCallback((index: number) => {
    if (index >= sectionOrder.length - 1) return;
    setSectionOrder(prev => {
      const newOrder = [...prev];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      return newOrder;
    });
  }, [sectionOrder.length]);

  // Get all available sections
  const getAllSections = (): CVSection[] => [
    CVSection.ABOUT,
    CVSection.SKILLS,
    CVSection.EXPERIENCES,
    CVSection.PROJECTS,
    CVSection.EDUCATION,
    CVSection.CERTIFICATES,
    CVSection.LANGUAGES,
  ];

  // Get excluded sections (sections not in the current order)
  const getExcludedSections = (): CVSection[] => {
    const allSections = getAllSections();
    return allSections.filter(section => !sectionOrder.includes(section));
  };

  // Get section name for display
  const getSectionName = (section: CVSection): string => {
    switch (section) {
      case CVSection.ABOUT: return "About";
      case CVSection.SKILLS: return "Skills";
      case CVSection.EXPERIENCES: return "Experiences";
      case CVSection.PROJECTS: return "Projects";
      case CVSection.EDUCATION: return "Education";
      case CVSection.CERTIFICATES: return "Certificates";
      case CVSection.LANGUAGES: return "Languages";
      default: return "Unknown Section";
    }
  };

  // Add a section back to the layout
  const includeSection = useCallback((section: CVSection) => {
    setSectionOrder(prev => [...prev, section]);
  }, []);

  // Remove a section from the layout
  const excludeSection = useCallback((index: number) => {
    setSectionOrder(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Layout Configuration */}
      <fieldset className="fieldset p-4">
        <legend className="fieldset-legend">Layout</legend>

        <div className="mb-4">
          <label className="fieldset-label">Margins (mm)</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Horizontal (X)</label>
              <input
                type="number"
                className="input w-full"
                min="5"
                max="30"
                value={config.marginX}
                onChange={(e) => setConfig(prev => ({ ...prev, marginX: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="text-sm">Vertical (Y)</label>
              <input
                type="number"
                className="input w-full"
                min="5"
                max="30"
                value={config.marginY}
                onChange={(e) => setConfig(prev => ({ ...prev, marginY: Number(e.target.value) }))}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="fieldset-label">Line Spacing</label>
          <input
            type="range"
            min="5"
            max="12"
            value={config.lineSpacing}
            className="range"
            step="0.5"
            onChange={(e) => setConfig(prev => ({ ...prev, lineSpacing: Number(e.target.value) }))}
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>Compact</span>
            <span>Current: {config.lineSpacing}</span>
            <span>Spacious</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="fieldset-label">Font Scale</label>
          <input
            type="range"
            min="0.8"
            max="1.2"
            value={config.fontScale}
            className="range"
            step="0.05"
            onChange={(e) => setConfig(prev => ({ ...prev, fontScale: Number(e.target.value) }))}
          />
          <div className="w-full flex justify-between text-xs px-2">
            <span>Smaller</span>
            <span>Current: {config.fontScale.toFixed(2)}x</span>
            <span>Larger</span>
          </div>
        </div>
      </fieldset>

      {/* Typography Configuration */}
      <fieldset className="fieldset p-4">
        <legend className="fieldset-legend">Typography</legend>

        <div className="mb-4">
          <label className="fieldset-label">Font</label>
          <select
            className="select w-full"
            value={config.font}
            onChange={(e) => setConfig(prev => ({ ...prev, font: e.target.value }))}
          >
            {availableFonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="fieldset-label">Title Position</label>
          <select
            className="select w-full"
            value={config.titleLocation}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              titleLocation: e.target.value as "left" | "center" | "right"
            }))}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="fieldset-label">Contact Information Layout</label>
          <select
            className="select w-full"
            value={config.contactOrientation}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              contactOrientation: e.target.value as "horizontal" | "vertical"
            }))}
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="fieldset-label">Language Proficiency Format</label>
          <select
            className="select w-full"
            value={config.languageGrader}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              languageGrader: e.target.value as "common" | "cefr"
            }))}
          >
            <option value="common">Common (Basic, Intermediate, etc.)</option>
            <option value="cefr">CEFR (A1, B2, C1, etc.)</option>
          </select>
        </div>
      </fieldset>

      {/* Section Order Configuration */}
      <fieldset className="fieldset p-4 col-span-1 md:col-span-2">
        <legend className="fieldset-legend">Section Order</legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Included Sections */}
          <div>
            <h3 className="font-semibold mb-2">Included Sections</h3>
            <div className="overflow-y-auto max-h-96 border border-base-300 rounded-lg p-3">
              {sectionOrder.length > 0 ? (
                sectionOrder.map((section, index) => (
                  <div key={section} className="flex items-center justify-between p-2 border-b border-base-300 last:border-b-0">
                    <span className="font-medium">{getSectionName(section)}</span>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => moveSectionUp(index)}
                        disabled={index === 0}
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => moveSectionDown(index)}
                        disabled={index === sectionOrder.length - 1}
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        className="btn btn-sm btn-error btn-outline"
                        onClick={() => excludeSection(index)}
                        title="Exclude Section"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-base-content/70 italic">
                  No sections included. Add sections from the excluded list.
                </div>
              )}
            </div>
          </div>

          {/* Excluded Sections */}
          <div>
            <h3 className="font-semibold mb-2">Excluded Sections</h3>
            <div className="overflow-y-auto max-h-96 border border-base-300 rounded-lg p-3">
              {getExcludedSections().length > 0 ? (
                getExcludedSections().map((section) => (
                  <div key={section} className="flex items-center justify-between p-2 border-b border-base-300 last:border-b-0">
                    <span className="font-medium text-base-content/70">{getSectionName(section)}</span>
                    <button
                      className="btn btn-sm btn-success btn-outline"
                      onClick={() => includeSection(section)}
                      title="Include Section"
                    >
                      +
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-base-content/70 italic">
                  No excluded sections. All sections are included in your CV.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-base-200 rounded-lg">
          <p className="text-sm">Use the up and down arrows to reorder sections. Use the ✕ button to exclude a section from your CV, or the + button to include it again.</p>
        </div>
      </fieldset>

      {/* Preview Section */}
      <fieldset className="fieldset p-4 col-span-1 md:col-span-2">
        <legend className="fieldset-legend">Preview</legend>

        <div className="p-4 bg-base-200 rounded-lg">
          <p className="text-center">Your changes are automatically applied to the PDF preview on the right.</p>
          <p className="text-center text-sm mt-2 opacity-70">The preview updates in real-time as you modify the configuration settings.</p>
        </div>
      </fieldset>

      {/* Data Management Section */}
      <fieldset className="fieldset p-4 col-span-1 md:col-span-2">
        <legend className="fieldset-legend">Data Management</legend>

        <DataManagement
          onDataImported={() => window.location.reload()}
          onDataCleared={() => window.location.reload()}
        />
      </fieldset>
    </div>
  );
};

export default ConfigPage;
