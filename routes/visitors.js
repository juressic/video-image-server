const express = require('express');

const router = express.Router();
const path = require('path');

router.get('/Jure_1660515769601', (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      '..',
      'visitor',
      'Jure_1660515769601',
      'Jure_1660515769601.html'
    )
  );
});
module.exports = router;
