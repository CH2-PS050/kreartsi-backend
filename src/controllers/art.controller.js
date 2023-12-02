const pool = require('../database');

exports.getArts = async (req, res) => {
    try {
      // masi ngasal but it works
      pool.query('SELECT * FROM Artworks', (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        } else {
          res.json(results);
        }
      });
    } catch (error) {
      console.log(error);
    }
};

