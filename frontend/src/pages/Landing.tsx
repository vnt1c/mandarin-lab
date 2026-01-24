import { useState } from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { SentenceInput } from '@/components/sentence/SentenceInput';
import { AuthModal } from '@/components/auth/AuthModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import heroImage from '@/assets/hero-watercolor.jpg';

export default function Landing() {
  const [authOpen, setAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze');

  const handleAnalyze = (text: string) => {
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      
      <main className="relative">
        {/* Hero Section */}
        <section 
          className="relative min-h-screen flex items-center justify-center px-4"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/80" />
          
          <div className="relative z-10 w-full max-w-3xl">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 tracking-tight">
                Master Chinese
                <br />
                <span className="text-primary">Naturally</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Break down sentences, explore meanings, and learn with an AI tutor
              </p>
            </div>

            <div className="glass-strong rounded-3xl p-8 shadow-elevated">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="analyze">Analyze Chinese sentence</TabsTrigger>
                  <TabsTrigger value="translate">How do I say…</TabsTrigger>
                </TabsList>

                <TabsContent value="analyze">
                  <SentenceInput
                    onAnalyze={handleAnalyze}
                    placeholder="Type a Chinese sentence..."
                  />
                </TabsContent>

                <TabsContent value="translate">
                  <SentenceInput
                    onAnalyze={handleAnalyze}
                    placeholder="How do I say... (English)"
                  />
                </TabsContent>
              </Tabs>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Sign in to unlock full analysis and save your learning progress
            </p>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-serif font-bold text-center mb-12">
              Everything you need to learn Chinese
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-strong rounded-2xl p-8 text-center shadow-soft hover:shadow-elevated transition-smooth">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">Sentence Breakdown</h3>
                <p className="text-muted-foreground">
                  Understand every character with detailed grammar analysis and pinyin
                </p>
              </div>

              <div className="glass-strong rounded-2xl p-8 text-center shadow-soft hover:shadow-elevated transition-smooth">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">Smart Dictionary</h3>
                <p className="text-muted-foreground">
                  Look up words with HSK levels, examples, and frequency data
                </p>
              </div>

              <div className="glass-strong rounded-2xl p-8 text-center shadow-soft hover:shadow-elevated transition-smooth">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">AI Tutor</h3>
                <p className="text-muted-foreground">
                  Practice conversation and get instant answers to your questions
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
