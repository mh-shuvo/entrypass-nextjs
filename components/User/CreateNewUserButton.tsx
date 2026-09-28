"use client";
import { useState } from "react";
import UserModal from "./UserModal";

export default function CreateNewUserButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleNewUserButtonClick = () => {
    setIsOpen(true);
  };

  const closeButtonHandler = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500"
        onClick={handleNewUserButtonClick}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
        Create New
      </button>
      <UserModal isOpen={isOpen} onClose={closeButtonHandler} modalTitle={"Add New User"} />
    </>
  );
}