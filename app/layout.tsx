import './globals.css';

export const metadata = {
  title: 'CareerFlow',
  description: 'Créer, améliorer et gérer vos documents professionnels et scolaires.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
