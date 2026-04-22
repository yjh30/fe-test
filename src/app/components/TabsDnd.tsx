'use client'

import type { ReactNode } from "react";

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { XCircleIcon, Bars3Icon } from "@heroicons/react/24/solid";

type Tab = {
  key: string;
  index: number;
  visible: boolean;
  icon: ReactNode;
  component: ReactNode;
};

function SortablePanel({
  tab,
  onClose,
}: {
  tab: Tab;
  onClose: (key: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tab.key,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "flex-1 flex flex-col bg-white min-w-[300px] shrink-0 [border-right:1px_solid_#ccc]",
        isDragging ? "opacity-70" : "opacity-100",
      ].join(" ")}
    >
      <div className="bg-[#e8e6e6] py-2 px-2 flex items-center gap-2">
        <div
          className="cursor-grab active:cursor-grabbing text-black/70 hover:text-black"
          aria-label={`Drag ${tab.key}`}
          {...attributes}
          {...listeners}
        >
          <Bars3Icon className="size-6" />
        </div>
        <div className="flex-1 text-center">{tab.key}</div>
        <div
          className="cursor-pointer"
          aria-label={`Close ${tab.key}`}
          onClick={() => onClose(tab.key)}
        >
          <XCircleIcon className="size-6" />
        </div>
      </div>
      {tab.component}
    </div>
  );
}

export default function TabsDnd({
  visibleTabs,
  onClose,
  onReorderVisibleTabs,
}: {
  visibleTabs: Tab[];
  onClose: (key: string) => void;
  onReorderVisibleTabs: (activeKey: string, overKey: string) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;
    onReorderVisibleTabs(String(active.id), String(over.id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={visibleTabs.map(t => t.key)} strategy={horizontalListSortingStrategy}>
        {visibleTabs.map(tab => (
          <SortablePanel key={tab.key} tab={tab} onClose={onClose} />
        ))}
      </SortableContext>
    </DndContext>
  );
}

