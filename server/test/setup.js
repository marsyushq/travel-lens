// Environment setup for tests without actual database connection
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

if (process.env.NODE_ENV === 'test') {
  process.env.DB_HOST = 'testhost';
  process.env.DB_USER = 'testuser';
  process.env.DB_PASS = 'testpass';
}
