'use client'

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import UiMap from "@/app/components/UiMap";
import UiMusic from "@/app/components/UiMusic";
import UiChat from "@/app/components/UiChat";
import TabsDnd from "@/app/components/TabsDnd";

import { MapIcon, MusicalNoteIcon, ChatBubbleBottomCenterIcon, XCircleIcon, Bars3Icon } from '@heroicons/react/24/solid'

type Tab = {
  key: string;
  index: number;
  visible: boolean;
  icon: ReactNode,
  component: ReactNode;
};

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>([
    { key: 'Map', index: 0, visible: true, icon: <MapIcon className="size-6" />, component: <UiMap /> },
    { key: 'Music', index: 1, visible: true, icon: <MusicalNoteIcon className="size-6" />, component: <UiMusic /> },
    { key: 'Chat', index: 2, visible: true, icon: <ChatBubbleBottomCenterIcon className="size-6" />, component: <UiChat /> },
  ])
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onClose = (key: string) => {
    setTabs((prev: Tab[]) => prev.map((tab: Tab) => (tab.key === key ? { ...tab, visible: false } : tab)))
  }

  const onOpen = (key: string) => {
    setTabs((prev: Tab[]) => prev.map((tab: Tab) => (tab.key === key ? { ...tab, visible: true } : tab)))
  }

  const onReorderVisibleTabs = (activeKey: string, overKey: string) => {
    if (activeKey === overKey) return;
    setTabs((prev: Tab[]) => {
      const visibleTabs = prev.filter((t: Tab) => t.visible);
      const hiddenTabs = prev.filter((t: Tab) => !t.visible);

      const oldIndex = visibleTabs.findIndex(t => t.key === activeKey);
      const newIndex = visibleTabs.findIndex(t => t.key === overKey);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const nextVisible = [...visibleTabs];
      const [moved] = nextVisible.splice(oldIndex, 1);
      nextVisible.splice(newIndex, 0, moved);

      return [...nextVisible, ...hiddenTabs].map((t, i) => ({ ...t, index: i }));
    });
  }

  const visibleTabs = tabs.filter((tab: Tab) => tab.visible);

  return (
    <div className="w-full flex"> 
      <div className="flex flex-col [border-right:1px_solid_#ccc] p-2.5 h-screen box-border">
        {
          tabs.map((tab: Tab) => (
            <div
              key={tab.key}
              className={[
                "mt-8 flex flex-col justify-center items-center rounded px-3 py-2",
                tab.visible ? "bg-black text-white" : "bg-transparent text-black hover:bg-black/5 cursor-pointer",
              ].join(" ")}
              onClick={() => onOpen(tab.key)}
            >
              <div>{tab.key}</div>
              {tab.icon}
            </div>
          ))
        }
      </div>
      <div className="flex-1 min-w-0 flex overflow-x-scroll">
        {
          visibleTabs.length === 0 ? null : (
            mounted ? (
              <TabsDnd
                visibleTabs={visibleTabs}
                onClose={onClose}
                onReorderVisibleTabs={onReorderVisibleTabs}
              />
            ) : (
              <div className="flex-1 min-w-0 flex">
                {visibleTabs.map((tab: Tab) => (
                  <div
                    key={tab.key}
                    className="flex-1 flex flex-col bg-white min-w-[300px] shrink-0 [border-right:1px_solid_#ccc]"
                  >
                    <div className="bg-[#e8e6e6] py-2 px-2 flex items-center gap-2">
                      <div className="text-black/40" aria-hidden>
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
                ))}
              </div>
            )
          )
        }
      </div>
    </div>
  );
}
