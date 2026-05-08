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

## Page Structure

The website should have a simple app-style structure where the homepage acts as the central landing page and the project pages provide depth. At the top level, the app/ directory should contain the main routing files: layout.tsx for the shared page shell, metadata, fonts, and global structure; page.tsx for the homepage; and globals.css for Tailwind/global styling. Inside app/, create a projects/ route, with either a page.tsx for an optional project index page later and a dynamic [slug]/page.tsx route for individual project writeups. That lets every project live at a clean URL like /projects/kalshi-trading-agent without manually creating a separate route folder for every single one. The homepage itself should be built from reusable components rather than one giant file, so most visual sections should live in components/, with files like Hero.tsx, IntroCard.tsx, FeaturedProjects.tsx, ProjectCard.tsx, CurrentlyBuilding.tsx, Interests.tsx, Navbar.tsx, and Footer.tsx. Project information should live in a separate data/projects.ts file, which acts as the single source of truth for project titles, slugs, summaries, stack tags, links, images, and longer writeup content. The homepage can pull from that file to display featured cards, while the dynamic project pages can use the same data to render full project writeups. Static assets should go in public/, with public/resume.pdf for the resume download and public/images/ for the chess king hero image, project thumbnails, icons, or any other visuals. If you later add longer writing or markdown-based project pages, you can add a content/ directory for MDX files, but I would not start there unless you know you want blog-style writing. Overall, the structure should separate routing in app/, reusable UI in components/, project content/data in data/, and static files in public/, so the site stays easy to expand without becoming messy.

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