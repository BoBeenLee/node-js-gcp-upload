const { Storage } = require('@google-cloud/storage');

const GOOGLE_CLOUD_PROJECT_ID = "henesis-wallet-dev"; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = "./test.json"; // Replace with the path to the downloaded private key

const storage = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: GOOGLE_CLOUD_KEYFILE,
});

const bucketName = "test";
const mimetype = "application/json";
const content = JSON.stringify({ key: "test" });
const gcsFileName = "test";


const sendUploadToGCS = () => {
  return new Promise((resolve, reject) => {
    try {
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(gcsFileName);

      const writer = file.createWriteStream({
        metadata: {
          contentType: mimetype,
        },
      });

      writer.on("error", (error) => {
        console.log(error);
        reject(error);
      });
      writer.on("finish", () => {
        resolve({
          url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
        });
      });
      writer.end(content);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};


const main = async () => {
    const response = await sendUploadToGCS();
    console.log(response.url);
};

main();