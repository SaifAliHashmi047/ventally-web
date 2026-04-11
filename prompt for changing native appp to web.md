You are an expert senior frontend engineer specializing in React.js (Vite), React Native migrations, and scalable UI systems.

Your task is to fully convert and replicate a React Native mobile application into a high-quality, production-ready React.js web application.

---

## 📁 Project Context

* React Native source: `ventallytest`
* Existing (incomplete) web app: `ventally-web`
* The web version already contains some screens, but they are inconsistent and incomplete

---

## 🎯 Mission Objectives

### 1. Full App Replication (Pixel-Perfect)

* Deeply analyze the React Native app
* Recreate ALL:

  * Screens
  * User flows
  * Navigation logic
  * UI components
* Maintain **pixel-perfect visual parity** with the mobile app
* Enhance for web with:

  * Hover states
  * Focus states
  * Smooth transitions

---

### 2. Role-Based Architecture

* Identify all user roles in the mobile app
* Recreate strict role separation in web:

  * Role-based routes
  * Protected routes
  * Separate dashboards/pages per role
  * Conditional rendering based on roles

---

### 3. Design System Fidelity

Replicate and systemize the design:

* Colors → Use CSS variables (theme tokens)
* Typography → Match font family, weights, sizes
* Spacing → Maintain consistent spacing scale
* Components → Match structure and visual weight

#### Glassmorphism (Important)

* Recreate glassy UI elements:

  * backdrop-blur
  * semi-transparent backgrounds
  * soft borders and shadows
* Ensure performance-friendly implementation

---

### 4. Styling System (MANDATORY)

Use:

* **Tailwind CSS** (for speed + responsiveness)
* **CSS Variables** (for theming consistency)

Create:

* Global theme config (colors, spacing, fonts)
* Reusable utility patterns
* Component-level consistency

---

### 5. Responsiveness (Critical)

Convert mobile UI into **fully responsive web layouts**:

* Mobile-first approach
* Breakpoints:

  * Mobile
  * Tablet
  * Desktop
* Do NOT scale UI blindly — adapt layouts intelligently

---

### 6. Refactor Existing Web Code

Audit all screens in `ventally-web`:

If any screen is:

* Visually inconsistent
* Poorly structured
* Not matching mobile app
  → Refactor completely

Ensure:

* One consistent design language across the entire app
* No mixed styles or design drift

---

### 7. Component Architecture

Build reusable, scalable components:

* Buttons
* Cards (especially glass containers)
* Inputs
* Modals
* Layout wrappers

Ensure:

* Consistent props API
* Reusability
* Clean separation of concerns

---

### 8. Navigation & Routing

* Convert React Native navigation into React Router structure
* Use:

  * Nested routes
  * Layout wrappers
  * Role-based route guards

---

### 9. API Integration

* Use EXACT same APIs as React Native app
* Maintain:

  * Request structure
  * Authentication flow
  * Error handling
* Centralize API logic

---

### 10. Code Quality & Structure

Follow best practices:

* Clean folder structure:

  * components/
  * pages/
  * layouts/
  * hooks/
  * services/
  * utils/
* Scalable architecture
* Maintainable code
* Avoid duplication

---

## ⚙️ Tech Stack (STRICT)

* React.js (Vite)
* Tailwind CSS
* React Router
* Axios or Fetch (centralized API layer)

---

## 🚀 Execution Plan (Follow Step-by-Step)

1. Analyze React Native app:

   * Extract screens, flows, roles, APIs
2. Audit existing web app:

   * Identify gaps and inconsistencies
3. Setup foundation:

   * Routing
   * Layout system
   * Theme system
4. Build core reusable components
5. Rebuild screens incrementally
6. Implement role-based flows
7. Refactor existing screens
8. Ensure full responsiveness
9. Polish UI (hover, animations, transitions)

---

## 🧠 Engineering Guidelines

* Do NOT blindly copy mobile UI → adapt for web UX
* Maintain strict consistency across all screens
* Prioritize performance and clean architecture
* Think like a product-level engineer

---

## ✅ Final Output Requirements

The final web app must:

* Fully replicate the React Native app functionality
* Maintain pixel-perfect design fidelity
* Be fully responsive across all devices
* Have consistent UI/UX across all pages
* Support all user roles with proper separation
* Be production-ready with clean, scalable code

---
