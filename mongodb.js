const { ENVIRONMENT, PORT, URL, DB_NAME } = require('./config');


let User = require('./model/user')


User.find({
    email: 'pepe@gmail.com'   // search query
  })
  .then(doc => {
    console.log(doc)
  })
  .catch(err => {
    console.error(err)
  })
