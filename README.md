validator-monitor
========

A tool to monitor Wanchain validator running status, including:
<li>CPU Usage</li>
<li>Memory Usage</li>
<li>Disk Usage</li>
<li>Block Delay</li>
<li>Coinbase Balance</li>

## Prerequisites

Install [Node.js](https://nodejs.org) and [npm](http://npmjs.org).

## Install Dependencies

Execute the command in the validator-monitor directory:
```bash
npm install
```
## Configuration

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

All of above items are required, and should be set according to your email service provider. Please make sure that SMTP is enabled and authentication is correct.

<li>gwan group</li>

| item         | description |
| :---         | :---        |
| ipcPath      | required    |

The monitor communicates with gwan via IPC, so ipcPath should be set according to the gwan startup parameters. The default path is ~/.wanchain/gwan.ipc

<li>monitor group</li>

| item         | description |
| :---         | :---        |
| diskName     | default is the root directory ("/"), could be changed if gwan uses another disk or partition |
| reportName   | optional, used to identify different validators if you have more than one |
| reportHour   | default is 10 o'clock, when to send daily report, based on the monitor server clock |

<br>

<li>threshold group</li>

| item         | description |
| :---         | :---        |
| cpuUsage     | default is 80, in percentage |
| memoryUsage  | default is 80, in percentage |
| diskUsage    | default is 80, in percentage |
| blockDelay   | default is 60, in seconds, equivalent to 12 blocks |
| balance      | default is 1 WAN, used for gas of PoS transations |

## How to Test
Execute the command in the validator-monitor directory:
```bash
npm run test
```
It will check the email configuration. If correct, the receiver should receive an email with subject "Wanchain Validator Monitor".

## Start Monitor
The validator-monitor is scheduled by crontab, you need to create a task:
```bash
crontab -e
```
Insert one line at the end of the opened file and save:
<br/>
```bash
*/10 * * * * ~/validator-monitor/start.sh > ~/validator-monitor/validator-monitor-log 2>&1
```
You can check the task with:
```bash
crontab -l
```
NOTE: please replace "~/validator-monitor" with your own validator-monitor path.

## Report
Reports will be sent by email.
<br/><br/>
If there is any alert, an email will be sent immediately, with subject:
<br/>
ALERT - Wanchain Validator Monitor
<br/><br/>
Otherwise, a report email will be sent daily, with subject:
<br/>
NORMAL - Wanchain Validator Monitor
