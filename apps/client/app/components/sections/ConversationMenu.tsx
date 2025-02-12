'use client';

interface KebabMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
}

export const KebabMenu: React.FC<KebabMenuProps> = ({ x, y, onClose, onDelete }) => {
  return (
    <div
      style={{ left: x, top: y }}
      className="absolute z-50 bg-white border rounded shadow-lg p-2"
    >
      <button className="block w-full text-left py-1 hover:bg-gray-100" onClick={onDelete}>
        Delete
      </button>
      <button className="block w-full text-left py-1 hover:bg-gray-100" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
};
