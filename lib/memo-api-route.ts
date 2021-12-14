import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export interface MemoApiRouteProps {
  handlerEntry: string;
  method: HttpMethod;
  itemsTable: ITable;
  httpApi: HttpApi;
}

// Constructの実装例
// 注意: 必ずしも今回の用途でこの抽象化が最適というわけではありません　あくまでも例としての実装になります
export class MemoApiRoute extends Construct {
  constructor(scope: Construct, id: string, props: MemoApiRouteProps) {
    super(scope, id);

    const { httpApi, itemsTable, method, handlerEntry } = props;

    const handler = new NodejsFunction(this, `Handler`, {
      entry: handlerEntry,
      environment: {
        TableName: itemsTable.tableName,
      },
    });

    // 通常のプログラミングと同様にif文による分岐も可能
    if (method == HttpMethod.GET) {
      itemsTable.grantReadData(handler);
    } else {
      itemsTable.grantWriteData(handler);
    }

    const integration = new HttpLambdaIntegration("Integration", handler);

    httpApi.addRoutes({
      path: "/memo",
      methods: [method],
      integration: integration,
    });
  }
}
