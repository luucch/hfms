import cryptoRandomString from 'crypto-random-string';

const randomString = () =>
  cryptoRandomString({ length: 10, type: 'alphanumeric' });
export default randomString;
