import { DynamoDB } from "aws-sdk";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

const ddb = new DynamoDB.DocumentClient();
const TableName = process.env.TableName!;

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  const userId = "guest"; // TODO: Authorizerから取得
  try {
    // DynamoDBのテーブルから、指定したuserIdに属するメモを取得
    const response = await ddb
      .query({
        TableName: TableName!,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        }, 
      })
      .promise();
  
    return {
      body: JSON.stringify(response.Items),
      statusCode: 200,
    };
  } catch (e) {
    return {
      // （デバッグ用）例外の情報をレスポンスで返す
      body: JSON.stringify(e),
      statusCode: 500,
    }
  }
};
