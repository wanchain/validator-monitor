const config = require('../config');
const mailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = mailer.createTransport({
  host: config.email.smtpServer,
  port: config.email.smtpPort,
  secure: config.email.secure,
  auth: {
    user: config.email.authUser,
    pass: config.email.authPassword
  }
});

exports.Metric = function (alert, name, value, detail = "") {
  this.alert = alert;
  this.name = name;
  this.value = value;
  this.detail = detail;
}

exports.sendMail = async function (metrics) {
  let msg = buildMsg(metrics);
  // console.log(msg); // FOR TEST
  let to = config.email.receiver;
  let options = {
    from: config.email.authUser,
    to: to,
    subject: msg.subject,
    html: msg.bodyHtml
  };
  try {
    await transporter.sendMail(options);
    return true;
  } catch (err) {
    console.error("send mail to %s failed: %O", to, err);
    return false;
  }
}

function buildMsg(metrics) {
  let content = formatMetrics(metrics);
  let cssPath = path.resolve(__dirname, "../css/email.css");
  let css = fs.readFileSync(cssPath, "utf-8");
  let html = `
    </html>
      <head>
      ${css}
      </head>
      <body>  
        <table class='statistics'> 
          <tbody><tr>
            <th class='stats-col-id'>Number</th>
            <th class='stats-col-id'>Metric</th> 
            <th class='stats-col-status'>Value</th>
            <th class='stats-col-status'>Detail</th>
            </tr>
            ${content}
          </tbody>
        </table>
      </body>
    </html>
  `;
  let msg = {
    subject: formatSubject(metrics),
    bodyHtml: html
  };
  return msg;
}

function formatSubject(metrics) {
  for (let i in metrics) {
    let metric = metrics[i];
    if (metric.alert) {
      status = "ALERT";
      break;
    }
  }  
  let subject = status + " - Wanchain Validator Monitor";
  if (config.monitor.reportName) {
    subject += (" - " + config.monitor.reportName);
  }
  return subject;
}

function formatMetrics(metrics) {
  let index = 1; result = `<tr>`;
  metrics.forEach((metric) => {
    // index
    result += `<td class='stats-col-id'>${index}</td>`;
    // metric
    result += `<td class='stats-col-id'>${metric.name}</td>`;
    // value
    if (metric.alert) {
      result += `<td class='stats-col-status'><font color=red>${metric.value}</font></td>`;
    } else {
      result += `<td class='stats-col-status'>${metric.value}</td>`;
    }
    // detail
    result += `<td class='stats-col-status'>${metric.detail}</td>`;
    result += `</tr>`;
    index++;
  });
  return result;
}