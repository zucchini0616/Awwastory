# Awwastory

A simple Express + SQLite API with a static front-end for interactive storybooks.

## Features

- 🚀 **Express** server providing RESTful API endpoints
- 📦 **SQLite** as a lightweight embedded database
- 🎨 Static front-end served from `/public`
- 🔒 JWT-based authentication (register, login, protected test route)
- 📚 Story management: list stories, read content pages

## Repository

```bash
https://github.com/zucchini0616/Awwastory.git
```

## Prerequisites
Node.js (v14+ recommended)

npm (bundled with Node.js)

## Local Setup
1. Clone the repo
  ```bash
git clone https://github.com/zucchini0616/Awwastory.git
cd Awwastory

```
2. Initialize & install
 ```bash
npm init -y
npm install
```
3. Fix audit issues (optional)
```bash
npm audit fix
```
4. Start the server
```bash
npm start
```
5. Verify
```bash
curl http://localhost:3000/
```
