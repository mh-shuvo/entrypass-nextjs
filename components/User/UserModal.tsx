"use client";
interface NewUserModalProps {
    isOpen:boolean,
    onClose: () => void,
    modalTitle:string

}
export default function UserModal({ isOpen, onClose,modalTitle}: NewUserModalProps) {
    if(!isOpen){
        return null;
    }
    return(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">
                &times;
                </button>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {modalTitle}
                </h3>
                <div className="mb-6">
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow appearance-none focus:outline-none focus:shadow-outline dark:text-gray-300"
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            autoComplete="name"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow appearance-none focus:outline-none focus:shadow-outline dark:text-gray-300"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            autoComplete="email"
                        />
                    </div>
                </div>
                
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                        Cancel
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Confirm
                    </button>
                </div>

            </div>
            </div>

        </>
    )
}