const express = require("express")
const router = express.Router()
const Restaurant = require("../../models/restaurant")

//新增餐廳頁面入口
router.get('/new', (req, res) => {
  res.render('new')
})


//瀏覽特定餐廳
router.get('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))


})

//新增餐廳
router.post('/', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})



//編輯特定餐廳
router.get('/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:restaurant_id', (req, res) => {
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
router.delete('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})


module.exports = router