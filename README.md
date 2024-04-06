# About Expensave

Expensave is an open-source application designed to help you track your personal and family expenses effortlessly, enabling better budgeting and financial management. Highly inspired by [Dollarbird](https://dollarbird.co/), Expensave offers intuitive features to monitor your spending habits and stay on top of your finances.

# Support 

This open-source project is developed in my free time. 
You can support this project by click on "Sponsor" button above.
Your sponsorship would help me dedicate more time and resources to improve project, add new features, fix bugs, 
as well as improve motivation and helps me understand, that this project is useful not only for me, but for more users.


# Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

# Features

- Multiple users
- Calendar sharing between users
- Exepnse import from financial institutions (still work in progress)
- Expense reports in various pivots (still work in progress)
- Responsive design
- Mobile [PWA](https://web.dev/explore/progressive-web-apps) application

# Installation

1. Run Docker image
```bash
  docker run \
    -p 18001:18001 \
    -p 18002:18002 \
    -v <desired path for DB data>:/var/lib/mysql
    algirdasc/expensave:latest
```
2. Open your browser: [http://localhost:18002](http://localhost:18002)

# Using mobile version

See [USING_MOBILE_VERSION.md](docs/USING_MOBILE_VERSION.md).

## Environment variables

You should set following environment variables:

- `TZ` - Your time zone. Full list can be found [here](https://www.php.net/manual/en/timezones.php).
- `CORS_ALLOW_ORIGIN` - Allowed [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) domains in regex notation. Default is `.*` - all domain names are allowed.
- `DATABASE_URL` - In case you want to use external MySQL/MariaDB, you can provide custom DSN for DB connection.

## Ports

- `18001` - is used for backend (API). API reference coming soon.
- `18002` - is used for frontend (UI)

# Contributing

Contributions from the community are more than welcomed! If you'd like to contribute to Expensave, please fork the repository and submit a pull request with your changes. Before submitting a pull request, make sure to:

- Follow the [contribution guidelines](docs/CONTRIBUTING.md).
- Write clear and concise commit messages.
- Test your changes thoroughly.
- Coding standard checks & tests must succeed.
- Code must follow coding standards: [Symfony](https://symfony.com/doc/current/contributing/code/standards.html) and [Angular](https://angular.io/guide/styleguide). 

# Support

If you encounter any issues or have any questions about Expensave, feel free to [open an issue](https://github.com/algirdasc/expensave/issues) on GitHub.

# Tech Stack

**Frontend:** Angular, Nebular, Bootstrap

**Backend:** PHP 8, Symfony

# Acknowledgements

Expensave was highly inspired by [Dollarbird](https://dollarbird.co/).

