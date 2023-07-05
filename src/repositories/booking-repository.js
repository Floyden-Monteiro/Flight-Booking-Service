const { StatusCodes } = require('http-status-codes');
const { Booking } = require('../models');
const CurdRepository = require('./crud-repository');

class BookingRepository extends CurdRepository {
  constructor() {
    super(Booking);
  }

  async createBooking(data, transaction) {
    const response = await Booking.create(data, { transaction: transaction });
    return response;
  }

  async get(data, transaction) {
    const response = await this.model.findByPk(data, {
      transaction: transaction,
    });
    if (!response) {
      throw new AppError(
        'Not able to found the resource',
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }

  async update(id, data, transaction) {
    const response = await this.model.update(
      data,
      {
        where: {
          id: id,
        },
      },
      { transaction: transaction }
    );

    if (response[0] == 0) {
      throw new AppError('resouce not found', StatusCodes.NOT_FOUND);
    }
    return response;
  }
}

module.exports = BookingRepository;
