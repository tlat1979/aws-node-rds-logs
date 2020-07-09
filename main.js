var request = {
    "StartTime": 1518867432,
    "EndTime": 1518868032,
    "MetricDataQueries": [
        {
            "Id": "m1",
            "MetricStat": {
                "Metric": {
                    "Namespace": "AWS/EC2",
                    "MetricName": "NetworkOut",
                    "Dimensions": [
                        {
                            "Name": "InstanceId",
                            "Value": "i-066f41e0b3b4e14fb"
                        }
                    ]
                },
                "Period": 300,
                "Stat": "Average",
                "Unit": "Bytes"
            }
        }
    ]
};

var main = _ => {

    var AWS = require("aws-sdk");
    var uuid = require('uuid');
    var cw = new AWS.CloudWatch({ apiVersion: '2010-08-01' });
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
    var AWS = require("aws-sdk");
    var uuid = require('uuid');
    AWS.config.update({ region: 'eu-west-1' });
    var rds = new AWS.RDS();

    var params = {
        DBInstanceIdentifier: 'rds-mysql-logs',
    };
    rds.describeDBInstances(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}

function describeEC2Instances() {

    var AWS = require("aws-sdk");
    var uuid = require('uuid');
    AWS.config.update({ region: 'eu-west-1' });
    var ec2 = new AWS.EC2();

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

var getCloudWatchLogs = (logGroupName, logStreamName) => {
    var AWS = require("aws-sdk");
    AWS.config.update({ region: 'eu-west-1' });
    var cloudwatchlogs = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' });

    var params = {
        logGroupName: logGroupName, /* required */
        logStreamName: logStreamName, /* required */
        //startTime: 1591697729,
        //endTime: 1594289742,
        limit: 10000,
        startFromHead: true,

    };
    cloudwatchlogs.getLogEvents(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}

//main();

//printStatuses();

//escribeRDSInstances()

//getCloudWatchLogs('RDSOSMetrics', 'db-FVULPU5GF6YHWCHB6I4A66QBQU');
//getCloudWatchLogs('/aws/rds/instance/rds-mysql-logs/general', 'rds-mysql-logs')
getCloudWatchLogs('/aws/rds/instance/rds-mysql-logs/slowquery', 'rds-mysql-logs')

