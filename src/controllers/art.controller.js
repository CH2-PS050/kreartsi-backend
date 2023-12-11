const pool = require("../database");

// Get All Arts
exports.getArts = async (req, res) => {
  pool.query("SELECT * FROM Artworks", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(results);
    }
  });
};

// Get My Arts
exports.getMyArts = async (req, res) => {
  const user_id = res.locals.user.user_id;

  pool.query(
    "SELECT * FROM Artworks WHERE user_id = ?",
    [user_id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).json(results);
      }
    }
  );
};

// Get Art by ID
exports.getArtById = async (req, res) => {
  const { artwork_id } = req.params;

  pool.query(
    "SELECT * FROM Artworks WHERE artwork_id = ?",
    [artwork_id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        if (results.length === 0) {
          return res.status(400).json({ msg: "Artwork not found" });
        } else {
          res.status(200).json(results);
        }
      }
    }
  );
};

// Upload Art
exports.uploadArt = async (req, res) => {
  const { caption, image_url, category_id } = req.body;
  const user_id = res.locals.user.user_id;

  if (!caption || !image_url || !category_id) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // PANGGIL MODEL ML BUAT DETECT CATEGORY
  const newArtQuery =
    "INSERT INTO Artworks (caption, image_url, category_id, user_id) VALUES (?, ?, ?, ?)";
  pool.query(
    newArtQuery,
    [caption, image_url, category_id, user_id],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      } else {
        let response = {
          id: results.insertId,
          caption: caption,
          image_url: image_url,
          category_id: category_id,
          user_id: user_id,
        };
        res
          .status(200)
          .json({ msg: "Artwork uploaded successfully", art: response });
      }
    }
  );
};

// DONATE
exports.donation = async (req, res) => {
  const { donated_amount } = req.body;
  const recipient_user_id = req.params.user_id;
  const donor_user_id = res.locals.user.user_id;

  if (!donated_amount) {
    return res.status(400).json({ msg: "Please input the amount" });
  }

  const newDonationQuery =
    "INSERT INTO Donations (donated_amount, donor_user_id, recipient_user_id) VALUES (?, ?, ?)";
  pool.query(
    newDonationQuery,
    [donated_amount, donor_user_id, recipient_user_id],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      } else {
        try {
          // add coin
          const updateRecipientCoinQuery =
            "UPDATE Users SET coins = coins + ? WHERE user_id = ?";
          pool.query(
            updateRecipientCoinQuery,
            [donated_amount, recipient_user_id],
            (error, results) => {
              if (error) {
                console.error(error);
                return res.status(500).send("Internal Server Error");
              }
            }
          );
          // deduct coin
          const updateDonorCoinQuery =
            "UPDATE Users SET coins = coins - ? WHERE user_id = ?";
          pool.query(
            updateDonorCoinQuery,
            [donated_amount, donor_user_id],
            (error, results) => {
              if (error) {
                console.error(error);
                return res.status(500).send("Internal Server Error");
              }
            }
          );

          let response = {
            id: results.insertId,
            donated_amount: donated_amount,
            donor_user_id: donor_user_id,
            recipient_user_id: recipient_user_id,
          };
          res.status(200).json({ msg: "Donation success", donation: response });
        } catch (error) {
          console.log(error);
        }
      }
    }
  );
};

// Like Art
exports.likeArt = async (req, res) => {
  const { artwork_id } = req.params;

  const likeArtQuery =
    "UPDATE Artworks SET likes_count = likes_count + 1 WHERE artwork_id = ?";
  pool.query(likeArtQuery, [artwork_id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json({ msg: "Artwork liked" });
    }
  });
};

// Unlike
exports.unlikeArt = async (req, res) => {
  const { artwork_id } = req.params;

  const unlikeArtQuery =
    "UPDATE Artworks SET likes_count = likes_count - 1 WHERE artwork_id = ?";
  pool.query(unlikeArtQuery, [artwork_id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json({ msg: "Artwork unliked" });
    }
  });
};
