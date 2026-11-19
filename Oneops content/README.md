# OneOps Website Content & Revamp Blueprint

> Complete extracted content, copy, metadata, and assets from [https://oneops.pro/](https://oneops.pro/)  
> Extracted on: **November 19, 2026**  
> Workspace: `c:\Antigravity\Oneops website\Oneops content`

---

## 📁 Repository Structure

```
Oneops content/
├── README.md                                  # Master index, brand architecture & revamp roadmap
├── pages/                                     # Core marketing pages
│   ├── 01_home.md                             # Homepage copy, sections, KPIs, mockups, FAQs
│   ├── 02_features.md                         # Dedicated Features page (AI Cost Management)
│   └── 03_blogs_index.md                      # Blog hub & Insights archive
├── blogs/                                     # Complete long-form editorial articles
│   ├── how-to-control-ai-spending-across-your-organization.md
│   ├── hidden-challenges-of-managing-multiple-ai-providers.md
│   └── why-ai-governance-is-the-next-big-enterprise-priority.md
├── components/                                # Reusable UI components & copy modules
│   ├── header_and_navigation.md               # Top navigation bar, logo, and CTA links
│   ├── footer_and_legal.md                    # Footer links, compliance badges, copyright
│   ├── comparison_table.md                    # Competitive matrix: OneOps vs LiteLLM vs Portkey
│   ├── pricing_matrix.md                      # Starter ($49), Growth ($199), Enterprise plans
│   ├── faq_accordion.md                       # 6 Enterprise FAQ items with full answers
│   └── early_access_form.md                   # Lead capture / demo modal form specifications
├── media/                                     # Assets & media inventory
│   ├── assets_inventory.md                    # Comprehensive register of all site images & SVGs
│   └── images/                                # Downloaded local assets for offline design
│       ├── oneops-logo.png                    # Primary logo
│       ├── On-charcoal.png                    # Dark mode logo variant
│       ├── oneops-favicon.png                 # Favicon
│       ├── blog-1-spend-control.webp          # Featured cover for Blog 1
│       ├── blog-2-multi-provider.webp         # Featured cover for Blog 2
│       └── blog-3-ai-governance.webp          # Featured cover for Blog 3
└── raw_data/                                  # Machine-readable exports
    ├── site_metadata.json                     # Full WordPress REST API export (pages, posts, SEO)
    └── structured_content.json                # JSON content tree for CMS or frontend framework ingestion
```

---

## 🎯 Brand Identity & Positioning

| Element | Definition |
| :--- | :--- |
| **Brand Name** | **OneOps** |
| **Tagline** | **Enterprise AI Governance Platform** |
| **Core Value Proposition** | The central control plane for enterprise AI: manage API keys, track spend by team and person, enforce hard budgets, and govern access across every AI model. |
| **Hero Headline** | `Every AI key. Every team. One platform.` |
| **Target Audience** | • **CTOs & CIOs**: Eliminates shadow AI, enforces centralized security policies.<br>• **CISOs & Security**: Prevents PII leakage with real-time DLP; maintains audit logs.<br>• **Finance & Procurement**: Enforces hard budget caps, per-employee spend attribution, eliminates end-of-month invoice shock.<br>• **IT & Operations**: Instant offboarding in 30 seconds; SCIM/Okta sync; no more keys in `.env` or Slack threads. |

---

## ⚔️ Competitive Differentiation (The "Why OneOps" Narrative)

Most market alternatives (e.g., **LiteLLM**, **Portkey**) were built as **developer-first proxy routers** (handling load balancing, latency, and code-level retries).

**OneOps is positioned directly above raw proxy routers as the Enterprise AI Control Plane**:
1. **Built for Business & Operations Teams**: Non-technical dashboards for Finance, HR, IT, and Team Leads.
2. **Per-Person Spend Attribution**: Track which exact employee incurred which API cost, not just a collective team bucket.
3. **Pre-LLM Data Privacy (DLP)**: Real-time scanning for 20+ PII types (names, SSNs, credit cards, healthcare records) before prompts leave the private network.
4. **Context Injection & Knowledge Base**: Centrally stores company context, brand guidelines, and specs to auto-inject into prompts, saving token costs and redundant context pasting.
5. **Zero-Code Access Delegation**: Assign models to teams with point-and-click ease (e.g., Development gets Claude + Bedrock; Marketing gets Gemini; Sales gets GPT-4o).

---

## 💡 Website Revamp Recommendations

When redesigning the OneOps website, consider the following high-impact enhancements:

### 1. Visual Design & Modern Tech Stack
- **Dark/Light Theme Contrast**: The current brand uses sleek dark slate tones (`#0F172A`, `#1E293B`) paired with high-contrast emerald/cyan accents for stats. A modern Next.js/Tailwind or Astro implementation will deliver instant page loads (CWV score > 95) replacing legacy WordPress/Elementor bloat.
- **Interactive Dashboard Sandbox**: Instead of static mockup images, implement an interactive preview widget where visitors can toggle between "Dev", "Marketing", and "Sales" to see real-time spend bars, budget caps, and model permissions adjust.

### 2. ROI & AI Spend Calculator
- Add an interactive calculator on the Pricing or Feature page:
  - *Inputs*: Number of employees using AI, average spend per person, primary models used.
  - *Output*: Estimated monthly savings from prompt caching, context auto-injection, and catching overages before they occur.

### 3. SEO & Information Architecture
- Retain exact URLs (`/feature/`, `/blogs/`, `/blogs/<slug>/`) to preserve domain authority.
- Retain existing Yoast SEO meta descriptions and structured schema already mapped in `raw_data/site_metadata.json`.
- Consider expanding the `/feature/` section into dedicated solution landing pages:
  - `/solutions/ai-cost-management`
  - `/solutions/ai-security-dlp`
  - `/solutions/ai-key-vault`
  - `/solutions/enterprise-governance`

---

## 🚀 Quick Links to Files

- 📄 [Homepage Copy & Layout](pages/01_home.md)
- 📊 [Features Page Copy](pages/02_features.md)
- 📰 [Blog Index Page](pages/03_blogs_index.md)
- 📝 [Blog: How to Control AI Spending Across Your Organization](blogs/how-to-control-ai-spending-across-your-organization.md)
- 📝 [Blog: Hidden Challenges of Managing Multiple AI Providers](blogs/hidden-challenges-of-managing-multiple-ai-providers.md)
- 📝 [Blog: Why AI Governance Is the Next Big Enterprise Priority](blogs/why-ai-governance-is-the-next-big-enterprise-priority.md)
- 🧭 [Header & Navigation](components/header_and_navigation.md)
- ⚖️ [Competitive Comparison Matrix](components/comparison_table.md)
- 💳 [Pricing Matrix](components/pricing_matrix.md)
- ❓ [FAQ Accordion](components/faq_accordion.md)
- 📋 [Early Access Lead Form](components/early_access_form.md)
- 🖼️ [Assets Inventory](media/assets_inventory.md)
- 📦 [Structured Content JSON](raw_data/structured_content.json)
- 🗄️ [Raw WordPress Metadata JSON](raw_data/site_metadata.json)
