"use strict";

const AWS = require("aws-sdk");

const options = process.env.LOCAL
  ? { region: "localhost", endpoint: "http://localhost:8082" }
  : {};

// Initialize
const dynamo = new AWS.DynamoDB.DocumentClient(options);
// Get table name from environmental varialbe (serverless.yml)
const tableName = process.env.tableName;

// Get all data function
module.exports.getAll = async () => {
  const params = {
    TableName: tableName,
  };
  try {
    // Access with scan
    const result = await dynamo.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
};

// Get specific data function
module.exports.get = async (event) => {
  const { id } = event;

  const params = {
    TableName: tableName,
    Key: { id },
  };

  try {
    const result = await dynamo.get(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
};

// Register specific data function
module.exports.put = async (event) => {
  const id = String(Date.now());
  const { message } = event;

  const params = {
    TableName: tableName,
    Item: { id, message },
  };

  try {
    const result = await dynamo.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
};

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: event,
      },
      null,
      2
    ),
  };
};

// module.exports.query = async event => {
//   const { id } = event;

//   const params = {
//     TableName: tableName,
//     KeyConditionExpression: 'id = :id',
//     ExpressionAttributeValues: { ':id': id },
//   };

//   try {
//     const result = await dynamo.query(params).promise();
//     return {
//       statusCode: 200,
//       body: JSON.stringify(result.Items),
//     };
//   } catch (error) {
//     return {
//       statusCode: error.statusCode,
//       body: error.message,
//     };
//   }
// };
