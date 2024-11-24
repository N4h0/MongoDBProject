// frå https://tailwindui.com/components/application-ui/elements/dropdowns
"use client";
import { useState, useEffect } from 'react';
// usestate: https://nextjs.org/learn/react-foundations/updating-state 

function DropDownDatabases() {
    const [isDropdownVisible1, setDropdownVisible1] = useState(false);
    const [isDropdownVisible2, setDropdownVisible2] = useState(false);
    const [databases, setDatabases] = useState([]); // State to store databases
    const [storedDatabase, setStoredDatabase] = useState(null);
    const [collections, setCollections] = useState([]); //State to store collections
    const [storedCollection, setStoredCollection] = useState(null); //currently active collection
    const [documents, setDocuments] = useState([]); //State to store documents
    const [firstDocumentInput, setFirstDocumentInput] = useState(false); //Show le input form for first document in a collection
    const [firstDocumentData, setFirstDocumentData] = useState({}); //Maybe dont need this?
    const [fields, setFields] = useState([{ key: "", value: "" }]); //Felt som vises i popupen

    const addField = () => {
        setFields([...fields, { key: "", value: "" }]);
    };

    // Handle input changes
    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const updatedFields = [...fields];
        updatedFields[index][name] = value;
        setFields(updatedFields);
    };

    // Hent alle databaser når den laster, set aktiv DB til den fyrste hvis aktiv DB ikkje er set.
    useEffect(() => {
        async function fetchDatabases() {
            try {
                const response = await fetch('/api/getAllDatabases');
                const data = await response.json();
                setDatabases(data); // Set the fetched databases in state
                if (!storedDatabase) {
                    setStoredDatabase(data[0])
                }
            } catch (error) {
                console.error("Failed to load databases:", error);
            }
        }
        fetchDatabases();
    }, []);

    useEffect(() => { //Endre aktiv collections (samling av enkelte collection :P) kvar gong me endrar aktiv DB
        async function fetchCollections() {
            setCollections([]);
            if (storedDatabase) {
                const collectionsResponse = await fetch(`/api/getCollections/${encodeURIComponent(storedDatabase)}`);
                const collectionsData = await collectionsResponse.json();
                setCollections(collectionsData);
                setStoredCollection(collectionsData[0])
            }
        }
        fetchCollections();
    }, [storedDatabase]); // Runs whenever storedDatabase changes

    useEffect(() => {
        async function fetchDocuments() {
            setDocuments([]);
            if (storedDatabase) {
                const documentsResponse = await fetch(`/api/getDocuments/${encodeURIComponent(storedDatabase)}/${encodeURIComponent(storedCollection)}`);
                const documentsData = await documentsResponse.json();
                setDocuments(documentsData);
            }
        }
        fetchDocuments();
    }, [storedCollection]); // Runs whenever storedColletion changes

    async function CreateNewDocument() {
        const response = await fetch(
            `/api/createFirstDocument/${encodeURIComponent(storedDatabase)}/${encodeURIComponent(storedCollection)}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: {
                        name: "New Item",
                        createdAt: new Date().toISOString(),
                        isActive: true,
                    },
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json(); // Parse the JSON response
        console.log("Document created:", result); // Log the success response
    }

    const toggleDropdown1 = () => {
        setDropdownVisible1(!isDropdownVisible1);
    };

    const closeDropdown1 = () => {
        setDropdownVisible1(false);
    };

    const toggleDropdown2 = () => {
        setDropdownVisible2(!isDropdownVisible2);
    };

    const closeDropdown2 = () => {
        setDropdownVisible2(false);
    };

    return (
        <>
            {/* First Dropdown */}
            Active database:
            <div className="relative inline-block text-left right-0"
                onMouseLeave={closeDropdown1}>
                <div>
                    <button
                        type="button"
                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        id="menu-button"
                        aria-expanded={isDropdownVisible1}
                        aria-haspopup="true"
                        onMouseEnter={toggleDropdown1}
                    >
                        {storedDatabase}
                        <svg
                            className="-mr-1 h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                {isDropdownVisible1 && (
                    <div
                        className="right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabIndex="-1"
                    >
                        <div className="py-1" role="none">
                            {/* Render the fetched databases as dropdown items */}
                            {databases.length > 0 ? (
                                databases.map((db, index) => (
                                    <a
                                        key={index}
                                        onClick={() => setStoredDatabase(db)}
                                        className="block px-4 py-2 text-sm text-gray-700"
                                        role="menuitem"
                                        tabIndex="-1"
                                    >
                                        {db}
                                    </a>
                                ))
                            ) : (
                                <p className="block px-4 py-2 text-sm text-gray-700">No databases found</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <p></p>
            {/* Second Dropdown */}
            Active collection:
            <div className="relative inline-block text-left right-0"
                onMouseLeave={closeDropdown2}>
                <div>
                    <button
                        type="button"
                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        id="menu-button"
                        aria-expanded={isDropdownVisible2}
                        aria-haspopup="true"
                        onMouseEnter={toggleDropdown2}
                    >
                        {storedCollection}
                        <svg
                            className="-mr-1 h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                {isDropdownVisible2 && (
                    <div
                        className="right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabIndex="-1"
                    >
                        <div className="py-1" role="none">
                            {/* Render the fetched databases as dropdown items */}
                            {collections.length > 0 ? (
                                collections.map((db, index) => (
                                    <a
                                        key={index}
                                        onClick={() => setStoredCollection(db)}
                                        className="block px-4 py-2 text-sm text-gray-700"
                                        role="menuitem"
                                        tabIndex="-1"
                                    >
                                        {db}
                                    </a>
                                ))
                            ) : (
                                <p className="block px-4 py-2 text-sm text-gray-700">No collections found</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* Data */}
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                </h2>
                {documents.length > 0 ? (
                    <table className="min-w-full table-auto border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                {Object.keys(documents[0]).map((column, index) => (
                                    <th
                                        key={index}
                                        className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700"
                                    >
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc, docIndex) => (
                                <tr key={docIndex} className="hover:bg-gray-50">
                                    {Object.keys(doc).map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
                                        >
                                            {typeof doc[column] === "object" && doc[column] !== null
                                                ? JSON.stringify(doc[column])
                                                : doc[column]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <button
                        onClick={CreateNewDocument}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        Create new document
                    </button>
                )}

            </div>
            {/* Popup */}

            {firstDocumentInput}

            <button
                onClick={() => setFirstDocumentInput(true)} // Open modal
                className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                type="button"
            >
                Toggle modal
            </button>

            {/* Main modal, from https://flowbite.com/docs/components/modal/*/}
            {firstDocumentInput && (
                <div id="default-modal" tabIndex="-1" aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Create new document in the <strong className="text-blue-600">{storedCollection}</strong> collection and <strong className="text-green-600">{storedDatabase}</strong> database.
                                </h3>
                                <button type="button"
                                    onClick={() => setFirstDocumentInput(false)}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* Modal body */}
                            <div className="p-4 md:p-5 space-y-4">
                                    <form className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        <label>
                                            Key:
                                            <input type="text" className="text-black" name="name" />
                                        </label>
                                        <label>
                                            Value:
                                            <input type="text" className="text-black" name="name" />
                                        </label>
                                    </form>
                            </div>
                            {/* Modal footer */}
                            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button data-modal-hide="default-modal" type="button"
                                    onClick={() => setFirstDocumentInput(false)}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create new document</button>
                                <button data-modal-hide="default-modal" type="button"
                                    onClick={() => setFirstDocumentInput(false)}
                                    className="py-2.5 px-5 ms-3 text-sm font-6u754rweyfgregmedium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DropDownDatabases;