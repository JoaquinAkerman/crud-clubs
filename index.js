const app = require('./server.js');

const PORT = process.env.PORT || 3050;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
