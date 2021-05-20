/* Amplify Params - DO NOT EDIT
	API_PROTOESTATEGQLAPI_GRAPHQLAPIIDOUTPUT
	API_PROTOESTATEGQLAPI_USERTABLE_ARN
	API_PROTOESTATEGQLAPI_USERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

var aws = require('aws-sdk');
var ddb = new aws.DynamoDB();

exports.handler = async (event, context) => {

    let date = new Date();

    if (event.request.userAttributes.sub) {

        let params = {
            Item: {
                'id': { S: event.request.userAttributes.sub },
                '__typename': { S: 'User' },
                'name': { S: event.request.userAttributes.name },
                'email': { S: event.request.userAttributes.email },
                'phoneNumber': { S: event.request.userAttributes.phone_number },
                'createdAt': { S: date.toISOString() },
                'updatedAt': { S: date.toISOString() },
            },
            TableName: process.env.API_PROTOESTATEGQLAPI_USERTABLE_NAME
        };

        // Call DynamoDB
        try {
            await ddb.putItem(params).promise()
            console.log("Success, user created in DDB");
        } catch (err) {
            console.log("Error creating user in DDB", err);
        }

        console.log("Success: lambda executed correctly");
        context.done(null, event);

    } else {
        // Nothing to do, the user's email ID is unknown
        console.log("Error: No valid user id, nothing was written to DynamoDB");
        context.done(null, event);
    };
};