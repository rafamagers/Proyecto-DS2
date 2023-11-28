const express = require('express');
const app = express();
const morgan = require('morgan');
const customerRoutes = require('./route');
const cors = require('cors');
const bodyParser = require('body-parser');


// Settings
app.set('port', process.env.PORT || 3001);

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api', customerRoutes);

// Starting the server
const port = 3001;
app.listen(app.get('port'), () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});