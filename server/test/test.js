require('jsdom-global')();
require('dotenv/config');

const { expect } = require('chai');
const Github = require('../src/Github');

const client = new Github({ token: process.env.OAUTH_TOKEN });

describe('my express app tests', () => {
  it('should return the not null when trying to get a repos info on github', () => {
    client.repos('shinopill').then((data) => {
      expect(null).to.not.eql(data);
    });  
  });

  it('should return the not null when trying to get anuser info on github', () => {
    expect(null).to.not.eql(client.user('shinopill'));
    client.user('shinopill').then((data) => {
      expect(null).to.not.eql(data);
    });  
  });

  it('should return the not null when trying to get an repo languages on github', () => {
    client.repoLanguages('shinopill').then((data) => {
      expect(null).to.not.eql(data);
    });  
  });

  it('should return the not null when trying to get an user language info on github', () => {
    client.userLanguages('shinopill').then((data) => {
      expect(null).to.not.eql(data);
    });  
  });

});
