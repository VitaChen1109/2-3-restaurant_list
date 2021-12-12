const express = require("express")
const router = express.Router()
const Restaurant = require("../../models/restaurant")

router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render("index", { restaurants }))
    .catch(err => console.log(err))
})


//搜尋餐廳
router.get('/search', (req, res) => {


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


// 匯出路由器
module.exports = router