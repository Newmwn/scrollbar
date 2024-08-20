import { newSpecPage } from '@stencil/core/testing';
import { NpVirtualScrollerList } from '../np-virtual-scroller';

describe('np-virtual-scroller', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NpVirtualScrollerList],
      html: `<np-virtual-scroller></np-virtual-scroller>`,
    });
    expect(page.root).toEqualHtml(`
      <np-virtual-scroller>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </np-virtual-scroller>
    `);
  });
});
