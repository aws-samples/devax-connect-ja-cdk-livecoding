import { Template, Match, Capture } from 'aws-cdk-lib/assertions'
import { App } from 'aws-cdk-lib'
import { LiveCodingStack } from '../lib/live-coding-stack'

test('Fine grained', () => {
    const app = new App()
    const stack = new LiveCodingStack(app, 'stack')
    const template = Template.fromStack(stack)

    // Functionが2つ作られていることを確認する
    template.resourceCountIs('AWS::Lambda::Function', 2)

    // Resource Matching & Retrieval
    // Propertiesが正しいことを確認する
    template.hasResourceProperties('AWS::DynamoDB::Table', {
        "AttributeDefinitions": [
            {
                "AttributeName": "userId",
                "AttributeType": "S",
            },
            {
                "AttributeName": "memoId",
                "AttributeType": "S",
            }
        ]
    })

    // Properties以外を確認したい場合はhasResource()を使う
    template.hasResource('AWS::DynamoDB::Table', {
        'UpdateReplacePolicy': 'Delete'
    })

    // 生成されるIAM Roleをすべて表示する
    console.log(template.findResources('AWS::IAM::Role'))

    // 存在しないことを確認する
    template.hasResourceProperties('AWS::DynamoDB::Table', {
        'DummyKey': Match.absent()
    })

    // 値をキャプチャーするにはCapture()を使う
    const capture = new Capture()
    template.hasResourceProperties('AWS::Lambda::Function', {
        Runtime: capture
    })

    console.log(capture.asString())
    // > nodejs14.x
})
