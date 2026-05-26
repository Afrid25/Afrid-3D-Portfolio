# Portfolio Chatbot Knowledge System

The chatbot reads its knowledge from `public/knowledge/*.json`.

Edit these files to update answers without changing chatbot source code:

- `profile.json`: name, role, contact, resume, greeting, quick prompts
- `projects.json`: projects, tags, links, featured status, summaries
- `skills.json`: skill groups and technologies
- `experience.json`: technical journey and work history
- `education.json`: education and study focus
- `achievements.json`: achievements and certificates
- `faq.json`: common questions
- `latestUpdates.json`: newest information the assistant should prioritize

After editing a JSON file, redeploy the portfolio. The chatbot loads these files at runtime with `cache: "no-store"`, so responses follow the latest served data.

## OpenAI API

The secure API example lives in `api/chat.js`.

Set these environment variables in Vercel:

```bash
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-5.2
```

Do not expose `OPENAI_API_KEY` with a `VITE_` prefix.

If the API key is missing or the API route is unavailable during local Vite development, the chatbot uses the local knowledge engine in `src/lib/assistantEngine.js`.

## Future CMS Upgrade

The current beginner setup uses local JSON. To move to Supabase or Firebase later:

1. Keep the same knowledge shape used by the JSON files.
2. Replace `loadPortfolioKnowledge` in `src/lib/portfolioKnowledge.js` with database fetches.
3. Update `api/chat.js` to load the same data from the database.
4. Add admin authentication before allowing write access.

Recommended database collections/tables:

- `profile`
- `projects`
- `skills`
- `experience`
- `education`
- `achievements`
- `certificates`
- `faq`
- `latest_updates`
- `chat_analytics`

This keeps AI logic separate from portfolio data and allows future dashboard editing.
