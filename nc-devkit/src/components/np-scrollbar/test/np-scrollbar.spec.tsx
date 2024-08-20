import { newSpecPage } from '@stencil/core/testing';
import { NpScrollbar } from '../np-scrollbar';

describe('np-scrollbar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NpScrollbar],
      html: `<np-scrollbar></np-scrollbar>`,
    });
    expect(page.root).toEqualHtml(`
      <np-scrollbar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </np-scrollbar>
    `);
  });
});
