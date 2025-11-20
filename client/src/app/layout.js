import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Stevens Fab Lab",
  description: "Stevens Fabrication Laboratory Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="w-full border-b bg-white">
          <nav className="max-w-5xl mx-auto flex items-center justify-between p-4">
            <span className="font-semibold text-lg">Stevens Fab Lab</span>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/fabrication" className="hover:underline">
                Fabrication
              </Link>
              <Link href="/equipment" className="hover:underline">
                Equipment
              </Link>
              <Link href="/order" className="hover:underline">
                Order
              </Link>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </div>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
