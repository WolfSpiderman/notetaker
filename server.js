const express = require('express');
const path = require('path');
const api = require('./routes/index');


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', api)

app.use(express.static('public'));

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);