#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
#  Expensave Installer
#  https://github.com/algirdasc/expensave
# ─────────────────────────────────────────────

REPO="algirdasc/expensave"
COMPOSE_URL="https://raw.githubusercontent.com/${REPO}/main/docker-compose.yml"
DEFAULT_INSTALL_DIR="/opt/expensave"

# ── Colors ────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ── Helpers ───────────────────────────────────
info()    { printf "  ${BLUE}→${NC} %s\n" "$1"; }
success() { printf "  ${GREEN}✓${NC} %s\n" "$1"; }
warn()    { printf "  ${YELLOW}!${NC} %s\n" "$1"; }
error()   { printf "  ${RED}✗${NC} %s\n" "$1"; }
header()  { printf "\n${BOLD}%s${NC}\n" "$1"; }
divider() { printf "${DIM}────────────────────────────────────────${NC}\n"; }

ask() {
    # ask <var_name> <prompt> <default>
    local var="$1" prompt="$2" default="$3"
    printf "  ${BOLD}%s${NC} ${DIM}[%s]${NC}: " "$prompt" "$default"
    read -r input
    eval "$var=\"${input:-$default}\""
}

ask_secret() {
    # ask_secret <var_name> <prompt>
    local var="$1" prompt="$2"
    printf "  ${BOLD}%s${NC}: " "$prompt"
    read -rs input
    printf "\n"
    eval "$var=\"$input\""
}

confirm() {
    # confirm <prompt> <default y|n> → returns 0=yes 1=no
    local prompt="$1" default="${2:-y}"
    local hint
    [ "$default" = "y" ] && hint="Y/n" || hint="y/N"
    printf "  ${BOLD}%s${NC} ${DIM}[%s]${NC}: " "$prompt" "$hint"
    read -r answer
    answer="${answer:-$default}"
    [[ "$answer" =~ ^[Yy] ]]
}

gen_password() {
    # 20 char alphanumeric
    tr -dc 'A-Za-z0-9' </dev/urandom | head -c 20
}

detect_timezone() {
    local tz=""
    if [ -f /etc/timezone ]; then
        tz=$(cat /etc/timezone)
    elif [ -L /etc/localtime ]; then
        tz=$(readlink /etc/localtime | sed 's|.*/zoneinfo/||')
    elif command -v timedatectl &>/dev/null; then
        tz=$(timedatectl show --property=Timezone --value 2>/dev/null || true)
    fi
    echo "${tz:-UTC}"
}

detect_locale() {
    local locale=""
    if [ -n "${LANG:-}" ]; then
        locale=$(echo "$LANG" | cut -d_ -f1)
    elif [ -n "${LC_ALL:-}" ]; then
        locale=$(echo "$LC_ALL" | cut -d_ -f1)
    fi
    echo "${locale:-en}"
}

# ── Checks ────────────────────────────────────
check_root() {
    if [ "$EUID" -ne 0 ]; then
        error "This script must be run as root (or with sudo)."
        printf "\n  Try: ${BOLD}sudo bash install.sh${NC}\n\n"
        exit 1
    fi
}

check_docker() {
    header "Checking requirements"
    divider

    if ! command -v docker &>/dev/null; then
        error "Docker is not installed."
        printf "\n  Docker is required to run Expensave.\n"
        printf "  Install it from: ${BOLD}https://docs.docker.com/engine/install/${NC}\n\n"
        printf "  Quick install (Linux):\n"
        printf "    ${DIM}curl -fsSL https://get.docker.com | bash${NC}\n\n"
        exit 1
    fi
    success "Docker $(docker --version | awk '{print $3}' | tr -d ',')"

    if ! docker compose version &>/dev/null 2>&1; then
        error "Docker Compose plugin is not installed."
        printf "\n  Install it from: ${BOLD}https://docs.docker.com/compose/install/${NC}\n\n"
        exit 1
    fi
    success "Docker Compose $(docker compose version --short 2>/dev/null || echo '')"

    if ! docker info &>/dev/null 2>&1; then
        error "Docker daemon is not running."
        printf "\n  Start it with: ${BOLD}sudo systemctl start docker${NC}\n\n"
        exit 1
    fi
    success "Docker daemon running"
}

# ── Configuration ─────────────────────────────
collect_config() {
    header "Installation mode"
    divider

    if confirm "Use default settings?" "y"; then
        INSTALL_DIR="$DEFAULT_INSTALL_DIR"
        TZ=$(detect_timezone)
        LOCALE=$(detect_locale)
        REGISTRATION_DISABLED="no"
        ADMIN_EMAIL=""
        ADMIN_PASSWORD=""
        USE_DEFAULTS=true
        printf "\n"
        info "Install dir : ${INSTALL_DIR}"
        info "Timezone    : ${TZ}"
        info "Locale      : ${LOCALE}"
        info "Registration: enabled"
    else
        USE_DEFAULTS=false
        printf "\n"
        header "Custom configuration"
        divider

        ask INSTALL_DIR "Install directory" "$DEFAULT_INSTALL_DIR"

        local detected_tz
        detected_tz=$(detect_timezone)
        ask TZ "Timezone" "$detected_tz"

        local detected_locale
        detected_locale=$(detect_locale)
        ask LOCALE "Locale" "$detected_locale"

        printf "\n"
        if confirm "Disable user registration? (single-user / private instance)" "n"; then
            REGISTRATION_DISABLED="yes"
            printf "\n"
            info "Registration disabled — an admin account will be created."
            ask ADMIN_EMAIL "Admin email" "admin@example.com"
            ADMIN_PASSWORD=$(gen_password)
        else
            REGISTRATION_DISABLED="no"
            ADMIN_EMAIL=""
            ADMIN_PASSWORD=""
        fi
    fi
}

# ── Install ───────────────────────────────────
do_install() {
    header "Installing Expensave"
    divider

    # Create install dir
    info "Creating directory: ${INSTALL_DIR}"
    mkdir -p "$INSTALL_DIR"
    cd "$INSTALL_DIR"

    # Generate secrets
    local db_password
    db_password=$(gen_password)

    # Download docker-compose.yml
    info "Downloading docker-compose.yml"
    curl -fsSL "$COMPOSE_URL" -o docker-compose.yml
    success "docker-compose.yml downloaded"

    # Write .env
    info "Writing .env"
    cat > .env <<EOF
# Expensave configuration
# Generated by install.sh on $(date -u +"%Y-%m-%dT%H:%M:%SZ")

TZ=${TZ}
LOCALE=${LOCALE}
REGISTRATION_DISABLED=${REGISTRATION_DISABLED}

# Database (auto-generated — do not share)
DB_PASSWORD=${db_password}
EOF
    success ".env written"

    # Patch docker-compose.yml with env vars
    info "Configuring docker-compose.yml"
    # Replace hardcoded env values with references to .env
    sed -i.bak \
        -e "s|TZ: Europe/Vilnius|TZ: \${TZ}|g" \
        -e "s|LOCALE: en|LOCALE: \${LOCALE}|g" \
        -e "s|REGISTRATION_DISABLED: no|REGISTRATION_DISABLED: \${REGISTRATION_DISABLED}|g" \
        -e "s|MARIADB_PASSWORD: expensave|MARIADB_PASSWORD: \${DB_PASSWORD}|g" \
        docker-compose.yml
    rm -f docker-compose.yml.bak
    success "docker-compose.yml configured"

    # Pull images
    info "Pulling Docker images (this may take a few minutes)..."
    docker compose pull
    success "Images pulled"

    # Start services
    info "Starting services..."
    docker compose up -d
    success "Services started"

    # Wait for app to be healthy
    info "Waiting for application to be ready..."
    local attempts=0
    until curl -sf "http://localhost:18000/api/ping" &>/dev/null || [ $attempts -ge 30 ]; do
        sleep 2
        attempts=$((attempts + 1))
        printf "."
    done
    printf "\n"

    # Create admin user if registration disabled
    if [ "$REGISTRATION_DISABLED" = "yes" ] && [ -n "$ADMIN_EMAIL" ]; then
        info "Creating admin user: ${ADMIN_EMAIL}"
        docker compose exec -T application php bin/console app:user:create \
            --email="$ADMIN_EMAIL" \
            --password="$ADMIN_PASSWORD" \
            --admin 2>/dev/null || \
        warn "Could not create admin user automatically. Create it manually after startup."
    fi
}

# ── Summary ───────────────────────────────────
print_summary() {
    local ip
    ip=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "localhost")

    printf "\n"
    divider
    printf "${GREEN}${BOLD}  Expensave installed successfully!${NC}\n"
    divider
    printf "\n"
    printf "  ${BOLD}App URL:${NC}       http://${ip}:18000\n"
    printf "  ${BOLD}Install dir:${NC}   ${INSTALL_DIR}\n"
    printf "\n"

    if [ "$REGISTRATION_DISABLED" = "yes" ] && [ -n "$ADMIN_EMAIL" ]; then
        printf "  ${BOLD}Admin email:${NC}   ${ADMIN_EMAIL}\n"
        printf "  ${BOLD}Admin password:${NC} ${YELLOW}${ADMIN_PASSWORD}${NC}\n"
        printf "\n"
        warn "Save your password — it will not be shown again!"
        printf "\n"
    fi

    printf "  ${BOLD}Manage:${NC}\n"
    printf "    Start:   ${DIM}cd ${INSTALL_DIR} && docker compose up -d${NC}\n"
    printf "    Stop:    ${DIM}cd ${INSTALL_DIR} && docker compose down${NC}\n"
    printf "    Logs:    ${DIM}cd ${INSTALL_DIR} && docker compose logs -f${NC}\n"
    printf "    Update:  ${DIM}cd ${INSTALL_DIR} && docker compose pull && docker compose up -d${NC}\n"
    printf "\n"
    printf "  ${BOLD}Docs:${NC}          https://github.com/${REPO}/wiki\n"
    printf "\n"
    divider
    printf "\n"
}

# ── Main ──────────────────────────────────────
main() {
    clear
    printf "\n"
    printf "${BOLD}  ╔═══════════════════════════════════╗${NC}\n"
    printf "${BOLD}  ║        Expensave Installer        ║${NC}\n"
    printf "${BOLD}  ║   Self-hosted expense tracking    ║${NC}\n"
    printf "${BOLD}  ╚═══════════════════════════════════╝${NC}\n"
    printf "\n"

    check_root
    check_docker
    collect_config
    do_install
    print_summary
}

main "$@"
