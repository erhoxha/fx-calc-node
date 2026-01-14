const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { getCalculateLotSize, postCalculateLotSize } = require('./controllers/calculateLotSizeController');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.redirect('/calculateLotSize');
});

app.get('/calculateLotSize', getCalculateLotSize);

app.post('/calculateLotSize', postCalculateLotSize);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
