const keys = require('../config/keys');

const puppeteer = require('puppeteer');
const { Buffer } = require('safe-buffer');
const Keygrip = require('keygrip');

describe('Page header tests', () => {
  let browser;
  let page;

  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.goto('localhost:3000');
  });


  afterEach(async () => {
    await browser.close();
  });

  test('The header logo should have correct text', async () => {
    const logoText = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(logoText).toEqual('Blogster');
  });

  test('Should redirect to google auth page after clicking on the login button', async () => {
    await page.click('.right a');

    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
  });

  test('Should show a logout button after successful login', async () => {
    const userId = '6537d2da22161f3d092d8fa5';

    const session = {
      passport: {
        user: userId,
      }
    };

    const sessionString = Buffer.from(
      JSON.stringify(session)
    ).toString('base64');

    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign(`session=${sessionString}`);

    await page.setCookie({ name: 'session', value: sessionString });
    await page.setCookie({ name: 'session.sig', value: sig });

    await page.goto('localhost:3000');
    await page.waitFor('a[href="/auth/logout"]');

    const buttonText = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(buttonText).toEqual('Logout');
  });
})
