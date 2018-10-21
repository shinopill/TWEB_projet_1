const { jsdom } = require('mocha-jsdom')
const { expect } = require('chai');
const {getUser} = require("../../client/js/app")
describe('my express app tests', () => {

  const dom = new jsdom(``, {
    url: "http://localhost:3000/",
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000
  });

  // Useless test, remove it and code your own tests here.
  it('should return the info on a user in github', () => {
    expect(!null).to.eql(getUser("shinopill"));
  });

  

});
