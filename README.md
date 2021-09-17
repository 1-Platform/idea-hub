# Idea Hub SPA for One Platform

Idea Hub is a place to share ideas and innovations, with feedbacks from other users. This repository is part of [One Platform](https://github.com/1-Platform/one-platform).

## Prerequisites

1. Nodejs v14.17.1
2. NPM v6.14.10

## Install dependencies

1. Clone the repository and switch into directory
   `git clone https://github.com/1-Platform/idea-hub.git && cd idea-hub`
2. Install Dependencies
   `npm install`
3. Copy `.env.example` to `.env.local` and fill necessary fields

## Start SPA

run `npm start`

## Start Production Build

run `npm run build`

## Start Test

run `npm test`

## Run lint

run `npm run lint:fix`

## Load remote couchdb with design documents and default tag

run `npm run migrate:all`: To save both design documents and default tags to couchdb

run `npm run migrate:design-doc`: To save design documents to couchdb

run `npm run migrate:default-tags`: To save default tags to couchdb

## 🤝 Contributors

👤 **Akhil Mohan** [akhilmhdh](https://github.com/akhilmhdh)
