const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log(event, context);

    const ip = event.requestContext.identity.sourceIp;
    const payload = JSON.parse(context.body);
    const logs = payload.logs;

    logs.forEach(log => log.ip = ip);

    const kinesis = new AWS.Kinesis();
    kinesis.putRecords(logs, (err, data) => {
      if (err) {
        console.error(err, err.stack);
        callback(err);
      } else {
        callback(null, 'Success enqueued ' + logs.length + ' logs');
      }
    });
};
