import { publishToSNS } from './snsService';
import AWS from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const SNS = {
    publish: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return { SNS: jest.fn(() => SNS) };
});

describe('publishToSNS', () => {
  const message = 'Test message';
  const topicArn = 'arn:aws:sns:us-east-1:123456789012:MyTopic';

  it('should publish a message to SNS', async () => {
    const snsMock = new AWS.SNS();
    snsMock.promise.mockResolvedValue({ MessageId: '12345' });

    await publishToSNS(message, topicArn);

    expect(snsMock.publish).toHaveBeenCalledWith({
      Message: message,
      TopicArn: topicArn,
    });
    expect(snsMock.promise).toHaveBeenCalled();
  });

  it('should log an error if publishing fails', async () => {
    const snsMock = new AWS.SNS();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    snsMock.promise.mockRejectedValue(new Error('Failed to publish'));

    await publishToSNS(message, topicArn);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error sending message to SNS: Error: Failed to publish'
    );

    consoleErrorSpy.mockRestore();
  });
});
