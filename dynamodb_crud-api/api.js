const db = require("./db");

const {
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  ScanCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const getPost = async (event) => {
  const res = { statusCode: 200 };

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ postId: event.pathParameters.postId }), // O marshall converte o JSON para o dynamodb reconhecer
    };

    const { Item } = await db.send(new GetItemCommand(params));

    console.log({ Item });

    res.body = JSON.stringify({
      message: "Successfuly retrivied post.",
      data: Item ? unmarshall(Item) : {},
      rawData: Item,
    });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.body = JSON.stringify({
      message: "Failed to get post.",
      errorMsg: err.message,
      errorStack: err.stack,
    });
  }
  return res;
};

const createPost = async (event) => {
  const res = { statusCode: 200 };

  try {
    const body = JSON.parse(event.body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(body || {}),
    };

    const result = await db.send(new PutItemCommand(params));

    console.log(result);

    res.body = JSON.stringify({
      message: "Successfuly created post.",
      result,
    });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.body = JSON.stringify({
      message: "Failed to create post.",
      errorMsg: err.message,
      errorStack: err.stack,
    });
  }
  return res;
};

const updatePost = async (event) => {
  const res = { statusCode: 200 };

  try {
    const body = JSON.parse(event.body);
    const objKeys = Object.keys(body);
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ postId: event.pathParameters.postId }),
      UpdateExpression: `SET ${objKeys
        .map((_, index) => `#key${index} = :value${index}`)
        .join(", ")}`,
      ExpressionAttributeNames: objKeys.reduce(
        (acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
        }),
        {}
      ),
      ExpressionAttributeValues: marshall(
        objKeys.reduce(
          (acc, key, index) => ({
            ...acc,
            [`:value${index}`]: body[key],
          }),
          {}
        )
      ),
    };

    const result = await db.send(new UpdateItemCommand(params));

    console.log(result);

    res.body = JSON.stringify({
      message: "Successfuly updated post.",
      result,
    });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.body = JSON.stringify({
      message: "Failed to update post.",
      errorMsg: err.message,
      errorStack: err.stack,
    });
  }
  return res;
};

const deletePost = async (event) => {
  const res = { statusCode: 200 };

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ postId: event.pathParameters.postId }),
    };

    const result = await db.send(new DeleteItemCommand(params));

    console.log(result);

    res.body = JSON.stringify({
      message: "Successfuly deleted post.",
      result,
    });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.body = JSON.stringify({
      message: "Failed to delete post.",
      errorMsg: err.message,
      errorStack: err.stack,
    });
  }
  return res;
};

const getAllPosts = async (event) => {
  const res = { statusCode: 200 };

  try {
    const { Items } = await db.send(
      new ScanCommand({ TableName: process.env.DYNAMODB_TABLE_NAME })
    );

    console.log({ Items });

    res.body = JSON.stringify({
      message: "Successfuly retrivied all posts.",
      data: Items.map((item) => unmarshall(item)),
      Items,
    });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.body = JSON.stringify({
      message: "Failed to retrieve posts.",
      errorMsg: err.message,
      errorStack: err.stack,
    });
  }
  return res;
};

module.exports = {
  getPost,
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
};
