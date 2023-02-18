const express = require('express');
const handlebars = require('express-handlebars');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Configuración del motor de plantillas
app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
  }),
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración del middleware para procesar los datos enviados desde el formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la ruta raíz para mostrar todos los clubes
app.get('/', (req, res) => {
  fs.readFile('clubes.json', (err, data) => {
    if (err) throw err;
    const clubes = JSON.parse(data);
    res.render('clubes', { clubes });
  });
});

// Configuración de la ruta para mostrar un club en particular
app.get('/clubes/:id', (req, res) => {
  const id = req.params.id;
  fs.readFile('clubes.json', (err, data) => {
    if (err) throw err;
    const clubes = JSON.parse(data);
    const club = clubes.find((c) => c.id == id);
    if (club) {
      res.render('club', { club });
    } else {
      res.status(404).send('Club no encontrado');
    }
  });
});

// Configuración de la ruta para mostrar el formulario de creación de un nuevo club
app.get('/crear', (req, res) => {
  res.render('crear');
});

// Configuración de la ruta para procesar el envío del formulario de creación de un nuevo club
app.post('/crear', (req, res) => {
  fs.readFile('clubes.json', (err, data) => {
    if (err) throw err;
    const clubes = JSON.parse(data);
    const nuevoClub = {
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
    clubes.push(nuevoClub);
    fs.writeFile('clubes.json', JSON.stringify(clubes), (err) => {
      if (err) throw err;
      res.redirect('/');
    });
  });
});

// Configuración de la ruta para mostrar el formulario de edición de un club existente
app.get('/editar/:id', (req, res) => {
  const id = req.params.id;
  fs.readFile('clubes.json', (err, data) => {
    if (err) throw err;
    const clubes = JSON.parse(data);
    const club = clubes.find((c) => c.id == id);
    if (club) {
      res.render('editar', { club });
    } else {
      res.status(404).send('Club no encontrado');
    }
  });
});

// Configuración de la ruta

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
