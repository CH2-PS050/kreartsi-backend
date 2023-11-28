exports.getUsers = async (req, res) => {
    try {
      res.json("Get users API");
    } catch (error) {
      console.log(error);
    }
};