const { StatusCodes } = require('http-status-codes');
const { Booking } = require('../models');
const CurdRepository = require('./crud-repository');

class BookingRepository extends CurdRepository {
  constructor() {
    super(Booking);
  }
}

module.exports = BookingRepository;
