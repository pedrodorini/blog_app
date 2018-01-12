const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost/blog_app', { useMongoClient: true })

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now() }
})

const Blog = mongoose.model('Blog', blogSchema)

app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log('Something went wrong!')
      console.log(err)
    } else {
      console.log(blogs)
      res.render('index', {blogs: blogs})
    }
  })
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})