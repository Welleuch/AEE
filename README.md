# AEE - Autonomous Engineering Engine v1.0

AI-powered system for autonomous design of special machinery modules.

## Features

- **Requirements Analysis**: Input payload, speed, distance, object shape
- **Robot Selection**: Filters real robots (Doosan) by performance requirements
- **Gripper Selection**: Compatible grippers (SCHUNK, Robotiq, Piab, SMC)
- **3D Assembly**: Interactive Three.js viewer with adapter visualization
- **Output**: BOM with pricing + Generated PLC code (Structured Text)

## Tech Stack

- Vite + React + TypeScript
- Three.js / @react-three/fiber
- Cloudflare Pages (hosting)
- Cloudflare Workers AI (LLM - optional)

## Demo Flow

1. Enter requirements: "Move 2kg at 100/min, distance 300mm, box"
2. View engineering analysis
3. Select robot from filtered options
4. Select compatible gripper
5. View 3D assembly
6. Get BOM + Cost + PLC code

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Connected to Cloudflare Pages via GitHub integration.