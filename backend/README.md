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
All data in routers, stamp is the only confusing one, the rest are straight forward basic get requests.

Note: names are the only ids used in the database, so simplifies queries; this would be a security no go under real life but hey its okay

- `/api/user/` - GET all users
- `/api/user/:name` - GET user by name
- `/api/user/sign-in` - POST sign in a user, if a user exists already, it will return the user, if not, it will create a new user (scuffed way to handle both LOL), pass in nae into body

- `/api/stamp/` - GET all stamps
- `/api/stamp/getByUser` - GET all stamps by user, pass in name into body
- `/api/stamp/getByLocation` - GET all stamps by location, pass in location into body
- `/api/stamp/getByPOI` - GET all stamps by place of interest, pass in place of interest into body
- `/api/stamp/submitStamp` - POST submit a stamp, pass in name, location, and place of interest into body; Note this is the most test needy of the requests, so dk if works properly

- `/api/poi/` - GET all points of interest
- `/api/poi/getByUser` - GET all points of interest by user, pass in name into body
  
- `/api/location/` - GET all points of interest
- `/api/location/getByUser` - GET all points of interest by user, pass in name into body

- `/api/challenge/` - GET all challenges
- `/api/challenge/getByPOI` - GET all challenges by place of interest, pass in place of interest into body