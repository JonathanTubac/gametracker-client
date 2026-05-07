# GameTracker — Frontend

A personal game library tracker built with vanilla HTML, CSS, and JavaScript. Track your games by status, rate them, log hours played, and export your list to CSV.

## Live Demo

| Resource | URL |
|---|---|
| Frontend (Vercel) | https://gametracker-client.vercel.app |
| Backend API (Vercel) | https://gametracker-api.vercel.app/health |

## Backend Repository

> https://github.com/JonathanTubac/gametracker-api.git

---

## Features

- Add, edit, and delete games from your library
- Filter by status: Playing, Completed, Backlog, Dropped, Wishlist
- Sort by title, release year, hours played, or date added
- 0–10 rating system
- Game cover upload via Cloudinary
- CSV export
- Grid and list views
- Pagination (10 results per page)

## Tech Stack

- Vanilla HTML / CSS / JavaScript (ES Modules)
- nginx (static file server)
- Docker + Docker Compose
- Cloudinary (image hosting)

---

## Running with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running

### Option 1 — Docker Compose (recommended)

Copy the example compose file and start the container:

**Linux / macOS (bash)**
```bash
cp docker-compose.yml.example docker-compose.yml
docker compose up -d
```

**PowerShell**
```powershell
Copy-Item docker-compose.yml.example docker-compose.yml
docker compose up -d
```

**CMD**
```cmd
copy docker-compose.yml.example docker-compose.yml
docker compose up -d
```

The app will be available at **http://localhost:8080**.

To stop:
```bash
docker compose down
```

---

### Option 2 — Docker CLI (no Compose)

**Linux / macOS (bash)**
```bash
# Build the image
docker build -t gametracker-front .

# Run the container
docker run -d \
  --name gametracker-front \
  -p 8080:80 \
  --restart unless-stopped \
  gametracker-front
```

**PowerShell**
```powershell
# Build the image
docker build -t gametracker-front .

# Run the container
docker run -d `
  --name gametracker-front `
  -p 8080:80 `
  --restart unless-stopped `
  gametracker-front
```

**CMD**
```cmd
REM Build the image
docker build -t gametracker-front .

REM Run the container
docker run -d ^
  --name gametracker-front ^
  -p 8080:80 ^
  --restart unless-stopped ^
  gametracker-front
```

The app will be available at **http://localhost:8080**.

---

### Useful Docker commands

| Action | Command |
|---|---|
| View running containers | `docker ps` |
| View logs | `docker logs gametracker-front` |
| Stop the container | `docker stop gametracker-front` |
| Remove the container | `docker rm gametracker-front` |
| Rebuild after changes | `docker compose up -d --build` |

---

## API Configuration

The frontend auto-detects the environment via `js/config.js`:

| Environment | API URL |
|---|---|
| `localhost` | `http://localhost:3000/api/v1` |
| Any other host | `https://gametracker-api.vercel.app/api/v1` |

To point to a different backend, edit `js/config.js` before building the Docker image.

---

## Project Structure

```
gametracker-front/
├── css/
│   ├── components.css
│   ├── layout.css
│   └── main.css
├── js/
│   ├── api.js        # All fetch calls to the backend
│   ├── config.js     # API URL config
│   ├── main.js       # Entry point
│   ├── render.js     # DOM rendering helpers
│   └── detail.js     # Game detail page logic
├── pages/
│   └── detail.html
├── index.html
├── nginx.conf
├── Dockerfile
└── docker-compose.yml.example
```
