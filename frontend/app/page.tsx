import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-gray-900/5 dark:ring-white/10">
        <ChatInterface />
      </div>
    </main>
  );
}
