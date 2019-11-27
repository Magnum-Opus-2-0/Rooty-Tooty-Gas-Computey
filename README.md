# Rooty-Tooty-Gas-Computey

[![Build Status](https://travis-ci.com/Magnum-Opus-2-0/Rooty-Tooty-Gas-Computey.svg?branch=master)](https://travis-ci.com/Magnum-Opus-2-0/Rooty-Tooty-Gas-Computey)

A better Gas Buddy

[Visit the site!](https://rooty-tooty-gas-computey.herokuapp.com/)

## Getting Started
### Installation
1. Clone the repo to your desired location using `git clone https://github.com/Magnum-Opus-2-0/Rooty-Tooty-Gas-Computey.git`
2. Run the `npm install` command in the root directory of the project to install all required
packages

### How to Use
1. Type `npm run build` to compile the project.
2. `npm start` to start the webserver.
3. On a browser, go to `http://localhost:8080`

#### Start Options
- The default start mode is to build and start a Node server (`"start": "node src/server.js"`).
This start mode will start the local host server at port `8080`.
- It is also possible to start the local server without Node (`"start": "react-scripts start"`).
This start mode will start the local host server at port `3000`.

## How to make changes

If you include a new library or module, such as:

```
import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
```

Then, you must install and save that module to the project by typing: `npm install --save module_name`. Example: `npm install --save clsx`

## Testing
Tests for algorithms and calculations are included on this repository. We use Jest to run our tests,
and Travis CI for continuous integration. You can either checkout the latest test logs here, or
run the tests on your own.

Currently, we have test suites that check our `StationCalculation`, `UserData`, and `FuelEconomy`
modules. Most `FuelEconomy` tests use a mocked `XMLhttprequest` object to check that fetch functions
work as expected, but a few perform an actual request to ensure that we get the data we expect from
the database. This noticeably slows down the `FuelEconomy` test suite, but it was necessary to help
us catch errors.

### Running Tests
To run the tests, make sure all packages have been installed by entering the `npm install` command.
After installing, run `npm test` from any directory in the project. This will start Jest and run
the tests suites. Note: If a test suite is taking a long time to run, it will finish; slow tests
are the result of an actual `XMLhttprequest` to a database.

## Cookies
Rooty Tooty Gas Computey makes use of cookies to store a users' car data. By storing the data, a
user does not have to reenter their car options every time they visit the site.

As a developer, you have these cookies available to you after a user has entered all of their
car information:
- `carID`: The ID of the user's car as specified by the car database. We are currently using
    [FuelEconomy.gov](https://www.fueleconomy.gov/feg/ws/).
- `combMPG`: The combined city and highway MPG of the user's car.
- `cityMPG`: The city MPG of the user's car.
- `highwayMPG`: The highway MPG of the user's car.
- `year`: The year of the user's car.
- `make`: The make of the user's car.
- `model`: The model of the user's car.
- `fuelType`: The recommended fuel type for the user's car.
- `option`: The option/trim of the user's car.
- `tankSize`: The size of the user's gas tank in gallons.
- `tankFill`: The current fill of the user's gas tank as a percentage. Defaults to 50%.

All cookies except the last two are available after the user enters their car option. `tankSize`
needs user input before it is saved, and `tankFill` is available immediately. 

