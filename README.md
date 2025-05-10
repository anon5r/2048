# 2048 Game

A modern implementation of the classic 2048 puzzle game built with React, TypeScript, and Vite. Join the numbers and get to the 2048 tile!

![2048 Game Screenshot](https://github.com/gabrielecirulli/2048/raw/master/meta/screenshot.png)

## Features

- Smooth animations and transitions
- Responsive design that works on desktop and mobile devices
- Keyboard controls for desktop (arrow keys)
- Touch/swipe controls for mobile devices
- Social media sharing when game is over

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v22 or higher recommended)
- [pnpm](https://pnpm.io/) (v8 or higher recommended)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/puzzle-2024.git
   cd puzzle-2024
   ```

2. Verify your pnpm setup (optional):
   ```bash
   ./verify-pnpm.sh
   ```
   or after cloning:
   ```bash
   pnpm verify
   ```
   This script checks if you have pnpm installed and if it meets the version requirements.

3. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```

## Running the Application

### Development Mode

To run the application in development mode with hot-reload:

```bash
pnpm dev
```

This will start the development server at `http://localhost:5173` (or another port if 5173 is already in use).

### Production Build

To create a production build:

```bash
pnpm build
```

The built files will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
pnpm preview
```

## How to Play

- **Desktop**: Use your arrow keys (↑, →, ↓, ←) to move the tiles.
- **Mobile**: Swipe up, right, down, or left to move the tiles.

When two tiles with the same number touch, they merge into one! Try to reach the 2048 tile.

## Technologies Used

- React 19
- TypeScript
- Vite
- CSS3 with animations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Original 2048 game by [Gabriele Cirulli](https://github.com/gabrielecirulli/2048)
- Inspired by [1024 by Veewo Studio](https://itunes.apple.com/us/app/1024!/id823499224)
