# Expensave

Expensave is an open-source application designed to help you track your personal and family expenses effortlessly, enabling better budgeting and financial management. Highly inspired by [Dollarbird](https://dollarbird.co/), Expensave offers intuitive features to monitor your spending habits and stay on top of your finances.

## Support

This open-source project is developed in my free time. 
You can support this project by clicking the "Sponsor" button above.
Your sponsorship will help me dedicate more time and resources to improve the project, add new features, fix bugs, and stay motivated. It also helps me understand that this project is useful not only for me, but for many users like you.

---

# Screenshots

## Desktop version

<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-calendar.png">
    <img alt="Calendar view" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-calendar.png" />
</a>
<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-expense-dialog.png">
    <img alt="Expense dialog" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-expense-dialog.png" style="width: 49%; float: left;" />
</a>
<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-sidebar.png">
    <img alt="Calendar list" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/desktop-sidebar.png" style="width: 49%; float: right;" />
</a>
<div style="clear: both;"></div>

## Mobile version

<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-calendar.png">
    <img alt="Mobile version calendar view" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-calendar.png" style="width: 32%; float: left;" />
</a>
<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-expense-dialog.png">
    <img alt="Mobile version expense dialog" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-expense-dialog.png" style="width: 32%; float: left;" />
</a>
<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-sidebar.png">
    <img alt="Mobile version calendar list" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/images/screenshots/mobile-sidebar.png" style="width: 32%; float: left;" />
</a>
<div style="clear: both;"></div>

## Features

- Multiple user support
- Shared expense calendars between family members
- Multiple & unlimited expense calendars
- Import your balance from financial institutions in various [formats](https://github.com/algirdasc/expensave/wiki/Bank-statement-import#supported-banks) 
- Reports on your spending and income habits
- Responsive design
- Mobile [PWA](https://web.dev/explore/progressive-web-apps) application

## Installation

### Install on Hostinger VPS seamlessly

[![Deploy on Hostinger](https://assets.hostinger.com/vps/deploy.svg)](https://www.hostinger.com/vps/docker-hosting?compose_url=https://raw.githubusercontent.com/algirdasc/expensave/refs/heads/main/docker-compose.yml&REFERRALCODE=1ALGIRDAS48#pricing)

## Install self-hosted instance

See wiki: [Installation](https://github.com/algirdasc/expensave/wiki/Installation).


## Installing Mobile Version

See wiki: [Using mobile version](https://github.com/algirdasc/expensave/wiki/Using-mobile-version).

## Bank Statement Import

See wiki: [Bank statement import](https://github.com/algirdasc/expensave/wiki/Bank-statement-import).

## Contributing

Contributions from the community are more than welcomed! If you'd like to contribute to Expensave, please fork the repository and submit a pull request with your changes. Before submitting a pull request, make sure to:

- Follow the [contribution guidelines](./docs/CONTRIBUTING.md).
- Follow coding standards: [Symfony](https://symfony.com/doc/current/contributing/code/standards.html) and [Angular](https://angular.io/guide/styleguide).
- Write clear and concise commit messages.
- Test your changes thoroughly.

## Support

If you encounter any issues or have any questions about Expensave, feel free to [open an issue](https://github.com/algirdasc/expensave/issues) on GitHub.

## Anonymous Data Collection

This application, by default, uses PostHog to collect anonymized data to help us understand app usage and improve the user experience. 
This includes tracking pageviews and automatically capturing uncaught exceptions. 
No personal or personalized data is collected or sent. 
We do this to identify bugs and enhance the features that are most used.

If you prefer not to share this data, you can easily opt out of tracking by
setting the `ANONYMOUS_DATA_COLLECTION` environment variable to `no`:

```bash
export ANONYMOUS_DATA_COLLECTION=no
```

## Tech Stack

**Frontend:** Angular, Nebular, Bootstrap

**Backend:** PHP 8, Symfony

## Acknowledgements

Expensave was highly inspired by [Dollarbird](https://dollarbird.co/).

