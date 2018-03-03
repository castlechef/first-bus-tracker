import * as express from 'express';
import * as cors from 'cors';

/**
 * to run this server on localhost install the chrome extension
 * https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi
 * otherwise it won't work when doing a get request
 */

let app = express();

/*
const options:cors.CorsOptions = {
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "http;//localhost:8100/",
  preflightContinue: false
};

app.use(cors(options));
app.options("*", cors(options));
*/

app.get('/buses', (req, res) => {
  const testData = {
    'status': 'success',
    'data': [
      {
        'busId': 1,
        'location': {
          'latitude': 53.003444,
          'longitude': -2.273507
        }
      },
      {
        'busId': 2,
        'location': {
          'latitude': 53.9643824,
          'longitude': -2.295362
        }
      },
      {
        'busId': 3,
        'location': {
          'latitude': 53.837285,
          'longitude': -2.276247
        }
      }
    ]
  }

  res.status(200);
  res.json(testData);
});

app.listen(8080, () => {
  console.log('mockup server listening on port 8080');
});
