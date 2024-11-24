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

    // Hent alle databaser når den laster
    useEffect(() => {
        async function fetchDatabases() {
            try {
                const response = await fetch('/api/getAllDatabases');
                const data = await response.json();
                setDatabases(data); // Set the fetched databases in state
            } catch (error) {
                console.error("Failed to load databases:", error);
            }
        }
        fetchDatabases();
    }, []);

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

    // Log the storedDatabase when it changes
    useEffect(() => {
        if (storedDatabase) {
            console.log("Currently stored database:", storedDatabase);
        }
    }, [storedDatabase]); // Dependency on storedDatabase


    useEffect(() => { //Endre aktiv collection kvar gong me endrar aktiv DB
        async function fetchCollections() {
            setCollections([]);
            if (storedDatabase) {
                const collectionsResponse = await fetch(`/api/getCollections/${encodeURIComponent(storedDatabase)}`);
                const collectionsData = await collectionsResponse.json();
                setCollections(collectionsData);
            }
        }
        fetchCollections();
    }, [storedDatabase]); // Runs whenever storedDatabase changes


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
                                        href="#"
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
        </>
    );
}

export default DropDownDatabases;