require('jsdom-global')();
const { expect } = require('chai');
const {Github} = require("../src/Github")
describe('my express app tests', () => {

  const client = new Github({ token: process.env.OAUTH_TOKEN})
  // Useless test, remove it and code your own tests here.
  it('should return the info on a user in github', () => {
    expect(!null).to.eql(client.repos("shinopill"));
  });

  

});
