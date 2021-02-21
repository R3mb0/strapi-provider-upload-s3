const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

module.exports = {
  init(config) {
    const { region } = config;

    const S3 = new S3Client({ region: region });

    return {
      async upload(file, customParams = {}) {
        const path = file.path ? `${file.path}/` : "";
        const keyName = `${path}${file.hash}${file.ext}`;

        const bucketName = config.params.Bucket;

        const uploadCommand = new PutObjectCommand({
          Bucket: bucketName,
          Key: keyName,
          Body: Buffer.from(file.buffer, "binary"),
          ContentType: file.nime,
          ...customParams,
        });

        try {
          await S3.send(uploadCommand);

          file.url = `https://${bucketName}.s3.${region}.amazonaws.com/${keyName}`;
        } catch (err) {
          console.error(err);
        }
      },
      async delete(file, customParams = {}) {
        const path = file.path ? `${file.path}/` : "";
        const keyName = `${path}${file.hash}${file.ext}`;
        const bucketName = config.params.Bucket;

        const deleteCommand = new DeleteObjectCommand({
          Key: keyName,
          Bucket: bucketName,
          ...customParams,
        });

        try {
          await S3.send(deleteCommand);
        } catch (err) {
          console.error(err);
        }
      },
    };
  },
};
