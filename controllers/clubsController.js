const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'clubs.json');

// function to read the data from the JSON file
function getClubData() {
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
}

// function to write the data to the JSON file
function saveClubData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data));
}

// function to get all clubs
function getClubs() {
  return getClubData().clubs;
}

// function to add a new club
function addClub(club) {
  const clubData = getClubData();
  clubData.clubs.push(club);
  saveClubData(clubData);
}

// function to update an existing club
function updateClub(club) {
  const clubData = getClubData();
  const clubIndex = clubData.clubs.findIndex((c) => c.id === club.id);
  if (clubIndex === -1) {
    throw new Error(`Club con id ${club.id} no encontrado.`);
  }
  clubData.clubs[clubIndex] = club;
  saveClubData(clubData);
}

// function to delete a club
function deleteClub(clubId) {
  const clubData = getClubData();
  const clubIndex = clubData.clubs.findIndex((c) => c.id === clubId);
  if (clubIndex === -1) {
    throw new Error(`Club con id ${clubId} no encontrado.`);
  }
  clubData.clubs.splice(clubIndex, 1);
  saveClubData(clubData);
}

// function to get a club by id
function getClubById(clubId) {
  return getClubs().find((c) => c.id === clubId);
}

module.exports = {
  getClubs,
  addClub,
  updateClub,
  deleteClub,
  getClubById,
};
