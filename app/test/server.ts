import * as express from 'express';
import * as cors from 'cors';

/**
 * to run this server on localhost install the chrome extension
 * https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi
 * otherwise it won't work when doing a get request
 */

let app = express();


const options:cors.CorsOptions = {
  allowedHeaders: ["Origin"],
  credentials: true,
  methods: "GET,PUT,POST",
  origin: "*",
  preflightContinue: false
};

app.use(cors(options));

app.get('/buses', (req, res) => {
  const testData = {
    'status': 'success',
    'data': [
      {
        'busId': 1,
        'location': {
          'latitude': 53.003444,
          'longitude': -2.273507
        },
        'routeName': 'U2'
      },
      {
        'busId': 2,
        'location': {
          'latitude': 53.9643824,
          'longitude': -2.295362
        },
        'routeName': 'U2'
      },
      {
        'busId': 3,
        'location': {
          'latitude': 53.837285,
          'longitude': -2.276247
        },
        'routeName': 'U1X'
      }
    ]
  }

  res.status(200);
  res.json(testData);
});

app.listen(8080, () => {
  console.log('mockup server listening on port 8080');
});
