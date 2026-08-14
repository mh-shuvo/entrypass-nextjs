"use client";
import {useState} from "react";
import UserModal from "./UserModal";
export default function CreateNewUserButton(){
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleNewUserButtonClick = () => {
        setIsOpen(true);
    };

    const closeButtonHandler = () =>{
        setIsOpen(false);
    }

    return (
        <>
                <button
                type="button" className="bg-green-600 text-white p-1 rounded hover:bg-green-700 cursor-pointer" 
                onClick={handleNewUserButtonClick}
                >
                    Create New
                </button>
                <UserModal isOpen={isOpen} onClose={closeButtonHandler} modalTitle={'Add New User'}/>
        </>
    )
}