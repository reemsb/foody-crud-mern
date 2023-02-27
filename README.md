# FOODY CRUD MERN

> A simple app to demonstrate the use of mongoDB (mongoose), REACTJS, Express JS and node js and linking a server side written in express with React built frontend.

- **[React](https://facebook.github.io/react/)** (18.x)
- **[Express](https://expressjs.com/)** (4.x)
- **[Mongoose](https://mongoosejs.com/)** (6.x)
- **[Typescript](https://www.typescriptlang.org/)** (4.x)
- **[SASS](http://sass-lang.com/)** (1.x)
- **[ESlint](https://eslint.org/docs/latest/)**

---

## Server side

- The backend is build using ExpressJS, it handles requests from the frontend (client project) to get,add,update and delete snack.
- The database is mongoDB and it is stored on [MongoDB Atlas](https://www.mongodb.com/atlas/database), The project uses Mongoose as the object Data Modeling (ODM), it manages relationship between data, provides schema validation and translates objects in Node.js (checkout the model in FOODY-CRUD-MERN>server>models>Snack.js to see the schema for snack.).
- server -> index.js: has the logic of our backend (handling API requests, connecting to the mongoDB).

## Client side

- The client project, representing the frontend part of the application, is build with ReactJS. It uses typescript and react-boostrap to create the UI. It is a single page application.

---

## Getting started

1. Settup ur database in mongoDB atlas account.

2. Add whitelist IP address (example ur own, automatically detected through the UI interface) as trusted host.

3. Use the links provided to connect your local mongo compass to the cloud DB and use another link to connect ur app in server>index.js.

4. run `npm install` to have the needed modules respectively in client and server folders.

5. Run backend through command line in server folder:

- Development mode using nodemeon: `npm run devStart`.
- Production mode: `npm start`.

3. Run frontend through command line in client folder:
   -run : `npm start`.
4. Go to `http://localhost:3000`

**Note**:

- Clone the repository or download it for local settup.
- replace `npm` with `yarn` if yarn is the used package manager.

---

## Authors and acknowledgment

- Github profile: [reemSB](https://github.com/reemsb)

## License

- MIT

## Contributing

The main functionality are there to perform a simple CRUD. It needs still some improvement (on UX level, code cleaness, add Unit tests) and can be refactored, forked and expanded.
