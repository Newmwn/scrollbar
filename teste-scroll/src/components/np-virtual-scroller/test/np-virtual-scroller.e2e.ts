import { newE2EPage } from '@stencil/core/testing';

describe('np-virtual-scroller', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<np-virtual-scroller></np-virtual-scroller>');

    const element = await page.find('np-virtual-scroller');
    expect(element).toHaveClass('hydrated');
  });
});
