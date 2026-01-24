import { TopNav } from '@/components/layout/TopNav';

export default function About() {
  return (
    <div className="min-h-screen">
      <TopNav />
      
      <main className="pt-24 px-4 pb-16">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-serif font-bold text-center mb-6">About Mandarin Lab</h1>
          
          <div className="glass-strong rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mandarin Lab was created with a simple goal: make Chinese learning natural and accessible to everyone. We believe that understanding the structure and meaning of sentences is key to mastering any language, especially one as rich and complex as Chinese.
            </p>
          </div>

          <div className="glass-strong rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4">Our Approach</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Unlike traditional learning methods that focus on rote memorization, Mandarin Lab emphasizes understanding. Our sentence breakdown tool helps you see exactly how Chinese sentences are constructed, while our AI tutor provides personalized guidance adapted to your learning style.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We combine modern AI technology with proven language learning principles to create an experience that's both effective and enjoyable. Whether you're a complete beginner or an advanced learner, Mandarin Lab adapts to your needs.
            </p>
          </div>

          <div className="glass-strong rounded-2xl p-8">
            <h2 className="text-2xl font-serif font-semibold mb-4">Why Choose Us</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Comprehensive Analysis</h3>
                <p className="text-muted-foreground">
                  Get detailed breakdowns of grammar, syntax, and word usage for any sentence
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Always Available</h3>
                <p className="text-muted-foreground">
                  Learn at your own pace, anytime, anywhere with our 24/7 available tools
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Personalized Learning</h3>
                <p className="text-muted-foreground">
                  Our AI tutor adapts to your questions and provides tailored explanations
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
