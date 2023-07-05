const axios = require('axios');
const { ServerConfig } = require('../config');
const { BookingRepository } = require('../repositories');
const db = require('../models');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

const bookingRepository = new BookingRepository();

async function createBooking(data) {
  // return new Promise((resolve, reject) => {
  //   const result = db.sequelize.transaction(async function bookingImpl(t) {
  //     const flight = await axios.get(
  //       `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
  //     );

  //     const flightData = flight.data.data;

  //     if (data.noOfSeats > flightData.totalSeats) {
  //       reject(
  //         new AppError('Not enough seats available ', StatusCodes.BAD_REQUEST)
  //       );
  //     }
  //     resolve(true);
  //   });
  // });

  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios.get(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
    );
    const flightData = flight.data.data;
    if (data.noOfSeats > flightData.totalSeats) {
      throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
    }
    const totalBillingAmount = data.noOfSeats * flightData.price;
    const bookingPayload = { ...data, totalCost: totalBillingAmount };
    const booking = await bookingRepository.createBooking(
      bookingPayload,
      transaction
    );

    await axios.patch(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
      {
        seats: data.noOfSeats,
      }
    );
  
    await transaction.commit();
    return booking;
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  createBooking,
};
