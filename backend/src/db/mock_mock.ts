import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open a database connection
export const getDbConnection = async () => {
  return open({
    filename: path.join(__dirname, 'stamped.db'), // Path to your database file
    driver: sqlite3.Database,
  });
};

const generateMockData = async () => {
  const db = await getDbConnection();

  // Clear existing data (Good for development, comment out for production)
  await db.exec('DELETE FROM stamps');
  await db.exec('DELETE FROM challenges');
  await db.exec('DELETE FROM point_of_interests');
  await db.exec('DELETE FROM locations');
  await db.exec('DELETE FROM users');

  // Insert sample locations
  const locations = [
    { name: "UCLA", description: "#1 Public University", latitude: 34.0722, longitude: -118.4427 },
    { name: "Santa Monica", description: "Beautiful Seaside City", latitude: 34.0119, longitude: -118.4916 },
    { name: "Hollywood", description: "King of the Movie Industry", latitude: 34.0907, longitude: -118.3266 },
    { name: "Malibu", description: "A Natural Luxury", latitude: 34.0381, longitude: -118.6923 },
    { name: "Silver Lake", description: "Trendy Eastside Neighborhood", latitude: 34.0829, longitude: -118.2733 },
    { name: "Downtown LA", description: "The Heart of the City", latitude: 34.0522, longitude: -118.2437 },
    { name: "Pasadena", description: "Home of the Rose Bowl", latitude: 34.1478, longitude: -118.1445 },
  ];
  for (const location of locations) {
    await db.run(
      'INSERT INTO locations (name, description, latitude, longitude) VALUES (?, ?, ?, ?)',
      [location.name, location.description, location.latitude, location.longitude]
    );
  }

  // Insert sample points of interest // 34.0741419,-118.4406174
  const pointsOfInterestData = [
    { location_name: 'UCLA', name: "Pauley Pavilion", description: "Huge Stadium fit for hosting hackathons", latitude: 34.070211, longitude: -118.446775 },
    { location_name: 'UCLA', name: "Bruin Bear", description: "Iconic statue on campus", latitude: 34.0747, longitude: -118.4441 },
    { location_name: 'UCLA', name: "Powell Library", description: "Where most students actually live on campus", latitude : 34.0716443, longitude : -118.4447515 },
    { location_name: 'UCLA', name: "Inverted Fountain", description: "Water doesn't actually fall up here.", latitude: 34.0700809, longitude: -118.4433377 },
    { location_name: 'UCLA', name: "Franklin D. Murphy Sculpture Garden", description: "Very interesting statues.", latitude: 34.0741419, longitude: -118.4406174 },
    { location_name: 'Santa Monica', name: "Santa Monica Pier", description: "Iconic pier with amusement park rides", latitude: 34.0097, longitude: -118.4976 },
    { location_name: 'Santa Monica', name: "Third Street Promenade", description: "Pedestrian mall with shops and restaurants", latitude: 34.0158, longitude: -118.4987 },
    { location_name: 'Hollywood', name: "Walk of Fame", description: "Stars embedded in the sidewalks", latitude: 34.1016, longitude: -118.3416 },
    { location_name: 'Hollywood', name: "Griffith Observatory", description: "Iconic landmark with city views", latitude: 34.1184, longitude: -118.3004 },
    { location_name: 'Malibu', name: "Zuma Beach", description: "Popular beach known for surfing", latitude: 34.0213, longitude: -118.8248 },
    { location_name: 'Malibu', name: "Getty Villa", description: "Museum dedicated to ancient Greek and Roman art", latitude: 34.0344, longitude: -118.5789 },
    { location_name: 'Silver Lake', name: "Silver Lake Reservoir", description: "Scenic reservoir with walking trails", latitude: 34.0851, longitude: -118.2649 },
    { location_name: 'Silver Lake', name: "Sunset Junction", description: "Hub of trendy shops and cafes", latitude: 34.0886, longitude: -118.2604 },
    { location_name: 'Downtown LA', name: "Grand Central Market", description: "Historic food hall with diverse vendors", latitude: 34.0521, longitude: -118.2487 },
    { location_name: 'Downtown LA', name: "Walt Disney Concert Hall", description: "Architectural marvel and concert venue", latitude: 34.0553, longitude: -118.2508 },
    { location_name: 'Pasadena', name: "Rose Bowl Stadium", description: "Historic outdoor athletic stadium", latitude: 34.1612, longitude: -118.1675 },
    { location_name: 'Pasadena', name: "Old Town Pasadena", description: "Charming historic district with shops and restaurants", latitude: 34.1481, longitude: -118.1478 },
  ];
  for (const poi of pointsOfInterestData) {
    await db.run(
      'INSERT INTO point_of_interests (location_name, name, description, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
      [poi.location_name, poi.name, poi.description, poi.latitude, poi.longitude]
    );
  }

  // Insert sample challenges
  const challengesData = [
    { poi_name: 'Pauley Pavilion', name: 'Hackathon Judging', description: 'Take a selfie with the students you\'re judging!' },
    { poi_name: 'Bruin Bear', name: 'Beary Nice', description: 'Make a bear pose with the bear.' },
    { poi_name: 'Powell Library', name: 'Midnight Escapades', description: 'Study in the library any time from 12:00 AM to 6 AM.' },
    { poi_name: 'Inverted Fountain', name: 'On your Toes', description: 'Get as close to the inverted fountain as possible without touching it.' },
    { poi_name: 'Franklin D. Murphy Sculpture Garden', name: 'Freeze Frame', description: 'Choose any of the statues and try to copy its pose.' },
    { poi_name: 'Santa Monica Pier', name: 'Ferris Wheel Ride', description: 'Enjoy the ocean view from the Ferris wheel.' },
    { poi_name: 'Third Street Promenade', name: 'Street Performer Sighting', description: 'Watch a street performer on the Promenade.' },
    { poi_name: 'Walk of Fame', name: 'Find Your Star', description: 'Locate your favorite celebrity\'s star.' },
    { poi_name: 'Griffith Observatory', name: 'Telescope Viewing', description: 'Look through a telescope at the night sky.' },
    { poi_name: 'Zuma Beach', name: 'Sunset Stroll', description: 'Take a relaxing walk on the beach at sunset.' },
    { poi_name: 'Getty Villa', name: 'Ancient Art Appreciation', description: 'Admire a piece of ancient Greek or Roman art.' },
    { poi_name: 'Silver Lake Reservoir', name: 'Lakeside Walk', description: 'Walk around the Silver Lake Reservoir.' },
    { poi_name: 'Sunset Junction', name: 'Coffee Stop', description: 'Grab a coffee at a local cafe.' },
    { poi_name: 'Grand Central Market', name: 'Try a New Food', description: 'Sample food from a vendor you\'ve never tried before.' },
    { poi_name: 'Walt Disney Concert Hall', name: 'Architectural Appreciation', description: 'Admire the unique design of the concert hall.' },
    { poi_name: 'Rose Bowl Stadium', name: 'Stadium Visit', description: 'Take a photo in front of the iconic Rose Bowl.' },
    { poi_name: 'Old Town Pasadena', name: 'Window Shopping', description: 'Enjoy browsing the shops in Old Town.' },
  ];
  for (const challenge of challengesData) {
    await db.run(
      'INSERT INTO challenges (poi_name, name, description) VALUES (?, ?, ?)',
      [challenge.poi_name, challenge.name, challenge.description]
    );
  }

  // Insert sample users
  const usersData = [
    {
      name: 'Alice',
      bio: 'Explorer. Lover of cityscapes and sunsets.',
      joined: '2024-06-15',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice'
    },
    {
      name: 'Bob',
      bio: 'Foodie and travel enthusiast.',
      joined: '2024-07-01',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bob'
    },
    {
      name: 'Charlie',
      bio: 'Art lover and history buff.',
      joined: '2024-07-10',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie'
    },
    {
      name: 'Diana',
      bio: 'Outdoor adventurer and beach lover.',
      joined: '2024-07-20',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Diana'
    },
    {
      name: 'Ethan',
      bio: 'Music enthusiast and urban explorer.',
      joined: '2024-08-01',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ethan'
    },
  ];
  for (const user of usersData) {
    await db.run(
      'INSERT INTO users (name, bio, joined, avatar) VALUES (?, ?, ?, ?)',
      [user.name, user.bio, user.joined, user.avatar]
    );
  }


  // Insert sample stamps (excluding UCLA initially, then adding one)
  const stampsData = [
    // Adding one more stamp for UCLA now
    {
      user_name: 'Diana',
      challenge_name: 'Take a Selfie',
      location_name: 'UCLA',
      point_of_interest_name: 'Bruin Bear',
      stamp: '🐻 Go Bruins!',
      datetime: '2024-09-18 11:30:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=18ABpMzmkl2UhGQnw_Cruk7hK8UWIyxrK',
    },
    {
      user_name: 'Diana',
      challenge_name: 'Freeze Frame',
      location_name: 'UCLA',
      point_of_interest_name: 'Franklin D. Murphy Sculpture Garden',
      stamp: 'Frozen!',
      datetime: '2024-09-19 11:30:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=1K9hgreytlPR4f59tfKECASYpprP8q9K_',
    },
  ];

  for (const stamp of stampsData) {
    await db.run(
      'INSERT INTO stamps (user_name, challenge_name, location_name, point_of_interest_name, stamp, datetime, photolink) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        stamp.user_name,
        stamp.challenge_name,
        stamp.location_name,
        stamp.point_of_interest_name,
        stamp.stamp,
        stamp.datetime,
        stamp.photolink,
      ]
    );
  }

  console.log('Mock data inserted.');
  await db.close();
};

generateMockData().catch((err) => console.error(err));