"use client";

import { useState, useRef } from "react";

type Props = {
  placeholder: string;
  buttonText?: string;
  onAdd: (value: string) => void;
  disabled?: boolean;
};

const AddItemInput = ({ placeholder, buttonText = "Add", onAdd, disabled = false }: Props) => {
  const [value, setValue] = useState("");
  const isAddingRef = useRef(false);

  const handleAdd = () => {
    if (isAddingRef.current || disabled || !value.trim()) return;

    isAddingRef.current = true;
    
    // Call the onAdd callback with the trimmed value
    onAdd(value.trim());
    
    // Reset the input
    setValue("");
    
    // Reset the flag after a short delay
    setTimeout(() => {
      isAddingRef.current = false;
    }, 100);
  };

  return (
    <div className="flex flex-row mb-2">
      <input
        type="text"
        className="input join-item"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
          }
        }}
        disabled={disabled}
      />
      <button
        className="btn btn-action join-item"
        onClick={handleAdd}
        disabled={disabled}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default AddItemInput;
