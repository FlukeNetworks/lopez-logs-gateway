const ApiBuilder = require('claudia-api-builder'),
  api = new ApiBuilder(),
  Promise = require('bluebird'),
  AWS = require('aws-sdk');

module.exports = api;

api.post('/logs', (request) => {
  const ip = request.context.sourceIp;
  const logs = JSON.parse(request.body).logs;

  logs.forEach(log => log.ip = ip);

  const records = logs.map(log => {
    return {
      Data: JSON.stringify(log),
      PartitionKey: log.url,
    };
  });

  const params = {
    Records: records,
    StreamName: 'lopez-logs-dev' // TODO: use an env variable?
  }

  const kinesis = new AWS.Kinesis();
  return new Promise((resolve, reject) => {
    kinesis.putRecords(params, (err, data) => {
      if (err) {
        console.error(err, err.stack);
        reject(err);
      } else {
        resolve(`Successfully enqueued ${logs.length} logs`); // TODO: what should our real response be?
      }
    });
  });
});
