const express = require('express');
const handlebars = require('express-handlebars');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();

//import all the functions from the controller
const clubsController = require('./controllers/clubsController');

let clubsDataBase = JSON.parse(fs.readFileSync('./clubs.json', 'utf-8'));
function consoleLog(parameter) {
  console.log(parameter + 'ejecuted ');
}

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
  consoleLog(' show all clubs'),
    fs.readFile('clubs.json', (err, data) => {
      if (err) throw err;
      const clubs = JSON.parse(data);
      res.render('clubs', { clubs });
    });
});

//Setting up the route to display the form for creating a new club
app.get('/clubs/new', (req, res) => {
  consoleLog('create a new club');
  res.render('new');
});
// Setting up the route to display a particular club
app.get('/clubs/:id', (req, res) => {
  consoleLog(' show a particular club');
  const id = req.params.id;
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

//Setting up the route to display the form for editing an existing club
app.get('/clubs/edit/:id', async (req, res) => {
  console.log('show the form for editing an existing club');
  try {
    const id = parseInt(req.params.id); // convert string to number
    const club = clubsDataBase.find((obj) => obj.id === id);
    res.render('edit', { club });
  } catch (err) {
    console.error(err);
    res.status(500).send('error to show the form for editing an existing club');
  }
});

//////////////////////POST////////////////////////

// Config of the route to process the creation of a new club
app.post('/clubs/new', (req, res) => {
  consoleLog('process the creation of a new club');
  fs.readFile('clubs.json', (err, data) => {
    if (err) throw err;
    const clubs = JSON.parse(data);
    const newClub = {
      id: uuidv4(),
      name: req.body.name,
      shortName: req.body.shortName,
      tla: req.body.tla,
      crestUrl: req.body.crestUrl,
      address: req.body.address,
      phone: req.body.phone,
      website: req.body.website,
      email: req.body.email,
      founded: parseInt(req.body.founded),
      clubColors: req.body.clubColors,
      venue: req.body.venue,
      lastUpdated: new Date().toISOString(),
    };
    clubs.push(newClub);
    fs.writeFile('clubs.json', JSON.stringify(clubs), (err) => {
      if (err) throw err;
      res.redirect('/');
    });
  });
});

// setting up the route to process the editing of an existing club
// this does not work

app.post('/clubs/edit/:id', (req, res) => {
  const id = req.params.id;
  consoleLog('Updating the club with id:', id);
  fs.readFile('clubs.json', (err, data) => {
    if (err) throw err;
    const clubs = JSON.parse(data);
    const club = clubs.find((c) => c.id == id);
    if (club) {
      club.id = req.body.id;
      club.name = req.body.name;
      club.shortName = req.body.shortName;
      club.tla = req.body.tla;
      club.crestUrl = req.body.crestUrl;
      club.address = req.body.address;
      club.phone = req.body.phone;
      club.website = req.body.website;
      club.email = req.body.email;
      club.founded = parseInt(req.body.founded);
      club.clubColors = req.body.clubColors;
      club.venue = req.body.venue;
      club.lastUpdated = new Date().toISOString();
      fs.writeFile('clubs.json', JSON.stringify(clubs), (err) => {
        if (err) throw err;
        res.redirect('/');
      });
    } else {
      res.status(404).send('Editing Club not found');
    }
  });
});

// Setting up the route to process the deletion of an existing club
app.post('/eliminar/:id', (req, res) => {
  consoleLog(' process the deletion of an existing club');

  const id = req.params.id;
  fs.readFile('clubs.json', (err, data) => {
    if (err) throw err;
    let clubs = JSON.parse(data);
    clubs = clubs.filter((c) => c.id != id);
    fs.writeFile('clubs.json', JSON.stringify(clubs), (err) => {
      if (err) throw err;
      res.redirect('/');
    });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
