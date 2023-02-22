const http = require('http');
const app = require('../../server.js');

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

describe('GET /', () => {
  it('should return status code 200', (done) => {
    http.get('http://localhost:4000', (res) => {
      expect(res.statusCode).toBe(200);
      done();
    });
  });
});
