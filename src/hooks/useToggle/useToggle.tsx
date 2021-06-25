import { useState } from 'react';

type useToggleReturn = {
  handleOpen: () => void;
  handleClose: () => void;
  handleToggle: () => void;
  isOpen: boolean;
};

/**
 * A hook to handle typical ui state management like toggling, opening and closing
 */

export const useToggle = (initialState = false): useToggleReturn => {
  const [isOpen, setIsOpen] = useState(initialState);

  const handleOpen = (): void => {
    setIsOpen(true);
  };

  const handleClose = (): void => {
    setIsOpen(false);
  };

  const handleToggle = (): void => {
    setIsOpen((isOpen) => !isOpen);
  };

  return {
    handleOpen,
    handleClose,
    handleToggle,
    isOpen,
  };
};
