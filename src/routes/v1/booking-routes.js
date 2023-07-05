const express = require('express');

const router = express.Router();
const { BookingController } = require('../../controllers');

router.post('/', BookingController.createBooking);

module.exports = router;
