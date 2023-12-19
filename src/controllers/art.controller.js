const pool = require("../database");
const config = require("../config");
const uploadImage = require("../helpers/uploadImage");

// Get All Arts
exports.getArts = async (req, res) => {
  // sort by newest or oldest based on the query parameter
  const { newest } = req.query;

  let sortQuery = "";
  if (newest === "true") {
    sortQuery = "ORDER BY upload_date ASC";
  } else if (newest === "false") {
    sortQuery = "ORDER BY upload_date DESC";
  }

  const getArtQuery = `SELECT * FROM Artworks ${sortQuery}`;

  pool.query(getArtQuery, (error, results) => {
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
  const userId = res.locals.user.user_id;

  pool.query(
    "SELECT * FROM Artworks WHERE user_id = ?",
    [userId],
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

// Get My SavedArts
exports.getMySavedArts = async (req, res) => {
  const userId = res.locals.user.user_id;

  const getSavedArtworksQuery = `
    SELECT Artworks.*
    FROM Artworks
    INNER JOIN SavedArtworks ON Artworks.artwork_id = SavedArtworks.artwork_id
    WHERE SavedArtworks.user_id = ?;
  `;

  pool.query(getSavedArtworksQuery, [userId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(results);
    }
  });
};

// Get Art by ID
exports.getArtById = async (req, res) => {
  const { artworkId } = req.params;

  pool.query(
    "SELECT * FROM Artworks WHERE artwork_id = ?",
    [artworkId],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        if (results.length === 0) {
          return res.status(400).json({ message: "Artwork not found" });
        } else {
          res.status(200).json(results);
        }
      }
    }
  );
};

// Upload Art
exports.uploadArt = async (req, res) => {
  const { caption } = req.body;
  const { file } = req;
  const userId = res.locals.user.user_id;

  try {
    if (!file || !caption) {
      return res.status(400).json({
        message: "Please upload an image and enter all required fields",
      });
    }

    const fileName = `art_${Date.now()}.jpg`;
    const bucketName = config.storage.bucketName;
    const categoryId = 3;
    const imageUrl = await uploadImage(file.buffer, fileName, bucketName);

    const newArtQuery =
      "INSERT INTO Artworks (caption, image_url, category_id, user_id) VALUES (?, ?, ?, ?)";

    pool.query(
      newArtQuery,
      [caption, imageUrl, categoryId, userId],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).send("Internal Server Error");
        } else {
          let response = {
            id: results.insertId,
            caption: caption,
            imageUrl: imageUrl,
            categoryId: categoryId,
            userId: userId,
          };
          res
            .status(200)
            .json({ message: "Artwork uploaded successfully", art: response });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// DONATE
exports.donation = async (req, res) => {
  const { donatedAmount } = req.body;
  const recipientUserId = req.params.userId;
  const donorUserId = res.locals.user.user_id;

  if (!donatedAmount) {
    return res.status(400).json({ message: "Please input the amount" });
  }

  const newDonationQuery =
    "INSERT INTO Donations (donated_amount, donor_user_id, recipient_user_id) VALUES (?, ?, ?)";
  pool.query(
    newDonationQuery,
    [donatedAmount, donorUserId, recipientUserId],
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
            [donatedAmount, recipientUserId],
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
            [donatedAmount, donorUserId],
            (error, results) => {
              if (error) {
                console.error(error);
                return res.status(500).send("Internal Server Error");
              }
            }
          );

          let response = {
            id: results.insertId,
            donatedAmount: donatedAmount,
            donorUserId: donorUserId,
            recipientUserId: recipientUserId,
          };
          res
            .status(200)
            .json({ message: "Donation success", donation: response });
        } catch (error) {
          console.log(error);
        }
      }
    }
  );
};

// Like Art
exports.likeArt = async (req, res) => {
  const { artworkId } = req.params;
  const userId = res.locals.user.user_id;

  const likeArtQuery =
    "UPDATE Artworks SET likes_count = likes_count + 1 WHERE artwork_id = ?";
  pool.query(likeArtQuery, [artworkId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    } else {
      const newLikedArtQuery =
        "INSERT INTO LikedArtworks (user_id, artwork_id) VALUES (?, ?)";
      pool.query(newLikedArtQuery, [userId, artworkId], (likeError) => {
        if (likeError) {
          return res.status(500).send("Internal Server Error");
        }

        res.status(200).json({ message: "Artwork liked" });
      });
    }
  });
};

exports.isLikedArt = async (req, res) => {
  const { artworkId } = req.params;
  const userId = res.locals.user.user_id;

  const checkLikedArtQuery =
    "SELECT * FROM LikedArtworks WHERE user_id = ? AND artwork_id = ?";
  pool.query(checkLikedArtQuery, [userId, artworkId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    } else {
      if (results.length > 0) {
        res.status(200).json({ isLiked: true });
      } else {
        res.status(200).json({ isLiked: false });
      }
    }
  });
};

exports.unlikeArt = async (req, res) => {
  const { artworkId } = req.params;

  const unlikeArtQuery =
    "UPDATE Artworks SET likes_count = likes_count - 1 WHERE artwork_id = ?";
  pool.query(unlikeArtQuery, [artworkId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    } else {
      const deleteLikedArtQuery = 
        "DELETE FROM LikedArtworks WHERE artwork_id = ?";
      pool.query(deleteLikedArtQuery, [artworkId], (unlikeError) => {
        if (unlikeError) {
          return res.status(500).send("Internal Server Error");
        }

        res.status(200).json({ message: "Artwork unliked" });
      });
    }
  });
};

exports.isSavedArt = async (req, res) => {
  const { artworkId } = req.params;
  const userId = res.locals.user.user_id;

  const checkSavedArtQuery =
    "SELECT * FROM SavedArtworks WHERE user_id = ? AND artwork_id = ?";
  pool.query(checkSavedArtQuery, [userId, artworkId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    } else {
      if (results.length > 0) {
        res.status(200).json({ isSaved: true });
      } else {
        res.status(200).json({ isSaved: false });
      }
    }
  });
};

exports.getDonationHistory = async (req, res) => {
  const userId = res.locals.user.user_id;

  const getDonationHistoryQuery = `
    SELECT Donations.*, Users.username AS donor_username
    FROM Donations
    INNER JOIN Users ON Donations.donor_user_id = Users.user_id
    WHERE Donations.donor_user_id = ? OR Donations.recipient_user_id = ?;;
  `;

  pool.query(getDonationHistoryQuery, [userId, userId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(results);
    }
  });
};

exports.saveArt = async (req, res) => {
  const { artworkId } = req.params;
  const userId = res.locals.user.user_id;

  const checkSavedArtworkQuery =
    "SELECT * FROM SavedArtworks WHERE user_id = ? AND artwork_id = ?";
  pool.query(
    checkSavedArtworkQuery,
    [userId, artworkId],
    (checkError, checkResults) => {
      if (checkError) {
        console.error(checkError);
        return res.status(500).send("Internal Server Error");
      }

      if (checkResults.length > 0) {
        return res
          .status(400)
          .json({ message: "Artwork already saved by the user." });
      }

      const checkArtworkQuery = "SELECT * FROM Artworks WHERE artwork_id = ?";
      pool.query(checkArtworkQuery, [artworkId], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).send("Internal Server Error");
        }

        if (results.length === 0) {
          return res.status(404).json({ message: "Artwork not found." });
        }

        const saveArtworkQuery =
          "INSERT INTO SavedArtworks (user_id, artwork_id) VALUES (?, ?)";
        pool.query(saveArtworkQuery, [userId, artworkId], (saveError) => {
          if (saveError) {
            return res.status(500).send("Internal Server Error");
          }

          res.status(200).json({ message: "Artwork saved successfully." });
        });
      });
    }
  );
};

exports.unsaveArt = async (req, res) => {
  const { artworkId } = req.params;
  const userId = res.locals.user.user_id;

  const checkSavedArtworkQuery =
    "SELECT * FROM SavedArtworks WHERE user_id = ? AND artwork_id = ?";
  pool.query(
    checkSavedArtworkQuery,
    [userId, artworkId],
    (checkError, checkResults) => {
      if (checkError) {
        console.error(checkError);
        return res.status(500).send("Internal Server Error");
      }

      if (checkResults.length === 0) {
        return res
          .status(404)
          .json({ message: "Artwork not saved by the user." });
      }

      const checkArtworkQuery = "SELECT * FROM Artworks WHERE artwork_id = ?";
      pool.query(
        checkArtworkQuery,
        [artworkId],
        (artworkError, artworkResults) => {
          if (artworkError) {
            console.error(artworkError);
            return res.status(500).send("Internal Server Error");
          }

          if (artworkResults.length === 0) {
            return res.status(404).json({ message: "Artwork not found." });
          }

          const unsaveArtworkQuery =
            "DELETE FROM SavedArtworks WHERE user_id = ? AND artwork_id = ?";
          pool.query(unsaveArtworkQuery, [userId, artworkId], (unsaveError) => {
            if (unsaveError) {
              console.error(unsaveError);
              return res.status(500).send("Internal Server Error");
            }

            res.status(200).json({ message: "Artwork un-saved successfully." });
          });
        }
      );
    }
  );
};

exports.deleteArt = async (req, res) => {
  const { artworkId } = req.params;
  const userId = res.locals.user.user_id;

  const checkArtworkQuery =
    "SELECT * FROM Artworks WHERE user_id = ? AND artwork_id = ?";
  console.log(checkArtworkQuery);
  pool.query(
    checkArtworkQuery,
    [userId, artworkId],
    (checkError, checkResults) => {
      if (checkError) {
        console.error(checkError);
        return res.status(500).send("Internal Server Error");
      }

      console.log(checkResults);

      if (checkResults.length === 0) {
        return res
          .status(404)
          .json({ message: "Artwork not found for the specified user." });
      }

      const deleteArtworkQuery =
        "DELETE FROM Artworks WHERE user_id = ? AND artwork_id = ?";
      pool.query(deleteArtworkQuery, [userId, artworkId], (deleteError) => {
        if (deleteError) {
          console.error(deleteError);
          return res.status(500).send("Internal Server Error");
        }

        res.status(200).json({ message: "Artwork deleted successfully." });
      });
    }
  );
};

exports.editArtCaption = async (req, res) => {
  const { artworkId } = req.params;
  const { caption } = req.body;
  const userId = res.locals.user.user_id;

  const checkArtworkQuery =
    "SELECT * FROM Artworks WHERE user_id = ? AND artwork_id = ?";
  pool.query(
    checkArtworkQuery,
    [userId, artworkId],
    (checkError, checkResults) => {
      if (checkError) {
        console.error(checkError);
        return res.status(500).send("Internal Server Error");
      }

      if (checkResults.length === 0) {
        return res
          .status(404)
          .json({ message: "Artwork not found for the specified user." });
      }

      const updateCaptionQuery =
        "UPDATE Artworks SET caption = ? WHERE user_id = ? AND artwork_id = ?";
      pool.query(
        updateCaptionQuery,
        [caption, userId, artworkId],
        (updateError) => {
          if (updateError) {
            console.error(updateError);
            return res.status(500).send("Internal Server Error");
          }

          res.status(200).json({ message: "Caption updated successfully." });
        }
      );
    }
  );
};
