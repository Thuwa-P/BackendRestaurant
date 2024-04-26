const express = require("express");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getTickets,
  createTicket,
  getTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticket");

router
  .route("/")
  .get(protect, authorize("admin"), getTickets)
  .post(protect, authorize("admin", "user"), createTicket);
router
  .route("/:id")
  .get(protect, authorize("admin", "user"), getTicket)
  .put(protect, authorize("admin"), updateTicket)
  .delete(protect, authorize("admin"), deleteTicket);

module.exports = router;
