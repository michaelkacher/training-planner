# Clean & Usable Website Design Instructions

This guide outlines the principles and instructions for creating a modern, clean, and highly usable website with a focus on simplicity and user experience (UX).

## I. Core Design Principles

1.  **Prioritize Clarity over Complexity:** Every element must serve a purpose. Eliminate visual clutter, excessive animations, and unnecessary decorative elements to reduce the user's cognitive load.

2.  **Visual Hierarchy is King:** Guide the user's eye using size, color, contrast, and spacing. The most important content (e.g., headlines, primary CTAs) must be instantly recognizable.

3.  **Mobile-First Responsive Design:** Design all layouts starting with the smallest screen size, then scale up. Use fluid widths and Tailwind CSS's responsive prefixes (`sm:`, `md:`, `lg:`) extensively to ensure a seamless experience on all devices.

## II. Layout and Structure

- **The Power of Whitespace (Negative Space):** Use ample padding and margin (whitespace) around text blocks, images, and components. This "breathing room" drastically improves readability and emphasizes key elements.

  - _Instruction:_ Aim for generous vertical spacing between major sections (e.g., `py-16` or `py-24` in Tailwind).

- **Grid-Based Layouts:** Use CSS Grid or Flexbox (via Tailwind classes) to establish consistent spacing and alignment across the entire site. Use a main container width that provides good readability on large screens (e.g., `max-w-7xl` centered).

- **Intuitive Navigation:**

  - Keep the primary navigation simple, using clear, concise labels.

  - On mobile, use a standard "hamburger" icon menu that reveals a full-screen, easy-to-tap navigation overlay.

  - Ensure calls to action (CTAs) are distinct from regular navigation links.

## III. Typography (Readability Focus)

- **Font Selection (High Legibility):** Use a clean, modern, sans-serif font like **Inter, Roboto, or Noto Sans**. Use a maximum of **two** typefaces: one for headlines and one for body text (often just one typeface is sufficient).

- **Scale and Hierarchy:**

  - Establish a clear typographic scale (e.g., `text-xs` to `text-6xl`).

  - Use bold weight and larger size for **H1/H2** elements.

  - Body text should be set between `16px` and `18px` (`text-base` or `text-lg`) for optimal desktop and mobile reading.

- **Line Height (Leading):** Set a comfortable line height for body text. A good ratio is 1.5 to 1.6 times the font size (e.g., Tailwind's `leading-relaxed`).

## IV. Color, Contrast, and Aesthetics

- **Limited Color Palette:** Use a maximum of **three primary brand colors** plus black/white/shades of grey for backgrounds and text.

  1.  **Primary Color:** For main CTAs, highlights, and primary brand identity.

  2.  **Secondary Color:** For accents and secondary interactive elements.

  3.  **Accent/Feedback Color:** (e.g., Red for errors, Green for success).

- **High Contrast:** Ensure all text passes **WCAG 2.1 AA** contrast requirements. Use dark text on light backgrounds (or vice-versa for dark mode).

  - _Instruction:_ Avoid low-contrast elements like light grey text on a white background unless it is non-essential, decorative text.

- **Aesthetic Details:**

  - Use **rounded corners** on all interactive elements, cards, and containers (e.g., `rounded-lg`).

  - Use subtle **shadows** (`shadow-md` or `shadow-xl`) to lift interactive elements like buttons and cards off the page, indicating depth and clickability.

## V. Accessibility (A11y)

- **Semantic HTML:** Always use correct HTML elements (e.g., `<h1>`, `<button>`, `<ul>`) instead of generic `<div>` tags to convey meaning to screen readers.

- **Keyboard Navigation:** Ensure the user can navigate the entire site using only the **`Tab` key**. Focus states (`:focus` styling) must be clearly visible on all interactive elements.

- **Alternative Text:** Include descriptive **`alt` text** for all non-decorative images.

- **Form Labels:** Every form input must have a corresponding **`<label>`** element.

- **Interactive Targets:** Ensure interactive elements (buttons, links) are large enough to be easily tapped on touch screens (**minimum 44x44px** target size).
