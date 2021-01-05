# Digi-pet Deluxe

## Getting started

Clone this repo and open a terminal session at the folder where this was cloned too.

### installation

This repo has only one dependency and that is [http-server](https://github.com/http-party/http-server) to host the app.

with npm:

```
$your-folder> npm install
```

with yarn:

```
$your-folder> yarn install
```

### running

Once installed run the start command in your respective cli

with npm:

```
$your-folder> npm start
```

with yarn:

```
$your-folder> yarn start
```

Once started open your [localhost](http://127.0.0.1:8080/) on port 8080

## Architecture

Vanilla project, no bundling, just ES6, plain CSS and HTML

### CSS

This project uses the [Marx](https://github.com/mblode/marx) reset and a custom webfont called Zealot that was converted at [transfonter.org](https://transfonter.org/)

Sprite animations and element styles are custom for this app.

### ES6

### lib.js

This file contains global:

- Utility functions
- Simple Redux inspired state-management
- Simple UI management

### index.js

- Define pet mechanics delays
- Initialize UI elements
- Define state action reducers and side effects
- Initialize state store
- Bind UI element event handlers
- Wait for DOM Ready and Run

## Pet mechanics

- Pet starts idle
- After `petDelays.hurt` milliseconds if timestamp has not been updated enter hurt action state
- Every other action offsets the hurt action state by `petDelays.hurt` time
- `petDelays.feed` sets how long the feeding animation plays before going back to idle
- `petDelays.action` sets how long X action animation plays before going back to idle
