 {/* Main modal, from https://flowbite.com/docs/components/modal/*/}
function CustomModal({ 
    isOpen, 
    onClose, 
    title, 
    inputs, 
    onChange, 
    onAddInput, 
    onDeleteInput, 
    onSave, 
    isAddingDatabase 
}) {
    if (!isOpen) return null;

    return (
        <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="default-modal"
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-4 md:p-5 space-y-4">
                        {inputs.map((item, index) => (
                            <div
                                className="text-base leading-relaxed text-gray-500 dark:text-gray-400"
                                key={index}
                            >
                                {isAddingDatabase ? (
                                    <>
                                        <label className="block mb-1">Database:</label>
                                        <input
                                            className="text-black mb-2 block w-full p-2 border border-gray-300 rounded"
                                            name="key"
                                            type="text"
                                            value={item.key}
                                            onChange={(event) => onChange(event, index, 'key')}
                                        />
                                        <label className="block mb-1">Collection:</label>
                                        <input
                                            className="text-black block w-full p-2 border border-gray-300 rounded"
                                            name="value"
                                            type="text"
                                            value={item.value}
                                            onChange={(event) => onChange(event, index, 'value')}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <label className="block mb-1">Key:</label>
                                        <input
                                            className="text-black mb-2 block w-full p-2 border border-gray-300 rounded"
                                            name="key"
                                            type="text"
                                            value={item.key}
                                            onChange={(event) => onChange(event, index, 'key')}
                                        />
                                        <label className="block mb-1">Value:</label>
                                        <input
                                            className="text-black block w-full p-2 border border-gray-300 rounded"
                                            name="value"
                                            type="text"
                                            value={item.value}
                                            onChange={(event) => onChange(event, index, 'value')}
                                        />
                                    </>
                                )}
                                {!isAddingDatabase && inputs.length > 1 && (
                                    <button
                                        onClick={() => onDeleteInput(index)}
                                        className="mt-2 text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))}
                        {!isAddingDatabase && (
                            <button
                                onClick={onAddInput}
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Add Field
                            </button>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button
                            data-modal-hide="default-modal"
                            type="button"
                            onClick={onSave}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Save
                        </button>
                        <button
                            data-modal-hide="default-modal"
                            type="button"
                            onClick={onClose}
                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomModal;
