import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

const ddb = new DynamoDB.DocumentClient();
const TableName = process.env.TableName!;

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    const message = JSON.parse(event.body!).message; // {"message": "hello"} のようなJSONを想定
    const userId = 'guest';
    const memoId = uuidv4();
    await ddb
      .put({
        TableName,
        Item: {
          userId,
          memoId,
          message,
        },
      })
      .promise();

    return {
      body: JSON.stringify({ memoId }),
      statusCode: 201,
    };
  } catch (e) {
    return {
      body: JSON.stringify(e),
      statusCode: 500,
    };
  }
};
