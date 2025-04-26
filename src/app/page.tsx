import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Uniscope</h1>
        <p className="text-lg mb-4">
          Welcome to Uniscope, to see the list of reviews{' '}
          <Link href="/review" className="text-blue-500">
            go to reviews
          </Link>
        </p>
      </div>
    </main>
  );
}
