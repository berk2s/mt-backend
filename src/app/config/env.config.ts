const dotenv = require('dotenv')
const path = require('path')

/**
 * Changes config file to the corresponding {NODE_ENV} value
 */
dotenv.config({
  path: path.resolve(__dirname, `../../../${process.env.NODE_ENV}.env`),
})
