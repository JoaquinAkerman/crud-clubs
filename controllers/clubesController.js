const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'clubes.json');

// función para leer los datos del archivo JSON
function getClubData() {
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
}

// función para escribir los datos al archivo JSON
function saveClubData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data));
}

// función para obtener todos los clubes
function getClubes() {
  return getClubData().clubes;
}

// función para agregar un nuevo club
function addClub(club) {
  const clubData = getClubData();
  clubData.clubes.push(club);
  saveClubData(clubData);
}

// función para actualizar un club existente
function updateClub(club) {
  const clubData = getClubData();
  const clubIndex = clubData.clubes.findIndex((c) => c.id === club.id);
  if (clubIndex === -1) {
    throw new Error(`Club con id ${club.id} no encontrado.`);
  }
  clubData.clubes[clubIndex] = club;
  saveClubData(clubData);
}

// función para eliminar un club existente
function deleteClub(clubId) {
  const clubData = getClubData();
  const clubIndex = clubData.clubes.findIndex((c) => c.id === clubId);
  if (clubIndex === -1) {
    throw new Error(`Club con id ${clubId} no encontrado.`);
  }
  clubData.clubes.splice(clubIndex, 1);
  saveClubData(clubData);
}

// función para obtener un club por su id
function getClubById(clubId) {
  return getClubes().find((c) => c.id === clubId);
}

module.exports = {
  getClubes,
  addClub,
  updateClub,
  deleteClub,
  getClubById,
};
