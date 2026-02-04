# CHAPTER 3: DESIGN AND DEVELOPMENT METHODOLOGY

## 3.1 Methods of Data Gathering

The development of Campus Watt Watch employed multiple data gathering techniques to ensure the system accurately addresses user needs and institutional requirements.

### 3.1.1 Document Analysis

Existing literature on carbon emission factors, energy consumption patterns, and sustainability reporting standards were reviewed. The Philippine grid emission factor of **0.7 kg CO₂ per kWh** was adopted based on Department of Energy publications and international GHG Protocol guidelines.

### 3.1.2 Survey Questionnaire

A structured questionnaire based on the **ISO 25010** software quality model will be administered to evaluate the system's functional suitability, usability, security, and performance. Respondents include:

- Campus facilities personnel (5 respondents)
- Office representatives from various departments (10 respondents)
- Student pilot users (15 respondents)

### 3.1.3 Device Inventory Analysis

Common campus electrical devices were cataloged and categorized with their average wattage ratings:

| Category | Example Devices | Average Wattage |
|----------|-----------------|-----------------|
| Computing | Laptops, Desktop PCs | 150W |
| HVAC | Air Conditioning Units | 1,500W |
| Lighting | Fluorescent, LED Bulbs | 60W |
| Projectors | Classroom Projectors | 300W |
| Printers | Laser Printers, Copiers | 500W |
| Laboratory | Scientific Equipment | 800W |
| Kitchen | Refrigerators, Microwaves | 1,000W |

---

## 3.2 Requirements Specification

### 3.2.1 Project In-Scope and Out-Scope

**In-Scope:**

| Feature | Description |
|---------|-------------|
| User Authentication | Secure email/password login with email verification |
| Energy Logging | Manual entry of device usage (device, wattage, duration) |
| Carbon Calculation | Automatic computation using Philippine grid emission factor |
| Personal Dashboard | Individual consumption statistics (daily, weekly, monthly) |
| Admin Analytics | Campus-wide aggregated reports and user activity monitoring |
| Role-Based Access | Differentiated views for regular users and administrators |
| Responsive Design | Full functionality on desktop, tablet, and mobile devices |
| Data Visualization | Interactive charts showing consumption by category and time |

**Out-of-Scope:**

| Feature | Reason |
|---------|--------|
| Real-time IoT Integration | Requires hardware sensors beyond project scope |
| Automated Meter Reading | Would require physical infrastructure modifications |
| Multi-Campus Support | Initial deployment limited to LPU Manila |
| Water/Waste Tracking | Focus limited to electricity consumption |
| Mobile Native App | Web application serves all device types |
| Billing Integration | Beyond sustainability tracking objectives |
| Predictive Analytics | Reserved for future AI/ML enhancement |

### 3.2.2 System Architecture

Campus Watt Watch follows a **three-tier web application architecture**:

**Presentation Layer**
- Technology: React 18, TypeScript, Tailwind CSS
- Responsibility: User interface rendering, form handling, data visualization

**Application Layer**
- Technology: React Context API
- Responsibility: State management, business logic, API orchestration

**Data Layer**
- Technology: Supabase/PostgreSQL
- Responsibility: Persistent storage, authentication, access control

### 3.2.3 Hardware and Software Requirements

**Hardware Requirements (Development):**

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel Core i3 / AMD Ryzen 3 | Intel Core i5 / AMD Ryzen 5 |
| RAM | 4 GB | 8 GB |
| Storage | 10 GB available | 20 GB SSD |
| Display | 1366 × 768 | 1920 × 1080 |
| Internet | 5 Mbps | 25 Mbps |

**Hardware Requirements (End User):**

| Component | Minimum |
|-----------|---------|
| Device | Any device with modern web browser |
| Display | 320px minimum width (mobile responsive) |
| Internet | 1 Mbps stable connection |

**Software Requirements (Development):**

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Bun | Latest | Package manager and bundler |
| VS Code / Lovable | Latest | Development environment |
| Git | 2.0+ | Version control |
| Chrome/Firefox | Latest | Testing and debugging |

**Software Requirements (Production):**

| Software | Version | Purpose |
|----------|---------|---------|
| React | 18.3.1 | Frontend framework |
| TypeScript | 5.0+ | Type-safe JavaScript |
| Vite | 5.0+ | Build tool |
| Supabase | Latest | Backend-as-a-Service |
| Tailwind CSS | 3.4+ | Styling framework |

---

## 3.3 Analysis and Design

### 3.3.1 System Development Life Cycle

The project follows an **Agile Software Development Life Cycle (SDLC)** with iterative sprints allowing continuous refinement based on feedback.

**Phase Details:**

| Phase | Duration | Activities |
|-------|----------|------------|
| Planning | Week 1-2 | Requirements gathering, user stories, project scope definition |
| Design | Week 3-4 | System architecture, database schema, UI/UX wireframes |
| Development | Week 5-10 | Frontend components, backend integration, authentication |
| Testing | Week 11-12 | Unit tests, integration tests, user acceptance testing |
| Review | Ongoing | Stakeholder feedback, bug fixes, feature refinement |
| Deployment | Week 13 | Production release, user training, documentation |

### 3.3.2 UML Diagrams

#### Use Case Diagram

**Use Case Descriptions:**

| Use Case | Actor | Description |
|----------|-------|-------------|
| Register Account | User | Create new account with email, password, and name |
| Login/Logout | User, Admin | Authenticate and manage session |
| View Personal Dashboard | User | See individual energy and carbon statistics |
| Log Energy Consumption | User | Record device usage with wattage and duration |
| View Consumption History | User | Browse past energy log entries |
| Reset Password | User | Recover account via email verification |
| View Campus Analytics | Admin | Access aggregated campus-wide statistics |
| View All User Logs | Admin | Monitor all user consumption records |
| Manage User Roles | Admin | Assign or revoke administrative privileges |

#### Class Diagram

**User Class:**
- Attributes: id (string), email (string), name (string), role ('user' | 'admin')
- Methods: login(), logout(), resetPassword()

**EnergyLog Class:**
- Attributes: id (string), userId (string), deviceName (string), category (string), wattage (number), duration (number), carbonEmission (number), timestamp (Date)
- Methods: calculateEnergy(), calculateCarbon()

**DeviceCategory Class:**
- Attributes: id (string), name (string), icon (string), avgWattage (number)
- Methods: getDevices()

**DashboardStats Class:**
- Attributes: totalEnergyToday (number), totalCarbonToday (number), totalEnergyWeek (number), totalCarbonWeek (number), totalEnergyMonth (number), totalCarbonMonth (number), topDevices (Device[]), categoryBreakdown (array)
- Methods: getStats()

#### Activity Diagram - Energy Logging Process

1. Start
2. User logs in
3. System checks authentication
   - If not authenticated: Show error, return to login
   - If authenticated: Continue
4. User navigates to Log Energy page
5. User selects device category
6. User enters device name and wattage
7. User selects/enters duration
8. System calculates energy and carbon
9. User submits log
10. System saves to database
11. System updates dashboard statistics
12. System displays success notification
13. End

#### Sequence Diagram - User Login Flow

1. User enters credentials on LoginPage
2. LoginPage calls AuthContext.signIn(email, password)
3. AuthContext calls Supabase.auth.signInWithPassword()
4. Supabase returns session or error
5. AuthContext fetches profile from Supabase
6. Supabase returns profile data
7. AuthContext checks user_roles in Supabase
8. Supabase returns role data
9. AuthContext updates state with user info
10. LoginPage redirects user to Dashboard

#### Database Design (ERD)

**Table: profiles**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique profile identifier |
| user_id | UUID | FK → auth.users, NOT NULL | Links to authentication |
| name | TEXT | NOT NULL | User display name |
| email | TEXT | NOT NULL | User email address |
| created_at | TIMESTAMP | DEFAULT now() | Account creation time |
| updated_at | TIMESTAMP | DEFAULT now() | Last modification time |

**Table: user_roles**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique role assignment ID |
| user_id | UUID | FK → auth.users, NOT NULL | Links to user |
| role | app_role | DEFAULT 'user' | Role enumeration (admin/user) |
| created_at | TIMESTAMP | DEFAULT now() | Assignment time |

**Table: energy_logs**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique log identifier |
| user_id | UUID | FK → auth.users, NOT NULL | Log owner |
| device_name | TEXT | NOT NULL | Name of electrical device |
| category | TEXT | NOT NULL | Device category |
| wattage | INTEGER | NOT NULL | Power consumption in watts |
| duration | INTEGER | NOT NULL | Usage duration in minutes |
| carbon_emission | NUMERIC | NOT NULL | Calculated kg CO₂ |
| timestamp | TIMESTAMP | DEFAULT now() | When usage occurred |
| created_at | TIMESTAMP | DEFAULT now() | Record creation time |

**Relationships:**
- profiles.user_id → auth.users.id (1:1)
- user_roles.user_id → auth.users.id (1:1)
- energy_logs.user_id → auth.users.id (1:N)

#### System Storyboard

**Screen 1: Landing Page**
- Header with logo and navigation
- Hero section with headline "Track Your Campus Energy Footprint"
- Subtext explaining the system's purpose
- "Get Started" call-to-action button
- Feature highlights: Track Usage, Calculate Carbon, View Insights

**Screen 2: Login Page**
- Centered login card with logo
- Email input field
- Password input field
- "Sign In" button
- Links for "Forgot Password?" and "Create Account"
- Campus background image

**Screen 3: Dashboard**
- Sidebar navigation (Dashboard, Log Energy, Admin Panel)
- Welcome header with user name
- Tab navigation (Today, This Week, This Month)
- Four stat cards showing: Energy Consumed, Carbon Emission, Weekly Energy, Trees Needed
- Top 3 Energy Consuming Devices card with ranked list
- Energy by Category pie chart with legend
- Sustainability tip card at bottom

**Screen 4: Log Energy Page**
- Form with device category dropdown
- Device name text input
- Wattage number input with suggestions
- Duration selection (preset options + custom)
- Live preview showing calculated energy and carbon
- "Log Consumption" submit button
- Success toast notification on submission

---

## 3.4 Testing and Evaluation

### 3.4.1 Test Plan

**Test Objectives:**

1. Verify all functional requirements are correctly implemented
2. Ensure security controls prevent unauthorized data access
3. Validate calculation accuracy for energy and carbon values
4. Confirm responsive design across device sizes
5. Assess system performance under expected load

**Test Scope:**

| Test Type | Coverage |
|-----------|----------|
| Unit Testing | Calculation functions, utility methods |
| Integration Testing | API calls, database operations, authentication flow |
| System Testing | End-to-end user journeys |
| Security Testing | RLS policies, authentication bypass attempts |
| Usability Testing | User feedback via ISO 25010 questionnaire |

**Test Environment:**

- Development: Lovable preview environment
- Production: Deployed Lovable Cloud instance
- Browsers: Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- Devices: Desktop (1920×1080), Tablet (768×1024), Mobile (375×812)

### 3.4.2 Test Case Document

| TC-ID | Test Case | Steps | Expected Result |
|-------|-----------|-------|-----------------|
| TC-001 | User Registration | 1. Navigate to signup 2. Enter valid email/password/name 3. Submit | Account created, verification email sent |
| TC-002 | User Login | 1. Enter valid credentials 2. Click Sign In | Redirect to dashboard with user data |
| TC-003 | Invalid Login | 1. Enter wrong password 2. Click Sign In | Error message displayed, no access granted |
| TC-004 | Energy Log Creation | 1. Select category 2. Enter device/wattage/duration 3. Submit | Log saved, dashboard updated |
| TC-005 | Energy Calculation | 1. Log 1500W device for 120 minutes | Energy = 3.0 kWh, Carbon = 2.1 kg |
| TC-006 | Dashboard Statistics | 1. Log multiple entries 2. View dashboard | Correct totals for day/week/month |
| TC-007 | User Data Isolation | 1. Login as User A 2. Attempt to view User B data | Only User A data visible |
| TC-008 | Admin Access | 1. Login as admin 2. View admin panel | Campus-wide statistics displayed |
| TC-009 | Password Reset | 1. Click Forgot Password 2. Enter email 3. Check inbox | Reset email received with valid link |
| TC-010 | Responsive Layout | 1. Access on mobile device | All features accessible, no horizontal scroll |
| TC-011 | Session Timeout | 1. Login 2. Wait for session expiry | Automatic logout, redirect to login |
| TC-012 | Delete Energy Log | 1. View history 2. Delete entry | Log removed, statistics recalculated |

### 3.4.3 Evaluation Plan

The system will be evaluated using the **ISO 25010** software quality framework through structured questionnaires administered to pilot users.

**Evaluation Criteria:**

| Quality Characteristic | Sub-characteristics | Evaluation Method |
|------------------------|---------------------|-------------------|
| Functional Suitability | Completeness, Correctness, Appropriateness | Feature verification, calculation validation |
| Usability | Learnability, Operability, User Interface Aesthetics | 5-point Likert scale questionnaire |
| Security | Confidentiality, Integrity, Authenticity | Penetration testing, RLS validation |
| Performance Efficiency | Time Behavior, Resource Utilization | Load time measurements, response timing |
| Reliability | Availability, Fault Tolerance | Uptime monitoring, error handling tests |

**Evaluation Respondents:**

| Group | Count | Role in Evaluation |
|-------|-------|-------------------|
| Campus Facilities | 5 | Assess admin features, campus analytics |
| Office Representatives | 10 | Evaluate departmental logging workflow |
| Student Pilot Users | 15 | Test general usability, mobile experience |

**Evaluation Instruments:**

- Functional testing checklist
- Usability questionnaire (5-point Likert scale)
- System Usability Scale (SUS) standardized survey
- Open-ended feedback forms

**Scoring Interpretation:**

| Mean Score | Verbal Interpretation |
|------------|----------------------|
| 4.50 - 5.00 | Strongly Agree / Excellent |
| 3.50 - 4.49 | Agree / Very Good |
| 2.50 - 3.49 | Neutral / Satisfactory |
| 1.50 - 2.49 | Disagree / Needs Improvement |
| 1.00 - 1.49 | Strongly Disagree / Poor |

---

## 3.5 Deployment Plan

### 3.5.1 Deployment Strategy

Campus Watt Watch follows a **Continuous Deployment** model through the Lovable platform, enabling rapid iteration and immediate availability of updates.

**Deployment Phases:**

| Phase | Timeline | Activities |
|-------|----------|------------|
| Development | Weeks 1-10 | Feature implementation in preview environment |
| Staging | Week 11 | Internal testing, bug fixes, final refinements |
| Soft Launch | Week 12 | Pilot deployment to test users (30 participants) |
| Production | Week 13 | Full campus deployment with user training |
| Maintenance | Ongoing | Bug fixes, feature updates, user support |

### 3.5.2 Deployment Environment

| Component | Specification |
|-----------|---------------|
| Hosting | Lovable Cloud (managed infrastructure) |
| Database | Supabase PostgreSQL (auto-scaling) |
| CDN | Global edge network for static assets |
| SSL | Automatic HTTPS certificate provisioning |
| Domain | campus-green-view.lovable.app (custom domain configurable) |

### 3.5.3 Rollback Procedure

In case of critical deployment issues:

1. Access Lovable version history
2. Identify last stable deployment
3. Restore previous version
4. Notify affected users
5. Investigate root cause before redeploying

### 3.5.4 Post-Deployment Support

| Support Type | Response Time | Channel |
|--------------|---------------|---------|
| Critical bugs | 4 hours | Direct developer access |
| Feature requests | 1-2 weeks | Feedback collection |
| User training | On-demand | Documentation, video guides |

---

## 3.6 Calculation Methodology

Energy consumption and carbon emissions are calculated using scientifically validated formulas adapted for the Philippine electrical grid.

### Energy Consumption Formula

```
Energy (kWh) = (Wattage × Duration in minutes) / 60,000
```

This formula converts watt-minutes to kilowatt-hours, the standard unit for electricity billing and consumption analysis.

### Carbon Emission Formula

```
Carbon Emission (kg CO₂) = Energy (kWh) × 0.7
```

The emission factor of **0.7 kg CO₂ per kWh** represents the Philippine grid average, accounting for the nation's energy mix of coal, natural gas, and renewable sources.

### Example Calculation

A 1500W air conditioning unit running for 120 minutes:

- Energy = (1500 × 120) / 60,000 = **3.0 kWh**
- Carbon = 3.0 × 0.7 = **2.1 kg CO₂**
