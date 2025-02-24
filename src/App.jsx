import { useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  TouchSensor,
  MouseSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import Column from './components/Column';
import { createPortal } from 'react-dom';

function App() {
  // State for tasks in each column with dummy data
  const [activeItem, setActiveItem] = useState(null);
  const [todo, setTodo] = useState([
    { id: '1', title: 'Task 1', category: 'todo' },
    { id: '2', title: 'Task 2', category: 'todo' },
    { id: '3', title: 'Task 3', category: 'todo' },
  ]);
  const [inprogress, setInprogress] = useState([
    { id: '4', title: 'Task 4', category: 'inprogress' },
    { id: '5', title: 'Task 5', category: 'inprogress' },
  ]);
  const [done, setDone] = useState([
    { id: '6', title: 'Task 6', category: 'done' },
    { id: '7', title: 'Task 7', category: 'done' },
  ]);

  // Memoized task IDs for each column
  const todoIds = useMemo(() => todo.map(item => item.id), [todo]);
  const inprogressIds = useMemo(() => inprogress.map(item => item.id), [inprogress]);
  const doneIds = useMemo(() => done.map(item => item.id), [done]);

  // DnD Sensors Setup
  const sensors = useSensors(
    // useSensor(PointerSensor,{
    //   activationConstraint: {
    //     distance: 10,
    //   },
    // }),
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    //sensor for touch devices
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper functions to find tasks and reorder them
  const findTaskById = (id) => {
    return [...todo, ...inprogress, ...done].find(item => item.id === id);
  };

  const reorderWithinColumn = (column, setColumn, activeId, overId) => {
    const activeIndex = column.findIndex(item => item.id === activeId);
    const overIndex = column.findIndex(item => item.id === overId);
    const reordered = arrayMove(column, activeIndex, overIndex);
    setColumn(reordered);
  };

  const moveTaskBetweenColumns = (
    sourceColumn, setSourceColumn, targetColumn, setTargetColumn,
    activeId, overId, newCategory
  ) => {
    if (!sourceColumn.some(task => task.id === activeId)) return; // Prevent redundant updates
  
    setSourceColumn(prev => {
      const updatedSource = prev.filter(task => task.id !== activeId);
      return updatedSource;
    });
  
    setTargetColumn(prev => {
      if (prev.some(task => task.id === activeId)) return prev; // Avoid unnecessary state update
      const updatedTask = { ...findTaskById(activeId), category: newCategory };
      const overIndex = prev.findIndex(task => task.id === overId);
      const updatedTarget = [...prev];
      if (overIndex === -1) {
        updatedTarget.push(updatedTask);
      } else {
        updatedTarget.splice(overIndex, 0, updatedTask);
      }
      return updatedTarget;
    });
  };
  

  // Handlers for Drag Events
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveItem(active.data.current.data);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    // Dragging over a column box (empty area)
    if (over?.data?.current?.type === 'box') {
      const activeCategory = active?.data?.current?.data?.category;
      if (over.id === activeCategory) return;

      moveTaskBetweenColumns(
        getColumnState(activeCategory), setColumnState(activeCategory),
        getColumnState(over.id), setColumnState(over.id),
        active.id, over.id, over.id
      );
      return;
    }

    // Dragging over a task (within the same or different column)
    if (active.id === over.id) return;

    const sourceTask = findTaskById(active.id);
    const targetTask = findTaskById(over.id);
    if (!sourceTask || !targetTask) return;

    if (sourceTask.category === targetTask.category) {
      reorderWithinColumn(
        getColumnState(sourceTask.category), setColumnState(sourceTask.category),
        active.id, over.id
      );
    } else {
      moveTaskBetweenColumns(
        getColumnState(sourceTask.category), setColumnState(sourceTask.category),
        getColumnState(targetTask.category), setColumnState(targetTask.category),
        active.id, over.id, targetTask.category
      );
    }
  };

  const handleDragEnd = () => {
    // console.log(todo, inprogress, done);
    console.log(todoIds, inprogressIds, doneIds);
    setActiveItem(null);
  };

  // Helper function to get column state and set column state
  const getColumnState = (category) => {
    switch (category) {
      case 'todo': return todo;
      case 'inprogress': return inprogress;
      case 'done': return done;
      default: return [];
    }
  };

  const setColumnState = (category) => {
    switch (category) {
      case 'todo': return setTodo;
      case 'inprogress': return setInprogress;
      case 'done': return setDone;
      default: return () => {};
    }
  };

  return (
    <div className="flex justify-center space-x-8 p-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Todo Column */}
        <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
          <Column id="todo" box={todo} setBox={setTodo} />
        </SortableContext>

        {/* In Progress Column */}
        <SortableContext items={inprogressIds} strategy={verticalListSortingStrategy}>
          <Column id="inprogress" box={inprogress} setBox={setInprogress} />
        </SortableContext>

        {/* Done Column */}
        <SortableContext items={doneIds} strategy={verticalListSortingStrategy}>
          <Column id="done" box={done} setBox={setDone}/>
        </SortableContext>

        {/* Drag Overlay */}
        {createPortal(
          <DragOverlay>
            {activeItem && <SortableItem id={activeItem.id} title={activeItem.title} category={activeItem.category} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default App;
