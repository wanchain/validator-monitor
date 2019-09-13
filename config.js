module.exports = {
    email: { // required 
        // sender, should be set according to your email service provider, make sure that SMTP is enabled and authentication is correct
        smtpServer: "",  // eg. smtp.office365.com
        smtpPort: 587,
        secure: false,
        authUser: "",    // eg. someone@hotmail.com
        authPassword: "",
        // receiver
        receiver: ""     // eg. someone@hotmail.com
    },
    gwan: {
        ipcPath: ""      // required, should be set according to the gwan startup parameters. eg. /home/user/.wanchain/gwan.ipc
    },
    monitor: {
        diskName: "/",   // should be changed if gwan uses another disk or partition
        reportName: "",  // optional, used to identify different validators if you have more than one
        reportHour: 10   // when to send daily report, based on the monitor server clock
    },
    threshold: {
        cpuUsage: 80,    // %
        memoryUsage: 80, // %
        diskUsage: 80,   // %
        blockDelay: 60,  // seconds
        balance: 1       // WAN, as gas of pos transations
    }
};