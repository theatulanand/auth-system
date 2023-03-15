const crypto = require('crypto');
const unirest = require('unirest');
const hashService = require('./hash-service')

class OtpService {
    async generateOtp() {
        const otp = crypto.randomInt(1000, 9999);
        return otp
    }

    async sendBySms(otp, phone) {
        console.log(otp, phone)
        var unirest = require("unirest");

        var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

        req.headers({
            "authorization": process.env.F2SMS_AUTH
        });

        req.form({
            "variables_values": otp,
            "route": "otp",
            "numbers": phone,
        });


        req.end(function (res) {
            //console.log(res.body)
        });

    }

    verifyOtp(hashedOtp, data) {
        const computedOtp = hashService.hashOtp(data);
        return computedOtp === hashedOtp
    }
}

module.exports = new OtpService();