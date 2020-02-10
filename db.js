const mongoose = require('mongoose')

const mongoDB = 'mongodb://127.0.0.1/my_database'

mongoose.connect(mongoDB)

mongoose.Promise = global.Promise

const db = mongoose.connection

db.on('error', consoel.error.bind(console, 'MongoDB 连接错误: '))

// 定义一个模式
var Schema = mongoose.Schema

var SomeModelSchema = new Schema({
  a_string: String,
  a_date: Date
})

const SomeModel = mongoose.model('SomeModel', SomeModelSchema)