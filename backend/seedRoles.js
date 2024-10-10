// Initiate the connection to the database and seed the roles collection with the roles of the users in the system to start. 
import mongoose from 'mongoose';
import Role from './models/Roles.js';
import { connectToDb } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedRoles() {
  await connectToDb(async () => {
    const roles = [
      { email: 'SPEED-moderator1@pricehound.tech', role: 'moderator' },
      { email: 'SPEED-moderator2@pricehound.tech', role: 'moderator' },
      { email: 'SPEED-analyst1@pricehound.tech', role: 'analyst' },
      { email: 'SPEED-analyst2@pricehound.tech', role: 'analyst' },
    ];

    try {
      await Role.insertMany(roles);
      console.log('Roles seeded successfully');
    } catch (error) {
      console.error('Error seeding roles:', error);
    } finally {
      mongoose.connection.close(); // Close the connection after seeding
    }
  });
}

seedRoles();