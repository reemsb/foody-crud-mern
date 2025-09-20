# FOODY CRUD MERN

> A simple app to demonstrate the use of mongoDB (mongoose), REACTJS, Express JS and node js and linking a server side written in express with React built frontend.

<img width="1800" height="530" alt="Screenshot 2025-09-20 at 10 05 50" src="https://github.com/user-attachments/assets/bea2b5d3-d183-4138-82d9-8df4b81857e0" />
<img width="1800" height="530" alt="Screenshot 2025-09-20 at 10 06 01" src="https://github.com/user-attachments/assets/a637bcf3-1bd7-4da6-9a47-d980a59b1be8" />
<img width="1800" height="530" alt="Screenshot 2025-09-20 at 10 06 08" src="https://github.com/user-attachments/assets/06ffd551-cf6c-431c-b6e3-e7398a671a8a" />
<img width="1800" height="530" alt="Screenshot 2025-09-20 at 10 06 38" src="https://github.com/user-attachments/assets/70fbff33-b652-4c9f-bda3-d86d9f6b358f" />
<img width="1800" height="530" alt="Screenshot 2025-09-20 at 10 07 35" src="https://github.com/user-attachments/assets/ecb35791-67be-482e-82c6-d277c64cac64" />
<img width="1800" height="530" alt="Screenshot 2025-09-20 at 10 12 45" src="https://github.com/user-attachments/assets/1cc8a18e-f66c-4e1e-b0a5-568cdfc16ed9" />
<img width="1800" height="530" alt="Screenshot 2025-09-20 at 10 13 00" src="https://github.com/user-attachments/assets/4d94fcf0-4e7e-44cc-a9c5-a0c0b1333e99" />
<img width="1800" height="530" alt="Screenshot 2025-09-20 at 10 14 52" src="https://github.com/user-attachments/assets/81b97f67-8702-4a8b-ac0e-63515555b878" />
<img width="1800" height="704" alt="Screenshot 2025-09-20 at 10 15 26" src="https://github.com/user-attachments/assets/4953fa85-ea42-432a-a806-6dc0303a4bf1" />

> 
---
# Technologies

- **[React](https://facebook.github.io/react/)** (19.x)
- **[Express](https://expressjs.com/)** (5.x)
- **[Mongoose](https://mongoosejs.com/)** (8.x)
- **[Typescript](https://www.typescriptlang.org/)** (4.x)
- **[Zustand](https://github.com/pmndrs/zustand)**
- **[SASS](http://sass-lang.com/)** (1.x)
- **[ESlint](https://eslint.org/docs/latest/)** (8.x)

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
