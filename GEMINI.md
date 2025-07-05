## Project Overview

This is a Next.js project for an educational platform called "TeachMe".

### Key Technologies

*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS
*   **AI:** Genkit
*   **Package Manager:** npm
*   **Authentication:** Firebase Authentication (Google Provider)
*   **Database:** Firestore (for user roles and lesson metadata)
*   **Storage:** Firebase Storage (for lesson content in Markdown format)

### User Roles

Users are assigned one of the following roles upon their first login:

*   **Student (Default)**
*   **Lecturer**
*   **Admin**

### Project Structure

*   `src/app`: Main application pages and layouts.
*   `src/components`: Reusable React components.
*   `src/lib`: Utility functions and data fetching logic.
*   `src/ai`: AI-related code, including Genkit flows.
*   `src/hooks`: Custom React hooks, including authentication context.

### Content Hierarchy

*   **Subjects:** Broad categories (e.g., "Mathematics", "History").
*   **Courses:** Specific learning paths within a subject.
*   **Modules:** Sections within a course, grouping related lessons.
*   **Lessons:** Individual learning units within a module. Lesson content is written in Markdown and rendered in the UI.

### Development

*   **Run development server:** `npm run dev`
*   **Install dependencies:** `npm install`