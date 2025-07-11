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

Authentication flow has been improved with a loading state to prevent UI flickering on page load. Access control has been refined, replacing direct redirects to removed login/signin pages with informative toast messages for unauthorized access.

## Content Management

Lesson content is written in Markdown. The editing experience has been enhanced with `uiw/react-md-editor`, providing a richer interface. Code blocks within markdown are now rendered with syntax highlighting using `react-syntax-highlighter`. Lesson content is securely and consistently stored in Firebase Storage, with robust handling for updates and new lesson initialization.

## Tech Stack

*   [Next.js](https://nextjs.org/) - React framework
*   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
*   [Genkit](https://firebase.google.com/docs/genkit) - AI integration
*   [Firebase](https://firebase.google.com/) - Authentication, Firestore for metadata, and Storage for content.
*   [`uiw/react-md-editor`](https://github.com/uiwjs/react-md-editor) - Markdown editor for React.
*   [`react-syntax-highlighter`](https://github.com/react-syntax-highlighter/react-syntax-highlighter) - Syntax highlighting for React components.

## Content Hierarchy

The educational content is organized in a hierarchical structure:

*   **Subjects:** Broad categories (e.g., "Mathematics", "History").
*   **Courses:** Specific learning paths within a subject.
*   **Modules:** Sections within a course, grouping related lessons and homeworks.
*   **Lessons:** Individual learning units within a module. Lesson content is written in Markdown.
*   **Homeworks:** Individual assignments within a module, supporting various problem types (starting with multiple-choice).

## Project Structure

*   `src/app`: Contains the main application pages and layouts.
*   `src/components`: Contains reusable React components.
*   `src/lib`: Contains utility functions and data fetching logic.
*   `src/ai`: Contains AI-related code, including Genkit flows.
*   `src/hooks`: Contains custom React hooks, including authentication context.
