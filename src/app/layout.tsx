import "./globals.css";

export const metadata = {
  title: "Miftahul Huda — Full-Stack Developer",
  description: "Portfolio of Miftahul Huda, a Full-Stack Web Developer focused on building modern, fast, and scalable web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased grain">
        {children}
      </body>
    </html>
  );
}