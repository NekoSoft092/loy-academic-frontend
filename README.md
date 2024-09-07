
# Sage App 🪄✨🍃

[![Prod Build](https://github.com/SageWizzards/Sage-App/actions/workflows/prod-build.yml/badge.svg?branch=main)](https://github.com/SageWizzards/Sage-App/actions/workflows/prod-build.yml)
[![Dev Build](https://github.com/SageWizzards/Sage-App/actions/workflows/dev-build.yml/badge.svg)](https://github.com/SageWizzards/Sage-App/actions/workflows/dev-build.yml)

Sage App is a multiplatform app client for [Sage](https://github.com/SageWizards/Sage) under development.

## 🚀 Tech stack

**Languages:** TypeScript & Rust.

**Libraries:** Tauri, React, react-router, Zustand, Framer Motion, BeerCSS.

**DX:** Eslint, Prettier, Vite.

## 🚧 Construction zone

Sage desktop app is under active development and is likely to change.

Coming soon:

- 🔓 User authentication.
- 💬 Talk with your sage bots.
- 🤖 Build new sage bots.
- 🧑🏻‍💻 Let your sage bot help you with your daily tasks.
- 🔨 Extend your sage functionalities through plugins.
  
## 🔨 Install prerequisites

### 💿 MacOs & Linux

#### 🦀 Rust & Cargo

Install rust and cargo:

```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### ♻️ PNPM

Enable corepack:

```bash
  corepack enable
```

Install pnpm latest version using corepack:

```bash
  corepack prepare pnpm@latest --activate
```

### 🖼️ Windows

#### 🦀 Rust & Cargo

Install rust and cargo:

- Download <https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe>
- Run and install rustup-init.exe.

#### ♻️ PNPM

Enable corepack:

```bash
  corepack enable
```

Install pnpm latest version using corepack:

```bash
  corepack prepare pnpm@latest --activate
```

## 🧑🏻‍💻 Run locally for development

Clone the project:

```bash
  git clone git@github.com:SageWizzards/Sage-App.git
```

Go to the project directory:

```bash
  cd Sage-Desktop
```

Install dependencies:

```bash
  pnpm install
```

Start the app:

```bash
  pnpm tauri dev
```

## 📚 FAQ

### What platforms is this desktop app available on?

- MacOs
- Windows
- Linux

## ✍🏻 Authors

- [@PejeDev](https://www.github.com/PejeDev)
- [@NekoSoft092](https://www.github.com/NekoSoft092)