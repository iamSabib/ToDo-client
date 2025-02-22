import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

function App() {
  const [box1, setBox1] = useState([
    { id: '1', title: 'Task 1', category: 'A' },
    { id: '2', title: 'Task 2',category: 'A' },
    { id: '3', title: 'Task 3',category: 'A' },
  ]);
  const [box2, setBox2] = useState([
    // { id: '4', title: 'Task 4',category: 'B' },
    // { id: '5', title: 'Task 5',category: 'B' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    // Determine source and destination boxes
    const activeBox = box1.find((item) => item.id === active.id) ? 'box1' : 'box2';
    const overBox = box1.find((item) => item.id === over.id) ? 'box1' : 'box2';

    if (activeBox === overBox) {
      // Reorder within the same box
      const items = activeBox === 'box1' ? [...box1] : [...box2];
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      
      activeBox === 'box1' ? setBox1(reorderedItems) : setBox2(reorderedItems);
    } else {
      // Move between boxes
      const sourceItems = activeBox === 'box1' ? [...box1] : [...box2];
      const destItems = overBox === 'box1' ? [...box1] : [...box2];
      const activeItem = sourceItems.find((item) => item.id === active.id);
      const overIndex = destItems.findIndex((item) => item.id === over.id);

      // Remove from source box
      const updatedSource = sourceItems.filter((item) => item.id !== active.id);
      
      // Insert into destination box
      const updatedDest = [
        ...destItems.slice(0, overIndex),
        activeItem,
        ...destItems.slice(overIndex),
      ];

      // Update state
      activeBox === 'box1' ? setBox1(updatedSource) : setBox2(updatedSource);
      overBox === 'box1' ? setBox1(updatedDest) : setBox2(updatedDest);
    }
  }

  return (
    <div className="flex justify-center space-x-8 p-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* Box 1 */}
        <div className="w-1/2 bg-gray-600 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4 text-white">Box 1</h2>
          <SortableContext
            items={box1}
            strategy={verticalListSortingStrategy}
          >
            
            {box1.map((item) => (
              <SortableItem key={item.id} id={item.id} title={item.title} />
            ))}
          </SortableContext>
        </div>

        {/* Box 2 */}
        <div className="w-1/2 bg-gray-600 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4 text-white">Box 2</h2>
          <SortableContext
            items={box2}
            strategy={verticalListSortingStrategy}
            
          >
            {
            
            box2.map((item) => (
              <SortableItem key={item.id} id={item.id} title={item.title} />
            ))
            }
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}

export default App;