# DESIGNER_GUIDE.md

## 1. What is the Ramme App Starter?

Welcome to the Ramme App Starter! Think of this as your pre-built, fully-wired canvas for creating interactive prototypes. It's designed specifically for product designers, founders, and creators who want to build and test high-fidelity ideas without getting stuck on complex technical setup.

The starter kit comes with our entire `@ramme-io/ui` component library, a dynamic theming system, and a modern development environment already configured. This lets you skip the tedious setup and jump straight into bringing your vision to life.

## 2. Before You Start: Prerequisites

You only need two things on your computer to get started:

* **Node.js**: This is the underlying engine that runs the development environment. You can download the latest "LTS" (Long-Term Support) version from the official [Node.js website](https://nodejs.org/).
* **A Code Editor**: We highly recommend using [Visual Studio Code](https://code.visualstudio.com/), as it's free and has excellent support for the technologies in this project.

## 3. The One-Command Setup (Sub-5-Minute Goal ⏱️)

Our primary goal is to get you from zero to a running prototype in under five minutes. The entire setup process is handled by a single command.

Open your computer's terminal (on Mac, you can search for "Terminal"; on Windows, "PowerShell" or "Command Prompt"), and run the following command:

```bash
npm create @ramme-io/app@latest your-project-name
```

This command will ask you for a project name (e.g., `my-new-prototype`). It will then automatically:

1.  Create a new folder with your project's name.
2.  Install all the necessary dependencies, including React and `@ramme-io/ui`.
3.  Set up all the required configuration files.

## 4. Running Your Prototype

Once the installation is complete, navigate into your new project directory and start the development server.

`cd <your-project-name>`
`npm run dev`

Your new Ramme application will now be running at [http://localhost:5173](http://localhost:5173). Open this link in your web browser, and you will see the interactive style guide.

## 5. Exploring the Application

The application that's running is a complete, interactive prototype that also serves as a style guide for the `@ramme-io/ui` component library.

* **Live Components**: Every component you see is a live, interactive example. You can click buttons, open menus, and interact with forms to see exactly how they look and feel.
* **Side Navigation**: Use the navigation on the left to jump between different pages and categories of components.
* **Dynamic Theming**: Use the user menu in the top-right header to switch between themes and see how all components instantly adapt to different visual styles (like Dark Mode).
* **Multi-Template System**: Use the "Dashboard | Docs" toggle in the header to switch between two different application layouts. Notice how the content stays the same, but the entire navigation structure changes.

## 6. The Power of the Sitemap: Your First Change

The single most powerful feature of the Ramme starter is that the application's entire structure—its pages, navigation, titles, and icons—is controlled by a single file called a **sitemap**.

This is your central control panel. You don't need to hunt through component files to change a page title or reorder a navigation item. Let's try it.

1.  **Open the Project in Your Code Editor**: Open the folder you created (e.g., `my-new-prototype`) in VS Code.
2.  **Find the Sitemap**: In the file explorer on the left, navigate to `src` > `templates` > `dashboard` and open the `dashboard.sitemap.ts