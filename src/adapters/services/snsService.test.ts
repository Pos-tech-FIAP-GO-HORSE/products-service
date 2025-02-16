import { publishToSNS } from './snsService';
import AWS from 'aws-sdk';

jest.mock('aws-sdk', () => ({
  config: {
    update: jest.fn(),
  },
  SNS: jest.fn(() => ({
    publish: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  })),
}));

describe('publishToSNS', () => {
  const message = 'Test message';
  const topicArn = 'arn:aws:sns:us-east-1:123456789012:MyTopic';
  let snsMock: jest.Mocked<AWS.SNS>;

  beforeEach(() => {
    snsMock = new AWS.SNS() as jest.Mocked<AWS.SNS>;
    (snsMock.publish().promise as jest.Mock).mockResolvedValue({ MessageId: '12345' });
  });

  it('should publish a message to SNS', async () => {
    await publishToSNS(message, topicArn);

    expect(snsMock.publish).toHaveBeenCalledWith({
      Message: message,
      TopicArn: topicArn,
    });
  });

  it('should log an error if publishing fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (snsMock.publish().promise as jest.Mock).mockRejectedValue(new Error('Failed to publish'));

    await publishToSNS(message, topicArn);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error sending message to SNS: Error: Failed to publish'
    );

    consoleErrorSpy.mockRestore();
  });
});
