# POCOCARE

## Installation

Download the Code from GitHub

```git
git clone theatulanand/pococare-assignment
```

## Server

Go to the backend directory.

```cmd
cd backend
```

Use the package manager npm to install the required packages.

```cmd
npm install
```

#### Create .env file.

```.env
HASH_SECRET = <Hash Secret>
F2SMS_AUTH = <Fast to SMS Auth> // to send otp -> go to https://docs.fast2sms.com/
DB_URL = <Mongodb URL>
JWT_ACCESS_TOKEN_SECRET = <Access Token>
JWT_REFRESH_TOKEN_SECRET = <Refresh Token>
BASE_URL = http://localhost:5500
```

#### Start Server

```cmd
npm start
```

or

```cmd
nodemon server.js
```

## Client

```cmd
cd frontend
```

Use the package manager npm or yarn to install the required packages.

```cmd
npm install
```

or

```cmd
yarn install
```

### Start Client

```cmd
npm start
```

or

```cmd
yarn start
```
