const Page = require('./helpers/page');

describe('Page header tests', () => {
  let page;

  beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
  });

  afterEach(async () => {
    await page.close();
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
    await page.login();

    const buttonText = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(buttonText).toEqual('Logout');
  });
})
