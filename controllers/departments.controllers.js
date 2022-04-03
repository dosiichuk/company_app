const Department = require('../models/department.model');

exports.getAll = async (req, res) => {
  try {
    res.status(200).json(await Department.find());
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const dep = await Department.findOne().skip(rand);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.status(200).json(dep);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getOneById = async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.createOne = async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({ name });
    await newDepartment.save();
    res.json({ message: 'ok' });
  } catch (err) {
    res.status.json({ message: err });
  }
};

exports.updateOne = async (req, res) => {
  const { name } = req.body;
  try {
    await Department.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { name } },
      { new: true },
      (error, doc) => {
        if (error) res.status(404).json({ message: error });
        else res.status(200).json({ message: 'OK', data: { doc } });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.deletOne = async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (dep) {
      await Department.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK', data: { dep } });
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
