import { useState, useCallback } from "react";

export function useModal<T = null>() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const open = useCallback((item?: T) => {
    if (item !== undefined) {
      setActiveItem(item);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveItem(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    activeItem,
    setActiveItem,
    open,
    close,
    toggle
  };
}
