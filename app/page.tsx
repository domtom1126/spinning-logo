import ImageSpinner from './components/ImageSpinner';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Spinning Image Upload
      </h1>
      <ImageSpinner />
    </main>
  );
}
