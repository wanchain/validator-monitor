const config = require('./config');
const os = require('./lib/osutils');
const wan = require('./lib/wanutils');
const notify = require('./lib/notify');
const BigNumber = require('bignumber.js');
const fs = require('fs');

const historyFile = "/tmp/validator-monitor-history";

const testMode = (process.argv[2] === "test");
console.log("%s run wanchain validator monitor, testMode=%s", new Date().toUTCString(), testMode);

monitor();

async function monitor() {
  let alert = false, metrics = [];
  let metricAlert;
  //report time
  metrics.push(new notify.Metric(false, "Report Time", new Date().toUTCString()));
  // cpu
  let cpu = os.getCpuLoad();
  metricAlert = (cpu >= config.threshold.cpuUsage);
  metrics.push(new notify.Metric(metricAlert, "CPU Usage", cpu + "%"));
  alert = alert || metricAlert;
  // mem
  let mem = os.getMemInfo();
  let detail = mem.total + " GB in total, " + mem.free + " GB free";
  metricAlert = (mem.usage >= config.threshold.memoryUsage);
  metrics.push(new notify.Metric(metricAlert, "Memory Usage", mem.usage + "%", detail));
  alert = alert || metricAlert;
  // disk
  let diskName = "Disk" + "(" + config.monitor.diskName + ")" + " Usage";
  let disk = await os.getDiskInfo(config.monitor.diskName);
  if (disk) {
    let detail = disk.total + " GB in total, " + disk.free + " GB free";
    metricAlert = (disk.usage >= config.threshold.diskUsage);
    metrics.push(new notify.Metric(metricAlert, diskName, disk.usage + "%", detail));
    alert = alert || metricAlert;
  } else {
    metrics.push(new notify.Metric(true, diskName, "unknown", "disk unavailable"));
    alert = true;
  }
  // block
  let block = await wan.getLatestBlock();
  if (block) {
    let unit = (block.age > 1)? " seconds" : " second"; 
    metricAlert = (block.age >= config.threshold.blockDelay);
    metrics.push(new notify.Metric(metricAlert, "Block Delay", block.age + unit, "block number: " + block.number));
    alert = alert || metricAlert;
  } else {
    metrics.push(new notify.Metric(true, "Block Delay", "unknown", "gwan unavailable"));
    alert = true;
  }
  // balance
  let account = await wan.getBalance();
  if (account) {
    let min = new BigNumber(config.threshold.balance);
    metricAlert = account.balance.isLessThan(min);
    metrics.push(new notify.Metric(metricAlert, "Balance", account.balance.toString(10) + " WAN", account.address));
    alert = alert || metricAlert;
  } else {
    metrics.push(new notify.Metric(true, "Balance", "unknown", "gwan unavailable"));
    alert = true;
  } 
  console.log(metrics);
  // report
  await report(alert, metrics);
  // close ipc
  wan.closeWeb3();
}

async function report(alert, metrics) {
  if (alert || testMode) {
    await notify.sendMail(metrics);
  } else { // daily
    let current = new Date();
    let date = current.getDate(); // 1 ~ 31
    let hour = current.getHours() // 0 ~ 23
    if (hour >= config.monitor.reportHour) {
      let history = readHistory();
      if (history.date != date) {
        let sent = await notify.sendMail(metrics);
        if (sent) {
          writeHistory(date);
        }
      }
    }
  }  
}

function readHistory() {
  try {
    if (fs.existsSync(historyFile)) {
      let data = fs.readFileSync(historyFile, 'utf8');
      return JSON.parse(data);
    } else {
      return {};
    }
  } catch (err) {
    console.error("read validator monitor history failed: %O", err);
    return {};
  }
}

function writeHistory(date) {
  const history = JSON.stringify({
    date: date,
  });
  try {
    fs.writeFileSync(historyFile, history);
  } catch (err) {
    console.error("write validator monitor history failed: %O", err);
  }
}
