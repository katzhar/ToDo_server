const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const memjs = require('memjs');

const router = express.Router();
router.use(bodyParser.json());

const client = memjs.Client.create(process.env.MEMCACHEDCLOUD_SERVERS, {
  username: process.env.MEMCACHEDCLOUD_USERNAME,
  password: process.env.MEMCACHEDCLOUD_PASSWORD
});

router.get('/', authenticate.verifyUser, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const isTokenBlacklisted = await authenticate.isBlacklisted(token);
  if (isTokenBlacklisted)
    return res.status(401).send('Token is invalid');
  else {
    client.add(token, token, { expires: 10000 }, (err, val) => {
      if (err) throw err;
      else if (val) {
        res.statusCode = 200;
        res.json({ success: true });
      }
    })
  }
});

module.exports = router;