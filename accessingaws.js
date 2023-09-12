import { Auth } from 'aws-amplify';
import { S3 } from 'aws-sdk';

// AWS configuration
const awsConfig = {
  region: 'Asia Pacific (Singapore) ap-southeast-1', // Replace with your AWS region
  // Optionally, you can specify your AWS credentials here:
  accessKeyId: 'AKIA5ORYIF6P4A5O3PU7', // Replace with your AWS access key
  secretAccessKey: 'bzIOvTTgcmlmbP6N44UTHXi12XB1vou+vLZDkBlG', // Replace with your AWS secret key
};

// Initialize AWS Amplify
Auth.configure(awsConfig);

// Assume an IAM Role
async function assumeRoleAndAccessBucket() {
  try {
    // Sign in and get temporary IAM credentials
    const user = await Auth.signIn('awwauser', '1WtX4%!y'); // Replace with your authentication method

    // Assume an IAM role with permissions to access the access point and bucket
    const assumedRole = await user.assumeRole('arn:aws:iam::924609687455:user/awwauser'); // Replace 'role-arn' with the actual role ARN

    // Configure AWS SDK with the assumed role's credentials
    const s3 = new S3({
      region: 'Asia Pacific (Singapore) ap-southeast-1', // Replace with your AWS region
      credentials: {
        accessKeyId: assumedRole.accessKeyId,
        secretAccessKey: assumedRole.secretAccessKey,
        sessionToken: assumedRole.sessionToken,
      },
    });

    // Construct the URL for an object in the access point
    const objectUrl = `https://awwastory-1.s3-accesspoint.ap-southeast-1.amazonaws.com/object-key`;

    // Access the object
    const response = await fetch(objectUrl);
    const data = await response.text();

    // Process the object data as needed
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

assumeRoleAndAccessBucket();
