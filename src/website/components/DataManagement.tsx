"use client";

import { useState, useRef } from "react";
import { exportData, importData, clearAllData } from "../helper/localStorage";

type Props = {
  onDataImported?: () => void;
  onDataCleared?: () => void;
};

const DataManagement = ({ onDataImported, onDataCleared }: Props) => {
  const [importError, setImportError] = useState<string | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [showClearSuccess, setShowClearSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportData();
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = importData(content);

        if (success) {
          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          // Show success message
          setShowImportSuccess(true);
        } else {
          setImportError("Failed to import data. The file may be corrupted.");
        }
      } catch (error) {
        console.error("Error importing data:", error);
        setImportError("Invalid file format. Please select a valid backup file.");
      }
    };

    reader.readAsText(file);
  };

  const handleClearData = () => {
    setShowConfirmClear(true);
  };

  const confirmClearData = () => {
    const success = clearAllData();
    if (success) {
      setShowConfirmClear(false);

      // Show success message
      setShowClearSuccess(true);
    } else {
      alert("Failed to clear data. Please try again.");
    }
  };

  const cancelClearData = () => {
    setShowConfirmClear(false);
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Data Management</h2>
        <p className="text-sm mb-4">
          You can export your CV data and configuration for backup, or import previously exported data.
        </p>

        <div className="flex flex-col gap-2">
          <button
            className="btn btn-primary"
            onClick={handleExport}
          >
            Export Data
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleImportClick}
          >
            Import Data
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleImportFile}
          />

          {importError && (
            <div className="text-error text-sm mt-1">{importError}</div>
          )}

          <button
            className="btn btn-outline btn-error mt-2"
            onClick={handleClearData}
          >
            Clear All Data
          </button>
        </div>

        {showConfirmClear && (
          <div className="mt-4 p-4 bg-base-300 rounded-lg">
            <p className="font-semibold text-error mb-2">Are you sure you want to clear all data?</p>
            <p className="text-sm mb-4">This will remove all your CV information and configuration settings. This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sm btn-ghost"
                onClick={cancelClearData}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={confirmClearData}
              >
                Yes, Clear All Data
              </button>
            </div>
          </div>
        )}

        {/* Import Success Modal */}
        {showImportSuccess && (
          <div className="mt-4 p-4 bg-success text-success-content rounded-lg">
            <p className="font-semibold mb-2">Data imported successfully!</p>
            <p className="text-sm mb-4">Your CV data and configuration have been imported. You need to refresh the page to see the changes.</p>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sm btn-success"
                onClick={() => {
                  setShowImportSuccess(false);
                  if (onDataImported) {
                    onDataImported();
                  }
                }}
              >
                Refresh Now
              </button>
            </div>
          </div>
        )}

        {/* Clear Success Modal */}
        {showClearSuccess && (
          <div className="mt-4 p-4 bg-success text-success-content rounded-lg">
            <p className="font-semibold mb-2">Data cleared successfully!</p>
            <p className="text-sm mb-4">All your CV data and configuration have been removed. You need to refresh the page to see the changes.</p>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sm btn-success"
                onClick={() => {
                  setShowClearSuccess(false);
                  if (onDataCleared) {
                    onDataCleared();
                  }
                }}
              >
                Refresh Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManagement;
