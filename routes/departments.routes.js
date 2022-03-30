const express = require('express');
const router = express.Router();
const DepartmentController = require('../controllers/departments.controllers');

router.get('/departments', DepartmentController.getAll);

router.get('/departments/random', DepartmentController.getRandom);

router.get('/departments/:id', DepartmentController.getOneById);

router.post('/departments', DepartmentController.createOne);

router.put('/departments/:id', DepartmentController.updateOne);

router.delete('/departments/:id', DepartmentController.deletOne);

module.exports = router;
