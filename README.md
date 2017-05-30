# Line-js

This is a Nodejs implementation of [LINE Message API](https://devdocs.line.me/en/#messaging-api)

## Installation

- Create a ```cert``` directory, and store your server certificates inside
- Modify ```app.js``` to relate to your cert and database
- Rename ```config.js.example``` to ```config.js```, and put your token inside

## Usage

#### sendText(id, message)

- id (string) : LINE UID (**NOT** id in LINE app)
- message (string) : message to send

#### queryProfile(id, callback)

- id (string) : LINE UID (**NOT** id in LINE app)
- callback(id, displayName) (function) : callback function
