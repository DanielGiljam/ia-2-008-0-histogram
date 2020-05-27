# IA-2-008 (0) Histogram

A web app that displays a histogram for a photo.

Made in the course "Visualisering av information (2019-20) (IA-2-008 (0))" at [Arcada University of Applied Sciences](https://www.arcada.fi/en).

## Get started

1. Clone this repository

```bash
git clone https://github.com/DanielGiljam/ia-2-008-0-histogram.git
```

2. Run `npm install` (in the root of the repository)

```bash
cd ia-2-008-0-histogram
npm install
```

3. Start the development server by running `npm run dev`

```bash
npm run dev
```

4. Go to [http://localhost:3000](http://localhost:3000/) in your web browser

## Features

- Responsive UI
- Elegant UX
- Drag-n-drop functionality
- Image preview that scales properly
- 4-channel histogram (red, green, blue, luminosity)
- Channels can be toggled on and off in the histogram

## Technical Details

- Accessibility
  - Semantic HTML
  - ARIA attributes for supporting screen readers on custom elements
  - Keyboard navigation support
- Static
  - Can be deployed as a static website (see [`next export`](https://nextjs.org/docs/advanced-features/static-html-export))
- Statically analyzable
  - Source code is written in [TypeScript](https://www.typescriptlang.org/)
  - Uses [xstate](https://xstate.js.org/) for state management
    - Defining the app's architecture as a statechart comes with lots of benefits
      - Improves robustness of code
      - Lessens proneness to bugs
      - Reduces code complexity
      - Eliminates a lot of the headache associated with managing complex state
      - Makes it easier to add new features to the application
    - Although it is arguable how significant the benefits are in a simple app like this one
- Strict code quality standards
  - Consistent style and best practices are enforced by [ESLint](https://eslint.org/) in combination with [Prettier](https://prettier.io/)
  - The [ESLint](https://eslint.org/) configuration extends [JavaScript Standard Style](https://standardjs.com/)
- Powered by [Next.js](https://nextjs.org/)
  - Delightful developer experience
    - Clean source code repository structure
    - Hot code reloading development server
  - Production-grade [webpack](https://webpack.js.org/) pipeline
    - Tree-shaking
    - Code-splitting
- Powered by [React](https://reactjs.org/)
- Powered by [Material-UI](https://material-ui.com/)
