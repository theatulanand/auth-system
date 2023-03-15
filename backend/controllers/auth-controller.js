const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto')

class AuthController {
    async sendOtp(req, res) {

        const { phone } = req.body;

        if (!phone) {
            res.status(400).send({ "Message": "Phone number is requires" });
            return
        }

        const otp = await otpService.generateOtp();

        const ttl = 1000 * 60 * 2; // for 2 minutes

        const expires = Date.now() + ttl;

        const data = `${phone}.${otp}.${expires}`

        const hash = await hashService.hashOtp(data);

        await otpService.sendBySms(otp, phone)

        res.status(200).json({ hash: `${hash}.${expires}`, phone: phone });
    }

    async verifyOtp(req, res) {
        const { hash, otp, phone } = req.body

        if (!hash || !otp || !phone) {
            let message = {
                status: 400,
                message: "Invalid Data"
            }
            return res.status(400).json(message);
        }

        const [hashedOtp, expires] = hash.split(".");

        // checking otp validity
        if (Date.now() > +expires) {
            let message = {
                status: 400,
                message: "OTP Expired"
            }
            return res.status(400).json(message);
        }


        const data = `${phone}.${otp}.${expires}`;

        const isValid = otpService.verifyOtp(hashedOtp, data);

        if (!isValid) {
            let message = {
                status: 400,
                message: "Invalid OTP"
            }
            return res.status(400).json(message);
        }

        let user;

        try {
            user = await userService.findUser({ phone });
            if (!user) {
                user = await userService.createUser({ phone });
            }
        } catch (error) {
            console.log(error);
            let message = {
                status: 500,
                message: "DB Error"
            }
            return res.status(500).json(message);
        }

        //token
        const { accessToken, refreshToken } = tokenService.generateTokens({
            _id: user._id,
            activated: false
        });

        // storing refresh token
        try {
            await tokenService.storeRefreshToken(refreshToken, user._id);
        } catch (error) {
            console.log(error)
        }

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })

        const userDto = new UserDto(user);

        res.status(200).json({ user: userDto, auth: true })

    }

    async refresh(req, res) {
        // get refresh token from cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        // check if token is valid
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(
                refreshTokenFromCookie
            );
        } catch (err) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        // Check if token is in db
        try {
            const token = await tokenService.findRefreshToken(
                userData._id,
                refreshTokenFromCookie
            );
            if (!token) {
                return res.status(401).json({ message: 'Invalid token' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Internal error' });
        }
        // check if valid user
        const user = await userService.findUser({ _id: userData._id });
        if (!user) {
            return res.status(404).json({ message: 'No user' });
        }
        // Generate new tokens
        const { refreshToken, accessToken } = tokenService.generateTokens({
            _id: userData._id,
        });

        // Update refresh token
        try {
            await tokenService.updateRefreshToken(userData._id, refreshToken);
        } catch (err) {
            return res.status(500).json({ message: 'Internal error' });
        }
        // put in cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });
        // response
        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });
    }

    async logout(req, res) {
        const { refreshToken } = req.cookies;
        // delete refresh token from db
        await tokenService.removeToken(refreshToken);
        // delete cookies
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.json({ user: null, auth: false });
    }
}

module.exports = new AuthController()