# OneOps Homepage Copy & Structure

> **URL**: `https://oneops.pro/`
> **SEO Title**: `OneOps | Enterprise AI Governance Platform`
> **SEO Meta Description**: `OneOps is an AI governance platform designed to help organizations manage LLMs and AI tools responsibly, ensuring visibility, governance, and operational efficiency.`

---

## 1. Hero Section

- **Eyebrow**: `Enterprise AI Operations`
- **Headline (H1)**:
  # Every AI key. Every team. One platform.
- **Subheadline**:
  OneOps is the enterprise AI Governance platform which serves as the control plane for enterprise AI. Manage keys, track spend by team and person, enforce budgets, and govern access across every AI model your company uses.
- **Primary CTA**: `Book a demo` *(Opens early access form)*
- **Secondary CTA**: `See how it works` *(Scrolls to #oneops-features)*
- **Social Proof Logos**:
  - `Trusted by teams at`:
    - Acme Corp
    - Nexus AI
    - Meridian
    - Vortex Labs

### Hero Dashboard Mockup Data
- **Header**: ONEOPS DASHBOARD (Tabs: Dashboard, API Keys, Teams, Spend, Members, Knowledge)
- **Top Stats**:
  - **Budget Burn**: 82% used | 9 days left in cycle
  - **Total Spend**: $8,240 *(+12% vs Apr)*
  - **Active Keys**: 14 *(2 expiring)*
  - **Members**: 23 across 4 teams
- **Team Spend Breakdown**:
  - Dev: $3.2k
  - Mktg: $2.2k
  - Sales: $1.6k
  - Ops: $760
- **API Keys Status**:
  - Claude Sonnet 4 (`sk-ant-...4f2a`): **Active**
  - Gemini 1.5 Pro (`AIza...8xKj`): **Expiring** (Renew in 6 days)
  - GPT-4o (`sk-...9aBc`): **Expiring**

---

## 2. The Problem Section

- **Eyebrow**: `The problem`
- **Headline (H2)**:
  ## Your teams are using 12 AI tools. You have no idea who authorized half of them.

### Problem Cards:
1. **Keys scattered everywhere**
   - *Body*: API keys living in Slack threads, Notion pages, and engineers' .env files. No rotation schedule, no audit trail, no visibility into who has what.
2. **Spend is a complete mystery**
   - *Body*: You get a $14,000 invoice from Anthropic at month-end and spend two days piecing together which team burned it – with no person-level breakdown anywhere.
3. **Zero access governance**
   - *Body*: Marketing has access to the same models as your infrastructure team – no usage policies, no budget limits, no offboarding process when someone leaves.

---

## 3. Core Platform Capabilities (Dashboard Features)

- **Eyebrow**: `The solution`
- **Headline (H2)**:
  ## Everything your AI operations team needs in one dashboard.

### Feature 01: API Key Vault
- **Title (H3)**: One vault for every AI key you own
- **Description**: Centrally store, rotate, and monitor API keys for Claude, Gemini, OpenAI, Bedrock, Groq, Mistral, and 40+ other providers. No more keys scattered across .env files and Slack threads.
- **Key Capabilities / Checkmarks**:
  - [x] Expiry alerts at 14, 7, and 3 days – Slack + email
  - [x] Full audit log of every key action – who touched what, when
  - [x] One-click rotation without cycling the underlying provider key
- **UI Mockup Data**:
  - Claude Sonnet 4 (`sk-ant-...4f2a`) · Development · $1,840/mo · Active
  - Gemini 1.5 Pro (`AIza...8xKj`) · Marketing · $1,490/mo · Expiring
  - Bedrock Titan (`AKIA...7P3M`) · Development · $1,340/mo · Active

### Feature 02: Spend Attribution & Budget Hard Caps
- **Title (H3)**: Know exactly what AI costs – and who.
- **Description**: Track spending by provider, model, team, and individual member in real time. Set monthly budgets with hard caps. No more end-of-month invoice surprises.
- **Key Capabilities / Checkmarks**:
  - [x] Per-person spend attribution – every API call tracked to a name
  - [x] Budget alerts at 50%, 75%, 90% – soft or hard caps
  - [x] Export spend reports for finance chargebacks
- **UI Mockup Data**:
  - Development: $3,180
  - Marketing: $2,210
  - Sales: $1,620
  - Operations: $760
  - Total: $8,240 (+12% vs Apr) | Forecast: $9,820 (82% of budget)

### Feature 03: Team Model Assignment
- **Title (H3)**: Give each team the right model.
- **Description**: Assign specific AI models to specific teams with zero code changes. Dev gets Claude + Bedrock. Marketing gets Gemini. Sales gets GPT-4o. Reconfigure access in seconds.
- **Key Capabilities / Checkmarks**:
  - [x] SSO/SCIM – auto-provision and deprovision via Okta, Azure AD
  - [x] Role-based permissions – Admin, Team Lead, Member, Viewer
  - [x] Instant access revocation – no key rotation required
- **UI Mockup Data**:
  - **DEV (Development, 8 members)**: Claude Sonnet 4, Bedrock Titan, Claude Haiku
  - **MAR (Marketing, 6 members)**: Gemini 1.5 Pro, Gemini Flash
  - **SAL (Sales, 5 members)**: GPT-4o, GPT-3.5 Turbo

### Feature 04: Real-Time PII & DLP Guardrails
- **Title (H3)**: Stop sensitive data from leaving your org.
- **Description**: Every prompt your team sends is scanned in real time before it reaches any LLM provider. Names, emails, SSNs, card numbers, medical records, financial data – all caught and handled before they leave your network.
- **Key Capabilities / Checkmarks**:
  - [x] Block, redact, or alert – configurable per team or provider
  - [x] Detects 20+ PII types – names, emails, SSNs, IBANs, health data, and more
  - [x] Full violation log for GDPR, HIPAA, and SOC 2 audits
  - [x] Custom rules – flag internal project names, client IDs, proprietary terms

### Feature 05: Context & Team Knowledge Base
- **Title (H3)**: Your team's context, auto-injected. Zero waste.
- **Description**: Build a team-specific knowledge base – brand guidelines, codebase conventions, product specs, client context. OneOps automatically injects the right KB into every LLM request, so your team never has to paste background context again.
- **Key Capabilities / Checkmarks**:
  - [x] Team-scoped – Marketing, Dev, Sales each get their own KB
  - [x] Versioned and owned – every doc has an author and review date
  - [x] Smart injection – only relevant KB chunks sent, not the whole library
- **Metric Mockup**: Saves ~$840/month in wasted context tokens for a team of 6.

---

## 4. Extended Capabilities (AI Workspace & Operations)

- **Eyebrow**: `Beyond Governance`
- **Headline (H2)**:
  ## Powerful capabilities built for your teams — create, collaborate, discover insights, and work smarter.
- **Subtitle**: OneOps goes beyond managing AI tools, giving teams more ways to get real work done.

### 1. Sophia AI (Intelligent AI Operations Assistant)
- **Description**: Go beyond dashboards and discover what is happening across your AI ecosystem. Administrators can interact with Sophia AI to understand team and user token consumption, spending patterns, prompts being used, and overall AI usage across the organization.
- Sophia also helps administrators stay ahead with budget alerts when a member exceeds their allocated limit and instant notifications when AI providers release new updates, features, or changes across their ecosystem and tools.
- **Pill Highlights**:
  - Budget alerts
  - Provider update notifications

### 2. Feedback System
- **Description**: Capture monthly feedback from users on a recurring basis to understand their experience with OneOps, identify friction points, and surface issues that need attention. Feedback creates a continuous loop between users, administrators, and the OneOps team.
- **Pill Highlights**:
  - Recurring monthly cycles
  - Friction point detection
  - Closed feedback loop

### 3. Prompt Library
- **Description**: Keep valuable conversations and prompts accessible instead of recreating them every time. Prompt Library automatically retains previous prompts and conversations, allowing users to save, revisit, and retrieve useful prompts whenever they need them.
- **Pill Highlights**:
  - Auto-retained history
  - Save and revisit
  - Team-wide reuse

### 4. Motion Studio
- **Description**: Bring AI-powered creativity directly into your OneOps experience with integrated Motion Studio capabilities. Users can create and edit videos using intuitive manual tools or prompt-driven workflows, making it easier to turn ideas into engaging visual content.
- **Pill Highlights**:
  - Manual editing tools
  - Prompt-driven workflows
  - Video in one place

---

## 5. How It Works

- **Eyebrow**: `Setup in minutes`
- **Headline (H2)**:
  ## Connect. Assign. Control.
- **Subtitle**: Three steps to full visibility over every AI tool in your company.

### Steps:
1. **01 · Connect your providers**
   - *Copy*: Paste in your API keys for any AI provider – Claude, OpenAI, Gemini, Bedrock, Mistral, Groq, and more. OneOps vaults them with AES-256 encryption immediately.
2. **02 · Create teams, assign models**
   - *Copy*: Set up your teams and choose which AI models each one can access. Define monthly budgets per team or per person. Sync with Okta or Azure AD via SCIM.
3. **03 · Track, alert, optimize**
   - *Copy*: Watch spend in real time. Get alerts before limits are hit. Rotate keys on schedule. Pull reports for finance. One dashboard for all of it – forever.

---

## 6. Competitive Comparison
*(See full component at `components/comparison_table.md`)*
- **Headline**: Built for operations teams, not just developers.
- **Subheadline**: LiteLLM and Portkey are great for routing API calls. OneOps is the AI gateway built above them—providing AI governance, spend oversight, policy management, and LLM observability for enterprise teams.

---

## 7. Customer Testimonials & Social Proof

- **Eyebrow**: `What teams say`
- **Headline (H2)**:
  ## Trusted by AI teams at fast-moving companies.

### Quote 1:
> *"Finally one place to see that Marketing is burning through Gemini credits and Dev has 3 expired Bedrock keys. We caught a $4,000 overage before it happened."*
- **Author**: **Morgan K.**
- **Role**: CTO, Series B SaaS Company
- **Avatar initials**: `MK`

### Quote 2:
> *"When a developer left, we revoked their AI access in 30 seconds from a single screen. Before OneOps that would have been a 2-hour audit across five different provider dashboards."*
- **Author**: **Sarah R.**
- **Role**: Head of IT Security, 300-person fintech
- **Avatar initials**: `SR`

### Quote 3:
> *"Finance asked me which departments were driving our AI costs. I pulled a full breakdown by team, model, and person in 2 minutes. That used to be a week-long spreadsheet exercise."*
- **Author**: **Tom L.**
- **Role**: VP Operations, 500-person enterprise
- **Avatar initials**: `TL`

---

## 8. Pricing Section
*(See full component at `components/pricing_matrix.md`)*
- **Headline**: Simple pricing that scales with your team.
- **Subtitle**: All plans include a 14-day free trial. No credit card required.
- **Tiers**:
  - **Starter**: $49/mo (3 teams, 10 keys, 25 members)
  - **Growth**: $199/mo (10 teams, unlimited keys, 100 members, SSO, KB)
  - **Enterprise**: Custom (Unlimited teams/members, SCIM, SOC 2/HIPAA, VPC, HRIS sync)

---

## 9. FAQ Section
*(See full component at `components/faq_accordion.md`)*
- 6 complete enterprise questions covering platform definition, LLM observability, operational workflow, supported providers, PII security policies, and onboarding.

---

## 10. Bottom Call to Action (CTA)

- **Headline (H2)**:
  ## Stop managing AI access in Slack.
- **Subheadline**:
  OneOps gives your enterprise the visibility, control, and AI governance layer that your AI stack has been missing – from day one and manage LLM API keys easily.
- **Primary CTA**: `Book a demo`
- **Secondary CTA**: `Start free trial — no card needed`
