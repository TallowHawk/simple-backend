const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const history = require('connect-history-api-fallback');
const router = express.Router();

const app = express();

const whitelist = ['http://localhost:8080', 'http://localhost:3005'];
const corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};


app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(history());

app.use('/', express.static('../front-end/'));

require('./routes')(router);
app.use('/api', router);

// app.get('/2', (req, res) => {
//   res.send('hi');
// });

app.listen(process.env.PORT || 3005);
console.log('Server is running on port 3005');
