const keys = require("../../config/keys");
const { Buffer } = require('safe-buffer');
const Keygrip = require('keygrip');

const keygrip = new Keygrip([keys.cookieKey]);

const sessionFactory = (user) => {
  const sessionData = {
    passport: {
      user: String(user._id),
    }
  };

  const session = Buffer.from(
    JSON.stringify(sessionData)
  ).toString('base64');

  const sig = keygrip.sign(`session=${session}`);

  return { session, sig };
}

module.exports = sessionFactory;
