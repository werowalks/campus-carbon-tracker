import { ScrollArea } from "@/components/ui/scroll-area";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold text-foreground mb-8">
              CHAPTER 3: DESIGN AND DEVELOPMENT METHODOLOGY
            </h1>
            
            <p className="text-muted-foreground leading-relaxed">
              This chapter presents the methods and procedures employed in developing Campus Watt Watch. 
              It covers the data gathering techniques, system requirements, architectural design, and the 
              testing framework adopted throughout the development process.
            </p>

            <hr className="my-8 border-border" />

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              3.1 Methods of Data Gathering
            </h2>
            
            <p className="text-muted-foreground leading-relaxed">
              Several data gathering techniques were utilized to ensure that the system addresses user needs 
              while adhering to established sustainability reporting standards.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">
              3.1.1 Document Analysis
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              A review of existing literature on carbon emission factors and energy consumption patterns was 
              conducted prior to system development. The Philippine grid emission factor was determined through 
              an analysis of publications from the Department of Energy (DOE) and documentation from the 
              Institute for Global Environmental Strategies (IGES).
            </p>
            
            <p className="text-muted-foreground leading-relaxed mt-4">
              The adopted emission factor of <strong className="text-foreground">0.7 kg CO₂ per kWh</strong> reflects 
              the country's current energy mix, which remains heavily dependent on coal and natural gas (DOE, 2022). 
              This value aligns with the Greenhouse Gas (GHG) Protocol guidelines for Scope 2 emissions reporting, 
              making it appropriate for institutional carbon footprint tracking.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">
              3.1.2 Survey Questionnaire
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              A structured questionnaire anchored on the <strong className="text-foreground">ISO 25010</strong> software 
              quality model will be administered to evaluate system quality across multiple dimensions: functional 
              suitability, usability, security, and performance efficiency. The target respondents include:
            </p>

            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Respondent Group</th>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Number of Participants</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2 text-muted-foreground">Campus Facilities Personnel</td>
                    <td className="px-4 py-2 text-muted-foreground">5</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2 text-muted-foreground">Office Representatives</td>
                    <td className="px-4 py-2 text-muted-foreground">10</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-muted-foreground">Student Pilot Users</td>
                    <td className="px-4 py-2 text-muted-foreground">15</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">
              3.1.3 Device Inventory Analysis
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              An inventory of common electrical devices found within the campus was compiled to establish baseline 
              wattage values for the logging system. These values serve as reference points when users record their 
              energy consumption.
            </p>

            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Category</th>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Representative Devices</th>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Typical Wattage</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { category: "Computing", devices: "Laptops, Desktop Computers", wattage: "150W" },
                    { category: "HVAC", devices: "Window-type Air Conditioners", wattage: "1,500W" },
                    { category: "Lighting", devices: "Fluorescent Tubes, LED Bulbs", wattage: "60W" },
                    { category: "Presentation", devices: "LCD Projectors", wattage: "300W" },
                    { category: "Printing", devices: "Laser Printers, Photocopiers", wattage: "500W" },
                    { category: "Laboratory", devices: "Scientific Instruments", wattage: "800W" },
                    { category: "Pantry", devices: "Refrigerators, Microwave Ovens", wattage: "1,000W" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="px-4 py-2 text-muted-foreground">{row.category}</td>
                      <td className="px-4 py-2 text-muted-foreground">{row.devices}</td>
                      <td className="px-4 py-2 text-muted-foreground">{row.wattage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <hr className="my-8 border-border" />

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              3.2 Requirements Specification
            </h2>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">
              3.2.1 Project Scope
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              The scope definition establishes clear boundaries for the development effort, distinguishing between 
              features targeted for implementation and those reserved for future work.
            </p>

            <h4 className="text-lg font-medium text-foreground mt-4 mb-2">Features Within Scope:</h4>
            
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Feature</th>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "User Authentication", desc: "Email and password-based login with verification" },
                    { feature: "Energy Logging", desc: "Manual entry of device usage including wattage and duration" },
                    { feature: "Carbon Calculation", desc: "Automated computation using the Philippine grid emission factor" },
                    { feature: "Personal Dashboard", desc: "Individual consumption statistics across daily, weekly, and monthly periods" },
                    { feature: "Administrative Analytics", desc: "Campus-wide aggregated reports and activity monitoring" },
                    { feature: "Role-Based Access Control", desc: "Differentiated interfaces for regular users and administrators" },
                    { feature: "Responsive Interface", desc: "Accessibility across desktop, tablet, and mobile devices" },
                    { feature: "Data Visualization", desc: "Charts depicting consumption by category and time period" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="px-4 py-2 text-muted-foreground font-medium">{row.feature}</td>
                      <td className="px-4 py-2 text-muted-foreground">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 className="text-lg font-medium text-foreground mt-4 mb-2">Features Outside Scope:</h4>
            
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Feature</th>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Rationale for Exclusion</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Real-time IoT Integration", reason: "Requires hardware sensors beyond project resources" },
                    { feature: "Automated Meter Reading", reason: "Necessitates physical infrastructure modifications" },
                    { feature: "Multi-Campus Deployment", reason: "Initial implementation limited to a single campus" },
                    { feature: "Water and Waste Tracking", reason: "Current focus restricted to electricity consumption" },
                    { feature: "Native Mobile Application", reason: "Web-based approach provides adequate device coverage" },
                    { feature: "Billing System Integration", reason: "Falls outside sustainability tracking objectives" },
                    { feature: "Predictive Analytics", reason: "Identified as potential future enhancement" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="px-4 py-2 text-muted-foreground font-medium">{row.feature}</td>
                      <td className="px-4 py-2 text-muted-foreground">{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">
              3.2.2 System Architecture
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              The system adopts a <strong className="text-foreground">three-tier web application architecture</strong>, 
              separating concerns across presentation, application logic, and data management layers.
            </p>

            <div className="my-4 space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium text-foreground">Presentation Layer</h5>
                <p className="text-muted-foreground text-sm mt-1">
                  The user interface was built using React 18 with TypeScript for type safety and Tailwind CSS for styling. 
                  This layer handles rendering, form interactions, and the display of visualizations.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium text-foreground">Application Layer</h5>
                <p className="text-muted-foreground text-sm mt-1">
                  Business logic and state management are handled through React's Context API. This layer coordinates data 
                  flow between the interface and the database, implementing the calculation formulas for energy and carbon values.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium text-foreground">Data Layer</h5>
                <p className="text-muted-foreground text-sm mt-1">
                  Persistent storage, user authentication, and access control are managed through a PostgreSQL database. 
                  Row-level security policies enforce data isolation between users.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">
              3.2.3 Hardware and Software Requirements
            </h3>

            <h4 className="text-lg font-medium text-foreground mt-4 mb-2">Development Environment:</h4>
            
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Component</th>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Minimum</th>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Recommended</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { component: "Processor", min: "Intel Core i3 or equivalent", rec: "Intel Core i5 or equivalent" },
                    { component: "Memory", min: "4 GB RAM", rec: "8 GB RAM" },
                    { component: "Storage", min: "10 GB available space", rec: "20 GB SSD" },
                    { component: "Display", min: "1366 × 768 resolution", rec: "1920 × 1080 resolution" },
                    { component: "Network", min: "5 Mbps connection", rec: "25 Mbps connection" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="px-4 py-2 text-muted-foreground font-medium">{row.component}</td>
                      <td className="px-4 py-2 text-muted-foreground">{row.min}</td>
                      <td className="px-4 py-2 text-muted-foreground">{row.rec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <hr className="my-8 border-border" />

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              3.3 Analysis and Design
            </h2>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">
              3.3.1 Development Methodology
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              The project follows an <strong className="text-foreground">Agile Software Development Life Cycle (SDLC)</strong>, 
              structured around iterative sprints that allow for continuous refinement based on stakeholder feedback.
            </p>

            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Phase</th>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Timeline</th>
                    <th className="px-4 py-2 text-left text-foreground font-medium border-b border-border">Key Activities</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { phase: "Planning", timeline: "Weeks 1–2", activities: "Requirements elicitation, user story definition, scope finalization" },
                    { phase: "Design", timeline: "Weeks 3–4", activities: "Architecture design, database schema modeling, interface wireframing" },
                    { phase: "Development", timeline: "Weeks 5–10", activities: "Component implementation, backend integration, authentication setup" },
                    { phase: "Testing", timeline: "Weeks 11–12", activities: "Unit testing, integration testing, user acceptance testing" },
                    { phase: "Review", timeline: "Ongoing", activities: "Stakeholder demonstrations, defect resolution, feature adjustments" },
                    { phase: "Deployment", timeline: "Week 13", activities: "Production release, user orientation, documentation handover" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="px-4 py-2 text-muted-foreground font-medium">{row.phase}</td>
                      <td className="px-4 py-2 text-muted-foreground">{row.timeline}</td>
                      <td className="px-4 py-2 text-muted-foreground">{row.activities}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">
              3.3.2 Database Schema
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              The relational schema consists of three primary tables linked through user identifiers.
            </p>

            <h4 className="text-lg font-medium text-foreground mt-4 mb-2">profiles</h4>
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left text-foreground font-medium border-b border-border">Column</th>
                    <th className="px-3 py-2 text-left text-foreground font-medium border-b border-border">Type</th>
                    <th className="px-3 py-2 text-left text-foreground font-medium border-b border-border">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { col: "id", type: "UUID", purpose: "Unique record identifier" },
                    { col: "user_id", type: "UUID", purpose: "Reference to authentication record" },
                    { col: "name", type: "TEXT", purpose: "User's display name" },
                    { col: "email", type: "TEXT", purpose: "User's email address" },
                    { col: "created_at", type: "TIMESTAMP", purpose: "Account creation time" },
                    { col: "updated_at", type: "TIMESTAMP", purpose: "Last modification time" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="px-3 py-2 text-muted-foreground font-mono">{row.col}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.type}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 className="text-lg font-medium text-foreground mt-4 mb-2">energy_logs</h4>
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left text-foreground font-medium border-b border-border">Column</th>
                    <th className="px-3 py-2 text-left text-foreground font-medium border-b border-border">Type</th>
                    <th className="px-3 py-2 text-left text-foreground font-medium border-b border-border">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { col: "id", type: "UUID", purpose: "Unique record identifier" },
                    { col: "user_id", type: "UUID", purpose: "Owner of the log entry" },
                    { col: "device_name", type: "TEXT", purpose: "Name of the electrical device" },
                    { col: "category", type: "TEXT", purpose: "Device classification" },
                    { col: "wattage", type: "INTEGER", purpose: "Power rating in watts" },
                    { col: "duration", type: "INTEGER", purpose: "Usage time in minutes" },
                    { col: "carbon_emission", type: "NUMERIC", purpose: "Computed CO₂ in kilograms" },
                    { col: "timestamp", type: "TIMESTAMP", purpose: "When usage occurred" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="px-3 py-2 text-muted-foreground font-mono">{row.col}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.type}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <hr className="my-8 border-border" />

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              3.4 Testing and Evaluation
            </h2>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">
              3.4.1 Test Cases
            </h3>

            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left text-foreground font-medium border-b border-border">ID</th>
                    <th className="px-3 py-2 text-left text-foreground font-medium border-b border-border">Test Case</th>
                    <th className="px-3 py-2 text-left text-foreground font-medium border-b border-border">Expected Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "TC-01", name: "Account Registration", outcome: "Account created; verification email dispatched" },
                    { id: "TC-02", name: "Successful Login", outcome: "Redirect to dashboard; user data displayed" },
                    { id: "TC-03", name: "Failed Login Attempt", outcome: "Error message shown; access denied" },
                    { id: "TC-04", name: "Energy Log Submission", outcome: "Log saved; dashboard statistics updated" },
                    { id: "TC-05", name: "Calculation Accuracy", outcome: "Energy = 3.0 kWh; Carbon = 2.1 kg CO₂" },
                    { id: "TC-06", name: "Dashboard Aggregation", outcome: "Correct totals for selected time period" },
                    { id: "TC-07", name: "Data Isolation", outcome: "Only authenticated user data accessible" },
                    { id: "TC-08", name: "Administrator Access", outcome: "Campus-wide statistics visible" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="px-3 py-2 text-muted-foreground font-mono">{row.id}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <hr className="my-8 border-border" />

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              3.6 Calculation Methodology
            </h2>

            <div className="my-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Energy Consumption</h4>
              <code className="text-sm text-primary">
                Energy (kWh) = (Wattage × Duration in minutes) ÷ 60,000
              </code>
            </div>

            <div className="my-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Carbon Emission</h4>
              <code className="text-sm text-primary">
                Carbon Emission (kg CO₂) = Energy (kWh) × 0.7
              </code>
            </div>

            <div className="my-6 p-4 border border-border rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Sample Computation</h4>
              <p className="text-muted-foreground text-sm">
                For a 1,500-watt air conditioning unit operated for 120 minutes:
              </p>
              <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Energy = (1,500 × 120) ÷ 60,000 = <strong className="text-foreground">3.0 kWh</strong></li>
                <li>Carbon Emission = 3.0 × 0.7 = <strong className="text-foreground">2.1 kg CO₂</strong></li>
              </ul>
            </div>

            <hr className="my-8 border-border" />

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              References
            </h2>
            
            <p className="text-muted-foreground text-sm leading-relaxed">
              Department of Energy. (2022). <em>Philippine Power Statistics</em>. Retrieved from https://www.doe.gov.ph
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mt-2">
              Institute for Global Environmental Strategies. (2023). <em>List of Grid Emission Factors</em> (Version 11.6). 
              Retrieved from https://www.iges.or.jp
            </p>

          </article>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Documentation;
