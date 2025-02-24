import { useState, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableItem } from "../../SortableItem";

const Column = ({ id, box, setTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "box" },
  });

  const [isAdding, setIsAdding] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const inputRef = useRef(null);

  // Automatically focus input when the user clicks "Add Task"
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  // Handles adding a task
  const addTask = () => {
    if (taskTitle.trim() === "") return;
    setTask((prev) => [...prev, { id: Date.now().toString(), title: taskTitle, category: id }]);
    setTaskTitle("");
    setIsAdding(false);
  };

  // Close input when clicking outside or losing focus
  const handleBlur = (e) => {
    if (!e.relatedTarget || e.relatedTarget.id !== `add-btn-${id}`) {
      setIsAdding(false);
    }
  };

  return (
    <div ref={setNodeRef} className={`w-1/3 bg-gray-800 p-4 rounded-lg shadow-md ${isOver ? "border-2 border-green-500" : ""}`}>
      <h2 className="text-xl font-semibold text-white mb-4 capitalize">{id}</h2>

      {box?.map((item) => (
        <SortableItem key={item.id} id={item.id} title={item.title} category={item.category} />
      ))}

      <div className="mt-4">
        {isAdding ? (
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              className="input input-sm input-bordered w-full text-white border-green-400 focus:outline-none focus:ring-0"
              placeholder="Enter task title..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button id={`add-btn-${id}`} className="btn btn-sm btn-success" onClick={addTask}>
              +
            </button>
          </div>
        ) : (
          <button className="btn btn-sm btn-primary w-full" onClick={() => setIsAdding(true)}>
            Add Task
          </button>
        )}
      </div>
    </div>
  );
};

export default Column;
