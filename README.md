# About Expensave

Expensave is an open-source application designed to help you track your personal and family expenses effortlessly, 
enabling better budgeting and financial management. Highly inspired by [Dollarbird](https://dollarbird.co/), 
Expensave offers intuitive features to monitor your spending habits and stay on top of your finances.

# Support 

This open-source project is developed in my free time. 
You can support this project by clicking "Sponsor" button above.
Your sponsorship would help me dedicate more time and resources to improve project, add new features, fix bugs, 
as well as improve motivation and helps me understand, that this project is useful not only for me, but for more users.


# Screenshots

## Desktop version

<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/screenshots/desktop-calendar.png">
    <img alt="Calendar view" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/screenshots/desktop-calendar.png" />
</a>
<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/screenshots/desktop-expense-dialog.png">
    <img alt="Expense dialog" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/screenshots/desktop-expense-dialog.png" style="width: 49%; float: left;" />
</a>
<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/screenshots/desktop-sidebar.png">
    <img alt="Calendar list" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/screenshots/desktop-sidebar.png" style="width: 49%; float: right;" />
</a>
<div style="clear: both;"></div>

## Mobile version

<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/screenshots/mobile-calendar.png">
    <img alt="Mobile version calendar view" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/screenshots/mobile-calendar.png" style="width: 33%; float: left;" />
</a>
<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/screenshots/mobile-expense-dialog.png">
    <img alt="Mobile version expense dialog" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/screenshots/mobile-expense-dialog.png" style="width: 33%; float: left;" />
</a>
<a href="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/screenshots/mobile-sidebar.png">
    <img alt="Mobile version calendar list" src="https://raw.githubusercontent.com/algirdasc/expensave/main/docs/screenshots/mobile-sidebar.png" style="width: 33%; float: left;" />
</a>
<div style="clear: both;"></div>

# Features

- Multiple user support
- Shared expense calendars between family members
- Import your balance from financial institutions in various formats (still work in progress)
- Reports on your spending and income habits
- Responsive design
- Mobile [PWA](https://web.dev/explore/progressive-web-apps) application

# Installation

1. Run Docker image. Feel free to add or change environment variables according to your needs:
```bash
  docker run \
    -p 18000:18000 \
    -e LOCALE=en
    -v <desired path for DB data>:/var/lib/mysql
    algirdasc/expensave:latest
```
2. Open your browser: [http://localhost:18000](http://localhost:18000)

## Environment variables

- `TZ` - Your time zone. Full list can be found [here](https://www.php.net/manual/en/timezones.php).
- `DATABASE_URL` - In case you want to use external MySQL/MariaDB, you can provide custom DSN for DB connection.
- `LOCALE` - Locale used for date and number formatting. Full list can be found [here](https://unpkg.com/browse/@angular/common@17.3.3/locales/).
- `REGISTRATION_DISABLED=yes/no` - Disable new user registration

# Installing mobile version

See [USING_MOBILE_VERSION.md](docs/USING_MOBILE_VERSION.md).

# Contributing

Contributions from the community are more than welcomed! If you'd like to contribute to Expensave, please fork the repository and submit a pull request with your changes. Before submitting a pull request, make sure to:

- Follow the [contribution guidelines](docs/CONTRIBUTING.md).
- Follow coding standards: [Symfony](https://symfony.com/doc/current/contributing/code/standards.html) and [Angular](https://angular.io/guide/styleguide).
- Write clear and concise commit messages.
- Test your changes thoroughly.

# Support

If you encounter any issues or have any questions about Expensave, feel free to [open an issue](https://github.com/algirdasc/expensave/issues) on GitHub.

# Tech Stack

**Frontend:** Angular, Nebular, Bootstrap

**Backend:** PHP 8, Symfony

# Acknowledgements

Expensave was highly inspired by [Dollarbird](https://dollarbird.co/).

