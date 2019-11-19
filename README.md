# Rooty-Tooty-Gas-Computey

[![Build Status](https://travis-ci.com/Magnum-Opus-2-0/Rooty-Tooty-Gas-Computey.svg?branch=master)](https://travis-ci.com/Magnum-Opus-2-0/Rooty-Tooty-Gas-Computey)

A better Gas Buddy

Website URL: https://rooty-tooty-gas-computey.herokuapp.com/

## How to use
1. Open a terminal on the directory of the repository.
2. Type `npm install` to install all libraries that the project uses.
3. Type `npm run build` to compile the project.
4. `npm start` to start the webserver.
5. On a browser, go to `http://localhost:8080`

Whenever you make changes, you must type `npm run build`, then `npm start`, and refresh the webpage.

## How to make changes

If you include a new library or module, such as:

```
import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
```

Then, you must install and save that module to the project by typing: `npm install --save module_name`. Example: `npm install --save clsx`


"start": "node src/server.js"
"start": "react-scripts start"
