import { useEffect, useRef } from "react";
import "./styles/Cursor.css";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let hover = false;
    const cursor = cursorRef.current;
    if (!cursor) return;
    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };
    let frameId: number | null = null;
    const updateCursor = () => {
      frameId = null;
      if (hover) return;
      cursorPos.x += (mousePos.x - cursorPos.x) / 6;
      cursorPos.y += (mousePos.y - cursorPos.y) / 6;
      cursor.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`;
      if (Math.abs(mousePos.x - cursorPos.x) > 0.1 || Math.abs(mousePos.y - cursorPos.y) > 0.1) {
        frameId = requestAnimationFrame(updateCursor);
      }
    };
    const scheduleUpdate = () => {
      if (frameId === null) frameId = requestAnimationFrame(updateCursor);
    };
    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      scheduleUpdate();
    };
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    const hoverHandlers: Array<{
      element: HTMLElement;
      onEnter: (event: MouseEvent) => void;
      onLeave: () => void;
    }> = [];
    document.querySelectorAll("[data-cursor]").forEach((item) => {
      const element = item as HTMLElement;
      const onEnter = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        if (element.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");
          cursor.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          hover = true;
        }
        if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      };
      const onLeave = () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hover = false;
        scheduleUpdate();
      };
      element.addEventListener("mouseover", onEnter);
      element.addEventListener("mouseout", onLeave);
      hoverHandlers.push({ element, onEnter, onLeave });
    });
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      hoverHandlers.forEach(({ element, onEnter, onLeave }) => {
        element.removeEventListener("mouseover", onEnter);
        element.removeEventListener("mouseout", onLeave);
      });
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
