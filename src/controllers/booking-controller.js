const { BookingService } = require('../services');
const { successResponse, ErrorResponse } = require('../utils/common');
const { StatusCodes } = require('http-status-codes');

async function createBooking(req, res) {
  try {
    const response = await BookingService.createBooking({
      flightId: req.body.flightId,
      userId: req.body.userId,
      noOfSeats: req.body.noOfSeats,
    });
    successResponse.data = response;
    return res.status(StatusCodes.CREATED).json(successResponse);
  } catch (error) {
    
    ErrorResponse.error = error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

module.exports = { createBooking };
