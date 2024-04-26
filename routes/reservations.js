const express = require("express");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");
const {
  getReservations,
  addReservation,
  getReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservations");

router
  .route("/")
  .get(protect, getReservations)
  .post(protect, authorize("admin", "user"), addReservation);

router
  .route("/:id")
  .get(protect, getReservation)
  .put(protect, authorize("admin", "user"), updateReservation)
  .delete(protect, authorize("admin", "user"), deleteReservation);

module.exports = router;
