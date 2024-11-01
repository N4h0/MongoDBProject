import Link from "next/link";

export default async function Home() {
  return (
    <>
    <h1>"Hei, dette er frammesida. Me bruker app routing fordi serverside routing ftw."</h1>
    <p>Her er ein link til "standardsida:"
    <Link
    href="/app-demo"
  >
    <code>app/app-demo/page.tsx</code>
  </Link>
  </p>
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
    Interaksjon med MongoDB</button>
  </>
  );
}
