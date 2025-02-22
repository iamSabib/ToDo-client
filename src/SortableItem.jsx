import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// eslint-disable-next-line react/prop-types
export function SortableItem({ id, title, category }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    data: { data: {id ,title, category} },
   });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return <div
    ref={setNodeRef}
    style={style}
    className='bg-white p-3 mb-2 rounded shadow-md hover:bg-gray-300 text-black opacity-60  min-h-12 border-rose-500 border-2 cursor-grab'
    ></div>
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 mb-2 rounded shadow-md cursor-pointer hover:bg-gray-300 text-black"
    >
      {title}
    </div>
  );
}



