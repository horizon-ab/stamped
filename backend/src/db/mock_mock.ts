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

  // Insert sample points of interest
  const pointsOfInterestData = [
    { location_name: 'UCLA', name: "Pauley Pavilion", description: "Huge Stadium fit for hosting hackathons", latitude: 34.070211, longitude: -118.446775 },
    { location_name: 'UCLA', name: "Bruin Bear", description: "Iconic statue on campus", latitude: 34.0747, longitude: -118.4441 },
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
    { poi_name: 'Pauley Pavilion', name: 'Hackathon', description: 'Code for LA Hacks 2025!' },
    { poi_name: 'Bruin Bear', name: 'Take a Selfie', description: 'Snap a photo with the Bruin Bear.' },
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
    {
      user_name: 'Bob',
      challenge_name: 'Ferris Wheel Ride',
      location_name: 'Santa Monica',
      point_of_interest_name: 'Santa Monica Pier',
      stamp: '🎡 So fun!',
      datetime: '2024-08-01 14:30:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=2abc123xyz789',
    },
    {
      user_name: 'Alice',
      challenge_name: 'Street Performer Sighting',
      location_name: 'Santa Monica',
      point_of_interest_name: 'Third Street Promenade',
      stamp: '🎶 Great music!',
      datetime: '2024-08-05 16:00:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=3def456uvw012',
    },
    {
      user_name: 'Charlie',
      challenge_name: 'Find Your Star',
      location_name: 'Hollywood',
      point_of_interest_name: 'Walk of Fame',
      stamp: '⭐ Found it!',
      datetime: '2024-08-10 11:15:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=4ghi789rst345',
    },
    {
      user_name: 'Bob',
      challenge_name: 'Telescope Viewing',
      location_name: 'Hollywood',
      point_of_interest_name: 'Griffith Observatory',
      stamp: '🔭 Amazing views!',
      datetime: '2024-08-12 21:45:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=5jkl012pqr678',
    },
    {
      user_name: 'Alice',
      challenge_name: 'Sunset Stroll',
      location_name: 'Malibu',
      point_of_interest_name: 'Zuma Beach',
      stamp: '🌅 Beautiful sunset!',
      datetime: '2024-08-18 19:00:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=6mno345lmn901',
    },
    {
      user_name: 'Charlie',
      challenge_name: 'Ancient Art Appreciation',
      location_name: 'Malibu',
      point_of_interest_name: 'Getty Villa',
      stamp: '🏛️ Impressive collection!',
      datetime: '2024-08-22 13:00:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=7pqr678stu234',
    },
    {
      user_name: 'Bob',
      challenge_name: 'Lakeside Walk',
      location_name: 'Silver Lake',
      point_of_interest_name: 'Silver Lake Reservoir',
      stamp: '🚶 Nice walk!',
      datetime: '2024-08-25 09:30:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=8uvw901xyz567',
    },
    {
      user_name: 'Alice',
      challenge_name: 'Coffee Stop',
      location_name: 'Silver Lake',
      point_of_interest_name: 'Sunset Junction',
      stamp: '☕ Good coffee!',
      datetime: '2024-08-28 10:45:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=9xyz234abc890',
    },
    {
      user_name: 'Diana',
      challenge_name: 'Try a New Food',
      location_name: 'Downtown LA',
      point_of_interest_name: 'Grand Central Market',
      stamp: '🍜 Delicious!',
      datetime: '2024-09-02 12:00:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=10defghi789jkl',
    },
    {
      user_name: 'Ethan',
      challenge_name: 'Architectural Appreciation',
      location_name: 'Downtown LA',
      point_of_interest_name: 'Walt Disney Concert Hall',
      stamp: '🎶 Stunning design!',
      datetime: '2024-09-05 15:30:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=11mnopqr456stu',
    },
    {
      user_name: 'Charlie',
      challenge_name: 'Stadium Visit',
      location_name: 'Pasadena',
      point_of_interest_name: 'Rose Bowl Stadium',
      stamp: '🏟️ Historic venue!',
      datetime: '2024-09-10 10:00:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=12vwxyz123abc',
    },
    {
      user_name: 'Bob',
      challenge_name: 'Window Shopping',
      location_name: 'Pasadena',
      point_of_interest_name: 'Old Town Pasadena',
      stamp: '🛍️ Cute shops!',
      datetime: '2024-09-14 14:00:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=13def456uvw789',
    },
    // Adding one more stamp for UCLA now
    {
      user_name: 'Diana',
      challenge_name: 'Take a Selfie',
      location_name: 'UCLA',
      point_of_interest_name: 'Bruin Bear',
      stamp: '🐻 Go Bruins!',
      datetime: '2024-09-18 11:30:00',
      photolink: 'https://drive.google.com/thumbnail?sz=w640&id=14ghijklmno012',
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