import { newE2EPage } from '@stencil/core/testing';

describe('np-scrollbar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<np-scrollbar></np-scrollbar>');

    const element = await page.find('np-scrollbar');
    expect(element).toHaveClass('hydrated');
  });
});
