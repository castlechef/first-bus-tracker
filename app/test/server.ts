import * as express from 'express';

let app = express();

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
