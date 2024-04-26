const Ticket = require("../models/Ticket");

//@desc     Get all tickets
//@route    GET /api/v1/tickets
//@access   Public
exports.getTickets = async (req, res, next) => {
  try {
    let query;

    const reqQuery = { ...req.query };
    //Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    query = Ticket.find(JSON.parse(queryStr)).populate({
      path: "user",
      select: "name email telephone",
    });

    //Select
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields).populate({
        path: "user",
        select: "name email telephone",
      });
    }

    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt").populate({
        path: "user",
        select: "name email telephone",
      });
    }
    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Ticket.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //Executing query
    const tickets = await query;
    console.log(queryStr);

    //Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: tickets.length,
      pagination,
      data: tickets,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
};

//@desc   Get Single ticket
//@route  GET /api/v1/ticket/:id
//@access Public
exports.getTicket = async (req, res, next) => {
  try {
    const userTickets = await Ticket.find({ user: req.user.id });

    const hasTicket = userTickets.some((ticket) =>
      ticket._id.equals(req.params.id)
    );
    if (!hasTicket && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `You are not authorize to view this ticket.`,
      });
    }
    const ticket = await Ticket.findById(req.params.id).populate({
      path: "user",
      select: "name email telephone",
    });
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `No ticket with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

//@desc   Create Ticket
//@route  POST /api/v1/tickets/
//@access Public
exports.createTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.create(req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//@desc   Update Ticket
//@route  PUT /api/v1/tickets/:id
//@access Private
exports.updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(ticket);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `No ticket with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//@desc   Delete Ticket
//@route  DELETE /api/v1/tickets/:id
//@access Private
exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `No ticket with the id of ${req.params.id}`,
      });
    }
    await ticket.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
