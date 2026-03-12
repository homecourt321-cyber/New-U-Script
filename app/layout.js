export const metadata = {
  title: "NUL Connection Widget",
  description: "AI-powered connection script generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
