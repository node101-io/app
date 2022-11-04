const AWS = require('aws-sdk');

const s3 = new AWS.S3({	
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,	
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY	
});

module.exports = async (url, callback) => {
  return callback(null); // Temporarily stop all delete operations on DB

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,	
    Key: url.split('/')[url.split('/').length-1]
  };	
  
  s3.deleteObject(params, err => callback(err));
}
