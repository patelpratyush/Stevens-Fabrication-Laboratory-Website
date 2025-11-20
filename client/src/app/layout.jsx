import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata = {
  title: "Stevens Fab Lab",
  description: "Stevens Fabrication Laboratory Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="w-full bg-stevens-maroon shadow-md">
          <Navigation />
        </header>
        <main className="max-w-6xl mx-auto p-6 py-8">{children}</main>
      </body>
    </html>
  );
}
