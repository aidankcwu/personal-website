# Personal Website Project

This is my personal website built with Next.js, Tailwind CSS, and deployed on Vercel.

The goal is to launch a simple, clean, personal site first, then gradually improve the design and content.

## Current Priorities

### Phase 1: Simple Launch

Build a one-page website with these sections:

1. Hero
2. About
3. Featured Projects
4. Currently Building
5. Interests
6. Contact

Keep the design clean, modern, and easy to read. Do not over-engineer. Avoid unnecessary libraries, backend logic, databases, authentication, or complex state management.

The first version should be good enough to publish with a custom domain.

### Phase 2: Polish and Depth

After the simple version is live, improve:

1. Visual design and spacing
2. Hero section
3. Project descriptions
4. Mobile responsiveness
5. Resume/contact links
6. Basic animations with Motion, only if they feel subtle and intentional

Add project case study pages later only after the main page is solid.

## Style Direction

The site should feel personal, technical, and thoughtful.

Avoid generic portfolio language like “passionate developer” or “innovative problem solver.” Use specific wording about what I build and what I’m interested in.

Preferred tone:
- Clear
- Concise
- Personal
- Slightly informal
- Not corporate

## Content Focus

Highlight projects and interests related to:

- AI systems
- Quantitative trading
- Applied machine learning
- Data science
- Research
- Personal knowledge tools
- Chess
- Languages

Important projects to include:

- Kalshi autonomous trading agent
- OCR-to-Obsidian/RAG knowledge pipeline
- EMG/IMU gesture augmentation research
- MD Anderson toxicity prediction work

## Coding Guidelines

Use simple, readable components.

Suggested structure:

```text
app/page.tsx
components/Hero.tsx
components/About.tsx
components/Projects.tsx
components/CurrentlyBuilding.tsx
components/Interests.tsx
components/Contact.tsx
components/Footer.tsx