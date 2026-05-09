# Complete Linux Setup Guide for theHarvester OSINT GUI

This guide provides step-by-step instructions to set up theHarvester GUI on a fresh Linux installation (Ubuntu/Debian recommended).

## 1. System Updates & Dependencies

First, update your system and install the necessary build tools.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git python3-pip python3-venv nodejs npm mysql-server curl
```

## 2. Install Python 'uv' Manager

We use `uv` for lightning-fast Python dependency management.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.cargo/env
```

## 3. Clone and Prepare the Project

```bash
git clone https://github.com/Arzen-007/THE-HARVESTER-OSINT.git
cd THE-HARVESTER-OSINT
```

### Setup the OSINT Engine (theHarvester)

```bash
cd theHarvester
uv sync
cd ..
```

### Setup the Web Interface

```bash
cd app
npm install
```

## 4. Database Configuration

1. **Start MySQL Service**:
   ```bash
   sudo systemctl start mysql
   ```

2. **Create Database**:
   ```bash
   sudo mysql -u root -p -e "CREATE DATABASE harvester_db;"
   ```

3. **Configure Environment**:
   Create a `.env` file in the `app/` directory:
   ```bash
   nano .env
   ```
   Add your database credentials:
   ```env
   DATABASE_URL="mysql://root:your_password@localhost:3306/harvester_db"
   ```

4. **Initialize Database Schema**:
   ```bash
   npm run db:push
   ```

## 5. Launching the Application

You need two terminal windows open.

### Terminal 1: Backend API
```bash
cd THE-HARVESTER-OSINT/app
npm run dev:backend
```

### Terminal 2: Frontend GUI
```bash
cd THE-HARVESTER-OSINT/app
npm run dev
```

Visit **http://localhost:5173** in your browser to start your OSINT investigation!

## 💡 Troubleshooting

- **Port 5000 busy**: theHarvester API uses port 5000. Ensure no other service (like Flask or AirPlay) is using it.
- **Python Version**: Ensure `python3 --version` is 3.12 or higher.
- **API Keys**: To get more results, add your API keys in `theHarvester/api-keys.yaml`.
