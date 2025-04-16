"use client";

type Props = {
  items: string[];
  onRemove: (index: number) => void;
  emptyMessage?: string;
};

const ItemsList = ({ items, onRemove, emptyMessage = "No items added yet." }: Props) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-2 text-base-content/70 italic">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="border border-base-300 rounded-lg p-2 max-h-32 overflow-y-auto">
      <ul className="list-disc pl-5">
        {items.map((item, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <span className="text-sm">{item}</span>
            <button
              className="btn btn-xs btn-error"
              onClick={() => onRemove(idx)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsList;
