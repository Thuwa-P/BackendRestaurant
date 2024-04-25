const mongoose = require("mongoose");

const RestaurantsSchema = new mongoose.Schema(
  //name, address, telephone number, and open-close time.
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    district: {
      type: String,
      required: [true, "Please add a district"],
    },
    province: {
      type: String,
      required: [true, "Please add a province"],
    },
    postalcode: {
      type: String,
      required: [true, "Please add a postal code"],
      maxlength: [5, "Postal Code cannot be more than 5 digits"],
    },
    tel: {
      type: String,
    },
    openTime: {
      type: String,
      required: [true, "Please add a open time"],

      match: [
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please input correct time format (hh:MM)",
      ],
    },
    closeTime: {
      type: String,
      required: [true, "Please add a close time"],
      match: [
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please input correct time format (hh:MM)",
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// RestaurantsSchema.pre(
//   "deleteOne",
//   {
//     document: true,
//     query: false,
//   },
//   async function (next) {
//     console.log(`Reservations being removed from restaurant ${this._id}`);
//     await this.model("Reservation").deleteMany({ hospital: this._id });
//     next();
//   }
// );

RestaurantsSchema.virtual("reservations", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "restaurant",
  justOne: false,
});

module.exports = mongoose.model("Restaurant", RestaurantsSchema);
