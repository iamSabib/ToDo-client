import { useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
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
  const [activeId, setActiveId] = useState(null);
  const [box1, setBox1] = useState([
    { id: '1', title: 'Task 1', category: 'A' },
    { id: '2', title: 'Task 2', category: 'A' },
    { id: '3', title: 'Task 3', category: 'A' },
  ]);
  const [box2, setBox2] = useState([
    // "meow",
    { id: '4', title: 'Task 4',category: 'B' },
    { id: '5', title: 'Task 5',category: 'B' },
  ]);

  const taskIds1 = useMemo(() => box1.map(({ id }) => id), [box1]);
  const taskIds2 = useMemo(() => box2.map(({ id }) => id), [box2]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return;
    console.log("Over",over)

  }

  function handleDragStart(event) { 
    const {active} = event;
    // console.log("Active",active.data.current.data)
    setActiveId(active.data.current.data);
    return;
  }

  function handleDragOver(event) {
    const { active, over } = event;
    // console.log("Over in over",over)
    // if (!over) return;
    // if(over.id === '4'){
    //   console.log("Box2")
    //   //remove from box1 and add to box2
    //   const activeIndex = box1.findIndex((item) => item.id === activeId);
    //   const overIndex = box2.findIndex((item) => item.id === over.id);
    //   const item = box1[activeIndex];
    //   console.log("Item",item)
    //   setBox1((items) => {
    //     const nextState = [...items];
    //     nextState.splice(activeIndex, 1);
    //     return nextState;
    //   });
    //   setBox2((items) => {
    //     const nextState = [...items];
    //     nextState.splice(overIndex, 0, item);
    //     return nextState;
    //   });
    // }

    if(!over) return;
    const activeId = active.id;
    const overId = over.id;

    if(activeId === overId) return;

    if( active?.data?.current?.data?.category === over?.data?.current?.data?.category){
      console.log("Same Category")
      const activeIndex = box1.findIndex((item) => item.id === activeId);
    }
     
 
  }

  return (
    <div className="flex justify-center space-x-8 p-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        {/* Box 1 */}
          <SortableContext
            items={box1}
            strategy={verticalListSortingStrategy}
          >
            <Column id={"box1id"} box={box1}/>
          </SortableContext>
        

        {/* Box 2 */}
        <SortableContext
          items={box2}
          strategy={verticalListSortingStrategy}
        >
          <Column id={"box2id"} box={box2}/>
        </SortableContext>

        {createPortal(
          <DragOverlay>
            {activeId && (
              <SortableItem
                id={activeId}
                title={activeId.title}
                category={activeId.category
              }
              />
              )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
}

export default App;