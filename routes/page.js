const express = require('express');
const {vistaInicio,vistaAdministrar, vistaControl}= require('../controllers/viewsControllers');
const router = express.Router();

router.get('/inicio',vistaInicio);
router.get('/administrar',vistaAdministrar);
router.get('/control',vistaControl);

module.exports = {
    routers:router
}
