const express = require('express');

const router = express.Router();
const { infoController } = require('../../controllers');
const bookingRoute = require('./booking-routes');

router.get('/info', infoController);

router.use('/bookings', bookingRoute);

module.exports = router;
