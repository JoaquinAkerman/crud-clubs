const http = require('http');
const { v4: uuidv4 } = require('uuid');

const app = require('../server.js');

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(4000, (err) => {
    if (err) return done(err);
    done();
  });
});

afterAll((done) => {
  server.close(done);
});
jest.setTimeout(10000);
describe('GET /', () => {
  it('should return status code 200', (done) => {
    http.get('http://localhost:4000', (res) => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('text/html; charset=utf-8');

      done();
    });
  });
});

describe('GET /clubs/new', () => {
  it('should return status code 200', (done) => {
    http.get('http://localhost:4000/clubs/new', (res) => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
      done();
    });
  });
});

describe('GET /clubs/noID', () => {
  it('request with no ID should fail with return status code 404', (done) => {
    http.get('http://localhost:4000/clubs', (res) => {
      expect(res.statusCode).toBe(404);
      expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
      done();
    });
  });
});

describe('GET /edit/:id', () => {
  it('should return status code 200', (done) => {
    http.get('http://localhost:4000/clubs/edit/57', (res) => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
      done();
    });
  });
});

describe('GET /edit/noID', () => {
  it('request with no ID should fail with return status code 404', (done) => {
    http.get('http://localhost:4000/clubs/edit', (res) => {
      expect(res.statusCode).toBe(404);
      expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
      done();
    });
  });
});
