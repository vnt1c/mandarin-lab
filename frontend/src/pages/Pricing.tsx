import { TopNav } from '@/components/layout/TopNav';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="min-h-screen">
      <TopNav />
      
      <main className="pt-24 px-4 pb-16">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl font-serif font-bold text-center mb-6">Simple Pricing</h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Choose the plan that works best for your learning goals
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-strong rounded-2xl p-8 border-2 border-transparent hover:border-primary transition-smooth">
              <h3 className="text-2xl font-serif font-semibold mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>10 sentence analyses per day</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Basic dictionary access</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Limited AI tutor chat</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Get Started</Button>
            </div>

            <div className="glass-strong rounded-2xl p-8 border-2 border-primary shadow-elevated relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-serif font-semibold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$12</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Unlimited sentence analyses</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Full dictionary access</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Unlimited AI tutor chat</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Save unlimited sentences</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full">Start Pro Trial</Button>
            </div>

            <div className="glass-strong rounded-2xl p-8 border-2 border-transparent hover:border-primary transition-smooth">
              <h3 className="text-2xl font-serif font-semibold mb-2">Team</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$40</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Up to 5 team members</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Shared saved sentences</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Team analytics</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
