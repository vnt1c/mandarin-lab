import { TopNav } from '@/components/layout/TopNav';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <TopNav />
      
      <main className="pt-24 px-4 pb-16">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-serif font-bold text-center mb-6">Our Services</h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Comprehensive tools to accelerate your Chinese learning journey
          </p>

          <div className="space-y-8">
            <div className="glass-strong rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">Sentence Analysis</h2>
              <p className="text-muted-foreground mb-4">
                Break down any Chinese sentence into its component parts. Get detailed information about each character including pinyin, part of speech, meanings, and grammar notes. Perfect for understanding complex sentence structures.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Character-by-character breakdown</li>
                <li>Grammar and syntax explanations</li>
                <li>Dependency parsing</li>
                <li>Save sentences for later review</li>
              </ul>
            </div>

            <div className="glass-strong rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">Dictionary</h2>
              <p className="text-muted-foreground mb-4">
                Access a comprehensive Chinese-English dictionary with HSK levels, frequency data, and example sentences. Search by characters or pinyin to quickly find the information you need.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Multiple definitions and contexts</li>
                <li>HSK level indicators</li>
                <li>Frequency information</li>
                <li>Real-world example sentences</li>
              </ul>
            </div>

            <div className="glass-strong rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">AI Tutor</h2>
              <p className="text-muted-foreground mb-4">
                Chat with our AI tutor to get instant answers to your questions about Chinese grammar, vocabulary, and usage. Practice conversations and receive personalized guidance.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>24/7 availability</li>
                <li>Grammar explanations</li>
                <li>Conversation practice</li>
                <li>Learning recommendations</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigate('/')}>
              Get Started
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
