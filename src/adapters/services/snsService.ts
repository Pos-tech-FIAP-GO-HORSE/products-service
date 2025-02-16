import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-east-1' });

const sns = new AWS.SNS();

export const publishToSNS = async (message: string, topicArn: string) => {
  const params = {
    Message: message,
    TopicArn: topicArn,
  };

  try {
    const result = await sns.publish(params).promise();
    console.log(`Message sent to SNS: ${result.MessageId}`);
  } catch (error) {
    console.error(`Error sending message to SNS: ${error}`);
  }
};
