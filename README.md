validator-monitor
========

A tool to monitor wanchain validator, the metrics including:
<li>CPU usage</li>
<li>Memory usage</li>
<li>Disk usage</li>
<li>Block Delay</li>
<li>Balance</li>

## Prerequisites

Install [Node.js](https://nodejs.org) (containing [npm](http://npmjs.org)).

## Install Dependencies

Execute the command in the validator-monitor directory:
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

The validator-monitor communicates with gwan via IPC, ipcPath should be set according to the gwan running parameters.

<li>monitor group</li>

| item         | description |
| :---         | :---        |
| diskName     | default is the root directory ("/"), should be changed if gwan uses other disk |
| reportName   | optional, used to identify emails from different validators if you have more than one |
| reportHour   | default is 10, the time (in hours) to send daily report, based on the time zone of the gwan server |

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

Execute the command in the validator-monitor directory:
```bash
npm run test
```
Then check the inbox of the email configured by email.receiver, there should be a message with subject "Wanchain Validator Monitor".

## Start Monitor
The validator-monitor is scheduled by crontab, you need to create a task:
```bash
crontab -e
```
Insert one line at the end of the opened file and save:
<br/>
```bash
*/10 * * * * ~/validator-monitor/start.sh > /tmp/validator-monitor-log 2>&1
```
You can check the task with:
```bash
crontab -l
```
NOTE: please replace "~/validator-monitor" with your own validator-monitor path.

## The Reports
Reports will be sent by email.
<br/><br/>
If there are any alert, a alerts email is sent immediately, with subject:
<br/>
ALERT - Wanchain Validator Monitor
<br/><br/>
Else, a report email will be sent daily, the subject is:
<br/>
NORMAL - Wanchain Validator Monitor