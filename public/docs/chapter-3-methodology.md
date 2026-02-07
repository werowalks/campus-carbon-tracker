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
3. **Industry references**: Cross-referencing with published energy consumption guides from organizations such as the Philippine Department of Energy, Meralco Appliance Wattage Guide, and international energy agencies

**Device Inventory Results (Campus Watt Watch Device Masterlist):**

The following table presents the complete device inventory compiled for the Campus Watt Watch system. Each device entry includes its classification, power rating, and the authoritative source from which the wattage value was derived.

| Category | Device Name | Reference Wattage (W) | Wattage Source |
|----------|-------------|----------------------|----------------|
| **Computing** | Laptop | 65 | DOE PH / Manufacturer Adapters (45–90W) |
| Computing | Desktop Computer | 250 | DOE PH / Meralco Appliance Guide |
| Computing | iPad | 15 | DOE PH / USB Charging Standards |
| Computing | Tablet | 15 | DOE PH / USB Charging Standards |
| Computing | Monitor | 40 | DOE PH / Meralco Appliance Guide |
| Computing | Portable Monitor | 30 | DOE PH / Manufacturer Display Specs |
| **Cafeteria/Kitchen** | Electric Kettle | 1,500 | Meralco Appliance Wattage Guide |
| Cafeteria/Kitchen | Refrigerator | 150 | Meralco Appliance Wattage Guide |
| Cafeteria/Kitchen | Microwave Oven | 1,000 | Meralco Appliance Wattage Guide |
| Cafeteria/Kitchen | Rice Cooker | 700 | Meralco Appliance Wattage Guide |
| Cafeteria/Kitchen | Induction Cooker | 1,800 | DOE PH / Meralco Appliance Wattage Guide |
| Cafeteria/Kitchen | Electric Oven | 2,400 | Meralco Appliance Wattage Guide |
| Cafeteria/Kitchen | Coffee Machine | 1,200 | DOE PH / Meralco SME Guide |
| **Facilities/HVAC** | Electric Fan | 75 | DOE PH Energy Efficiency Guide |
| Facilities/HVAC | Portable Fan | 50 | DOE PH Energy Efficiency Guide |
| Facilities/HVAC | Air Purifier | 60 | DOE PH / Manufacturer Specs |
| Facilities/HVAC | Tile Cleaning Machine | 1,200 | Meralco Commercial Cleaning Equipment Guide |
| **Printing/Office** | POS Machine | 30 | Meralco SME Energy Guide |
| Printing/Office | Scanner | 30 | DOE PH Appliance Guide |
| Printing/Office | Printer | 400 | DOE PH / Meralco Appliance Guide |
| Printing/Office | Photocopier | 1,200 | Meralco Appliance Wattage Guide |
| **AV/Classroom** | DSLR Camera | 10 | Manufacturer Power Ratings |
| AV/Classroom | LCD Projector | 300 | Meralco Appliance Wattage Guide |
| AV/Classroom | Speaker | 60 | DOE PH / Meralco Appliance Guide |
| AV/Classroom | Sound System | 300 | DOE PH / Meralco Appliance Guide |
| AV/Classroom | Television | 120 | Meralco Appliance Wattage Guide |
| **Wearables** | Apple Watch | 5 | Manufacturer Charging Specs |
| Wearables | Samsung Watch | 5 | Manufacturer Charging Specs |
| Wearables | Garmin Watch | 5 | Manufacturer Charging Specs |
| Wearables | Huawei Watch | 5 | Manufacturer Charging Specs |
| Wearables | Fitbit | 3 | Manufacturer Charging Specs |
| Wearables | Xiaomi Watch | 5 | Manufacturer Charging Specs |
| **Networking** | Server Computer | 400 | DOE PH / Meralco SME Guide |
| Networking | Network Switch | 50 | DOE PH / Meralco SME Guide |
| **Security/Safety** | CCTV Camera | 15 | DOE PH / Security Equipment Specs |
| **Water/Waste** | Water Dispenser | 500 | Meralco Appliance Wattage Guide |
| **Lighting** | LED Light Bulb | 10 | DOE PH Energy Efficient Lighting Guide |

**Category Average Wattage Values:**

For quick reference, the following table summarizes the average wattage per category, which serves as the default value when users select a category before choosing a specific device:

| Category | Average Wattage | Calculation Basis |
|----------|-----------------|-------------------|
| Computing | 115W | Mean of all computing devices (15–400W range) |
| Cafeteria/Kitchen | 1,256W | Mean of kitchen appliances |
| Facilities/HVAC | 287W | Mean of HVAC equipment |
| Printing/Office | 415W | Mean of printing/office devices |
| AV/Classroom | 158W | Mean of AV equipment |
| Wearables | 5W | Mean of wearable device charging |
| Networking | 225W | Mean of networking equipment |
| Security/Safety | 15W | CCTV camera baseline |
| Water/Waste | 500W | Water dispenser baseline |
| Lighting | 10W | LED light bulb baseline |

**Application in System Design:**
The device inventory informs the system's device selection interface, where users can choose from predefined categories and receive suggested wattage values. When a user selects a specific device, the system automatically populates the wattage field with the reference value from the masterlist. Users retain the flexibility to override these defaults with actual nameplate ratings if known, but the preloaded values ensure that reasonable estimates are available for quick logging. This approach balances accuracy with usability—a critical consideration for encouraging sustained user engagement with the system.

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
| Predictive Modeling | Scenario-based projections for energy reduction and renewable grid transitions |

**Features Outside Scope:**

| Feature | Rationale for Exclusion |
|---------|-------------------------|
| Real-time IoT Integration | Requires hardware sensors beyond project resources |
| Automated Meter Reading | Necessitates physical infrastructure modifications |
| Multi-Campus Deployment | Initial implementation limited to a single campus |
| Water and Waste Tracking | Current focus restricted to electricity consumption |
| Native Mobile Application | Web-based approach provides adequate device coverage |
| Billing System Integration | Falls outside sustainability tracking objectives |

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

This section documents the mathematical formulas and computational logic employed by the Campus Watt Watch system to derive energy consumption and carbon emission values. Understanding these calculations is essential for interpreting dashboard statistics and validating system accuracy.

### 3.6.1 Core Formulas

The system employs two fundamental formulas that form the basis of all energy and environmental impact calculations:

#### Energy Consumption Formula

```
E = (W × t) ÷ 60,000
```

Where:
- **E** = Energy consumed in kilowatt-hours (kWh)
- **W** = Device power rating in watts (W)
- **t** = Usage duration in minutes
- **60,000** = Conversion constant (60 minutes × 1,000 watts per kilowatt)

**Derivation:**
This formula converts watt-minutes to kilowatt-hours by:
1. Multiplying wattage by time to get watt-minutes
2. Dividing by 60 to convert minutes to hours (watt-hours)
3. Dividing by 1,000 to convert watts to kilowatts

The combined divisor of 60,000 simplifies the computation while maintaining precision.

#### Carbon Emission Formula

```
C = E × EF
```

Where:
- **C** = Carbon dioxide emission in kilograms (kg CO₂)
- **E** = Energy consumed in kilowatt-hours (kWh)
- **EF** = Emission factor (0.7 kg CO₂/kWh for Philippine grid)

**Emission Factor Justification:**
The emission factor of **0.7 kg CO₂ per kWh** represents the Philippine grid average, derived from:
- Department of Energy (DOE) Philippines power sector statistics (2022)
- Institute for Global Environmental Strategies (IGES) Grid Emission Factors v11.6

This value accounts for the national energy mix, which comprises approximately:
- 57% fossil fuels (coal and natural gas)
- 21% renewable sources (hydroelectric, geothermal, solar, wind)
- 22% other sources

The location-based emission factor aligns with the Greenhouse Gas (GHG) Protocol guidelines for Scope 2 emissions reporting.

### 3.6.2 Sample Computations

#### Example 1: Air Conditioning Unit
**Given:** 1,500W window-type AC operated for 120 minutes

| Step | Calculation | Result |
|------|-------------|--------|
| Energy | E = (1,500 × 120) ÷ 60,000 | 3.0 kWh |
| Carbon | C = 3.0 × 0.7 | 2.1 kg CO₂ |

#### Example 2: Laptop Computer
**Given:** 65W laptop operated for 480 minutes (8 hours)

| Step | Calculation | Result |
|------|-------------|--------|
| Energy | E = (65 × 480) ÷ 60,000 | 0.52 kWh |
| Carbon | C = 0.52 × 0.7 | 0.364 kg CO₂ |

#### Example 3: LED Light Bulb
**Given:** 10W LED bulb operated for 600 minutes (10 hours)

| Step | Calculation | Result |
|------|-------------|--------|
| Energy | E = (10 × 600) ÷ 60,000 | 0.1 kWh |
| Carbon | C = 0.1 × 0.7 | 0.07 kg CO₂ |

### 3.6.3 Dashboard Analytics Computation

The dashboard presents aggregated statistics computed from individual energy logs. This section explains how each metric is derived.

#### Time Period Filtering

Logs are filtered based on the selected time period using timestamp comparisons:

| Period | Filter Logic |
|--------|--------------|
| **Today** | `timestamp >= start of current day (00:00:00)` |
| **This Week** | `timestamp >= (current date - 7 days)` |
| **This Month** | `timestamp >= first day of current month` |

#### Total Energy Consumption

```
Total Energy = Σ Eᵢ = Σ [(Wᵢ × tᵢ) ÷ 60,000]
```

Where the summation (Σ) is performed over all logs within the selected time period.

#### Total Carbon Emission

```
Total Carbon = Σ Cᵢ = Σ Eᵢ × 0.7
```

Alternatively, computed directly from stored values:
```
Total Carbon = Σ (carbon_emission field from each log record)
```

#### Top Devices Ranking

The system identifies the top 3 energy-consuming devices through the following process:

1. **Group by device name:** Aggregate all logs by `device_name`
2. **Sum energy per device:** Calculate `Σ Eᵢ` for each device group
3. **Sort descending:** Order devices by total energy consumption
4. **Select top 3:** Return the three highest-consuming devices

```
Top Devices = SORT(
  GROUP BY device_name: Σ [(Wᵢ × tᵢ) ÷ 60,000]
) DESC LIMIT 3
```

#### Category Breakdown (Pie Chart)

The category distribution is computed as follows:

1. **Group by category:** Aggregate all logs by device category
2. **Sum energy per category:** Calculate `Σ Eᵢ` for each category
3. **Calculate percentages:** Determine each category's share of total consumption

```
Category Percentage = (Category Energy ÷ Total Energy) × 100
```

| Category | Formula |
|----------|---------|
| Percentage | Pᶜ = (Eᶜ ÷ Eₜₒₜₐₗ) × 100 |
| Where | Eᶜ = Σ Eᵢ for category c |
| And | Eₜₒₜₐₗ = Σ Eᵢ for all logs |

### 3.6.4 Data Aggregation Example

Consider a user with the following logs for the current month:

| Device | Category | Wattage | Duration | Energy (kWh) | Carbon (kg) |
|--------|----------|---------|----------|--------------|-------------|
| Laptop | Computing | 65W | 480 min | 0.52 | 0.364 |
| Desktop Computer | Computing | 250W | 240 min | 1.0 | 0.7 |
| Electric Fan | Facilities/HVAC | 75W | 360 min | 0.45 | 0.315 |
| LCD Projector | AV/Classroom | 300W | 120 min | 0.6 | 0.42 |
| Laptop | Computing | 65W | 360 min | 0.39 | 0.273 |

**Aggregated Results:**

| Metric | Calculation | Result |
|--------|-------------|--------|
| **Total Energy** | 0.52 + 1.0 + 0.45 + 0.6 + 0.39 | **2.96 kWh** |
| **Total Carbon** | 0.364 + 0.7 + 0.315 + 0.42 + 0.273 | **2.072 kg CO₂** |

**Top Devices:**
1. Desktop Computer: 1.0 kWh
2. Laptop: 0.91 kWh (0.52 + 0.39)
3. LCD Projector: 0.6 kWh

**Category Breakdown:**
| Category | Energy | Percentage |
|----------|--------|------------|
| Computing | 1.91 kWh | 64.5% |
| AV/Classroom | 0.6 kWh | 20.3% |
| Facilities/HVAC | 0.45 kWh | 15.2% |

### 3.6.5 Implementation in Code

The calculation logic is implemented in TypeScript within the system's type definitions and context providers:

```typescript
// Carbon emission factor (kg CO2 per kWh) - Philippines grid average
export const CARBON_EMISSION_FACTOR = 0.7;

// Energy calculation function
export function calculateEnergyKWh(wattage: number, durationMinutes: number): number {
  return (wattage * durationMinutes) / (1000 * 60);
}

// Carbon emission calculation function
export function calculateCarbonEmission(wattage: number, durationMinutes: number): number {
  const energyKWh = calculateEnergyKWh(wattage, durationMinutes);
  return energyKWh * CARBON_EMISSION_FACTOR;
}
```

This modular approach ensures consistency across all system components and facilitates unit testing of calculation accuracy.

---

## 3.7 Predictive Modeling Methodology

The Campus Watt Watch system incorporates a predictive modeling module that enables administrators to simulate the impact of sustainability interventions on campus energy consumption and carbon emissions. This section documents the mathematical models, assumptions, and data sources underlying the scenario simulation feature.

### 3.7.1 Modeling Approach

The predictive modeling component employs a **deterministic scenario analysis** approach, a widely used technique in energy planning and environmental impact assessment (IPCC, 2006; IEA, 2022). Rather than relying on probabilistic forecasting, which requires extensive historical datasets, deterministic modeling applies known transformation factors to current consumption data to project outcomes under hypothetical conditions.

This approach was selected for several reasons:

| Criterion | Justification |
|-----------|---------------|
| **Data Availability** | The system operates on user-reported consumption logs rather than continuous sensor data, making deterministic projections more appropriate than statistical forecasting |
| **Transparency** | Each scenario applies a clearly defined mathematical transformation, making results interpretable and auditable |
| **Academic Validity** | Deterministic scenario analysis is an established methodology in energy planning literature (IPCC Guidelines for National Greenhouse Gas Inventories) |
| **Actionability** | Results directly correspond to specific interventions that campus administrators can implement |

### 3.7.2 Scenario Definitions

Three independent scenarios were developed, each targeting a distinct sustainability intervention. Scenarios can be applied individually or in combination to assess cumulative impact.

#### Scenario 1: Electricity Reduction (10% Conservation Target)

**Rationale:**
The 10% reduction target aligns with the Philippine Energy Efficiency and Conservation Roadmap published by the Department of Energy (DOE, 2022), which recommends institutional energy conservation targets of 10–15% for government and educational facilities. This conservative baseline was selected to reflect achievable gains through behavioral interventions such as equipment scheduling, occupancy-based controls, and awareness campaigns.

**Mathematical Model:**

```
E_projected = E_baseline × (1 - r)
```

Where:
- `E_projected` = Projected energy consumption after intervention (kWh)
- `E_baseline` = Current total energy consumption for the period (kWh)
- `r` = Reduction factor (0.10 for 10% reduction)

**Carbon Impact:**

```
C_projected = E_projected × EF_grid
```

Where:
- `C_projected` = Projected carbon emissions (kg CO₂)
- `EF_grid` = Current grid emission factor (0.7 kg CO₂/kWh)

**Source:** Department of Energy Philippines. (2022). *Philippine Energy Efficiency and Conservation Roadmap*. DOE PH.

#### Scenario 2: Renewable Energy Grid Transition

**Rationale:**
This scenario models the impact of transitioning the campus electricity supply from the conventional Philippine grid to a renewable energy-dominant grid. The renewable grid emission factor of **0.4 kg CO₂/kWh** is derived from the DOE Philippines' target for increased renewable energy penetration under the Renewable Energy Act (RA 9513) and the National Renewable Energy Program (NREP).

The factor of 0.4 kg CO₂/kWh represents a blended emission rate achievable through a combination of solar, wind, and hydroelectric generation, accounting for intermittency and backup requirements. This value is consistent with targets published by IGES (2023) for countries transitioning toward 35–50% renewable energy share.

**Mathematical Model:**

```
C_projected = E_baseline × EF_renewable
```

Where:
- `C_projected` = Projected carbon emissions under renewable grid (kg CO₂)
- `E_baseline` = Current total energy consumption (kWh) — energy consumption remains unchanged
- `EF_renewable` = Renewable grid emission factor (0.4 kg CO₂/kWh)

**Emission Factor Comparison:**

| Grid Type | Emission Factor | Source |
|-----------|----------------|--------|
| Current Philippine Grid | 0.7 kg CO₂/kWh | DOE PH (2022), IGES v11.6 |
| Renewable-Dominant Grid | 0.4 kg CO₂/kWh | DOE PH NREP Targets, IGES Projections |

**Carbon Reduction:**

```
Reduction (%) = [(EF_grid - EF_renewable) ÷ EF_grid] × 100
             = [(0.7 - 0.4) ÷ 0.7] × 100
             = 42.86%
```

This scenario demonstrates that grid decarbonization alone can achieve approximately a 43% reduction in carbon emissions without any change in energy consumption behavior.

**Sources:**
- Department of Energy Philippines. (2022). *National Renewable Energy Program (NREP)*. DOE PH.
- Republic Act No. 9513. *Renewable Energy Act of 2008*. Congress of the Philippines.
- Institute for Global Environmental Strategies. (2023). *List of Grid Emission Factors* (Version 11.6). IGES.

#### Scenario 3: Category Exclusion (Device Phase-Out)

**Rationale:**
This scenario enables administrators to assess the impact of phasing out an entire category of electrical devices from campus operations. This is particularly relevant for identifying high-impact intervention targets—categories that contribute disproportionately to overall consumption.

**Mathematical Model:**

```
E_projected = Σ Eᵢ   where category(i) ≠ excluded_category
```

Where:
- `E_projected` = Total energy excluding the selected category (kWh)
- `Eᵢ` = Energy consumption of individual log entry `i`
- `excluded_category` = The device category selected for phase-out

**Carbon Impact:**

```
C_projected = E_projected × EF_active
```

Where `EF_active` is the emission factor currently in effect (either 0.7 or 0.4 depending on Scenario 2 status).

### 3.7.3 Combined Scenario Computation

When multiple scenarios are activated simultaneously, the system applies transformations in a defined sequence to avoid compounding errors:

**Computation Order:**

| Step | Operation | Description |
|------|-----------|-------------|
| 1 | Category Exclusion | Filter out logs from the excluded category |
| 2 | Energy Reduction | Apply the 10% reduction multiplier to the filtered total |
| 3 | Emission Factor | Apply the active emission factor (grid or renewable) |

**Combined Formula:**

```
E_projected = [Σ Eᵢ (where category ≠ excluded)] × (1 - r)
C_projected = E_projected × EF_active
```

Where:
- `r` = 0.10 if Scenario 1 is active, 0 otherwise
- `EF_active` = 0.4 if Scenario 2 is active, 0.7 otherwise

### 3.7.4 Reduction Metrics

The system computes and displays percentage reductions for both energy and carbon:

```
Energy Reduction (%) = [(E_baseline - E_projected) ÷ E_baseline] × 100
Carbon Reduction (%) = [(C_baseline - C_projected) ÷ C_baseline] × 100
```

### 3.7.5 Sample Computation

**Given:** Monthly baseline data of 2.96 kWh energy and 2.072 kg CO₂ (from Section 3.6.4)

**Scenario: All three interventions active** (10% reduction + renewable grid + exclude Facilities/HVAC category)

| Step | Calculation | Result |
|------|-------------|--------|
| Baseline Energy | Σ all logs | 2.96 kWh |
| After Category Exclusion (remove HVAC: 0.45 kWh) | 2.96 - 0.45 | 2.51 kWh |
| After 10% Reduction | 2.51 × 0.9 | 2.259 kWh |
| Carbon with Renewable Grid | 2.259 × 0.4 | 0.9036 kg CO₂ |

**Reduction Summary:**

| Metric | Baseline | Projected | Reduction |
|--------|----------|-----------|-----------|
| Energy | 2.96 kWh | 2.259 kWh | 23.7% |
| Carbon | 2.072 kg CO₂ | 0.9036 kg CO₂ | 56.4% |

### 3.7.6 Visualization

The predictive modeling interface presents results through:

1. **Side-by-side comparison cards** displaying baseline and projected values for energy (kWh) and carbon emissions (kg CO₂)
2. **Bar chart visualization** comparing baseline vs. projected values across both metrics
3. **Reduction summary panel** showing percentage decreases and absolute values saved

### 3.7.7 Implementation in Code

The predictive modeling logic is implemented in TypeScript within the `ScenarioSimulation` component:

```typescript
// Renewable grid emission factor (kg CO₂/kWh) — based on DOE PH targets
const RENEWABLE_EMISSION_FACTOR = 0.4;

// Scenario computation logic
let filteredLogs = monthLogs;

// Step 1: Category exclusion
if (removeCategory && excludedCategory) {
  filteredLogs = filteredLogs.filter(log => log.category !== excludedCategory);
}

// Step 2: Calculate energy with optional 10% reduction
let totalEnergy = filteredLogs.reduce(
  (sum, log) => sum + calculateEnergyKWh(log.wattage, log.duration), 0
);
if (reduceElectricity) {
  totalEnergy *= 0.9;
}

// Step 3: Apply emission factor (grid or renewable)
const emissionFactor = useRenewableGrid ? RENEWABLE_EMISSION_FACTOR : CARBON_EMISSION_FACTOR;
const totalCarbon = totalEnergy * emissionFactor;
```

### 3.7.8 Limitations and Assumptions

| Limitation | Description |
|------------|-------------|
| **Static Reduction Factor** | The 10% reduction is applied uniformly across all devices; actual savings may vary by category |
| **Linear Emission Model** | Assumes a constant emission factor regardless of time-of-day or seasonal generation mix variations |
| **No Behavioral Modeling** | Does not account for rebound effects or changes in user behavior following interventions |
| **Single-Period Analysis** | Projections are based on current month data only; multi-period trend analysis is not included |

These limitations are acknowledged as areas for future enhancement, potentially incorporating machine learning-based forecasting and time-series analysis as the system accumulates sufficient historical data.

---

## References

Department of Energy. (2022). *Philippine Power Statistics*. Retrieved from https://www.doe.gov.ph

Department of Energy Philippines. (2022). *Philippine Energy Efficiency and Conservation Roadmap*. DOE PH.

Department of Energy Philippines. (2022). *National Renewable Energy Program (NREP)*. DOE PH.

Institute for Global Environmental Strategies. (2023). *List of Grid Emission Factors* (Version 11.6). Retrieved from https://www.iges.or.jp

Intergovernmental Panel on Climate Change. (2006). *2006 IPCC Guidelines for National Greenhouse Gas Inventories*. IGES, Japan.

International Energy Agency. (2022). *World Energy Outlook 2022*. IEA, Paris.

Meralco. (2023). *Appliance Wattage Guide*. Manila Electric Company.

GHG Protocol. (2015). *GHG Protocol Scope 2 Guidance*. World Resources Institute and World Business Council for Sustainable Development.

Republic Act No. 9513. *Renewable Energy Act of 2008*. Congress of the Philippines.
