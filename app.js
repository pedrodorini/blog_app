const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost/blog_app', { useMongoClient: true })

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now() }
})

const Blog = mongoose.model('Blog', blogSchema)

app.get('/', (req, res) => {
  res.redirect('/blogs')
})
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
app.get('/blogs/new', (req, res) => {
  res.render('new')
})
app.post('/blogs', (req, res) => {
  let newBlog = {
    title: req.body.title,
    image: req.body.image,
    body: req.body.body
  }
  Blog.create(newBlog, (err, blog) => {
    if (err) {
      console.log(err)
    } else {
      console.log('New blog post added')
      console.log(blog)
      res.redirect('/blogs')
    }
  })
})
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log(err)
    } else {
      res.render('show', { blog: blog })
    }
  })
})
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      console.log(err)
    } else {
      res.render('edit', { blog: blog })
    }
  })
})
app.put('/blogs/:id', (req, res) => {
  let newData = {
    title: req.body.title,
    image: req.body.image,
    body: req.body.body
  }
  Blog.findByIdAndUpdate(req.params.id, newData, (err, blog) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect(`/blogs/${req.params.id}`)
    }
  })
})
app.listen(3000, () => {
  console.log('Server running on port 3000')
})