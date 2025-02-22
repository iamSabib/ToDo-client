import {useDroppable} from '@dnd-kit/core';
import { SortableItem } from '../../SortableItem';
// import { useState } from 'react';

const Column = ({id, box}) => {

    const {setNodeRef, isOver} = useDroppable({
        id,
    });

    // const {isOver, setIsOver} = useState(false);
    // console.log("Is Over :",isOver)

    // console.log("Box2",box,id);

    return (
        <div ref={setNodeRef} className={`w-1/2 bg-gray-600 p-4 rounded-lg ${isOver ? "border border-green-800" : ""}`}>
            <h2 className="text-lg font-bold mb-4 text-white">Box 2</h2>
            {box?.map((item) => (
              <SortableItem key={item.id} id={item.id} title={item.title} category={item.category} />
            ))}
        </div>
    );
};

export default Column;



