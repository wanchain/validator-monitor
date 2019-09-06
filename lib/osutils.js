const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/* load average usage for 1, 5, 15 minutes */
exports.getCpuLoad = function() {
  let loads = os.loadavg();
  let cpus = os.cpus().length;
  let load = (100 * loads[2] / cpus).toFixed(1); // use 15 minutes value
  return load;
}

exports.getMemInfo = function() {
  let total = os.totalmem();
  let used = total - os.freemem();
  let usage = (100 * used / total).toFixed(1);
  let totalGb = (total / Math.pow(1024, 3)).toFixed(1);
  let freeGb = ((total - used) / Math.pow(1024, 3)).toFixed(1);
  return {usage: usage, total: totalGb, free: freeGb};
}

const DISK_PATTERN = /^(\S+)\n?\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\n/mg

function createDiskInfo(head, values) {
  let info = {};
  head.forEach((h, i) => {
    info[h] = values[i]
  });
  return info;
}

function parseDfStdout(stdout) {
  let head, dfInfo = [];
  stdout.replace(DISK_PATTERN, function () {
    var values = Array.prototype.slice.call(arguments, 1, 7);
    if (arguments[7] === 0) {
      head = values;
      return;
    }
    dfInfo.push(createDiskInfo(head, values))
  })
  return dfInfo;
}

exports.getDiskInfo = async function(diskName) {
  const { stdout, stderr } = await exec('df -k');
  if (stderr) {
    console.error("get disk info failed: %O", stderr);
    return null;
  }    
  let disk = null, disks = parseDfStdout(stdout);
  for (let i = 0; i < disks.length; i++) {
    if (disks[i]['Mounted on'] === diskName) {
      disk = disks[i]
      break;
    }
  }
  if (disk) {
    let total = Math.ceil((disk['1K-blocks'] || disk['1024-blocks']) / 1024);
    let used = Math.ceil(disk.Used / 1024);
    let usage = (100 * used / total).toFixed(1);
    let totalGb = (total / 1024).toFixed(1);
    let freeGb = ((total - used) / 1024).toFixed(1);
    return {usage: usage, total: totalGb, free: freeGb};
  } else {
    return null;
  }
}