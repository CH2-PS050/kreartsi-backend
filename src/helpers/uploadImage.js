const config = require("../config");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: config.storage.projectId,
  // keyFilename: Buffer.from(config.storage.keyFileContent, "base64").toString(
  //   "utf-8"
  // ),
  keyFilename: config.storage.keyFilename,
});

const getBucket = (bucketName) => {
  return storage.bucket(bucketName);
};

const uploadImage = async (fileBuffer, fileName, bucketName) => {
  const bucket = getBucket(bucketName);

  const file = bucket.file(fileName);
  const stream = file.createWriteStream({
    metadata: {
      contentType: "image/jpeg",
    },
  });

  return new Promise((resolve, reject) => {
    stream.on("error", (err) => {
      console.error(err);
      reject("Error uploading image to Google Cloud Storage");
    });

    stream.on("finish", () => {
      const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      resolve(imageUrl);
    });

    stream.end(fileBuffer);
  });
};

module.exports = uploadImage;
