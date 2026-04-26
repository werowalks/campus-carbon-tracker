import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Leaf, ArrowLeft, ArrowRight, Calculator, BookOpen, Database, Target } from 'lucide-react';
import {
  CAMPUS_DEVICES,
  CAMPUS_DEVICE_CATEGORIES,
  getDevicesByCategory,
} from '@/data/campusDevices';

export default function About() {
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
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </header>

      <main className="container pb-20">
        {/* Hero */}
        <section className="max-w-4xl mx-auto text-center py-12 md:py-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Target className="w-4 h-4" />
            About WattLog
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
            Empowering Campuses Toward
            <span className="block text-primary">Energy Awareness</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            WattLog is a Sustainable Campus Initiative developed to help universities
            and campuses generate real-time data on their energy consumption. By
            making electricity usage and carbon emissions visible as they happen,
            the platform empowers institutions to measure, understand, and reduce
            their environmental footprint through evidence-based insights.
          </p>
        </section>

        {/* Description */}
        <section className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6">
            <BookOpen className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-display font-semibold text-lg mb-2">What It Is</h3>
            <p className="text-sm text-muted-foreground">
              An integrated dashboard that lets campus members log device usage and
              instantly see the resulting energy and carbon impact.
            </p>
          </Card>
          <Link to="/demo" className="group">
            <Card className="p-6 h-full transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1 cursor-pointer relative">
              <Database className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-display font-semibold text-lg mb-2 flex items-center gap-2">
                How It Works
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">
                Users select a device, enter the duration of use, and the system
                computes kilowatt-hours and CO₂ emissions using verified formulas.
              </p>
              <span className="text-xs text-primary font-medium mt-3 inline-block">
                Try the interactive demo →
              </span>
            </Card>
          </Link>
          <Card className="p-6">
            <Target className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-display font-semibold text-lg mb-2">Why It Matters</h3>
            <p className="text-sm text-muted-foreground">
              By making energy use visible, WattLog supports data-driven sustainability
              decisions and a culture of responsible consumption on campus.
            </p>
          </Card>
        </section>

        {/* Calculation Methodology */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              How Energy & Carbon Are Computed
            </h2>
          </div>

          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="font-display font-semibold text-lg mb-2">
                1. Energy Consumption (kWh)
              </h3>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm md:text-base">
                kWh = (Wattage × Duration in minutes) ÷ 60,000
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Wattage is divided by 1,000 to convert watts to kilowatts, and minutes
                are divided by 60 to convert to hours — combined into a single
                divisor of 60,000.
              </p>
            </div>

            <div>
              <h3 className="font-display font-semibold text-lg mb-2">
                2. Carbon Emissions (kg CO₂)
              </h3>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm md:text-base">
                Carbon = kWh × 0.7 kg CO₂/kWh
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                The emission factor of <strong>0.7 kg CO₂ per kWh</strong> reflects the
                Philippine national grid mix, sourced from the Department of Energy
                (DOE) Philippines and the Institute for Global Environmental
                Strategies (IGES) v11.6 grid emission factor database.
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-display font-semibold text-lg mb-2">
                Worked Example
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                A 1,200 W air conditioner used for 60 minutes:
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>kWh = (1200 × 60) ÷ 60,000 = <strong>1.2 kWh</strong></li>
                <li>Carbon = 1.2 × 0.7 = <strong>0.84 kg CO₂</strong></li>
              </ul>
            </div>
          </Card>
        </section>

        {/* Device Wattage Sources */}
        <section className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              Device Wattage Sources
            </h2>
          </div>
          <p className="text-muted-foreground mb-6">
            All device wattages used in WattLog are referenced from authoritative
            sources: the <strong>Department of Energy (DOE) Philippines</strong>,
            the <strong>Meralco Appliance Wattage Guide</strong>, manufacturer
            datasheets, and the <strong>IGES</strong> documentation. Browse by
            category below.
          </p>

          <Accordion type="single" collapsible className="w-full">
            {CAMPUS_DEVICE_CATEGORIES.map((category) => {
              const devices = getDevicesByCategory(category);
              if (devices.length === 0) return null;
              return (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="text-left">
                    <span className="flex items-center gap-3">
                      <span className="font-display font-semibold">{category}</span>
                      <span className="text-xs text-muted-foreground">
                        ({devices.length} {devices.length === 1 ? 'device' : 'devices'})
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Device</TableHead>
                            <TableHead className="w-[120px] text-right">Wattage (W)</TableHead>
                            <TableHead>Source</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {devices.map((d) => (
                            <TableRow key={d.name}>
                              <TableCell className="font-medium">{d.name}</TableCell>
                              <TableCell className="text-right tabular-nums">
                                {d.wattage.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {d.source}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <Card className="p-6 mt-8 bg-muted/40">
            <h3 className="font-display font-semibold mb-2">Data Collection Methods</h3>
            <p className="text-sm text-muted-foreground">
              Wattage values were obtained through (1) <strong>nameplate inspection</strong>{' '}
              of equipment power-rating labels, (2) <strong>manufacturer
              specifications</strong> from product datasheets, and (3) cross-referencing
              with industry guidelines from DOE Philippines, Meralco, and IGES to
              ensure accuracy and academic defensibility.
            </p>
          </Card>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto text-center mt-20">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Ready to track your campus impact?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login">
              <Button size="lg" className="eco-gradient">
                Get Started
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card/50">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Sustainable Campus Initiative. Built for a greener future.
          </p>
          <Link to="/contact" className="text-sm text-primary hover:underline">
            Contact Us
          </Link>
        </div>
      </footer>
    </div>
  );
}
