// frå https://tailwindui.com/components/application-ui/elements/dropdowns
"use client";
import { useState, useEffect } from 'react';
// usestate: https://nextjs.org/learn/react-foundations/updating-state 
import CustomModal from './CustomModal.js';

function DropDownDatabases() {
    //Constants for modal
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalInputs, setModalInputs] = useState([{ key: '', value: '' }]);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [isAddingDatabase, setIsAddingDatabase] = useState(false);

    const [isDropdownVisible1, setDropdownVisible1] = useState(false);
    const [isDropdownVisible2, setDropdownVisible2] = useState(false);
    const [databases, setDatabases] = useState([]); // State to store databases
    const [storedDatabase, setStoredDatabase] = useState(null);
    const [collections, setCollections] = useState([]); //State to store collections
    const [storedCollection, setStoredCollection] = useState(null); //currently active collection
    const [documents, setDocuments] = useState([]); //State to store documents
    const [inputs, setInputs] = useState([{ key: "", value: "" }]) //Input for ny verdi i tom collection
    const [newDocument, setNewDocument] = useState(null); // State for the new row

    //Update newDocument state when the input fields change
    const handleNewDocumentChange = (field, value) => {
        setNewDocument((prev) => ({ ...prev, [field]: value }));
    };

    // Add a new row to the table to create a new document with existing keys
    const handleAddNewRow = () => {
        if (!newDocument) {
            // Initialize newDocument with fields from existing documents
            setNewDocument(Object.keys(documents[0]).reduce((acc, key) => {
                acc[key] = key === '_id' ? null : ''; // Leave _id null, other fields empty
                return acc;
            }, {}));
        }
    };

    // Create a new document in the current collection with existing keys
    const handleCreateDocument = async () => {
        if (!newDocument) return;

        try {
            const url = `/api/createDocument/${encodeURIComponent(storedDatabase)}/${encodeURIComponent(storedCollection)}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: newDocument }), // Send the new document
            });

            if (!response.ok) {
                throw new Error(`Failed to create document: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Document created:', result);

            // Add the new document to the state and reset the new row
            setDocuments((prev) => [...prev, newDocument]);
            setNewDocument(null);
        } catch (error) {
            console.error('Error creating document:', error);
        }
    };

    //Update modal input fields on change
    const handleModalChange = (event, index, type) => {
        const { value } = event.target;
        const updatedInputs = [...modalInputs];
        updatedInputs[index][type] = value;
        setModalInputs(updatedInputs);
    };

    //add new input field to modal
    const handleModalAddInput = () => {
        if (!isAddingDatabase) {
            setModalInputs([...modalInputs, { key: '', value: '' }]);
        }
    };

    //delete input field from modal
    const handleModalDeleteInput = (index) => {
        if (!isAddingDatabase) {
            const updatedInputs = modalInputs.filter((_, i) => i !== index);
            setModalInputs(updatedInputs);
        }
    };

    //Save new database, collection or document
    const handleModalSave = async () => {
        try {
            let payload = {};

            if (modalTitle === 'Create Database') {
                const database = modalInputs[0].key;
                const collection = modalInputs[0].value;
                if (database && collection) {
                    payload = { database, collection };
                } else {
                    alert('Please provide both database and collection names.');
                    return;
                }
            } else if (modalTitle === 'Create Collection') {
                const database = modalInputs[0].key;
                const collection = modalInputs[0].value;
                if (database && collection) {
                    payload = { database, collection };
                } else {
                    alert('Please provide both database and collection names.');
                    return;
                }
            } else if (modalTitle === 'Create Document') {
                const documentData = modalInputs.reduce((acc, input) => {
                    if (input.key) acc[input.key] = input.value;
                    return acc;
                }, {});
                if (Object.keys(documentData).length > 0) {
                    payload = { data: documentData }; // Wrap the object in a "data" property
                    createNewDocument(payload);
                }

            }

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            console.log(`${modalTitle} successfully created.`);
        } catch (error) {
            console.error(`Error during ${modalTitle} creation:`, error);
        }

        setModalOpen(false);
    };

    //Open modal for creating database, collection or document
    const handleModalOpen = (title) => {
        setModalTitle(title);

        if (title === 'Create Database' || title === 'Create Collection') {
            if (title === 'Create Database') {
                setModalInputs([{ key: '', value: '' }]); // Database name and initial collection name
            } else {
                setModalInputs([{ key: storedDatabase, value: '' }]);  // Only collection name
            }
            setIsAddingDatabase(true); //Display DB and collection field
            setApiEndpoint('/api/createDatabase');
        } else if (title === 'Create Document') {
            setModalInputs([{ key: '', value: '' }]); // Key-value pairs for document
            setIsAddingDatabase(false);

        }
        setModalOpen(true);
    };

    //Delete database
    async function deleteDatabase(input) {
        const url = `/api/deleteDatabase/${encodeURIComponent(input)}`;
        try {
            console.log("input:", input)
            const response = await fetch(url);
        }
        catch (error) {
            console.log('Error deleting document.')
        }
    }

    //Delete collection
    async function deleteCollection(input) {
        const url = `/api/deleteCollection/${encodeURIComponent(storedDatabase)}/${encodeURIComponent(input)}`;
        try {
            console.log("input:", input)
            const response = await fetch(url);
        }
        catch (error) {
            console.log('Error deleting document.')
        }
    }

    //Delete document
    async function deleteHoverDocument(input) {
        const url = `/api/deleteDocument/${encodeURIComponent(storedDatabase)}/${encodeURIComponent(storedCollection)}/${encodeURIComponent(input)}`;
        try {
            console.log("input:", input)
            const response = await fetch(url);
        }
        catch (error) {
            console.log('Error deleting document.')
        }
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

    //set documents whenever storedCollection changes
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

    // API call to create new document
    const createNewDocument = async (documentData) => {
        const url = `/api/createDocument/${encodeURIComponent(storedDatabase)}/${encodeURIComponent(storedCollection)}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(documentData), // Wrap the data in a "data" object
            });

            if (!response.ok) {
                throw new Error(`Failed to create document: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Document created successfully:', result);
            return result;
        } catch (error) {
            console.error('Error creating document:', error);
            throw error;
        }
    };

    // API call to update a document
    const updateDocument = async (doc) => {
        const url = `/api/updateDocument/${encodeURIComponent(storedDatabase)}/${encodeURIComponent(storedCollection)}/${encodeURIComponent(doc._id)}`;
    
        try {
            const { _id, ...data } = doc;
    
            const response = await fetch(url, {
                method: 'PUT', // Use PUT for updates
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data }), // Wrap data in a `data` field
            });
    
            if (!response.ok) {
                throw new Error(`Failed to update document: ${response.statusText}`);
            }
    
            const result = await response.json();
            console.log('Document updated successfully:', result);
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };
    
    //updates fields when an user makes a change
    const handleEditChange = (docIndex, field, value) => {
        const updatedDocuments = [...documents];
        updatedDocuments[docIndex][field] = value; // Update the specific field in the document
        setDocuments(updatedDocuments);
    };

    //dropdown toggles, should be merged and dropdown should be moved to a sepparate file
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
            <div
                className="relative inline-block text-left right-0"
                onMouseLeave={closeDropdown1}
            >
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
                                <p className="block px-4 py-2 text-sm text-gray-700">
                                    No databases found
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <button
                onClick={() => handleModalOpen('Create Database')}
                className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-sm font-bold rounded-full cursor-pointer hover:bg-blue-600 ml-2"
            >
                +
            </button>
            <button
                onClick={() => deleteDatabase(storedDatabase)}
                className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-sm font-bold rounded-full cursor-pointer hover:bg-blue-600 ml-2"
            >
                -
            </button>
            <p></p>
    
            {/* Second Dropdown */}
            Active collection:
            <div
                className="relative inline-block text-left right-0"
                onMouseLeave={closeDropdown2}
            >
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
                                <p className="block px-4 py-2 text-sm text-gray-700">
                                    No collections found
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <button
                onClick={() => handleModalOpen('Create Collection')}
                className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-sm font-bold rounded-full cursor-pointer hover:bg-blue-600 ml-2"
            >
                +
            </button>
            <button
                onClick={() => deleteCollection(storedCollection)}
                className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-sm font-bold rounded-full cursor-pointer hover:bg-blue-600 ml-2"
            >
                -
            </button>
    
            {/* Data Table with New Row Feature */}
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc, docIndex) => (
                                <tr key={docIndex} className="hover:bg-gray-50">
                                    {Object.keys(doc).map((field, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
                                        >
                                            {field !== '_id' ? (
                                                <input
                                                    className="w-full bg-gray-100 border-gray-300 rounded px-2 py-1"
                                                    type="text"
                                                    value={doc[field] || ''}
                                                    onChange={(e) =>
                                                        handleEditChange(
                                                            docIndex,
                                                            field,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            ) : (
                                                doc[field]
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        <button
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
                                            onClick={() => updateDocument(doc)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded ml-2"
                                            onClick={() =>
                                                deleteHoverDocument(doc._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {newDocument && (
                                <tr className="bg-yellow-50">
                                    {Object.keys(newDocument).map((field, index) => (
                                        <td
                                            key={index}
                                            className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
                                        >
                                            {field !== '_id' ? (
                                                <input
                                                    className="w-full bg-white border-gray-300 rounded px-2 py-1"
                                                    type="text"
                                                    placeholder={`Enter ${field}`}
                                                    value={newDocument[field] || ''}
                                                    onChange={(e) =>
                                                        handleNewDocumentChange(
                                                            field,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <span className="text-gray-400 italic">
                                                    Auto-generated
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                                            onClick={handleCreateDocument}
                                        >
                                            Create
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                ) : (
                    <button
                        onClick={() => handleModalOpen('Create Document')}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                        Create new document
                    </button>
                )}
                {documents.length > 0 && !newDocument && (
                    <button
                        onClick={handleAddNewRow}
                        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Add New Line
                    </button>
                )}
            </div>
    
            {/* Modal */}
            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={modalTitle}
                inputs={modalInputs}
                onChange={handleModalChange}
                onAddInput={handleModalAddInput}
                onDeleteInput={handleModalDeleteInput}
                onSave={handleModalSave}
                isAddingDatabase={isAddingDatabase}
            />
        </>
    );
    
}

export default DropDownDatabases;