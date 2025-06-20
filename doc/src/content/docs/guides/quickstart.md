---
title: Green Dot Quick Start
description: Get started with Green Dot - A powerful TypeScript nodeJs framework for building DX friendly, secure and type-safe backend services.
---

Security and DX focused NodeJs backend framework. See [home page](/) for a quick presentation tour.

## Create a new project

1. Run this command and follow the prompt:
```bash
npx green_dot@latest generate
```
2. Run the same command again to generate API services, Database Models, Schedules...and so on.

## Project Structure

Your generated project will follow this structure:

```bash
📁 ./
├── 📁 myDb1/                    # Each DB as its own folder 
│   ├── 📁 models/              
│   │   ├── [modelName].dao.ts   # Security config for the model
│   │   └── [modelName].model.ts # Model definition file
│   └── ⚙️ gd.db.config.ts       # DB config file specific to this database
├── 📁 myDb2/                    
│
├── 📁 myApp1/                   # Each APP as its own folder 
│   ├── 📁 myModule1/            # A custom module; structure is flexible
│   │   ├── [serviceName].testFlow.ts # api tests for your module
│   │   └── [serviceName].svc.ts # API route definition for the module
│   ├── ⚙️ gd.apiTests.config.ts # Config file for automated API tests (BETA)
│   └── ⚙️ gd.app.config.ts      # App config file specific to this application
├── 📁 myApp2/                   
│
└── ⚙️ gd.config.ts              # Global config (all roles, permissions, etc.)
```


## IDE Integration

1. Install the `green dot VSCode Extension` from the IDE or the [marketplace](https://marketplace.visualstudio.com/items?itemName=topkat.green-dot-vscode-module)
2. Use `gd_` snippets in any TypeScript file for faster development
3. Hover over any green_dot property or function to see documentation

## Available Plugins

When you first generate your project, you can install these plugins:

- `GDmanagedLogin`: Managed JWT login with email/password updates
- `GDapiKeyAuthentication`: API Key authentication
- `GDdoubleAuthentication`: 2FA, Pin Code, or biometric authentication

See [Plugins Documentation](../plugins/1_plugins)

## Need Help?

- Visit our [GitHub Repository](https://github.com/topkat/green_dot)
- Open an issue for bug reports or feature requests
- Submit a Pull Request for code contributions