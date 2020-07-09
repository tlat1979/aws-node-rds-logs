const AWS = require("aws-sdk");
const uuid = require('uuid');
AWS.config.update({ region: 'eu-west-1' });
const cloudWatch = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' });
const cw = new AWS.CloudWatch({ apiVersion: '2010-08-01' });
const rds = new AWS.RDS();
const ec2 = new AWS.EC2();

const SQL_GENERAL_LOG = '/aws/rds/instance/rds-mysql-logs/general';
const SQL_SLOW_QUERY_LOG = '/aws/rds/instance/rds-mysql-logs/slowquery';
const SQL_ERROR_LOG = '/aws/rds/instance/rds-mysql-logs/error';
const RDS_METRICS_LOG = 'RDSOSMetrics';
const RDS_METRICS_STREAM_NAME = 'db-FVULPU5GF6YHWCHB6I4A66QBQU';
const RDS_LOGS_STREAM_NAME = 'rds-mysql-logs';

// Not Really Working
var listCloudWatchMetrics = _ => {

    var params = {
        Dimensions: [
            {
                Name: 'InstanceId',
                Value: 'i-066f41e0b3b4e14fb'
            },
        ],
        MetricName: 'CPUUtilization',
        Namespace: 'AWS/Logs'
    };

    cw.listMetrics(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Metrics", JSON.stringify(data.Metrics));
        }
    });
}

var describeRDSInstances = _ => {
    var params = {
        DBInstanceIdentifier: 'rds-mysql-logs',
    };
    rds.describeDBInstances(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}

function describeEC2Instances() {

    ec2.describeInstances({}, function (err, data) {
        if (err) {
            console.error(err.toString());
        } else {
            var currentTime = new Date();
            console.log(currentTime.toString());

            for (var r = 0, rlen = data.Reservations.length; r < rlen; r++) {
                var reservation = data.Reservations[r];
                for (var i = 0, ilen = reservation.Instances.length; i < ilen; ++i) {
                    var instance = reservation.Instances[i];

                    var name = '';
                    for (var t = 0, tlen = instance.Tags.length; t < tlen; ++t) {
                        if (instance.Tags[t].Key === 'Name') {
                            name = instance.Tags[t].Value;
                        }
                    }
                    console.log('\t' + name + '\t' + instance.InstanceId + '\t' + instance.PublicIpAddress + '\t' + instance.InstanceType + '\t' + instance.ImageId + '\t' + instance.State.Name);
                }
            }
        }
    });
}

var getCloudWatchLogs = (logGroupName, logStreamName = RDS_LOGS_STREAM_NAME) => {

    var params = {
        logGroupName: logGroupName, /* required */
        logStreamName: logStreamName, /* required */
        //startTime: 1591697729,
        //endTime: 1594289742,
        limit: 10000,
        startFromHead: true,

    };
    cloudWatch.getLogEvents(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}

//listCloudWatchMetrics();

//describeEC2Instances();

//describeRDSInstances()

//getCloudWatchLogs(RDS_METRICS_LOG, RDS_METRICS_STREAM_NAME);
//getCloudWatchLogs(SQL_GENERAL_LOG)
getCloudWatchLogs(SQL_SLOW_QUERY_LOG);
//getCloudWatchLogs(SQL_ERROR_LOG);

