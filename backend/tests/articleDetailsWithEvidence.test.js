import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from '../routes/articles.js';
import Article from '../models/Article.js';

dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());
app.use('/api/articles', router);

describe('GET /api/articles/:id', () => {
  let testArticleId;

  beforeAll(async () => {
    // Connect to the test database before running tests
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_TEST_USERNAME}:${process.env.MONGO_TEST_PASSWORD}@testcluster0.pza3q.mongodb.net/testdb?retryWrites=true&w=majority`);

    // Create a sample article in the test database with a valid ObjectId and required fields
    const testArticle = await Article.create({
      user_name: 'Test User',
      user_email: 'testuser@example.com',
      title: 'Test Article',
      evidence: 'This is supporting evidence.',
      evidence_summary: 'strong',
      status: 'published',
    });

    testArticleId = testArticle._id; // Store the ObjectId for use in tests
  }, 30000);

  afterAll(async () => {
    // Drop the test database and close the connection after all tests
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }, 30000);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an article with evidence and summary', async () => {
    const response = await request(app).get(`/api/articles/${testArticleId}`);

    // Check the response status and the article data in the body
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('evidence', 'This is supporting evidence.');
    expect(response.body).toHaveProperty('evidence_summary', 'strong');
    expect(response.body).toHaveProperty('title', 'Test Article');
  });

  it('should return 404 if the article is not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId(); // Generate a valid but non-existent ObjectId
    const response = await request(app).get(`/api/articles/${nonExistentId}`);

    // Check the response status and error message
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Article not found');
  });

  it('should handle errors when retrieving an article', async () => {
    // Mock a database error scenario
    jest.spyOn(Article, 'findById').mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await request(app).get(`/api/articles/${testArticleId}`);

    // Check for 500 status and error message
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Error fetching article');
  });
});