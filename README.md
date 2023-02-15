# FOODY CRUD MERN

- A simple app to demonstrate the use of mongoDB (mongoose), REACTJS, Express JS and node js.
  This app is supposed to manage snacks (basic CRUD).
- Practice makes perfect.

## Server side

- The backend is build using ExpressJS, it handles requests from the frontend (client project) to get,add,update and delete snack.
- The database is mongoDB and it is stored on [MongoDB Atlas](https://www.mongodb.com/atlas/database), The project uses Mongoose as the object Data Modeling (ODM), it manages relationship between data, provides schema validation and translates objects in Node.js (checkout the model in FOODY-CRUD-MERN>server>models>Snack.js to see the schema for snack.).
- server -> index.js: has the logic of our backend (handling API requests, connecting to the mongoDB).

## Client side

- The client project, representing the frontend part of the application, is build with ReactJS. It uses typescript and react-boostrap to create the UI. It is a single page application.

## How to run:

- Run in server forlder:

  - Development mode using nodemeon: 'npm run devStart'.
  - Production mode: 'npm start'.

- Run command in client folder:
  -run : 'npm start'.

## Test:

It is still missing and can be added later on.

## Authors and acknowledgment

- Github profile: [reemSB](https://github.com/reemsb)

## License

open source projects.

## Project status

The main functionality are there to perform a simple CRUD. It needs still some improvement (on UX level, code cleaness, add Unit tests) and can be refactored, forked and expanded.
