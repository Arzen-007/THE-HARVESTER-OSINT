# THE-HARVESTER-OSINT GUI 🛡️

<div align="center">
  <img src="app/src/assets/logo.png" alt="THE HARVESTER Logo" width="150" style="margin-bottom: 20px;" />
</div>

A modern, professional Web GUI for **theHarvester**, one of the most powerful Open Source Intelligence (OSINT) gathering tools. This project transforms the traditional CLI experience into a high-performance, hacker-themed dashboard built with React, FastAPI, and tRPC.

## ✨ Features

- **Professional Logo & Branding**: Aggressive cyber-security themed logo with blood-red and neon-green aesthetics.
- **Multi-Page Navigation**: Organized interface with Dashboard, Sources, Analytics, Settings, and Documentation pages.
- **Cyber-Themed Dashboard**: High-tech "Matrix" inspired interface with real-time terminal feedback.
- **Simplified Scanning**: Select from 60+ OSINT sources with a single click.
- **Advanced Options**: Support for DNS brute forcing, Shodan queries, and domain takeover checks.
- **Persistence**: Full scan history and result storage using MySQL and Drizzle ORM.
- **Real-time Stats**: Live monitoring of OSINT sources and system status.
- **Export Capabilities**: Download your intelligence gathering results in JSON format.
- **Source Explorer**: Browse and search through all available OSINT sources with descriptions.
- **Responsive Design**: Works seamlessly on desktop and tablet devices.

---

## 🚀 Complete Linux Setup Guide

This guide provides step-by-step instructions to set up theHarvester GUI on a fresh Linux installation (Ubuntu/Debian recommended).

### 1. System Updates & Dependencies

First, update your system and install the necessary build tools.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git python3-pip python3-venv nodejs npm mysql-server curl
```

### 2. Install Python 'uv' Manager

We use `uv` for lightning-fast Python dependency management.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.cargo/env
```

### 3. Clone and Prepare the Project

```bash
git clone https://github.com/Arzen-007/THE-HARVESTER-OSINT.git
cd THE-HARVESTER-OSINT
```

#### Setup the OSINT Engine (theHarvester)

```bash
cd theHarvester
uv sync
cd ..
```

#### Setup the Web Interface

```bash
cd app
npm install
```

### 4. Database Configuration

1.  **Start MySQL Service**:
    ```bash
    sudo systemctl start mysql
    ```

2.  **Create Database**:
    ```bash
    sudo mysql -u root -p -e "CREATE DATABASE harvester_db;"
    ```

3.  **Configure Environment**:
    Create a `.env` file in the `app/` directory:
    ```bash
    nano .env
    ```
    Add your database credentials:
    ```env
    DATABASE_URL="mysql://root:your_password@localhost:3306/harvester_db"
    APP_ID="your_app_id"
    APP_SECRET="your_app_secret"
    ```

4.  **Initialize Database Schema**:
    ```bash
    npm run db:push
    ```

### 5. Launching the Application

You need two terminal windows open.

#### Terminal 1: Backend API
```bash
cd THE-HARVESTER-OSINT/app
npm run dev:backend
```

#### Terminal 2: Frontend GUI
```bash
cd THE-HARVESTER-OSINT/app
npm run dev
```

Visit **http://localhost:5173** in your browser to start your OSINT investigation!

---

## 💡 Troubleshooting

-   **Port 5000 busy**: theHarvester API uses port 5000. Ensure no other service (like Flask or AirPlay) is using it.
-   **Python Version**: Ensure `python3 --version` is 3.12 or higher.
-   **API Keys**: To get more results, add your API keys in `theHarvester/api-keys.yaml`.

---

## 🛠️ Project Structure

| Directory | Description |
|-----------|----------|
| `app/` | The React + tRPC + Hono web application. |
| `theHarvester/` | The core OSINT engine (forked from laramies/theHarvester). |
| `app/api/` | Backend API routes and theHarvester integration logic. |
| `app/src/components/hacker/` | Custom UI components for the cyber-theme. |
| `app/src/pages/` | Multi-page components (Home, Dashboard, Sources, etc.). |
| `app/src/assets/` | Logo and other static assets. |

---

## 📊 Supported OSINT Sources

The GUI supports all major modules of theHarvester, categorized for ease of use:

| Category | Sources |
|---|---|
| **Search Engines** | Google, Bing, Baidu, Brave, DuckDuckGo, Mojeek, Yahoo |
| **Certificates** | Certspotter, Crtsh, Chaos |
| **Threat Intel** | ThreatCrowd, OTX, VirusTotal |
| **DNS** | DNSDumpster, HackerTarget, Rapiddns, Robtex |
| **Code Repos** | GitHub-Code, GitLab |
| **Web Archives** | WaybackArchive, CommonCrawl |
| **Security** | SecurityTrails, Shodan, Censys, FOFA, ZoomEye |
| **Intelligence** | IntelX, Hunter, RocketReach, BuiltWith |
| **Network** | Netlas, Onyphe, CriminalIP |
| **Discovery** | SubdomainCenter, SubdomainFinderC99, ProjectDiscovery |
| **Other** | BeVigil, FullHunt, HudsonRock, LeakIX, Tomba, URLScan, WhoisXML |

---

## ⚖️ License & Disclaimer

This tool is for **authorized security testing and educational purposes only**. The developers are not responsible for any misuse of this tool.

-   **theHarvester Engine**: GPL-2.0 License
-   **GUI Wrapper**: MIT License

Maintained by **Syed Muhammad Qammar Abbas Zaidi**
Built with ❤️ for the OSINT community.
