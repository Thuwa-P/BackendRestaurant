const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router();

// const reservationRouter = require("./reservations");
const {
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createRestaurant,
} = require("../controllers/restaurant");

// router.use("/:restaurantId/reservations/", reservationRouter);

router
  .route("/")
  .get(getRestaurants)
  .post(protect, authorize("admin"), createRestaurant);
router
  .route("/:id")
  .get(getRestaurant)
  .put(protect, authorize("admin"), updateRestaurant)
  .delete(protect, authorize("admin"), deleteRestaurant);

module.exports = router;
