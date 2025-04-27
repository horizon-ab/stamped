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
        { name: 'Downtown Metropolis', description: 'The bustling city center.', latitude: 34.0522, longitude: -118.2437 },
        { name: 'Uptown Heights', description: 'A trendy residential area.', latitude: 34.0700, longitude: -118.2500 },
        { name: 'Historic District', description: 'Full of old buildings and landmarks.', latitude: 34.0450, longitude: -118.2350 },
        { name: 'Seaside Marina', description: 'A beautiful area by the ocean.', latitude: 33.9500, longitude: -118.4000 },
        { name: 'Mountain View Estates', description: 'A quiet suburban area.', latitude: 34.1000, longitude: -118.1500 },
        { name: "UCLA", description: "#1 Public University",  latitude : 34.0722, longitude : -118.4427},
    ];
    for (const location of locations) {
        await db.run(
            'INSERT INTO locations (name, description, latitude, longitude) VALUES (?, ?, ?, ?)',
            [location.name, location.description, location.latitude, location.longitude]
        );
    }

    // Insert sample points of interest
    const pointsOfInterest = [
        { location_name: 'Downtown Metropolis', name: 'City Hall', description: 'The center of city government.', latitude: 34.0536, longitude: -118.2428 },
        { location_name: 'Downtown Metropolis', name: 'Central Park', description: 'A large green space in the city.', latitude: 34.0500, longitude: -118.2400 },
        { location_name: 'Uptown Heights', name: 'Art Museum', description: 'A museum with modern art.', latitude: 34.0750, longitude: -118.2550 },
        { location_name: 'Uptown Heights', name: 'Shopping Mall', description: 'A large shopping center.', latitude: 34.0650, longitude: -118.2450 },
        { location_name: 'Historic District', name: 'Old Church', description: 'A historic religious building.', latitude: 34.0460, longitude: -118.2360 },
        { location_name: 'Historic District', name: 'Town Square', description: 'The central gathering place.', latitude: 34.0440, longitude: -118.2340 },
        { location_name: 'Seaside Marina', name: 'Lighthouse', description: 'A guiding light for ships.', latitude: 33.9550, longitude: -118.4050 },
        { location_name: 'Seaside Marina', name: 'Fishing Pier', description: 'A place for fishing and views.', latitude: 33.9450, longitude: -118.3950 },
        { location_name: 'Mountain View Estates', name: 'Mountain Trailhead', description: 'Start of a hiking trail.', latitude: 34.1050, longitude: -118.1450 },
        { location_name: 'Mountain View Estates', name: 'Scenic Overlook', description: 'A place with a great view.', latitude: 34.0950, longitude: -118.1550 },
        { location_name: 'UCLA', name: "Pauley Pavilion", description: "Big ass pavilion!", latitude: 34.070211, longitude: -118.446775}
    ];
    for (const poi of pointsOfInterest) {
        await db.run(
            'INSERT INTO point_of_interests (location_name, name, description, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
            [poi.location_name, poi.name, poi.description, poi.latitude, poi.longitude]
        );
    }

    // Insert sample challenges
    const challenges = [
        { poi_name: 'City Hall', name: 'Capitol Steps Climb', description: 'Climb the steps of City Hall and take a photo.' },
        { poi_name: 'Central Park', name: 'Fountain Photo', description: 'Take a picture by the main fountain.' },
        { poi_name: 'Art Museum', name: 'Modern Art Selfie', description: 'Take a selfie with your favorite modern art piece.' },
        { poi_name: 'Shopping Mall', name: 'Mall Scavenger Hunt', description: 'Find a specific item in the mall.' },
        { poi_name: 'Old Church', name: 'Bell Tower View', description: 'Capture a view from the church bell tower.' },
        { poi_name: 'Town Square', name: 'Statue Pose', description: 'Strike a pose with the central statue.' },
        { poi_name: 'Lighthouse', name: 'Lighthouse Beacon', description: 'Photograph the lighthouse beacon at night.' },
        { poi_name: 'Fishing Pier', name: 'Sunset Pier Photo', description: 'Take a photo of the sunset from the pier.' },
        { poi_name: 'Mountain Trailhead', name: 'Trailhead Marker', description: 'Photograph the start of the trail.' },
        { poi_name: 'Scenic Overlook', name: 'Panoramic View', description: 'Capture a panoramic photo of the view.' },
        { poi_name: 'Pauley Pavilion', name: 'Hackathon', description: 'Code for LA Hacks 2025!' },
    ];
    for (const challenge of challenges) {
        await db.run(
            'INSERT INTO challenges (poi_name, name, description) VALUES (?, ?, ?)',
            [challenge.poi_name, challenge.name, challenge.description]
        );
    }

      // Insert sample users
      const users = [
        {
          name: 'Alice',
          bio: 'Explorer. Lover of cityscapes and sunsets.',
          joined: '2024-06-15',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice'
        },
        {
          name: 'Bob',
          bio: 'Travel photographer. Seeker of adventure.',
          joined: '2024-06-16',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bob'
        },
        {
          name: 'Charlie',
          bio: 'Nature lover. Always on the lookout for the next great shot.',
          joined: '2024-06-17',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie'
        },
        {
          name: 'David',
          bio: 'History buff. Enjoys exploring old towns.',
          joined: '2024-06-18',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=David'
        },
        {
          name: 'Eve',
          bio: 'Foodie. Loves to discover new places to eat.',
          joined: '2024-06-19',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Eve'
        },
      ];
      for (const user of users) {
        await db.run(
          'INSERT INTO users (name, bio, joined, avatar) VALUES (?, ?, ?, ?)',
          [user.name, user.bio, user.joined, user.avatar]
        );
      }
      

    // Insert sample stamps (assuming all other tables are populated)
    const stamps = [
        {
            user_name: 'Alice',
            challenge_name: 'Capitol Steps Climb',
            location_name: 'Downtown Metropolis',
            point_of_interest_name: 'City Hall',
            stamp: '✅ #1',
            datetime: '2024-07-24 10:00:00',
            photolink: 'https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU',
        }, // 
        {
            user_name: 'Bob',
            challenge_name: 'Fountain Photo',
            location_name: 'Downtown Metropolis',
            point_of_interest_name: 'Central Park',
            stamp: '✅ #2',
            datetime: '2024-07-24 12:30:00',
            photolink: 'https://th.bing.com/th/id/OIP.mqaKL-y9JPYO5QiAP8LZ4QHaE8?rs=1&pid=ImgDetMain',
        },
        {
            user_name: 'Charlie',
            challenge_name: 'Modern Art Selfie',
            location_name: 'Uptown Heights',
            point_of_interest_name: 'Art Museum',
            stamp: '✅ #3',
            datetime: '2024-07-24 15:00:00',
            photolink: 'https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU',
        },
        {
            user_name: 'Alice',
            challenge_name: 'Mall Scavenger Hunt',
            location_name: 'Uptown Heights',
            point_of_interest_name: 'Shopping Mall',
            stamp: '✅ #4',
            datetime: '2024-07-25 09:00:00',
            photolink: 'https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU',
        },
        {
            user_name: 'David',
            challenge_name: 'Bell Tower View',
            location_name: 'Historic District',
            point_of_interest_name: 'Old Church',
            stamp: '✅ #5',
            datetime: '2024-07-25 11:00:00',
            photolink: 'https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU',
        },
        {
            user_name: 'Dylan',
            challenge_name: 'Bell Tower View',
            location_name: 'Historic District',
            point_of_interest_name: 'Old Church',
            stamp: '✅ #5',
            datetime: '2024-07-25 12:00:00',
            photolink: 'https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU',
        },
        {
            user_name: 'Eve',
            challenge_name: 'Statue Pose',
            location_name: 'Historic District',
            point_of_interest_name: 'Town Square',
            stamp: '✅ #6',
            datetime: '2024-07-25 13:00:00',
            photolink: 'https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU',
        },
        {
            user_name: 'Alice',
            challenge_name: 'Lighthouse Beacon',
            location_name: 'Seaside Marina',
            point_of_interest_name: 'Lighthouse',
            stamp: '✅ #7',
            datetime: '2024-07-25 20:00:00',
            photolink: 'https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU',
        },
        {
            user_name: 'Bob',
            challenge_name: 'Sunset Pier Photo',
            location_name: 'Seaside Marina',
            point_of_interest_name: 'Fishing Pier',
            stamp: '✅ #8',
            datetime: '2024-07-25 19:30:00',
            photolink: 'https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU',
        },
        {
            user_name: 'Charlie',
            challenge_name: 'Trailhead Marker',
            location_name: 'Mountain View Estates',
            point_of_interest_name: 'Mountain Trailhead',
            stamp: '✅ #9',
            datetime: '2024-07-26 08:00:00',
            photolink: 'https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU',
        },
        {
            user_name: 'David',
            challenge_name: 'Panoramic View',
            location_name: 'Mountain View Estates',
            point_of_interest_name: 'Scenic Overlook',
            stamp: '✅ #10',
            datetime: '2024-07-26 10:00:00',
            photolink: 'https://drive.google.com/thumbnail?sz=w640&id=1NoM7_m0Eruab87d2qJYgZOxbYGd5XUHU',
        },
    ];

    for (const stamp of stamps) {
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