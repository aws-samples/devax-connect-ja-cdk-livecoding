import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { MemoApiRoute } from "./memo-api-route";

export class LiveCodingStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const itemsTable = new Table(this, "Table", {
      partitionKey: { type: AttributeType.STRING, name: "userId" },
      sortKey: { type: AttributeType.STRING, name: "memoId" },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const httpApi = new HttpApi(this, `ApiTest`);

    new MemoApiRoute(this, "GetRoute", {
      handlerEntry: "lambdas/get_handler/index.ts",
      method: HttpMethod.GET,
      itemsTable,
      httpApi,
    });

    new MemoApiRoute(this, "PostRoute", {
      handlerEntry: "lambdas/post_handler/index.ts",
      method: HttpMethod.POST,
      itemsTable,
      httpApi,
    });

    new CfnOutput(this, "ApiEndpoint", { value: httpApi.apiEndpoint });
  }
}
