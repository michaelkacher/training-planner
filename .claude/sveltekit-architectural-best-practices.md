# SvelteKit Architectural and Performance Best Practices

SvelteKit is designed to be lean, but following these architectural and performance guidelines will ensure your application remains fast, scalable, and maintainable.

---

## 1. Routing and Layouts

- **Use Nested Layouts for Scoping:** Avoid cramming everything into the main `+layout.svelte`. Use nested layouts to manage UI (like sidebars or sub-navigation) and logic for specific route groups (e.g., `/dashboard/+layout.svelte` for all dashboard pages). This keeps code modular and localizes changes.

- **Leverage Load Functions (`+page.server.js`/`+layout.js`):**

  - **Data Fetching:** Fetch data required for a specific route within its **`load`** function. SvelteKit handles loading states, error handling, and parallel execution for you.
  - **Global Data:** Use `+layout.server.js` or `+layout.js` for data needed across many routes, such as user session data, global navigation links, or theme settings.

- **Server-Side Rendering (SSR) by Default:** SvelteKit uses **SSR** by default, which is great for SEO and initial page load performance. Use `+page.server.js` for data that requires server credentials (like database access or environment variables that shouldn't be exposed to the client).

- **Minimize Hydration Overheads:** Svelte is naturally lightweight, but ensure you are only rendering interactive Svelte components where necessary. If a page is entirely static (e.g., a landing page), consider **prerendering** it during the build process or using the `+page.server.js` file's `load` function to only return HTML without client-side JavaScript.

---

## 2. State Management

- **Svelte Stores (The Default):** For most local and application-wide state, Svelte's built-in **writable** and **readable** stores are the cleanest solution.

  - Use **derived stores** for computed state (e.g., filtering a list based on a search term).

- **Context API for Component Trees:** For passing data deep down a component tree without prop drilling, use Svelte's **Context API** (`getContext`/`setContext`). This is cleaner than importing stores globally for deeply nested components.

- **Svelte 5 Runes (`$state`, `$derived`):** If you are using Svelte 5, leverage **runes** for reactive declarations. They provide a more explicit and intuitive way to manage state directly within components, often replacing the need for local writable stores.

---

## 3. Component Architecture

- **Organize by Domain:** For large applications, organize components, stores, and utilities based on features or domains (e.g., `src/lib/components/auth`, `src/lib/components/products`) rather than technical type.

- **Props-First Approach:** Keep components dumb and reusable. Components should primarily receive data and handlers via **props**, keeping the core logic segregated into stores or utility modules.

- **Accessibility (A11y):** Prioritize accessibility from the start. Use semantic HTML, proper ARIA attributes, and ensure keyboard navigation works for all interactive elements.

---

## 4. Performance & Optimization

- **Image Optimization:** Use modern image formats (WebP) and techniques. SvelteKit's Vite integration allows for tools to optimize images and lazily load them.

- **Code Splitting:** SvelteKit automatically handles **route-level code splitting**, ensuring users only download the code needed for the current page.

- **CSS Scoping:** Use `<style>` blocks inside `.svelte` files. This scopes CSS automatically, preventing global style conflicts and eliminating unused CSS from the production bundle, which boosts performance.

- **Dependency Management:** Be mindful of external packages. Svelte's core strength is its small bundle size; adding heavy, non-Svelte-optimized libraries can negate this benefit. Prefer libraries optimized for Svelte or **headless libraries**.
