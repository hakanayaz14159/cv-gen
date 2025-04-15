import { Metadata } from "next";
import "./App.css";

export const metadata: Metadata = {
  title: "CV Generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
