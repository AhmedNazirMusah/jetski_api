const fs = require("fs/promises");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async ({ BucketName, Key, Body, contentType }) => {
  try {
    
    const command = new PutObjectCommand({
      Bucket: BucketName,
      Key: Key,
      Body: Body,
      ContentType: contentType,
    });
    const response = await s3.send(command);
    return response; // Return the S3 response
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("S3 upload failed");
  }
};

module.exports = { uploadToS3, s3 };
