const mongoose = require('mongoose');
const expect = require('chai').expect;
const chai = require('chai');

const Employee = require('../employee.model');
const Department = require('../department.model');

describe('Employee', () => {
  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
  });
  describe('Reading data', () => {
    before(async () => {
      const testEmployeeOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'Marketing',
      });
      await testEmployeeOne.save();

      const testEmployeeTwo = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'IT',
      });
      await testEmployeeTwo.save();
    });
    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });
    it('should return a proper document by "name" with "findOne" method', async () => {
      const employee = await Employee.findOne({
        firstName: 'Amanda',
        lastName: 'Doe',
      });
      const expectedFirstName = 'Amanda';
      const expectedLastName = 'Doe';
      expect(employee.firstName).to.be.equal(expectedFirstName);
      expect(employee.lastName).to.be.equal(expectedLastName);
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'Marketing',
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmployeeOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'Marketing',
      });
      await testEmployeeOne.save();

      const testEmployeeTwo = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'IT',
      });
      await testEmployeeTwo.save();
    });
    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        { lastName: 'Doe' },
        { $set: { lastName: 'Doug' } }
      );
      const updatedEmployee = await Employee.findOne({
        lastName: 'Doug',
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ lastName: 'Doe' });
      employee.lastName = 'Doug';
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        lastName: 'Doug',
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany(
        { lastName: 'Doe' },
        { $set: { lastName: 'Doug' } }
      );
      const updatedEmployees = await Employee.find({ lastName: 'Doug' });
      const expectedLength = 2;
      expect(updatedEmployees.length).to.be.equal(expectedLength);
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmployeeOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'Marketing',
      });
      await testEmployeeOne.save();

      const testEmployeeTwo = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'IT',
      });
      await testEmployeeTwo.save();
    });
    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'John' });
      const employee = await Employee.findOne({ firstName: 'John' });
      expect(employee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ department: 'Marketing' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({
        department: 'Marketing',
      });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany({});
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
  describe('Populating data from cross-referenced collections', () => {
    beforeEach(async () => {
      chai.should();
      const testDepartmentOne = new Department({
        name: 'Technology',
      });
      await testDepartmentOne.save();
      const testDepartmentTwo = new Department({
        name: 'Marketing',
      });
      await testDepartmentTwo.save();
      const testEmployeeOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: testDepartmentOne._id,
      });
      await testEmployeeOne.save();

      const testEmployeeTwo = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: testDepartmentTwo._id,
      });
      await testEmployeeTwo.save();
    });
    it('should properly populate the department field with data from Department collection', async () => {
      const employees = await Employee.find().populate('department');
      employees.forEach((employee) => {
        employee.department.should.be.a('Object');
        expect(employee.department).to.have.property('name');
        expect(employee.department).to.have.property('id');
      });
    });
    afterEach(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });
});
