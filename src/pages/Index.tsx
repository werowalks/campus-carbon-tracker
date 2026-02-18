import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Zap, BarChart3, Download, ArrowRight, Building2 } from 'lucide-react';
import ContactFormDialog from '@/components/ContactFormDialog';

export default function Index() {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="container py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl eco-gradient flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">WattLog</span>
        </div>
        <Link to="/login">
          <Button variant="outline">
            Sign In
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="container">
        <div className="py-20 md:py-32 max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            Sustainable Campus Initiative
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Track Your Campus
            <span className="block text-primary">Carbon Footprint</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            An integrated dashboard for universities to monitor energy consumption, 
            track carbon emissions, and build a more sustainable future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="eco-gradient text-lg px-8">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="pb-20 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">
              Log Energy Usage
            </h3>
            <p className="text-muted-foreground text-sm">
              Track device consumption across your campus with easy-to-use logging tools.
            </p>
          </div>

          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">
              Real-time Analytics
            </h3>
            <p className="text-muted-foreground text-sm">
              Visualize daily, weekly, and monthly carbon emissions with interactive charts.
            </p>
          </div>

          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-warning" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">
              Export Reports
            </h3>
            <p className="text-muted-foreground text-sm">
              Download comprehensive data in CSV or Excel format for further analysis.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Sustainable Campus Initiative. Built for a greener future.
          </p>
          <ContactFormDialog />
        </div>
      </footer>
    </div>
  );
}
