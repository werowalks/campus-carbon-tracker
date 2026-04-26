import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Mail, ArrowLeft } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="container py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl eco-gradient flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">WattLog</span>
        </Link>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </header>

      {/* Content */}
      <main className="container">
        <div className="py-20 md:py-32 max-w-2xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl eco-gradient mb-6">
            <Mail className="w-8 h-8 text-primary-foreground" />
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
            Contact Us
          </h1>

          <p className="text-lg text-muted-foreground mb-10">
            Have questions, feedback, or need support? We'd love to hear from you.
            Reach out to our team directly via email.
          </p>

          <div className="stat-card max-w-md mx-auto">
            <p className="text-sm text-muted-foreground mb-2">Email us at</p>
            <a
              href="mailto:campuswattwatch@gmail.com"
              className="text-xl md:text-2xl font-display font-semibold text-primary hover:underline break-all"
            >
              campuswattwatch@gmail.com
            </a>
          </div>

          <div className="mt-10">
            <a href="mailto:campuswattwatch@gmail.com">
              <Button size="lg" className="eco-gradient text-lg px-8">
                <Mail className="w-5 h-5 mr-2" />
                Send us an Email
              </Button>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container py-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Sustainable Campus Initiative. Built for a greener future.
          </p>
        </div>
      </footer>
    </div>
  );
}
