// require packages used in the project
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 載入 mongoose
const Restaurant = require("./models/restaurant")
const bodyParser = require('body-parser')
const methodOverride = require("method-override")


mongoose.connect('mongodb://localhost/restaurant-list')

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


const app = express()
const port = 3000


//express template engine 
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Set static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

// routes setting
//瀏覽全部餐廳
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render("index", { restaurants }))
    .catch(err => console.log(err))
})

//新增餐廳頁面入口
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})


//新增餐廳
app.put('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

//搜尋餐廳
app.get('/search', (req, res) => {


  const keywords = req.query.keyword.toLowerCase().trim()

  Restaurant.find()
    .lean()
    .then(restaurants => {
      const filteredRestaurant = restaurants.filter(
        restaurant => restaurant.name.toLowerCase().includes(keywords) ||
          restaurant.category.toLowerCase().includes(keywords));

      res.render('index', { restaurants: filteredRestaurant, keywords: keywords });

    })

    .catch(err => console.log(err))
})


//瀏覽特定餐廳
app.get('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))


})


//編輯特定餐廳
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.put('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  const edit_res = req.body
  return Restaurant.findById(id).then(restaurant => {
    restaurant.name = edit_res.name;
    restaurant.category = edit_res.category;
    restaurant.image = edit_res.image;
    restaurant.location = edit_res.location;
    restaurant.phone = edit_res.phone;
    restaurant.google_map = edit_res.google_map;
    restaurant.rating = edit_res.rating;
    restaurant.description = edit_res.description;
    return restaurant.save()
  }).then(() => {
    res.redirect(`/restaurants/${id}`)
  }).catch(error => console.log(error))
})

// 刪除餐廳
app.delete('/restaurants/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})


// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})


