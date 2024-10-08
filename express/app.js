const express = require('express'); 
const cors = require('cors');
const app = express();
const port = 3000;
const routes = require('./routes/index.js');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}!`)
})