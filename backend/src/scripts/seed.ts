// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import Project from '../datalayer/project';

// dotenv.config({ path: '../../.env' });

// const sampleProjects = [
//   {
//     title: 'Photography Portfolio',
//     description: 'A showcase of my best photography projects.',
//     image: 'https://example.com/photo1.jpg',
//   },
//   {
//     title: 'Web App Development',
//     description: 'A full-stack app built with Vue.js and Express.js.',
//     image: 'https://example.com/webapp.jpg',
//   },
// ];

// const seedData = async () => {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio', {
//     });
//     console.log('Database connected');

//     // Clear existing data
//     await Project.deleteMany();
//     await Project.collection.drop();
//     console.log('Existing data cleared');

//     // Insert sample data
//     await Project.insertMany(sampleProjects);
//     console.log('Sample data inserted');

//     process.exit(0);
//   } catch (error) {
//     console.error('Error seeding data:', error);
//     process.exit(1);
//   }
// };

// seedData();
