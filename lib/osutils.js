const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/* load average usage for 1, 5, 15 minutes */
exports.getCpuLoad = function() {
  let loads = os.loadavg();
  let cpus = os.cpus().length;
  let load = (100 * loads[2] / cpus).toFixed(1); // use 15 minutes value
  return {load: load, cpus: cpus};
}

/* mem info */

const MEM_PATTERN = /^(\S*)\n?\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\n/mg

function createInfo(head, values) {
  let info = {};
  head.forEach((h, i) => {
    info[h] = values[i]
  });
  return info;
}

function parseFreeStdout(stdout) {
  let head, freeInfo = [];
  stdout.replace(MEM_PATTERN, function () {
    var values = Array.prototype.slice.call(arguments, 1, 8);
    if (arguments[8] === 0) {
      head = values;
      return;
    }
    freeInfo.push(createInfo(head, values))
  })
  return freeInfo;
}

exports.getMemInfo = async function() {
  const { stdout, stderr } = await exec('free -m');
  if (stderr) {
    console.error("get mem info failed: %O", stderr);
    return null;
  }
  let mem = null, mems = parseFreeStdout(stdout);
  for (let i = 0; i < mems.length; i++) {
    if (mems[i][''] === 'Mem:') {
      mem = mems[i];
      break;
    }
  }
  if (mem) {
    let total = mem.total, used, free;
    let avail = mem.available;
    if (avail != undefined) { // new version linux
      used = total - avail;
      free = avail;
    } else { // old version linux
      used = mem.used;
      free = total - used;
    }
    let usage = (100 * used / total).toFixed(1);
    let totalGb = (total / 1024).toFixed(1);
    let freeGb = (free / 1024).toFixed(1);
    return {usage: usage, total: totalGb, free: freeGb};
  } else {
    return null;
  }
}

/* disk info */

const DISK_PATTERN = /^(\S+)\n?\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+?)\n/mg

function parseDfStdout(stdout) {
  let head, dfInfo = [];
  stdout.replace(DISK_PATTERN, function () {
    var values = Array.prototype.slice.call(arguments, 1, 7);
    if (arguments[7] === 0) {
      head = values;
      return;
    }
    dfInfo.push(createInfo(head, values))
  })
  return dfInfo;
}

exports.getDiskInfo = async function(diskName) {
  const { stdout, stderr } = await exec('df -m');
  if (stderr) {
    console.error("get disk info failed: %O", stderr);
    return null;
  }    
  let disk = null, disks = parseDfStdout(stdout);
  for (let i = 0; i < disks.length; i++) {
    if (disks[i]['Mounted on'] === diskName) {
      disk = disks[i];
      break;
    }
  }
  if (disk) {
    let total = disk['1M-blocks'];
    let used = disk.Used;
    let usage = (100 * used / total).toFixed(1);
    let totalGb = (total / 1024).toFixed(1);
    let freeGb = ((total - used) / 1024).toFixed(1);
    return {usage: usage, total: totalGb, free: freeGb};
  } else {
    return null;
  }
}