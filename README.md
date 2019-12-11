# NodeJS basic structure example

## Introduction
This is a basic NodeJS architecture to help you build amazing things from scratch.

## Libraries in use
- express
- body-parser
- dontenv
- express-validator
- helmet
- jsonwebtoken
- mongodb

## Database
- Install MongoDB community sever see https://docs.mongodb.com/guides/server/install/
- mongodb configuration /etc/mongod.conf 
- start mongo: `sudo mongod --dbpath=/var/lib/mongodb`


## Installation & Usage
- Download the repo `git clone https://cuslenghi@bitbucket.org/cuslenghi/node-api-boilerplate.git`.
- Install dependencies `npm i`.
- Start the server `npm start` (this use nodemon).
- Build amazing APIs 🚀.


##### Mailer configurations
To complete the authentication flow properly you must configure the mailer. 
You can chose to configure an AWS SES service, or to configure your own gmail account as mailer. 
We recommend the later for local deployments. In the same mood, we do not recommended gmail mailer for prod environments.
```
EMAIL_ACCOUNT=email@gmail.com
EMAIL_SECRET=secret
EMAIL_FROM_ADDR=email@gmail.com
TEMPLATE_PATH=/path/to-template/
```

If you choose the gmail mailer, don't forget to activate that feature on gmail's admin panel.
Visit your [gmail admin panel](https://myaccount.google.com/lesssecureapps?pli=1) to enable the email account as an external mailer.


## Contributions
Feel free to collaborate with the project to improve it

## Authors
 **Joaquin Beceiro** 
 
 **Claudio Uslenghi** 
 
- [Bitbucket](https://bitbucket.org/cuslenghi/node-api-boilerplate/) 

