## Project Overview

This is a Next.js project for an educational platform called "TeachMe".

### Key Technologies

*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS, `uiw/react-md-editor` (for enhanced markdown editing), `react-syntax-highlighter` (for code syntax highlighting)
*   **AI:** Genkit
*   **Package Manager:** npm
*   **Authentication:** Firebase Authentication (Google Provider)
*   **Database:** Firestore (for user roles and lesson metadata)
*   **Storage:** Firebase Storage (for lesson content in Markdown format, with secure and consistent handling)

### User Roles

Users are assigned one of the following roles upon their first login:

*   **Student (Default)**
*   **Lecturer**
*   **Admin**

Authentication flow has been improved with a loading state to prevent UI flickering on page load. Access control has been refined, replacing direct redirects to removed login/signin pages with informative toast messages for unauthorized access.

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
*   **Lessons:** Individual learning units within a module. Lesson content is written in Markdown and rendered in the UI. The lesson editing experience has been enhanced, and new lesson content initialization is now correctly handled.

### Development

*   **Run development server:** `npm run dev`
*   **Install dependencies:** `npm install`