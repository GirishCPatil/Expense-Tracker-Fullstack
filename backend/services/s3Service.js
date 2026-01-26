const AWS = require('aws-sdk');

exports.uploadToS3 = async (data, filename, contentType) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    Body: data,
    ContentType: contentType
  };

  await s3.upload(params).promise();

  const signedUrl = s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    Expires: 300
  });

  return signedUrl;
};
