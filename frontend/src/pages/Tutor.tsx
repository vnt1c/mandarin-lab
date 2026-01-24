import { SideNav } from '@/components/layout/SideNav';
import { TutorChat } from '@/components/tutor/TutorChat';

export default function Tutor() {
  return (
    <div className="flex min-h-screen w-full">
      <SideNav />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-4xl font-serif font-bold mb-2">AI Tutor</h1>
            <p className="text-muted-foreground">
              Practice conversation and ask questions about Chinese grammar and vocabulary
            </p>
          </div>

          <TutorChat />
        </div>
      </main>
    </div>
  );
}
