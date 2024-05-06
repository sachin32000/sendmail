const express = require('express');
const { getStudents } = require('../controller/studentController');

const router = express.Router();

//GET All students List

router.get('/getAll ', getStudents);

module.exports = router;