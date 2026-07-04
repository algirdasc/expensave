# Expensave

**Expensave** is a free, open-source self-hosted expense tracker for personal and family budget management. Track spending, share calendars with family members, import bank statements, and monitor your finances — all on your own server.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub release](https://img.shields.io/github/v/release/algirdasc/expensave)](https://github.com/algirdasc/expensave/releases)
[![Docker Pulls](https://img.shields.io/docker/pulls/algirdasc/expensave)](https://hub.docker.com/r/algirdasc/expensave)

---

## Screenshots

### Desktop

<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-calendar.png">
    <img alt="Expensave desktop calendar view" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-calendar.png" style="width: 49%; float: left;" />
</a>
<div><small>Calendar view: select account, date range, and overview of expenses.</small></div>
<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-expense-dialog.png">
    <img alt="Expensave desktop expense dialog" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-expense-dialog.png" style="width: 49%; float: right;" />
</a>
<div><small>Expense editor: create, edit, and confirm a transaction.</small></div>
<div style="clear: both;"></div>

<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-report.png">
    <img alt="Expensave report view" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-report.png" style="width: 49%; float: left;" />
</a>
<div><small>Reports overview: spending analytics and trends by category and date.</small></div>
<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-reports-details.png">
    <img alt="Expensave report details" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-reports-details.png" style="width: 49%; float: right;" />
</a>
<div><small>Reports details: drill down into detailed spending breakdowns.</small></div>
<div style="clear: both;"></div>

### Mobile

<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-overview.png">
    <img alt="Expensave mobile main view" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-overview.png" style="width: 24%; float: left;" />
</a>
<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-expense-dialog.png">
    <img alt="Expensave mobile expense dialog" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-expense-dialog.png" style="width: 24%; float: left;" />
</a>
<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-reports-overview.png">
    <img alt="Expensave mobile report view" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-reports-overview.png" style="width: 24%; float: left;" />
</a>
<div><small>Mobile reports overview: analytics on a small screen.</small></div>
<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-reports-details.png">
    <img alt="Expensave mobile report details" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-reports-details.png" style="width: 24%; float: left;" />
</a>
<div><small>Mobile reports details: same charts, phone-friendly layout.</small></div>
<div style="clear: both;"></div>

---

## Features

- 👥 Multiple user support
- 📅 Shared expense calendars between family members
- ♾️ Multiple & unlimited expense calendars
- 🔁 Recurring expenses — daily, weekly, monthly, and yearly schedules
- 🏦 Import bank statements in various [formats](https://github.com/algirdasc/expensave/wiki/Bank-statement-import#supported-banks)
- 📊 Reports on spending and income habits
- 📱 Mobile [PWA](https://web.dev/explore/progressive-web-apps) — installable on iOS and Android
- 🎨 Responsive design — works on desktop, tablet, and mobile

---

## Quick Start

### Option 1 — Automated installer (recommended)

Requires Docker. Installs and starts Expensave interactively:

```bash
curl -fsSL https://expensave.app/install.sh | sudo bash
```

The installer will:
- Verify Docker is installed and running
- Ask whether to use default or custom settings
- Configure timezone and locale from your OS automatically
- Generate a secure database password
- Pull images and start the application
- Print the URL and credentials when done

---

### Option 2 — Docker Compose (manual)

**1. Create a directory and download the compose file:**

```bash
mkdir -p /opt/expensave && cd /opt/expensave
curl -fsSL https://raw.githubusercontent.com/algirdasc/expensave/main/docker-compose.yml -o docker-compose.yml
```

**2. Create a `.env` file:**

```bash
cat > .env <<EOF
TZ=Europe/Vilnius
LOCALE=en
REGISTRATION_DISABLED=no
DB_PASSWORD=change_me_please
EOF
```

**3. Start:**

```bash
docker compose up -d
```

App is available at **http://localhost:18000**

**Useful commands:**

```bash
docker compose logs -f          # view logs
docker compose pull && docker compose up -d   # update to latest
docker compose down             # stop
```

---

### Option 3 — Deploy on Hostinger VPS

One-click deploy on a Hostinger VPS with Docker pre-configured:

[![Deploy on Hostinger](https://assets.hostinger.com/vps/deploy.svg)](https://www.hostinger.com/vps/docker-hosting?compose_url=https://raw.githubusercontent.com/algirdasc/expensave/refs/heads/main/docker-compose.yml&REFERRALCODE=1ALGIRDAS48#pricing)

---

## Mobile PWA

Expensave works as a Progressive Web App — install it on your phone directly from the browser, no app store required.

See wiki: [Using mobile version](https://github.com/algirdasc/expensave/wiki/Using-mobile-version).

---

## Bank Statement Import

Import your balance from financial institutions in various formats.

See wiki: [Bank statement import](https://github.com/algirdasc/expensave/wiki/Bank-statement-import).

---

## Community & Discussions

Have a question, idea, or want to share how you use Expensave?

👉 **[Join the discussion on GitHub](https://github.com/algirdasc/expensave/discussions)**

- 💡 **Ideas & feature requests** — suggest what you'd like to see
- ❓ **Q&A** — ask questions and get help from the community
- 🗣️ **Show & tell** — share your setup or how you use Expensave

---

## Support

### 💬 Bug reports & questions

Found a bug or need help?

- [Open an issue](https://github.com/algirdasc/expensave/issues) for bug reports
- [Start a discussion](https://github.com/algirdasc/expensave/discussions) for questions and ideas

### ❤️ Financial support

Expensave is developed and maintained in my free time. If you find it useful, consider supporting the project:

- Click the **Sponsor** button at the top of this page
- Your support helps me dedicate more time to new features, bug fixes, and keeping the project alive
- It also lets me know that Expensave is useful to others — which means a lot

---

## License

Expensave is open-source software licensed under the [GNU General Public License v3.0](./LICENSE).
