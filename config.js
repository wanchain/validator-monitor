module.exports = {
    email: { // required 
        // sender, should be set according to your email service provider
        smtpServer: "",  // eg. smtp.office365.com
        smtpPort: 25,
        secure: false,
        authUser: "",    // eg. someone@hotmail.com
        authPassword: "",
        // receiver
        receiver: ""     // eg. someone@hotmail.com
    },
    gwan: {
        ipcPath: ""      // required, should be set according to the gwan running parameters. eg. ~/gwan/gwan.ipc
    },
    monitor: {
        diskName: "/",   // should be changed if gwan uses other disk
        reportName: "",  // optional, used to identify emails sent from different validators if you have more than one
        reportHour: "10" // the time (in hours) to send the daily report, based on the time zone of the gwan server
    },
    threshold: {
        cpuUsage: 80,    // %
        memoryUsage: 80, // %
        diskUsage: 80,   // %
        blockDelay: 60,  // seconds
        balance: 1       // WAN, as gas of pos transations
    }
};