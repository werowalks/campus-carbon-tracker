# CHAPTER 3: DESIGN AND DEVELOPMENT METHODOLOGY

This chapter presents the methods and procedures employed in developing Campus Watt Watch. It covers the data gathering techniques, system requirements, architectural design, and the testing framework adopted throughout the development process.

---

## 3.1 Methods of Data Gathering

To develop a system that accurately addresses institutional sustainability tracking needs, a multi-method approach to data gathering was employed. This triangulation strategy—combining document analysis, survey instruments, and empirical inventory—ensures that the resulting application is grounded in both established scientific standards and practical user requirements. Each technique serves a distinct purpose in informing the system's design, calculation methodology, and evaluation framework.

### 3.1.1 Document Analysis

Document analysis served as the foundational data gathering technique, providing the scientific basis for the system's carbon emission calculations. This method involved a systematic review of authoritative publications from government agencies and international research organizations to establish credible emission factors.

**Purpose and Rationale:**
The primary objective of this technique was to identify an appropriate grid emission factor that accurately reflects the carbon intensity of electricity consumption in the Philippine context. Given that emission factors vary significantly across countries due to differences in energy generation mix, it was essential to source data specific to the national grid rather than relying on global averages.

**Sources Reviewed:**

| Source | Document Type | Key Information Extracted |
|--------|---------------|---------------------------|
| Department of Energy (DOE), Philippines | Official government statistics and power sector reports | National energy mix composition, generation capacity by fuel type |
| Institute for Global Environmental Strategies (IGES) | International research publication (Grid Emission Factors v11.6) | Country-specific emission factors for Scope 2 reporting |
| Greenhouse Gas Protocol | International standards documentation | Methodology guidelines for organizational carbon accounting |

**Key Findings:**
The analysis revealed that the Philippine power grid remains heavily dependent on fossil fuels, with coal and natural gas collectively accounting for approximately 57% of the national energy mix as of 2022 (DOE, 2022). This composition results in a grid emission factor of **0.7 kg CO₂ per kWh**, which represents the average carbon dioxide released for every kilowatt-hour of electricity consumed from the national grid.

This emission factor aligns with the location-based method prescribed by the GHG Protocol for Scope 2 emissions reporting, making it suitable for institutional carbon footprint tracking. The value was cross-validated against the IGES database, which compiles emission factors from national energy authorities worldwide, ensuring consistency with internationally recognized reporting standards.

**Application in System Design:**
The emission factor derived from this analysis is embedded directly into the system's calculation engine. When users log their energy consumption, the application automatically applies this factor to convert kilowatt-hours into kilograms of carbon dioxide equivalent, providing an immediate visualization of the environmental impact associated with electricity usage.

### 3.1.2 Survey Questionnaire

A structured survey questionnaire anchored on the **ISO 25010** software quality model was designed to evaluate the system's quality across multiple dimensions following deployment. This technique enables the collection of quantitative feedback from end-users, facilitating an objective assessment of system performance.

**Purpose and Rationale:**
While document analysis provides the scientific foundation for the system, survey research captures the human element—specifically, how effectively the application serves its intended users. The ISO 25010 framework was selected because it offers a comprehensive taxonomy of software quality characteristics recognized by the international software engineering community.

**Instrument Design:**

The questionnaire comprises items mapped to five quality characteristics deemed most relevant to the system's objectives:

| Quality Characteristic | Definition | Sample Survey Item |
|------------------------|------------|-------------------|
| Functional Suitability | Degree to which the system provides functions that meet stated and implied needs | "The system accurately calculates energy consumption and carbon emissions based on my inputs." |
| Usability | Degree to which the system can be used effectively and efficiently | "I found the energy logging interface easy to understand and navigate." |
| Security | Degree to which the system protects information and data | "I am confident that my personal energy consumption data is kept private and secure." |
| Performance Efficiency | Degree to which the system performs its functions within acceptable time frames | "The dashboard loads and displays my statistics quickly without noticeable delays." |
| Reliability | Degree to which the system performs specified functions under stated conditions | "The system consistently saves my energy logs without errors or data loss." |

**Target Respondents:**

The survey targets three distinct user groups to capture diverse perspectives on system quality:

| Respondent Group | Number of Participants | Selection Rationale |
|------------------|------------------------|---------------------|
| Campus Facilities Personnel | 5 | Representatives responsible for campus-wide energy management and sustainability initiatives; expected to evaluate administrative features and reporting accuracy |
| Office Representatives | 10 | Staff members from various departments who will regularly log energy consumption; expected to evaluate day-to-day usability and workflow integration |
| Student Pilot Users | 15 | End-users who will interact with personal dashboards; expected to evaluate accessibility, mobile experience, and interface aesthetics |

**Response Scale:**

The questionnaire employs a five-point Likert scale to measure respondent agreement with each item:

| Scale Value | Verbal Interpretation |
|-------------|----------------------|
| 5 | Strongly Agree |
| 4 | Agree |
| 3 | Neutral |
| 2 | Disagree |
| 1 | Strongly Disagree |

**Administration Protocol:**
The survey will be administered electronically following a two-week pilot testing period, during which participants will have the opportunity to explore all system features. This exposure period ensures that respondents can provide informed evaluations based on actual usage experience rather than first impressions.

**Survey Form Structure:**

The evaluator survey form is composed of six (6) sections, each designed to capture specific aspects of the system evaluation:

| Section | Purpose | Description |
|---------|---------|-------------|
| **1. Evaluator Information** | Demographic and Role Collection | This section collects basic demographic and role-related information about the evaluators for documentation and reference purposes. All responses are treated with strict confidentiality and are used solely for academic analysis. |
| **2. Functionality** | ISO 25010 – Functional Suitability | This section evaluates the extent to which the system performs its intended functions. It assesses the accuracy of displayed data, the proper operation of navigation elements and integrated components, and the overall reliability of system features including energy logging, carbon calculation, and dashboard visualization. |
| **3. Usability** | ISO 25010 – Usability and User Experience | This section measures the ease of use and learnability of the system. It focuses on navigation clarity, interface organization, content readability, and the logical flow of information across the dashboard and form components. |
| **4. Efficiency** | ISO 25010 – Performance Efficiency | This section examines how efficiently users are able to complete tasks within the system. It evaluates system responsiveness, dashboard loading time, form submission speed, and the seamless integration between the logging interface and visualization components. |
| **5. Aesthetics and Accessibility** | ISO 25010 – Portability and Accessibility Quality | This section assesses the visual appeal, consistency, and accessibility of the system. It considers layout design, readability, inclusivity, and alignment with the sustainability theme of Lyceum of the Philippines University–Manila, ensuring that the platform can be effectively used by a diverse group of users across different devices. |
| **6. Open-Ended Feedback** | Qualitative Insights | This section allows evaluators to provide qualitative feedback, insights, and recommendations for system improvement. Responses from this section serve as supplementary data to identify strengths, limitations, and potential enhancements of the proposed system. |

**Section Details:**

*Section 1: Evaluator Information*
Gathers respondent profile data including name (optional), department or college affiliation, role classification (Facilities Personnel, Office Representative, or Student), and prior experience with sustainability tracking systems. This demographic information enables cross-tabulation analysis to identify whether user perceptions vary across different stakeholder groups.

*Section 2: Functionality (Functional Suitability)*
Contains Likert-scale items that assess whether the system correctly performs its specified functions. Evaluators rate the accuracy of energy consumption calculations, the correctness of carbon emission conversions, the reliability of data persistence, and the consistency of dashboard statistics with submitted logs.

*Section 3: Usability (User Experience)*
Measures the cognitive effort required to learn and operate the system. Items address the intuitiveness of the navigation menu, the clarity of form labels and instructions, the discoverability of features, and the overall user satisfaction with the interaction design.

*Section 4: Efficiency (Performance)*
Evaluates temporal aspects of system interaction. Respondents rate the speed of page transitions, the responsiveness of form submissions, the loading time of chart visualizations, and the perceived fluidity of the overall user experience.

*Section 5: Aesthetics and Accessibility*
Captures perceptions of visual design quality and inclusive access. Items cover color scheme appropriateness, typography legibility, mobile responsiveness, contrast ratios for readability, and the thematic alignment with environmental sustainability messaging.

*Section 6: Open-Ended Feedback*
Provides three open-response prompts: (1) "What features did you find most useful?", (2) "What difficulties or frustrations did you encounter?", and (3) "What improvements would you recommend?" These qualitative responses undergo thematic analysis to supplement the quantitative findings.

### 3.1.3 Device Inventory Analysis

Device inventory analysis was conducted to establish a comprehensive catalog of common electrical equipment found within the campus environment. This empirical technique involved the systematic documentation of device categories, representative appliances, and their corresponding power ratings.

**Purpose and Rationale:**
For the energy logging system to be practical and user-friendly, it must provide users with reasonable default values for device wattage. Many users may not readily know the power consumption of the appliances they use, which could lead to inaccurate data entry or user frustration. By pre-populating the system with typical wattage values for common campus devices, data entry friction is reduced and calculation accuracy is improved.

**Data Collection Process:**
A walkthrough of representative campus facilities—including classrooms, computer laboratories, administrative offices, and common areas—was conducted to identify the types of electrical devices in regular use. For each device category, the rated wattage was obtained through:

1. **Nameplate inspection**: Reading the power rating labels affixed to equipment
2. **Manufacturer specifications**: Consulting product documentation and technical datasheets
3. **Industry references**: Cross-referencing with published energy consumption guides from organizations such as the Philippine Department of Energy and international energy agencies

**Device Inventory Results:**

| Category | Representative Devices | Typical Wattage | Usage Context |
|----------|------------------------|-----------------|---------------|
| Computing | Laptops, Desktop Computers, Monitors | 150W | Classrooms, offices, laboratories |
| HVAC | Window-type Air Conditioners, Split-type Units | 1,500W | Offices, lecture halls, server rooms |
| Lighting | Fluorescent Tubes, LED Bulbs, Emergency Lights | 60W | All indoor spaces, corridors |
| Presentation | LCD Projectors, Interactive Displays | 300W | Classrooms, conference rooms |
| Printing | Laser Printers, Photocopiers, Multifunction Devices | 500W | Administrative offices, libraries |
| Laboratory | Scientific Instruments, Centrifuges, Microscopes | 800W | Science laboratories |
| Pantry | Refrigerators, Microwave Ovens, Water Dispensers | 1,000W | Break rooms, faculty lounges |

**Application in System Design:**
The device inventory informs the system's device selection interface, where users can choose from predefined categories and receive suggested wattage values. Users retain the flexibility to override these defaults with actual nameplate ratings if known, but the preloaded values ensure that reasonable estimates are available for quick logging. This approach balances accuracy with usability—a critical consideration for encouraging sustained user engagement with the system

---

## 3.2 Requirements Specification

### 3.2.1 Project Scope

The scope definition establishes clear boundaries for the development effort, distinguishing between features targeted for implementation and those reserved for future work.

**Features Within Scope:**

| Feature | Description |
|---------|-------------|
| User Authentication | Email and password-based login with verification |
| Energy Logging | Manual entry of device usage including wattage and duration |
| Carbon Calculation | Automated computation using the Philippine grid emission factor |
| Personal Dashboard | Individual consumption statistics across daily, weekly, and monthly periods |
| Administrative Analytics | Campus-wide aggregated reports and activity monitoring |
| Role-Based Access Control | Differentiated interfaces for regular users and administrators |
| Responsive Interface | Accessibility across desktop, tablet, and mobile devices |
| Data Visualization | Charts depicting consumption by category and time period |

**Features Outside Scope:**

| Feature | Rationale for Exclusion |
|---------|-------------------------|
| Real-time IoT Integration | Requires hardware sensors beyond project resources |
| Automated Meter Reading | Necessitates physical infrastructure modifications |
| Multi-Campus Deployment | Initial implementation limited to a single campus |
| Water and Waste Tracking | Current focus restricted to electricity consumption |
| Native Mobile Application | Web-based approach provides adequate device coverage |
| Billing System Integration | Falls outside sustainability tracking objectives |
| Predictive Analytics | Identified as potential future enhancement |

### 3.2.2 System Architecture

The system adopts a **three-tier web application architecture**, separating concerns across presentation, application logic, and data management layers.

**Presentation Layer**

The user interface was built using React 18 with TypeScript for type safety and Tailwind CSS for styling. This layer handles rendering, form interactions, and the display of visualizations.

**Application Layer**

Business logic and state management are handled through React's Context API. This layer coordinates data flow between the interface and the database, implementing the calculation formulas for energy and carbon values.

**Data Layer**

Persistent storage, user authentication, and access control are managed through a PostgreSQL database. Row-level security policies enforce data isolation between users.

### 3.2.3 Hardware and Software Requirements

**Development Environment:**

| Component | Minimum Specification | Recommended Specification |
|-----------|----------------------|---------------------------|
| Processor | Intel Core i3 or equivalent | Intel Core i5 or equivalent |
| Memory | 4 GB RAM | 8 GB RAM |
| Storage | 10 GB available space | 20 GB SSD |
| Display | 1366 × 768 resolution | 1920 × 1080 resolution |
| Network | 5 Mbps connection | 25 Mbps connection |

**End-User Environment:**

| Component | Minimum Requirement |
|-----------|---------------------|
| Device | Any device with a modern web browser |
| Display | 320px minimum viewport width |
| Network | Stable 1 Mbps connection |

**Development Software:**

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18 or later | JavaScript runtime environment |
| Bun | Latest stable | Package management and bundling |
| Visual Studio Code | Latest | Code editing |
| Git | 2.0 or later | Version control |

**Production Stack:**

| Technology | Version | Role |
|------------|---------|------|
| React | 18.3.1 | Frontend framework |
| TypeScript | 5.0+ | Static typing |
| Vite | 5.0+ | Build tooling |
| PostgreSQL | 15+ | Database management |
| Tailwind CSS | 3.4+ | Utility-based styling |

**Deployment Environment:**

The production application is deployed using **IONOS Web Hosting**, a commercial hosting platform that provides reliable infrastructure for web applications. IONOS was selected for this project based on the following considerations:

| Criterion | IONOS Capability |
|-----------|------------------|
| **Reliability** | 99.9% uptime guarantee with redundant server infrastructure |
| **SSL Security** | Free SSL certificate included for HTTPS encryption |
| **Global CDN** | Content delivery network for optimized loading times across geographic regions |
| **Scalability** | Flexible resource allocation to accommodate varying traffic loads |
| **Domain Management** | Integrated DNS management and custom domain support |

**Deployment Configuration:**

The application build process generates optimized static assets through Vite's production build pipeline. These assets are then deployed to the IONOS hosting environment, where they are served to end-users. The backend services, including user authentication and database operations, are managed through a separate cloud infrastructure (Lovable Cloud) that communicates with the frontend via secure API endpoints.

This separation of concerns—static frontend hosting via IONOS and dynamic backend services via cloud infrastructure—follows modern web architecture best practices, enabling independent scaling and maintenance of each tier.

---

## 3.3 Analysis and Design

### 3.3.1 Development Methodology

The project follows an **Agile Software Development Life Cycle (SDLC)**, structured around iterative sprints that allow for continuous refinement based on stakeholder feedback.

| Phase | Timeline | Key Activities |
|-------|----------|----------------|
| Planning | Weeks 1–2 | Requirements elicitation, user story definition, scope finalization |
| Design | Weeks 3–4 | Architecture design, database schema modeling, interface wireframing |
| Development | Weeks 5–10 | Component implementation, backend integration, authentication setup |
| Testing | Weeks 11–12 | Unit testing, integration testing, user acceptance testing |
| Review | Ongoing | Stakeholder demonstrations, defect resolution, feature adjustments |
| Deployment | Week 13 | Production release, user orientation, documentation handover |

### 3.3.2 Unified Modeling Language Diagrams

The following diagrams document the system's structure and behavior from multiple perspectives.

#### Use Case Diagram

The use case model identifies the primary actors and their interactions with the system.

**Actor Definitions:**
- **User**: A registered individual who logs personal energy consumption
- **Administrator**: A user with elevated privileges for campus-wide monitoring

**Use Case Descriptions:**

| Use Case | Actor(s) | Description |
|----------|----------|-------------|
| Register Account | User | Creates a new account with email, password, and display name |
| Authenticate | User, Admin | Logs into the system and establishes a session |
| View Dashboard | User | Displays personal energy and carbon statistics |
| Log Energy Consumption | User | Records device usage with wattage and duration |
| View History | User | Browses previously submitted energy logs |
| Reset Password | User | Initiates account recovery via email |
| Access Campus Analytics | Admin | Views aggregated statistics across all users |
| Monitor User Activity | Admin | Reviews consumption logs submitted by all users |
| Manage Roles | Admin | Assigns or revokes administrative privileges |

#### Class Diagram

The class diagram represents the core entities and their attributes.

**User Entity**
- Attributes: id, email, name, role
- Operations: authenticate(), terminateSession(), initiatePasswordReset()

**EnergyLog Entity**
- Attributes: id, userId, deviceName, category, wattage, duration, carbonEmission, timestamp
- Operations: computeEnergy(), computeCarbon()

**DeviceCategory Entity**
- Attributes: id, name, icon, defaultWattage
- Operations: retrieveDevices()

**DashboardStatistics Entity**
- Attributes: dailyEnergy, dailyCarbon, weeklyEnergy, weeklyCarbon, monthlyEnergy, monthlyCarbon, topDevices, categoryDistribution
- Operations: aggregateStatistics()

#### Activity Diagram: Energy Logging Process

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

#### Sequence Diagram: Authentication Flow

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

#### Entity-Relationship Diagram (ERD)

The Entity-Relationship Diagram provides a visual representation of the database structure, illustrating the entities, their attributes, and the relationships that govern data integrity within the Campus Watt Watch system.

**ERD Overview:**

The database design follows a normalized relational structure centered around the authentication system. The `auth.users` table, managed by the cloud authentication service, serves as the central reference point for all user-related data. Three public schema tables extend this foundation:

```
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
```

**Entity Descriptions:**

| Entity | Purpose | Cardinality |
|--------|---------|-------------|
| **auth.users** | Core authentication table managed by the cloud authentication service. Contains login credentials and session management data. | Central reference entity |
| **profiles** | Stores user profile information including display name and email. Created automatically via database trigger upon user registration. | 1:1 with auth.users |
| **user_roles** | Defines user permission levels using the `app_role` enumeration (admin, user). Default role assigned via database trigger. | 1:1 with auth.users |
| **energy_logs** | Records individual energy consumption entries with device details, calculated carbon emissions, and usage timestamps. | 1:N with auth.users |

**Attribute Specifications:**

*profiles Entity:*
- `id` (UUID): Primary key, auto-generated unique identifier
- `user_id` (UUID): Foreign key referencing auth.users
- `name` (TEXT): User's display name
- `email` (TEXT): User's email address
- `created_at` (TIMESTAMP): Account creation timestamp
- `updated_at` (TIMESTAMP): Last modification timestamp

*user_roles Entity:*
- `id` (UUID): Primary key, auto-generated unique identifier
- `user_id` (UUID): Foreign key referencing auth.users
- `role` (ENUM): Permission level using app_role type (admin | user)
- `created_at` (TIMESTAMP): Role assignment timestamp

*energy_logs Entity:*
- `id` (UUID): Primary key, auto-generated unique identifier
- `user_id` (UUID): Foreign key referencing auth.users
- `device_name` (TEXT): Name of the electrical device
- `category` (TEXT): Device classification (e.g., computer, hvac, lighting)
- `wattage` (INTEGER): Power rating in watts
- `duration` (INTEGER): Usage time in minutes
- `carbon_emission` (NUMERIC): Computed CO₂ emission in kilograms
- `timestamp` (TIMESTAMP): When the usage occurred
- `created_at` (TIMESTAMP): Record creation timestamp

**Key Design Decisions:**

1. **Separation of Authentication and Profile Data**: The profiles table exists in the public schema to allow application-level queries, while sensitive authentication data remains protected in the auth schema.

2. **Role-Based Access Control (RBAC)**: The user_roles table enables flexible permission management through the `app_role` enumeration, supporting future role expansions beyond the current admin/user dichotomy.

3. **Denormalized Email Storage**: Email is stored in both auth.users and profiles to enable efficient querying without cross-schema joins.

4. **Automatic Record Creation**: Database triggers (`handle_new_user`) automatically create corresponding records in profiles and user_roles when a new user registers, ensuring referential integrity.

**Referential Integrity and Security:**

All foreign key relationships reference the `user_id` column, which corresponds to the `id` in `auth.users`. Row-Level Security (RLS) policies enforce data isolation:
- Users can only access their own profile and role data
- Users can only create, read, and delete their own energy logs
- Administrators can view all profiles and energy logs across the system

#### Interface Storyboard

The storyboard describes the key screens and their components.

**Landing Page**
- Application header with logo and navigation links
- Hero section presenting the system's value proposition
- Feature highlights: consumption tracking, carbon calculation, insights dashboard
- Call-to-action button directing to registration or login

**Login Screen**
- Centered card containing the application logo
- Email and password input fields
- Sign-in button
- Links for password recovery and new account registration
- Campus imagery as background

**User Dashboard**
- Collapsible sidebar with navigation options
- Personalized greeting in the header area
- Tab navigation for time period selection (Today, This Week, This Month)
- Statistical cards displaying: Energy Consumed, Carbon Emission, Cumulative Values
- Ranked list of top energy-consuming devices
- Pie chart showing distribution by device category
- Sustainability tip displayed at the bottom

**Energy Logging Form**
- Dropdown for device category selection
- Text field for device name entry
- Numeric input for wattage (with suggested values)
- Duration selector with preset options and custom entry
- Live preview of calculated energy and carbon values
- Submission button with loading state
- Toast notification upon successful logging

---

## 3.4 Testing and Evaluation

### 3.4.1 Test Plan

**Objectives:**

The testing phase aims to verify that all functional requirements are correctly implemented, security controls prevent unauthorized access, calculations produce accurate results, and the interface performs adequately across different devices.

**Scope:**

| Test Category | Coverage |
|---------------|----------|
| Unit Testing | Calculation functions, utility methods |
| Integration Testing | Database operations, authentication workflows |
| System Testing | End-to-end user scenarios |
| Security Testing | Row-level security enforcement, access control |
| Usability Testing | User experience evaluation via questionnaire |

**Environment:**

Testing was conducted using the following configurations:

- Browsers: Chrome 120+, Firefox 120+, Safari 17+, Microsoft Edge 120+
- Viewports: Desktop (1920×1080), Tablet (768×1024), Mobile (375×812)

### 3.4.2 Test Cases

| ID | Test Case | Procedure | Expected Outcome |
|----|-----------|-----------|------------------|
| TC-01 | Account Registration | Navigate to signup, enter valid credentials, submit form | Account created; verification email dispatched |
| TC-02 | Successful Login | Enter valid email and password, submit | Redirect to dashboard; user data displayed |
| TC-03 | Failed Login Attempt | Enter incorrect password, submit | Error message shown; access denied |
| TC-04 | Energy Log Submission | Select category, enter device details, submit | Log saved; dashboard statistics updated |
| TC-05 | Calculation Accuracy | Log 1500W device for 120 minutes | Energy = 3.0 kWh; Carbon = 2.1 kg CO₂ |
| TC-06 | Dashboard Aggregation | Submit multiple entries, view dashboard | Correct totals for selected time period |
| TC-07 | Data Isolation | Login as User A, attempt to query User B records | Only User A data accessible |
| TC-08 | Administrator Access | Login with admin credentials, access admin panel | Campus-wide statistics visible |
| TC-09 | Password Recovery | Request password reset, check email | Reset link received; link functions correctly |
| TC-10 | Responsive Layout | Access application on mobile device | All features accessible; no horizontal overflow |
| TC-11 | Session Expiration | Login, allow session to expire | Automatic logout; redirect to login screen |
| TC-12 | Log Deletion | View history, delete an entry | Log removed; statistics recalculated |

### 3.4.3 Evaluation Framework

The system will be evaluated using criteria derived from the **ISO 25010** software product quality model. A structured questionnaire will be administered to pilot users following a testing period.

**Quality Characteristics:**

| Characteristic | Sub-characteristics | Evaluation Method |
|----------------|---------------------|-------------------|
| Functional Suitability | Completeness, Correctness, Appropriateness | Feature checklist, calculation verification |
| Usability | Learnability, Operability, Aesthetics | Likert-scale questionnaire |
| Security | Confidentiality, Integrity, Authenticity | Access control testing |
| Performance Efficiency | Response Time, Resource Utilization | Timing measurements |
| Reliability | Availability, Fault Tolerance | Error handling verification |

**Participant Distribution:**

| Group | Count | Evaluation Focus |
|-------|-------|------------------|
| Facilities Personnel | 5 | Administrative features, reporting accuracy |
| Office Representatives | 10 | Department-level logging workflow |
| Student Users | 15 | General usability, mobile experience |

**Scoring Interpretation:**

| Mean Score Range | Interpretation |
|------------------|----------------|
| 4.50 – 5.00 | Excellent |
| 3.50 – 4.49 | Very Good |
| 2.50 – 3.49 | Satisfactory |
| 1.50 – 2.49 | Needs Improvement |
| 1.00 – 1.49 | Poor |

---

## 3.5 Deployment

### 3.5.1 Deployment Strategy

The application follows a **continuous deployment** model, enabling rapid iteration and immediate availability of updates.

| Phase | Timeline | Activities |
|-------|----------|------------|
| Development | Weeks 1–10 | Feature implementation in preview environment |
| Staging | Week 11 | Internal testing and final adjustments |
| Pilot Release | Week 12 | Limited deployment to 30 test participants |
| Production | Week 13 | Full campus deployment with user training |
| Maintenance | Ongoing | Bug fixes, updates, and user support |

### 3.5.2 Infrastructure

| Component | Specification |
|-----------|---------------|
| Hosting | Cloud-managed infrastructure |
| Database | PostgreSQL with automatic scaling |
| Content Delivery | Global edge network for static assets |
| Security | Automatic HTTPS provisioning |

### 3.5.3 Rollback Procedure

In the event of a critical issue following deployment:

1. Access the deployment version history
2. Identify the last stable release
3. Restore the previous version
4. Notify affected users of temporary service interruption
5. Investigate root cause before redeployment

---

## 3.6 Calculation Methodology

Energy consumption and carbon emissions are computed using formulas consistent with standard electricity measurement practices.

### Energy Consumption

```
Energy (kWh) = (Wattage × Duration in minutes) ÷ 60,000
```

This formula converts watt-minutes to kilowatt-hours, the standard unit for electricity consumption reporting.

### Carbon Emission

```
Carbon Emission (kg CO₂) = Energy (kWh) × 0.7
```

The emission factor of 0.7 kg CO₂ per kWh represents the Philippine grid average, accounting for the national energy mix comprising coal, natural gas, and renewable sources (DOE, 2022).

### Sample Computation

For a 1,500-watt air conditioning unit operated for 120 minutes:

- Energy = (1,500 × 120) ÷ 60,000 = **3.0 kWh**
- Carbon Emission = 3.0 × 0.7 = **2.1 kg CO₂**

---

## References

Department of Energy. (2022). *Philippine Power Statistics*. Retrieved from https://www.doe.gov.ph

Institute for Global Environmental Strategies. (2023). *List of Grid Emission Factors* (Version 11.6). Retrieved from https://www.iges.or.jp
