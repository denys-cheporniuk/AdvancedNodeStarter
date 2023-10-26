const puppeteer = require('puppeteer');

describe('Browser launch and create a new page', () => {
  let browser;
  let page;


  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.goto('localhost:3000');
  });


  afterAll(async () => {
    await browser.close();
  });

  test('Logo should have correct text', async () => {
    const logoText = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(logoText).toEqual('Blogster');
  })
})
