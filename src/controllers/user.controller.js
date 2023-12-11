const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const pool = require("../database");

// sebenarnya will be better kalo pake sequelize ORM tp error wkt aku coba jd sementara query" gini aja dulu
// Get All Users
exports.getUsers = async (req, res) => {
  pool.query("SELECT * FROM Users", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(results);
    }
  });
};

// Get User by ID
exports.getUserById = async (req, res) => {
  const { user_id } = req.params;

  pool.query(
    "SELECT * FROM Users WHERE user_id = ?",
    [user_id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        if (results.length === 0) {
          return res.status(400).json({ msg: "User not found" });
        } else {
          res.status(200).json(results);
        }
      }
    }
  );
};

// Register User
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  console.log(username, email, password);
  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  const existingUserQuery = "SELECT * FROM Users WHERE email = ?";
  pool.query(existingUserQuery, [email], (error, results) => {
    console.log(results);
    if (results.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    } else if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }

    const hashedPassword = hashPassword(password);

    pool.query(
      "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (insertError, insertResults) => {
        if (insertError) {
          console.error(insertError);
          return res.status(500).send("Internal Server Error");
        } else {
          let response = {
            id: insertResults.insertId,
            username: username,
            email: email,
          };
          return res
            .status(200)
            .json({ msg: "User registered successfully", user: response });
        }
      }
    );
  });
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  pool.query(
    "SELECT * FROM Users WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        if (results.length === 0) {
          return res.status(400).json({ msg: "User does not exists" });
        }
        const isMatch = comparePassword(password, results[0].password);
        if (!isMatch)
          return res.status(400).json({ msg: "Invalid credentials" });

        let payload = {
          id: results[0].id,
          email: results[0].email,
          username: results[0].username,
        };

        const token = generateToken(payload);

        res.status(200).json({
          token,
          user: {
            id: results[0].id,
            email: results[0].email,
            username: results[0].username,
          },
        });
      }
    }
  );
};
