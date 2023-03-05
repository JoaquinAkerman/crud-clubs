const express = require('express');
const handlebars = require('express-handlebars');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const clubsDataBase = require('./clubs.json');
const { generateId } = require('./modules/idServices');

app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
  }),
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Setting up the middleware to process the data sent from the form
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up the root route to display all clubs
app.get('/', (req, res) => {
  fs.readFile('clubs.json', (err, data) => {
    if (err) throw err;
    const clubs = JSON.parse(data);
    res.render('clubs', { clubs });
  });
});

// Setting up the route to display the form for creating a new club
app.get('/clubs/new', (req, res) => {
  res.render('new');
});

// Setting up the route to display a particular club
app.get('/clubs/:id', (req, res) => {
  const { id } = req.params;
  fs.readFile('clubs.json', (err, data) => {
    if (err) throw err;
    const clubs = JSON.parse(data);
    const club = clubs.find((c) => c.id == id);
    if (club) {
      res.render('club', { club });
    } else {
      res.status(404).send('Club not found');
    }
  });
});

// Setting up the route to display the form for editing an existing club
app.get('/clubs/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const club = clubsDataBase.find((obj) => obj.id == id);
    res.render('edit', { club });
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

// Setting up the route to display the images of each club
app.get('/public/static/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(filename, { root: './public/uploads' }, (err) => {
    if (err) {
      const status = err.status || 500;
      const body = err.message || 'Something went wrong';
      res.status(status).send(body);
      res.status(err.status).end();
    }
  });
});

/// ///////////////////POST////////////////////////

// Config of the route to process the creation of a new club
app.post('/clubs/new', (req, res) => {
  fs.readFile('clubs.json', (err, data) => {
    if (err) throw err;
    const clubs = JSON.parse(data);
    const newClub = {
      id: generateId(clubs),
      name: req.body.name,
      shortName: req.body.shortName,
      tla: req.body.tla,
      crestUrl: req.body.crestUrl,
      address: req.body.address,
      phone: req.body.phone,
      website: req.body.website,
      email: req.body.email,
      founded: req.body.founded,
      clubColors: req.body.clubColors,
      venue: req.body.venue,
      lastUpdated: new Date().toISOString(),
    };
    clubs.push(newClub);
    fs.writeFile('clubs.json', JSON.stringify(clubs), () => {
      if (err) throw err;
      res.redirect('/');
    });
  });
});

// setting up the route to process the editing of an existing club

app.post('/clubs/edit/:id', (req, res) => {
  const { id } = req.params;
  fs.readFile('clubs.json', (err, data) => {
    if (err) throw err;
    const clubs = JSON.parse(data);
    const club = clubs.find((c) => c.id == id);
    if (club) {
      club.id = parseInt(req.body.id);
      club.name = req.body.name;
      club.shortName = req.body.shortName;
      club.tla = req.body.tla;
      club.crestUrl = req.body.crestUrl;
      club.address = req.body.address;
      club.phone = req.body.phone;
      club.website = req.body.website;
      club.email = req.body.email;
      club.founded = req.body.founded;
      club.clubColors = req.body.clubColors;
      club.venue = req.body.venue;
      club.lastUpdated = new Date().toISOString();
      fs.writeFile('clubs.json', JSON.stringify(clubs), () => {
        if (err) throw err;
        res.redirect('/');
      });
    } else {
      res.status(404).send('Editing Club not found');
    }
  });
});

app.post('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile('clubs.json', (err, data) => {
    if (err) throw err;
    let clubs = JSON.parse(data);
    clubs = clubs.filter((c) => c.id !== id);

    fs.writeFile('clubs.json', JSON.stringify(clubs), () => {
      if (err) {
        throw err;
      }
      res.redirect('/');
    });
  });
});

// code to prcoess the upload images

const storagePath = multer.diskStorage({
  // set the storage path
  destination(req, file, cb) {
    cb(null, './public/uploads');
  },
  filename(req, file, cb) {
    // set the file name
    cb(null, `${req.params.id}.png`);
  },
});

const uploadImage = multer({ storage: storagePath });

app.post('/upload/:id', uploadImage.single('image'), (req, res) => {
  // Check if the image input is empty
  if (!req.file) {
    res.status(400).render('processStatus', { message: 'Error, invalid or missing image file' });
  }
  // if not empty, send the success message
  return res.status(200).render('processStatus', { message: 'Image uploaded successfully' });
});

// code to process the reset of the clubs
app.post('/reset-clubs', (req, res) => {
  const pathbackupClubs = './backupClubs/backupClubs.json';
  const pathClubsDataBase = './clubs.json';
  try {
    const backupData = fs.readFileSync(pathbackupClubs);
    fs.writeFileSync(pathClubsDataBase, backupData);
    res.status(200).render('processStatus', { message: 'Clubs reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).render('processStatus', { message: 'Internal server error' });
  }
});

module.exports = app; // export the app to be used in the test and in the server
