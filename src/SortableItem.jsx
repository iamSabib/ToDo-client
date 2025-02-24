import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, Edit, Check } from "lucide-react"; // Importing icons for UI

export function SortableItem({ id, title, category, deleteTask, updateTask }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { data: { id, title, category } },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleUpdate = () => {
    if (newTitle.trim()) {
      updateTask(id, newTitle);
      setIsEditing(false);
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-200 p-3 mb-2 rounded-lg shadow-md opacity-50 min-h-12 border-2 border-rose-500 cursor-grabbing scale-105"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 mb-2 rounded-lg shadow-lg cursor-grab hover:bg-gray-100 text-black transition-all duration-200 border border-gray-300 hover:shadow-md active:scale-95"
    >
      <div className="flex justify-between items-center">
        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border rounded p-1 text-sm w-full mr-2"
          />
        ) : (
          <span className="font-medium text-gray-800">{title}</span>
        )}

        <div className="flex space-x-2">
          {isEditing ? (
            <button
              onClick={handleUpdate}
              className="btn btn-circle btn-xs btn-success hover:scale-110 transition-all duration-150 shadow-md"
            >
              <Check size={14} />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-circle btn-xs btn-warning hover:scale-110 transition-all duration-150 shadow-md"
            >
              <Edit size={14} />
            </button>
          )}
          <button
            onClick={() => deleteTask(id)}
            className="btn btn-circle btn-xs btn-error hover:scale-110 transition-all duration-150 shadow-md"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
