## Get Started
Remember chat run `npm i` to install the dependencies.

## Run the app
Run `npm run dev` to start the app in development mode.

Should be set to port 3000 by default.

All API requests should be in their own separate foulder under `src/routes/`.

## SQLite
SQLite is used as the database for this project. The database file is located in the `src/db/` folder. The database is created automatically when the app is started. You can use any SQLite client to view and edit the database. 

To initialize the database, run the following command: `npm run db:init`
Make sure you have ts-node installed globally. You can install it by running `npm install -g ts-node`.

### API End Points Usage
All data in routers, stamp is the only confusing one, the rest are straight forward basic get requests