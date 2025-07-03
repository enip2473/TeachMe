# TeachMe

This is a Next.js project for an educational platform.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

This project uses Firebase Authentication with Google as a provider. Users are assigned one of three roles upon their first login:

*   **Student (Default):** Can view lessons and courses.
*   **Lecturer:** Can view lessons and courses, and has access to a Lecturer Dashboard (future feature).
*   **Admin:** Can view lessons and courses, and has access to an Admin Dashboard (future feature).

## Tech Stack

*   [Next.js](https://nextjs.org/) - React framework
*   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
*   [Genkit](https://firebase.google.com/docs/genkit) - AI integration
*   [Firebase](https://firebase.google.com/) - Authentication and Firestore for user roles.

## Content Hierarchy

The educational content is organized in a hierarchical structure:

*   **Subjects:** Broad categories (e.g., "Mathematics", "History").
*   **Courses:** Specific learning paths within a subject.
*   **Modules:** Sections within a course, grouping related lessons.
*   **Lessons:** Individual learning units within a module.

## Project Structure

*   `src/app`: Contains the main application pages and layouts.
*   `src/components`: Contains reusable React components.
*   `src/lib`: Contains utility functions and data fetching logic.
*   `src/ai`: Contains AI-related code, including Genkit flows.
*   `src/hooks`: Contains custom React hooks, including authentication context.
