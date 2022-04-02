const mongoose = require('mongoose');
const Department = require('../department.model.js');
const expect = require('chai').expect;

describe('Department', () => {
  it('should throw an error if no "name" arg', () => {
    const dep = new Department({}); // create new Department, but don't set `name` attr value

    dep.validate((err) => {
      expect(err.errors.name).to.exist;
    });
  });
  it('should throw an error if name is longer than 20 and shorter than 5 chars', () => {
    const cases = ['jkfn', 'jdsfieajrfieurifeurfiueirufherfheoihf'];
    for (let name of cases) {
      const dep = new Department({ name });
      dep.validate((err) => {
        expect(err.errors.name).to.exist;
      });
    }
  });
  it('should throw an error if "name" is not a string', () => {
    const cases = [{}, []];
    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate((err) => {
        expect(err.errors.name).to.exist;
      });
    }
  });
  it('should not throw error if name is consistent with schema', () => {
    const cases = ['jkfnff', 'rieurhifu78'];
    for (let name of cases) {
      const dep = new Department({ name });
      dep.validate((err) => {
        expect(err).to.equal(null);
      });
    }
  });
});
