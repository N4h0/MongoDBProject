// app/clientSideComponents/TestButton.jsx
'use client';

function TestButton() {
  async function ReadTestData() {
    const response = await fetch('/api/readData/testbase/test'); // Call the updated API route
    const result = await response.json(); // Parse the JSON response
    console.log(result); // Log the data to the client-side console
  }

  return (
    <div>
      <button
        onClick={ReadTestData}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Read i consolen.
      </button>
    </div>
  );
}

export default TestButton;