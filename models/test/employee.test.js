const mongoose = require('mongoose');
const expect = require('chai').expect;
const Employee = require('../employee.model');

describe('Employee', () => {
  it('should throw an error if no firstName, lastName or department arg', () => {
    const cases = [
      { lastName: 'Doe', department: 'Management' },
      { firstName: 'Doe', department: 'Management' },
      { lastName: 'Doe', firstName: 'Management' },
      {},
      { firstName: 'John' },
    ];
    for (let item of cases) {
      const employee = new Employee({ ...item });
      employee.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });
  it('should throw an error if firstName, lastName or department is not a string', () => {
    const cases = [
      { lastName: [], department: 'Management' },
      { firstName: 'Doe', department: {} },
      { lastName: 'Doe', firstName: () => {} },
      {},
      { firstName: null },
    ];
    for (let item of cases) {
      const employee = new Employee({ ...item });

      employee.validate((err) => {
        expect(err.errors).to.exist;
      });
    }
  });
  it('should not throw error if entry is consistent with schema', () => {
    const cases = [
      { firstName: 'John', lastName: 'Doe', department: 'Management' },
      { firstName: 'Amanda', lastName: 'Doe', department: 'Fconomy' },
    ];
    for (let item of cases) {
      const employee = new Employee(item);
      employee.validate((err) => {
        expect(err).to.not.exist;
      });
    }
  });
});
