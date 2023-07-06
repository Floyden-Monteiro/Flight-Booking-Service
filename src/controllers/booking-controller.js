const { BookingService } = require('../services');
const { successResponse, ErrorResponse } = require('../utils/common');
const { StatusCodes } = require('http-status-codes');

const inMemDb = {};

async function createBooking(req, res) {
  try {
    const response = await BookingService.createBooking({
      flightId: req.body.flightId,
      userId: req.body.userId,
      noOfSeats: req.body.noOfSeats,
    });
    successResponse.data = response;
    return res.status(StatusCodes.OK).json(successResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

async function makePayment(req, res) {
  try {
    const idempotencyKey = req.headers['x-idempotency-key'];
    if (!idempotencyKey) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'idempotency key missing' });
    }
    if (inMemDb[idempotencyKey]) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Cannot retry on a successful payment' });
    }
    const response = await BookingService.makePayment({
      totalCost: req.body.totalCost,
      userId: req.body.userId,
      bookingId: req.body.bookingId,
    });
    inMemDb[idempotencyKey] = idempotencyKey;
    successResponse.data = response;
    return res.status(StatusCodes.OK).json(successResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}
module.exports = { createBooking, makePayment };
