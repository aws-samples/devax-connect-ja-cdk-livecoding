import { Template } from 'aws-cdk-lib/assertions'
import { App } from 'aws-cdk-lib'
import { LiveCodingStack } from '../lib/live-coding-stack'

test('Snapshot test', () => {
    const app = new App()
    const stack = new LiveCodingStack(app, 'stack')
    const template = Template.fromStack(stack)

    expect(template.toJSON()).toMatchSnapshot()
})
