validator-monitor
========

A tool to monitor wanchain validator, the metrics including:
<li>CPU usage</li>
<li>Memory usage</li>
<li>Disk usage</li>
<li>Block Delay</li>
<li>Balance</li>

## Prerequisites

Install [Node.js](https://nodejs.org) with [npm](http://npmjs.org).

## Install Dependencies

Enter the validator-monitor directory to execute command:
```bash
npm install
```
## Configure Parameters

The configure file is named config.js, it contains several goups and items:
<li>email group</li>

| item         | description |
| :---         | :---        |
| smtpServer   | required    |
| smtpPort     | required    |
| secure       | required    |
| authUser     | required    |
| authPassword | required    |
| receiver     | required    |

All of these items are required, should be set according to your email service provider, please ensure that SMTP is enabled and authentication is correct.

<li>gwan group</li>

| item         | description |
| :---         | :---        |
| ipcPath      | required    |

Validator-monitor and gwan communicate via IPC, ipcPath should be set according to the gwan running parameters.

<li>monitor group</li>

| item         | description |
| :---         | :---        |
| diskName     | default is root directory ("/"), should be changed if gwan uses other disk |
| reportName   | optional, used to identify emails sent from different validators if you have more than one |
| reportHour   | default is 10, the time (in hours) to send the daily report, based on the time zone of the gwan server |

<br>

<li>threshold group</li>

| item         | description |
| :---         | :---        |
| cpuUsage     | default is 80, in percentage |
| memoryUsage  | default is 80, in percentage |
| diskUsage    | default is 80, in percentage |
| blockDelay   | default is 60, in seconds, equivalent to 12 blocks |
| balance      | default is 1 WAN, as gas of pos transations |

## Test Working

Enter the validator-monitor directory to execute command:
```bash
npm run test
```
Then check your inbox of the email you configured in email.receiver, there should be a message with the subject "Wanchain Validator Monitor".

## Start Monitor
The validator-monitor is scheduled by crontab, first creating a task:
```bash
crontab -e
```
Insert one line to the end of the file and save:
<br/>
```bash
*/10 * * * * ~/validator-monitor/start.sh > /tmp/validator-monitor-log 2>&1
```
NOTE: please replace "~/validator-monitor" with your own validator-monitor path.

## Report
The report is sent by email.
<br/><br/>
If no alerts, the report will be sent daily, with subject:
<br/>
NORMAL - Wanchain Validator Monitor
<br/><br/>
Else, the alerts email is sent immediately, the subject is:
<br/>
ALERT - Wanchain Validator Monitor