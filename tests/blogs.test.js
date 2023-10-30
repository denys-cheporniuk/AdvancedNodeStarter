const Page = require('./helpers/page');

describe('Blogs page tests', () => {
  let page;

  beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
  });

  afterEach(async () => {
    await page.close();
  });

  describe('When logged in', () => {
    beforeEach(async () => {
      await page.login();
      await page.click('a.btn-floating');
    })

    test('Should see create blog form', async () => {
      const label = await page.getContentsOf('form label');

      expect(label).toEqual('Blog Title');
    });


    describe('Using invalid inputs', () => {
      beforeEach(async () => {
        await page.click('form button');
      })

      test('should show error message for title', async () => {
        const titleError = await page.getContentsOf('.title .red-text');

        expect(titleError).toEqual('You must provide a value');
      });

      test('should show error message for content', async () => {
        const contentError = await page.getContentsOf('.content .red-text');

        expect(contentError).toEqual('You must provide a value');
      });
    })

    describe('Using valid inputs', () => {
      beforeEach(async () => {
        await page.type('.title input', 'My title');
        await page.type('.content input', 'My content');
        await page.click('form button');
      })

      test('should redirect user to review screen', async () => {
        const text = await page.getContentsOf('h5');

        expect(text).toEqual('Please confirm your entries');
      });

      test('should submit and save new blog', async () => {
        await page.click('button.green');
        await page.waitFor('.card');

        const cardTitle = await page.getContentsOf('.card-title');
        const cardContent = await page.getContentsOf('p');

        expect(cardTitle).toEqual('My title');
        expect(cardContent).toEqual('My Content');
      });
    })


  });

  describe('User is not logged in', async () => {
    const actions = [
      {
        method: 'get',
        path: '/api/blogs'
      },
      {
        method: 'post',
        path: '/api/blogs',
        data: {
          title: 'Blog Title',
          content: 'Blog Content'
        }
      }
    ];

    test('should return error when trying to create blog', async () => {
      const results = await page.execRequests(actions);

      for (let result of results) {
        expect(result).toEqual({error: 'You must log in!'});
      }
    });
  });
});
