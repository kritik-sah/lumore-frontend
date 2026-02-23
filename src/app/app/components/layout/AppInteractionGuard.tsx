"use client";

import { useEffect } from "react";

const isCopyAllowedTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest(".chat-copy-allowed"));
};

export const AppInteractionGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    const preventCtrlZoom = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    const preventKeyboardZoom = (event: KeyboardEvent) => {
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;
      if (!isCmdOrCtrl) return;
      const zoomKeys = ["+", "=", "-", "_", "0"];
      if (zoomKeys.includes(event.key)) {
        event.preventDefault();
      }
    };

    const preventPinchZoom = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    document.addEventListener("wheel", preventCtrlZoom, { passive: false });
    document.addEventListener("keydown", preventKeyboardZoom, {
      passive: false,
    });
    document.addEventListener("touchmove", preventPinchZoom, {
      passive: false,
    });

    return () => {
      document.removeEventListener("wheel", preventCtrlZoom);
      document.removeEventListener("keydown", preventKeyboardZoom);
      document.removeEventListener("touchmove", preventPinchZoom);
    };
  }, []);

  return (
    <div
      className="app-guard h-full"
      onCopyCapture={(event) => {
        if (!isCopyAllowedTarget(event.target)) {
          event.preventDefault();
        }
      }}
      onCutCapture={(event) => {
        if (!isCopyAllowedTarget(event.target)) {
          event.preventDefault();
        }
      }}
      onDragStartCapture={(event) => {
        const target = event.target;
        if (target instanceof HTMLImageElement) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </div>
  );
};


