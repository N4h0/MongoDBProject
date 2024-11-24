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
                if (!storedCollection) { //Default er at den fyrste ollection i ei samling er aktiv, og dokumenta i den blir vist.
                    setStoredCollection(collectionsData[0])
                }
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
                        Database
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
                        Collections
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
        Documents in Collection: {storedCollection || "None Selected"}
    </h2>
    {documents.length > 0 ? (
        <ul className="list-disc list-inside">
            {documents.map((doc, index) => (
                <li key={index} className="text-gray-700">
                    {JSON.stringify(doc, null, 2)} {/* Display the document as JSON */}
                </li>
            ))}
        </ul>
    ) : (
        <p className="text-gray-500">No documents found or loading...</p>
    )}
</div>



        </>
    );
}

export default DropDownDatabases;