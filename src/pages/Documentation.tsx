import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

const rawContent = `CHAPTER 3: DESIGN AND DEVELOPMENT METHODOLOGY

This chapter presents the methods and procedures employed in developing Campus Watt Watch. It covers the data gathering techniques, system requirements, architectural design, and the testing framework adopted throughout the development process.

───────────────────────────────────────────────────────

3.1 Methods of Data Gathering

Several data gathering techniques were utilized to ensure that the system addresses user needs while adhering to established sustainability reporting standards.

3.1.1 Document Analysis

A review of existing literature on carbon emission factors and energy consumption patterns was conducted prior to system development. The Philippine grid emission factor was determined through an analysis of publications from the Department of Energy (DOE) and documentation from the Institute for Global Environmental Strategies (IGES).

The adopted emission factor of 0.7 kg CO₂ per kWh reflects the country's current energy mix, which remains heavily dependent on coal and natural gas (DOE, 2022). This value aligns with the Greenhouse Gas (GHG) Protocol guidelines for Scope 2 emissions reporting, making it appropriate for institutional carbon footprint tracking.

3.1.2 Survey Questionnaire

A structured questionnaire anchored on the ISO 25010 software quality model will be administered to evaluate system quality across multiple dimensions: functional suitability, usability, security, and performance efficiency. The target respondents include:

Respondent Group                    Number of Participants
Campus Facilities Personnel         5
Office Representatives              10
Student Pilot Users                 15

The questionnaire employs a five-point Likert scale, with responses ranging from Strongly Disagree (1) to Strongly Agree (5).

3.1.3 Device Inventory Analysis

An inventory of common electrical devices found within the campus was compiled to establish baseline wattage values for the logging system. These values serve as reference points when users record their energy consumption.

Category        Representative Devices              Typical Wattage
Computing       Laptops, Desktop Computers          150W
HVAC            Window-type Air Conditioners        1,500W
Lighting        Fluorescent Tubes, LED Bulbs        60W
Presentation    LCD Projectors                      300W
Printing        Laser Printers, Photocopiers        500W
Laboratory      Scientific Instruments              800W
Pantry          Refrigerators, Microwave Ovens      1,000W

───────────────────────────────────────────────────────

3.2 Requirements Specification

3.2.1 Project Scope

The scope definition establishes clear boundaries for the development effort, distinguishing between features targeted for implementation and those reserved for future work.

Features Within Scope:

Feature                         Description
User Authentication             Email and password-based login with verification
Energy Logging                  Manual entry of device usage including wattage and duration
Carbon Calculation              Automated computation using the Philippine grid emission factor
Personal Dashboard              Individual consumption statistics across daily, weekly, and monthly periods
Administrative Analytics        Campus-wide aggregated reports and activity monitoring
Role-Based Access Control       Differentiated interfaces for regular users and administrators
Responsive Interface            Accessibility across desktop, tablet, and mobile devices
Data Visualization              Charts depicting consumption by category and time period

Features Outside Scope:

Feature                         Rationale for Exclusion
Real-time IoT Integration       Requires hardware sensors beyond project resources
Automated Meter Reading         Necessitates physical infrastructure modifications
Multi-Campus Deployment         Initial implementation limited to a single campus
Water and Waste Tracking        Current focus restricted to electricity consumption
Native Mobile Application       Web-based approach provides adequate device coverage
Billing System Integration      Falls outside sustainability tracking objectives
Predictive Analytics            Identified as potential future enhancement

3.2.2 System Architecture

The system adopts a three-tier web application architecture, separating concerns across presentation, application logic, and data management layers.

Presentation Layer
The user interface was built using React 18 with TypeScript for type safety and Tailwind CSS for styling. This layer handles rendering, form interactions, and the display of visualizations.

Application Layer
Business logic and state management are handled through React's Context API. This layer coordinates data flow between the interface and the database, implementing the calculation formulas for energy and carbon values.

Data Layer
Persistent storage, user authentication, and access control are managed through a PostgreSQL database. Row-level security policies enforce data isolation between users.

3.2.3 Hardware and Software Requirements

Development Environment:

Component       Minimum Specification           Recommended Specification
Processor       Intel Core i3 or equivalent     Intel Core i5 or equivalent
Memory          4 GB RAM                        8 GB RAM
Storage         10 GB available space           20 GB SSD
Display         1366 × 768 resolution           1920 × 1080 resolution
Network         5 Mbps connection               25 Mbps connection

End-User Environment:

Component       Minimum Requirement
Device          Any device with a modern web browser
Display         320px minimum viewport width
Network         Stable 1 Mbps connection

Development Software:

Software                Version         Purpose
Node.js                 18 or later     JavaScript runtime environment
Bun                     Latest stable   Package management and bundling
Visual Studio Code      Latest          Code editing
Git                     2.0 or later    Version control

Production Stack:

Technology      Version     Role
React           18.3.1      Frontend framework
TypeScript      5.0+        Static typing
Vite            5.0+        Build tooling
PostgreSQL      15+         Database management
Tailwind CSS    3.4+        Utility-based styling

───────────────────────────────────────────────────────

3.3 Analysis and Design

3.3.1 Development Methodology

The project follows an Agile Software Development Life Cycle (SDLC), structured around iterative sprints that allow for continuous refinement based on stakeholder feedback.

Phase           Timeline        Key Activities
Planning        Weeks 1–2       Requirements elicitation, user story definition, scope finalization
Design          Weeks 3–4       Architecture design, database schema modeling, interface wireframing
Development     Weeks 5–10      Component implementation, backend integration, authentication setup
Testing         Weeks 11–12     Unit testing, integration testing, user acceptance testing
Review          Ongoing         Stakeholder demonstrations, defect resolution, feature adjustments
Deployment      Week 13         Production release, user orientation, documentation handover

3.3.2 Unified Modeling Language Diagrams

The following diagrams document the system's structure and behavior from multiple perspectives.

Use Case Diagram

The use case model identifies the primary actors and their interactions with the system.

Actor Definitions:
• User: A registered individual who logs personal energy consumption
• Administrator: A user with elevated privileges for campus-wide monitoring

Use Case Descriptions:

Use Case                Actor(s)        Description
Register Account        User            Creates a new account with email, password, and display name
Authenticate            User, Admin     Logs into the system and establishes a session
View Dashboard          User            Displays personal energy and carbon statistics
Log Energy Consumption  User            Records device usage with wattage and duration
View History            User            Browses previously submitted energy logs
Reset Password          User            Initiates account recovery via email
Access Campus Analytics Admin           Views aggregated statistics across all users
Monitor User Activity   Admin           Reviews consumption logs submitted by all users
Manage Roles            Admin           Assigns or revokes administrative privileges

Class Diagram

The class diagram represents the core entities and their attributes.

User Entity
• Attributes: id, email, name, role
• Operations: authenticate(), terminateSession(), initiatePasswordReset()

EnergyLog Entity
• Attributes: id, userId, deviceName, category, wattage, duration, carbonEmission, timestamp
• Operations: computeEnergy(), computeCarbon()

DeviceCategory Entity
• Attributes: id, name, icon, defaultWattage
• Operations: retrieveDevices()

DashboardStatistics Entity
• Attributes: dailyEnergy, dailyCarbon, weeklyEnergy, weeklyCarbon, monthlyEnergy, monthlyCarbon, topDevices, categoryDistribution
• Operations: aggregateStatistics()

Activity Diagram: Energy Logging Process

The activity diagram below traces the workflow for recording energy consumption:

1. User initiates login
2. System validates credentials
3. Upon successful authentication, user navigates to the logging interface
4. User selects a device category from the dropdown
5. User enters device name and wattage value
6. User specifies usage duration
7. System calculates energy consumption and carbon emission
8. User confirms and submits the entry
9. System persists the record to the database
10. Dashboard statistics are refreshed
11. System displays confirmation notification

If authentication fails at step 2, an error message is displayed and the user is returned to the login screen.

Sequence Diagram: Authentication Flow

The sequence diagram illustrates the message exchanges during user login:

1. User submits credentials through the login form
2. LoginPage component invokes the signIn method on AuthContext
3. AuthContext calls the authentication service with email and password
4. Authentication service returns either a valid session or an error response
5. If successful, AuthContext queries the profiles table for user details
6. Database returns the user profile record
7. AuthContext queries the user_roles table for permission data
8. Database returns the assigned role
9. AuthContext updates application state with user information
10. LoginPage redirects to the Dashboard component

Entity-Relationship Diagram (ERD)

The Entity-Relationship Diagram provides a visual representation of the database structure, illustrating the entities, their attributes, and the relationships that govern data integrity within the Campus Watt Watch system.

ERD Overview:

The database design follows a normalized relational structure centered around the authentication system. The auth.users table, managed by the cloud authentication service, serves as the central reference point for all user-related data. Three public schema tables extend this foundation:

┌─────────────────────────────────────────────────────────────────────────────────┐
│                        CAMPUS WATT WATCH - DATABASE ERD                         │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────────┐
                              │     auth.users      │
                              │  (Authentication)   │
                              ├─────────────────────┤
                              │ PK  id: UUID        │
                              │     email: TEXT     │
                              │     created_at      │
                              └──────────┬──────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              │                          │                          │
              │ 1:1                      │ 1:1                      │ 1:N
              ▼                          ▼                          ▼
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│        profiles         │  │       user_roles        │  │       energy_logs       │
├─────────────────────────┤  ├─────────────────────────┤  ├─────────────────────────┤
│ PK  id: UUID            │  │ PK  id: UUID            │  │ PK  id: UUID            │
│ FK  user_id: UUID       │  │ FK  user_id: UUID       │  │ FK  user_id: UUID       │
│     name: TEXT          │  │     role: app_role      │  │     device_name: TEXT   │
│     email: TEXT         │  │     created_at          │  │     category: TEXT      │
│     created_at          │  └─────────────────────────┘  │     wattage: INTEGER    │
│     updated_at          │                               │     duration: INTEGER   │
└─────────────────────────┘                               │     carbon_emission: NUM│
                                                          │     timestamp           │
                                                          │     created_at          │
                                                          └─────────────────────────┘

Legend:
  PK = Primary Key
  FK = Foreign Key
  1:1 = One-to-One Relationship
  1:N = One-to-Many Relationship

Entity Descriptions:

Entity              Purpose                                                             Cardinality
auth.users          Core authentication table. Contains login credentials.              Central reference entity
profiles            Stores user profile info. Created via trigger on registration.      1:1 with auth.users
user_roles          Defines permission levels using app_role enum (admin, user).        1:1 with auth.users
energy_logs         Records energy consumption entries with device details.             1:N with auth.users

Attribute Specifications:

profiles Entity:
• id (UUID): Primary key, auto-generated unique identifier
• user_id (UUID): Foreign key referencing auth.users
• name (TEXT): User's display name
• email (TEXT): User's email address
• created_at (TIMESTAMP): Account creation timestamp
• updated_at (TIMESTAMP): Last modification timestamp

user_roles Entity:
• id (UUID): Primary key, auto-generated unique identifier
• user_id (UUID): Foreign key referencing auth.users
• role (ENUM): Permission level using app_role type (admin | user)
• created_at (TIMESTAMP): Role assignment timestamp

energy_logs Entity:
• id (UUID): Primary key, auto-generated unique identifier
• user_id (UUID): Foreign key referencing auth.users
• device_name (TEXT): Name of the electrical device
• category (TEXT): Device classification (e.g., computer, hvac, lighting)
• wattage (INTEGER): Power rating in watts
• duration (INTEGER): Usage time in minutes
• carbon_emission (NUMERIC): Computed CO₂ emission in kilograms
• timestamp (TIMESTAMP): When the usage occurred
• created_at (TIMESTAMP): Record creation timestamp

Key Design Decisions:

1. Separation of Authentication and Profile Data: The profiles table exists in the public schema to allow application-level queries, while sensitive authentication data remains protected in the auth schema.

2. Role-Based Access Control (RBAC): The user_roles table enables flexible permission management through the app_role enumeration, supporting future role expansions.

3. Denormalized Email Storage: Email is stored in both auth.users and profiles to enable efficient querying without cross-schema joins.

4. Automatic Record Creation: Database triggers (handle_new_user) automatically create corresponding records in profiles and user_roles when a new user registers.

Referential Integrity and Security:

All foreign key relationships reference the user_id column. Row-Level Security (RLS) policies enforce:
• Users can only access their own profile and role data
• Users can only create, read, and delete their own energy logs
• Administrators can view all profiles and energy logs across the system

Interface Storyboard

The storyboard describes the key screens and their components.

Landing Page
• Application header with logo and navigation links
• Hero section presenting the system's value proposition
• Feature highlights: consumption tracking, carbon calculation, insights dashboard
• Call-to-action button directing to registration or login

Login Screen
• Centered card containing the application logo
• Email and password input fields
• Sign-in button
• Links for password recovery and new account registration
• Campus imagery as background

User Dashboard
• Collapsible sidebar with navigation options
• Personalized greeting in the header area
• Tab navigation for time period selection (Today, This Week, This Month)
• Statistical cards displaying: Energy Consumed, Carbon Emission, Cumulative Values
• Ranked list of top energy-consuming devices
• Pie chart showing distribution by device category
• Sustainability tip displayed at the bottom

Energy Logging Form
• Dropdown for device category selection
• Text field for device name entry
• Numeric input for wattage (with suggested values)
• Duration selector with preset options and custom entry
• Live preview of calculated energy and carbon values
• Submission button with loading state
• Toast notification upon successful logging

───────────────────────────────────────────────────────

3.4 Testing and Evaluation

3.4.1 Test Plan

Objectives:

The testing phase aims to verify that all functional requirements are correctly implemented, security controls prevent unauthorized access, calculations produce accurate results, and the interface performs adequately across different devices.

Scope:

Test Category           Coverage
Unit Testing            Calculation functions, utility methods
Integration Testing     Database operations, authentication workflows
System Testing          End-to-end user scenarios
Security Testing        Row-level security enforcement, access control
Usability Testing       User experience evaluation via questionnaire

Environment:

Testing was conducted using the following configurations:
• Browsers: Chrome 120+, Firefox 120+, Safari 17+, Microsoft Edge 120+
• Viewports: Desktop (1920×1080), Tablet (768×1024), Mobile (375×812)

3.4.2 Test Cases

ID      Test Case               Procedure                                               Expected Outcome
TC-01   Account Registration    Navigate to signup, enter valid credentials, submit     Account created; verification email dispatched
TC-02   Successful Login        Enter valid email and password, submit                  Redirect to dashboard; user data displayed
TC-03   Failed Login Attempt    Enter incorrect password, submit                        Error message shown; access denied
TC-04   Energy Log Submission   Select category, enter device details, submit           Log saved; dashboard statistics updated
TC-05   Calculation Accuracy    Log 1500W device for 120 minutes                        Energy = 3.0 kWh; Carbon = 2.1 kg CO₂
TC-06   Dashboard Aggregation   Submit multiple entries, view dashboard                 Correct totals for selected time period
TC-07   Data Isolation          Login as User A, attempt to query User B records        Only User A data accessible
TC-08   Administrator Access    Login with admin credentials, access admin panel        Campus-wide statistics visible
TC-09   Password Recovery       Request password reset, check email                     Reset link received; link functions correctly
TC-10   Responsive Layout       Access application on mobile device                     All features accessible; no horizontal overflow
TC-11   Session Expiration      Login, allow session to expire                          Automatic logout; redirect to login screen
TC-12   Log Deletion            View history, delete an entry                           Log removed; statistics recalculated

3.4.3 Evaluation Framework

The system will be evaluated using criteria derived from the ISO 25010 software product quality model. A structured questionnaire will be administered to pilot users following a testing period.

Quality Characteristics:

Characteristic              Sub-characteristics                         Evaluation Method
Functional Suitability      Completeness, Correctness, Appropriateness  Feature checklist, calculation verification
Usability                   Learnability, Operability, Aesthetics       Likert-scale questionnaire
Security                    Confidentiality, Integrity, Authenticity    Access control testing
Performance Efficiency      Response Time, Resource Utilization         Timing measurements
Reliability                 Availability, Fault Tolerance               Error handling verification

Participant Distribution:

Group                   Count   Evaluation Focus
Facilities Personnel    5       Administrative features, reporting accuracy
Office Representatives  10      Department-level logging workflow
Student Users           15      General usability, mobile experience

Scoring Interpretation:

Mean Score Range    Interpretation
4.50 – 5.00         Excellent
3.50 – 4.49         Very Good
2.50 – 3.49         Satisfactory
1.50 – 2.49         Needs Improvement
1.00 – 1.49         Poor

───────────────────────────────────────────────────────

3.5 Deployment

3.5.1 Deployment Strategy

The application follows a continuous deployment model, enabling rapid iteration and immediate availability of updates.

Phase           Timeline        Activities
Development     Weeks 1–10      Feature implementation in preview environment
Staging         Week 11         Internal testing and final adjustments
Pilot Release   Week 12         Limited deployment to 30 test participants
Production      Week 13         Full campus deployment with user training
Maintenance     Ongoing         Bug fixes, updates, and user support

3.5.2 Infrastructure

Component           Specification
Hosting             Cloud-managed infrastructure
Database            PostgreSQL with automatic scaling
Content Delivery    Global edge network for static assets
Security            Automatic HTTPS provisioning

3.5.3 Rollback Procedure

In the event of a critical issue following deployment:

1. Access the deployment version history
2. Identify the last stable release
3. Restore the previous version
4. Notify affected users of temporary service interruption
5. Investigate root cause before redeployment

───────────────────────────────────────────────────────

3.6 Calculation Methodology

Energy consumption and carbon emissions are computed using formulas consistent with standard electricity measurement practices.

Energy Consumption

Energy (kWh) = (Wattage × Duration in minutes) ÷ 60,000

This formula converts watt-minutes to kilowatt-hours, the standard unit for electricity consumption reporting.

Carbon Emission

Carbon Emission (kg CO₂) = Energy (kWh) × 0.7

The emission factor of 0.7 kg CO₂ per kWh represents the Philippine grid average, accounting for the national energy mix comprising coal, natural gas, and renewable sources (DOE, 2022).

Sample Computation

For a 1,500-watt air conditioning unit operated for 120 minutes:

• Energy = (1,500 × 120) ÷ 60,000 = 3.0 kWh
• Carbon Emission = 3.0 × 0.7 = 2.1 kg CO₂

───────────────────────────────────────────────────────

References

Department of Energy. (2022). Philippine Power Statistics. Retrieved from https://www.doe.gov.ph

Institute for Global Environmental Strategies. (2023). List of Grid Emission Factors (Version 11.6). Retrieved from https://www.iges.or.jp
`;

const Documentation = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rawContent);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Chapter 3 Documentation</h1>
          <Button onClick={handleCopy} variant="outline" className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy All"}
          </Button>
        </div>

        <Tabs defaultValue="copy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="copy">Copy Text</TabsTrigger>
            <TabsTrigger value="preview">Formatted Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="copy" className="mt-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Select all the text below and copy it, or use the "Copy All" button above.
              </p>
              <ScrollArea className="h-[calc(100vh-16rem)] border border-border rounded-md bg-background">
                <pre className="p-4 text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {rawContent}
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <ScrollArea className="h-[calc(100vh-12rem)]">
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

                {/* Continue with more sections as needed */}
                <p className="text-muted-foreground mt-8 italic">
                  Switch to "Copy Text" tab to copy the full document content.
                </p>
              </article>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Documentation;
