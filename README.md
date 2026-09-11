# Workplace Genius

Create a modern, responsive SaaS web application called "AI Workplace Productivity Assistant" designed for professionals, administrators, managers, and job seekers.

Architecture & Layout:
- Professional SaaS dashboard layout with collapsible left sidebar navigation, top header (search, notifications, user profile, theme/status), and responsive main content area.
- Works seamlessly across desktop, tablet, and mobile.
- Clean, accessible design system with modern typography, subtle cards, professional icons (Lucide), loading skeletons, empty states, error handling, and toast notifications.
- Include a persistent or contextual "Responsible AI" badge and banner ("AI-generated content may contain errors or omissions. Always review and verify AI outputs before using them...").

Navigation & Routes:
1. Dashboard:
   - "Good morning! What would you like to accomplish today?" personalized header
   - Metrics/stats: Tasks completed, AI tasks run, Time saved, Active plans
   - Feature launch cards with badges and descriptions for all 5 AI modules
   - Quick Actions bar & Recent Activity feed
   - "Load Sample Demo Data" toggle / quick fill buttons

2. Smart Email Generator:
   - Inputs: Email Purpose, Recipient, Key Points / Notes, Tone selector (Formal, Friendly, Persuasive, Professional), Length selector (Short, Medium, Detailed)
   - "Load Sample Notes" button for instant demonstration
   - Generate button with realistic streaming/loading state
   - Generated editable result container with Subject line, Greeting, Body paragraphs, Closing, and Sign-off
   - Actions: Copy to Clipboard, Regenerate, Edit in place, Clear
   - Adheres to the prompt instructions: preserve meaning, no hallucinations, adapted tone

3. Meeting Notes Summarizer:
   - Inputs: Raw meeting notes text area, template loader (e.g. "Q3 Strategy & Operations Sync" sample notes)
   - "Summarize Meeting" action
   - Structured Output:
     * Executive Summary card
     * Key Discussion Points (bullet points)
     * Decisions Made (highlighted badges)
     * Action Items interactive table (Task | Responsible Person | Deadline | Status)
     * Follow-up Items & Next Steps
   - Actions: Export/Copy summary, Edit items, Mark tasks done

4. AI Task Planner:
   - Add/manage tasks with: Task Name, Priority (High/Medium/Low), Deadline, Estimated Duration (mins/hours)
   - Pre-loaded realistic sample tasks ("Prepare monthly administrative report", "Respond to client emails", "Attend team meeting", "Submit weekly report", "Update employee records")
   - Plan Scope: Daily Schedule vs. Weekly Plan
   - "Generate AI Schedule & Plan" action
   - AI Output breakdown:
     * Priority ranking & recommended order of execution
     * Suggested timeline/schedule including realistic break periods
     * Scheduling conflicts & workload warnings
     * Productivity recommendations

5. AI Research Assistant:
   - Input: Topic or research question with Depth selector (Quick Overview, Detailed Explanation, Key Insights, Recommendations)
   - Sample prompt chips (e.g., "AI adoption in HR workflows", "Hybrid work policy benchmarks")
   - AI Output: Executive Overview, Key Insights & Findings, Advantages & Disadvantages, Practical Recommendations, Questions for Further Research
   - Prominent source verification notice and confidence/disclaimer badge

6. AI Workplace Chat:
   - Full interactive chat interface with suggested prompt pills ("Draft an apology for delayed deliverable", "Prepare agenda for 1-on-1", "Help summarize this paragraph")
   - Rich message bubbles, Markdown formatting, Copy response button, Clear conversation, and Chat history sidebar
   - System prompt adherence: helpful, safe, strictly workplace focused

7. Settings:
   - User profile info, AI model preferences, tone presets, privacy controls, and clear cache / reset demo data buttons.

Ensure all features have realistic client-side fallback/mock responses with full prompt engineering fidelity so the demo works completely out of the box even before backend/API keys are configured, and integrates Lovable AI Edge Functions when available. Include polished sample data for immediate presentation.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pro-aid-suite.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fe8456c0-ecfc-4291-be39-49f5c6399436).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
