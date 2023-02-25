const axios = require('axios');
const http = require('http');
const cheerio = require('cheerio');

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
  it('should return status code 200 and title id with "Club Management System"', async () => {
    const response = await axios.get('http://localhost:4000');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(response.headers['content-length']).toBeDefined();
    expect(parseInt(response.headers['content-length'])).toBeGreaterThan(0);
    const $ = cheerio.load(response.data); //use cheerio to parse the response
    const titleText = $('#title').text().trim();
    expect(titleText).toBe('Club Management System');
  });
});

describe('GET /clubs/new', () => {
  it('should return status code 200 and "New Club" title', async () => {
    const response = await axios.get('http://localhost:4000/clubs/new');
    const $ = cheerio.load(response.data); //use cheerio to parse the response
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(response.headers['content-length']).toBeDefined();
    expect(parseInt(response.headers['content-length'])).toBeGreaterThan(0);
  });

  it('should load the new club form', async () => {
    const response = await axios.get('http://localhost:4000/clubs/new');
    const $ = cheerio.load(response.data);
    const titleText = $('#title').text().trim();
    const clubName = $('input#name');
    const shortName = $('input#shortName');
    const tla = $('input#tla');
    const crestUrl = $('input#crestUrl');
    const address = $('input#address');
    const phone = $('input#phone');
    const website = $('input#website');
    const email = $('input#email');
    const founded = $('input#founded');
    const clubColors = $('input#clubColors');
    const venue = $('input#venue');
    const clubColorsInput = $('input#clubColors');
    const saveButton = $('button#save');

    expect(titleText).toBe('New club');
    expect(clubName.length).toBeGreaterThan(0);
    expect(shortName.length).toBeGreaterThan(0);
    expect(tla.length).toBeGreaterThan(0);
    expect(crestUrl.length).toBeGreaterThan(0);
    expect(address.length).toBeGreaterThan(0);
    expect(phone.length).toBeGreaterThan(0);
    expect(website.length).toBeGreaterThan(0);
    expect(email.length).toBeGreaterThan(0);
    expect(founded.length).toBeGreaterThan(0);
    expect(clubColors.length).toBeGreaterThan(0);
    expect(venue.length).toBeGreaterThan(0);
    expect(clubColorsInput.length).toBeGreaterThan(0);
    expect(saveButton.text().trim()).toBe('Save');
  });
});

describe('GET /clubs/noID', () => {
  it('request with no ID should fail with return status code 404', (done) => {
    http.get('http://localhost:4000/clubs/edit', (res) => {
      expect(res.statusCode).toBe(404);
      expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
      done();
    });
  });
});

describe('GET /edit/:id', () => {
  it('should return status code 200', async () => {
    const response = await axios.get('http://localhost:4000/clubs/edit/57');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(response.headers['content-length']).toBeDefined();
    expect(parseInt(response.headers['content-length'])).toBeGreaterThan(0);
  });

  it('should load the edit form', async () => {
    const response = await axios.get('http://localhost:4000/clubs/edit/57');
    const $ = cheerio.load(response.data);
    const titleText = $('#title').text().trim();
    const clubName = $('input#name');
    const shortName = $('input#shortName');
    const tla = $('input#tla');
    const crestUrl = $('input#crestUrl');
    const address = $('input#address');
    const phone = $('input#phone');
    const website = $('input#website');
    const email = $('input#email');
    const founded = $('input#founded');
    const clubColors = $('input#clubColors');
    const venue = $('input#venue');
    const clubColorsInput = $('input#clubColors');
    const saveButton = $('button#save');

    expect(titleText).toBe('Edit club');
    expect(clubName.length).toBeGreaterThan(0);
    expect(shortName.length).toBeGreaterThan(0);
    expect(tla.length).toBeGreaterThan(0);
    expect(crestUrl.length).toBeGreaterThan(0);
    expect(address.length).toBeGreaterThan(0);
    expect(phone.length).toBeGreaterThan(0);
    expect(website.length).toBeGreaterThan(0);
    expect(email.length).toBeGreaterThan(0);
    expect(founded.length).toBeGreaterThan(0);
    expect(clubColors.length).toBeGreaterThan(0);
    expect(venue.length).toBeGreaterThan(0);
    expect(clubColorsInput.length).toBeGreaterThan(0);
    expect(saveButton.text().trim()).toBe('Save');
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
