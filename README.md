# Lopez Logging Gateway (AWS)

This system sets up an AWS Gateway for receiving logs from UI clients over HTTPS and pushing them into a kinesis stream, to be later processed by Logstash for ingestion to Elasticsearch.

The API grants anonymous access, so its possible for anyone to send logs to this endpoint. We may revisit this if it becomes an issue.

## Claudia

This application uses [Claudia](https://github.com/claudiajs/claudia) to generate the AWS services necessary for deployment.

### Installation

Install Claudia globally:

    npm install -g claudia

You should have the [AWS CLI](https://aws.amazon.com/cli/) installed and configured as well.

### Basic Usage

NOTE: For these commands to work, you will need to have proper AWS permissions for creating/updating AWS Gateway/Lambda.

You can create a new Gateway service:

    # Only run this once.
    claudia create --region us-east-1 --api-module server

Updating the existing Gateway code:

    claudia update
