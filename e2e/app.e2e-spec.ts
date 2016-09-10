import { RLPage } from './app.po';

describe('rl App', function() {
  let page: RLPage;

  beforeEach(() => {
    page = new RLPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
