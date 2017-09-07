const ApiBuilder = require('claudia-api-builder'),
  api = new ApiBuilder(),
  Promise = require('bluebird'),
  AWS = require('aws-sdk');

module.exports = api;

api.post('/logs', (request) => {
  const ip = request.context.sourceIp;
  const logs = JSON.parse(request.body).logs;

  if (!logs || logs.length === 0) {
    return Promise.resolve();
  }

  logs.forEach(log => log.ip = ip);

  const records = logs.map(log => {
    return {
      Data: JSON.stringify(log),
      PartitionKey: log.url,
    };
  });

  if (!request.env.kinesisStream) {
    return Promise.reject('Kinesis stream name is not configured');
  }

  const params = {
    Records: records,
    StreamName: request.env.kinesisStream
  }

  const kinesis = new AWS.Kinesis();
  return new Promise((resolve, reject) => {
    kinesis.putRecords(params, (err, data) => {
      if (err) {
        console.error(err, err.stack);
        reject(err);
      } else {
        const jsonResponse = { num_processed: logs.length };
        resolve(new api.ApiResponse(jsonResponse, {'Content-Type': 'application/json' }, 201));
      }
    });
  });
});

// This creates an 'env' variable in the request object given to lambda. This allows
// us to dynamically configure the lambda per environment.
api.addPostDeployConfig('kinesisStream', 'What is the Kinesis stream name?', 'kinesis-stream-name');
