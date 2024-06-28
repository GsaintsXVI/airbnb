const mongoose = require('mongoose');
const {Schema} = mongoose

const bookingSchema = new Schema({
   place: {type: mongoose.Schema.Types.ObjectId, ref:'Place'},
   checkIn: {type: Date, required: true},
   checkOut: {type: Date, required: true},
   numberOfGuests: {type: Number, required: true},
   name: {type: String, required: true},
   phone: {type: String, required: true},
   email: {type: String, required: true},
});

const PlaceModel = mongoose.model('Booking', placeSchema);
module.exports = PlaceModel