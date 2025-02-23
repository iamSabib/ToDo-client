import { useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import Column from './assets/components/Column';
import { createPortal } from 'react-dom';

function App() {
  // Store full task objects
  const [activeItem, setActiveItem] = useState(null);
  const [boxA, setBoxA] = useState([
    { id: '1', title: 'Task 1', category: 'A' },
    { id: '2', title: 'Task 2', category: 'A' },
    { id: '3', title: 'Task 3', category: 'A' },
  ]);
  const [boxB, setBoxB] = useState([
    { id: '4', title: 'Task 4', category: 'B' },
    { id: '5', title: 'Task 5', category: 'B' },
  ]);

  // Derive id arrays for each box to pass to SortableContext
  const boxAIds = useMemo(() => boxA.map(item => item.id), [boxA]);
  const boxBIds = useMemo(() => boxB.map(item => item.id), [boxB]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper: find task by id from both boxes
  const findTaskById = (id) => {
    return boxA.find(item => item.id === id) || boxB.find(item => item.id === id);
  };

  // Helper: reorder items within the same box
  const reorderWithinBox = (box, setBox, activeId, overId) => {
    const activeIndex = box.findIndex(item => item.id === activeId);
    const overIndex = box.findIndex(item => item.id === overId);
    const nextItems = arrayMove(box, activeIndex, overIndex);
    setBox(nextItems);
  };

  // Helper: move item between boxes with updated category
  const moveBetweenBoxes = (
    sourceBox,
    setSourceBox,
    targetBox,
    setTargetBox,
    activeId,
    overId,
    newCategory
  ) => {
    const activeIndex = sourceBox.findIndex(item => item.id === activeId);
    const task = sourceBox[activeIndex];
    const updatedTask = { ...task, category: newCategory };

    // Remove the item from source box
    setSourceBox(prev => prev.filter(item => item.id !== activeId));

    // Insert into target box at correct position; if overId not found, add at the end
    const overIndex = targetBox.findIndex(item => item.id === overId);
    setTargetBox(prev => {
      const next = [...prev];
      if (overIndex === -1) {
        next.push(updatedTask);
      } else {
        next.splice(overIndex, 0, updatedTask);
      }
      return next;
    });
  };

  // When dragging starts, store the full task object
  function handleDragStart(event) { 
    const { active } = event;
    setActiveItem(active.data.current.data);
  }

  function handleDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    // If dragging over a container rather than a task, skip reordering logic
    if (over.id === 'box1id' || over.id === 'box2id') return;

    if (active.id === over.id) return;

    const sourceTask = findTaskById(active.id);
    const targetTask = findTaskById(over.id);
    if (!sourceTask || !targetTask) return;

    // If same category, reorder within the same box
    if (sourceTask.category === targetTask.category) {
      if (sourceTask.category === 'A') {
        reorderWithinBox(boxA, setBoxA, active.id, over.id);
      } else if (sourceTask.category === 'B') {
        reorderWithinBox(boxB, setBoxB, active.id, over.id);
      }
    } else {
      // Move between boxes and update the task's category accordingly
      if (sourceTask.category === 'A' && targetTask.category === 'B') {
        moveBetweenBoxes(boxA, setBoxA, boxB, setBoxB, active.id, over.id, 'B');
      } else if (sourceTask.category === 'B' && targetTask.category === 'A') {
        moveBetweenBoxes(boxB, setBoxB, boxA, setBoxA, active.id, over.id, 'A');
      }
    }
  }

  function handleDragEnd(event) {
    setActiveItem(null);
  }

  return (
    <div className="flex justify-center space-x-8 p-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Box A */}
        <SortableContext
          items={boxAIds}
          strategy={verticalListSortingStrategy}
        >
          <Column id="box1id" box={boxA} />
        </SortableContext>

        {/* Box B */}
        <SortableContext
          items={boxBIds}
          strategy={verticalListSortingStrategy}
        >
          <Column id="box2id" box={boxB} />
        </SortableContext>

        {createPortal(
          <DragOverlay>
            {activeItem && (
              <SortableItem
                id={activeItem.id}
                title={activeItem.title}
                category={activeItem.category}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default App;
