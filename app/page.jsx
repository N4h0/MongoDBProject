import Link from "next/link";
import TestButton from "./clientSideComponents/clientSideComponents"; // Import the client-side component

export default async function Home() {
  return (
    <>
      <h1>"Hei, dette er frammesida. Me bruker app routing fordi serverside routing ftw."</h1>
      <h1>"Desverre må me ha med nokre client-side komponentat, feks knappen under :("</h1>
      <TestButton/>
      <p></p>
      <Link href="/api/testConnection" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
        <code>Test autorisasjon til database (link)</code>
      </Link>
    </>

  );
}
