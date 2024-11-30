import { Component, h } from '@stencil/core';
import { Devkit, UnitTypeEnum } from '../../models';
import { ScrollbarPositionEnum, ScrollbarVisibilityEnum } from '../np-scrollbar/models/np-scrollbar.enum';

@Component({
  tag: 'component-devkit-test',
  styleUrl: 'component-devkit-test.scss',
  shadow: true,
})
export class ComponentsDevkitTest {
  connectedCallBack() {
    Devkit.init(
      {
        defaultImagePath: null,
        imagePath: null,
        unitType: UnitTypeEnum.Tbu,
        zoom: 1.0,
      },
      null,
    );
  }
  scrollbar;
  render() {
    return (
      <div>
        <button onClick={() => this.scrollbar?.scrollToPosition(50, 50, true)}>MID</button>
        <div class={'components-wrapper'} style={{ width: '400px', height: '300px', border: '1px solid black' }}>
          <np-scrollbar
            padding={10}
            ref={ref => (this.scrollbar = ref)}
            scrollbarPosition={ScrollbarPositionEnum.AboveContent}
            scrollbarVisibility={ScrollbarVisibilityEnum.HoverWithTrack}
            scrollStyles={{ scrollbar: { marginGap: 0 }, thumb: { width: 10, borderRadius: 20 }, track: { width: 1, borderRadius: 0 } }}
          >
            <div style={{ width: '1500px' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at finibus nisi. Proin placerat sagittis nibh pellentesque accumsan. Mauris vel ornare felis, non
              tincidunt urna. Phasellus tempor tellus id pretium vehicula. Donec semper blandit tellus nec varius. Aliquam arcu massa, semper et venenatis sit amet, auctor ac
              ipsum. Donec pharetra metus ac tempor ornare. Praesent vel volutpat risus. Fusce laoreet quam libero, nec commodo urna cursus vitae. Quisque accumsan eget lacus eu
              accumsan. Etiam tincidunt dictum dui ut fermentum. Pellentesque at lectus eros. Mauris iaculis nunc a risus consequat, vel bibendum magna volutpat. Sed efficitur urna
              a risus tempor ullamcorper. Mauris nec purus eget odio finibus euismod. Morbi vitae urna ut quam tincidunt malesuada non a nibh. Maecenas sodales porta bibendum.
              Vestibulum volutpat porta fringilla. Mauris at ultrices dui, eget vestibulum nisl. Etiam sit amet odio consequat, gravida justo ac, pretium quam. Morbi maximus neque
              nec eros blandit, eu lacinia arcu vulputate. In dictum interdum leo. Vivamus auctor hendrerit enim, ac elementum turpis bibendum ac. Nulla posuere aliquet porttitor.
              Etiam a ornare nunc, sit amet vehicula risus. Cras dapibus eleifend est, eget aliquet velit molestie sit amet. Donec massa magna, hendrerit at cursus sit amet,
              fringilla sitLorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at finibus nisi. Proin placerat sagittis nibh pellentesque accumsan. Mauris vel ornare
              felis, non tincidunt urna. Phasellus tempor tellus id pretium vehicula. Donec semper blandit tellus nec varius. Aliquam arcu massa, semper et venenatis sit amet,
              auctor ac ipsum. Donec pharetra metus ac tempor ornare. Praesent vel volutpat risus. Fusce laoreet quam libero, nec commodo urna cursus vitae. Quisque accumsan eget
              lacus eu accumsan. Etiam tincidunt dictum dui ut fermentum. Pellentesque at lectus eros. Mauris iaculis nunc a risus consequat, vel bibendum magna volutpat. Sed
              efficitur urna a risus tempor ullamcorper. Mauris nec purus eget odio finibus euismod. Morbi vitae urna ut quam tincidunt malesuada non a nibh. Maecenas sodales porta
              bibendum. Vestibulum volutpat porta fringilla. Mauris at ultrices dui, eget vestibulum nisl. Etiam sit amet odio consequat, gravida justo ac, pretium quam. Morbi
              maximus neque nec eros blandit, eu lacinia arcu vulputate. In dictum interdum leo. Vivamus auctor hendrerit enim, ac elementum turpis bibendum ac. Nulla posuere
              aliquet porttitor. Etiam a ornare nunc, sit amet vehicula risus. Cras dapibus eleifend est, eget aliquet velit molestie sit amet. Donec massa magna, hendrerit at
              cursus sit amet, fringilla sitLorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at finibus nisi. Proin placerat sagittis nibh pellentesque accumsan.
              Mauris vel ornare felis, non tincidunt urna. Phasellus tempor tellus id pretium vehicula. Donec semper blandit tellus nec varius. Aliquam arcu massa, semper et
              venenatis sit amet, auctor ac ipsum. Donec pharetra metus ac tempor ornare. Praesent vel volutpat risus. Fusce laoreet quam libero, nec commodo urna cursus vitae.
              Quisque accumsan eget lacus eu accumsan. Etiam tincidunt dictum dui ut fermentum. Pellentesque at lectus eros. Mauris iaculis nunc a risus consequat, vel bibendum
              magna volutpat. Sed efficitur urna a risus tempor ullamcorper. Mauris nec purus eget odio finibus euismod. Morbi vitae urna ut quam tincidunt malesuada non a nibh.
              Maecenas sodales porta bibendum. Vestibulum volutpat porta fringilla. Mauris at ultrices dui, eget vestibulum nisl. Etiam sit amet odio consequat, gravida justo ac,
              pretium quam. Morbi maximus neque nec eros blandit, eu lacinia arcu vulputate. In dictum interdum leo. Vivamus auctor hendrerit enim, ac elementum turpis bibendum ac.
              Nulla posuere aliquet porttitor. Etiam a ornare nunc, sit amet vehicula risus. Cras dapibus eleifend est, eget aliquet velit molestie sit amet. Donec massa magna,
              hendrerit at cursus sit amet, fringilla sitLorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at finibus nisi. Proin placerat sagittis nibh
              pellentesque accumsan. Mauris vel ornare felis, non tincidunt urna. Phasellus tempor tellus id pretium vehicula. Donec semper blandit tellus nec varius. Aliquam arcu
              massa, semper et venenatis sit amet, auctor ac ipsum. Donec pharetra metus ac tempor ornare. Praesent vel volutpat risus. Fusce laoreet quam libero, nec commodo urna
              cursus vitae. Quisque accumsan eget lacus eu accumsan. Etiam tincidunt dictum dui ut fermentum. Pellentesque at lectus eros. Mauris iaculis nunc a risus consequat,
              vel bibendum magna volutpat. Sed efficitur urna a risus tempor ullamcorper. Mauris nec purus eget odio finibus euismod. Morbi vitae urna ut quam tincidunt malesuada
              non a nibh. Maecenas sodales porta bibendum. Vestibulum volutpat porta fringilla. Mauris at ultrices dui, eget vestibulum nisl. Etiam sit amet odio consequat, gravida
              justo ac, pretium quam. Morbi maximus neque nec eros blandit, eu lacinia arcu vulputate. In dictum interdum leo. Vivamus auctor hendrerit enim, ac elementum turpis
              bibendum ac. Nulla posuere aliquet porttitor. Etiam a ornare nunc, sit amet vehicula risus. Cras dapibus eleifend est, eget aliquet velit molestie sit amet. Donec
              massa magna, hendrerit at cursus sit amet, fringilla sitLorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at finibus nisi. Proin placerat sagittis
              nibh pellentesque accumsan. Mauris vel ornare felis, non tincidunt urna. Phasellus tempor tellus id pretium vehicula. Donec semper blandit tellus nec varius. Aliquam
              arcu massa, semper et venenatis sit amet, auctor ac ipsum. Donec pharetra metus ac tempor ornare. Praesent vel volutpat risus. Fusce laoreet quam libero, nec commodo
              urna cursus vitae. Quisque accumsan eget lacus eu accumsan. Etiam tincidunt dictum dui ut fermentum. Pellentesque at lectus eros. Mauris iaculis nunc a risus
              consequat, vel bibendum magna volutpat. Sed efficitur urna a risus tempor ullamcorper. Mauris nec purus eget odio finibus euismod. Morbi vitae urna ut quam tincidunt
              malesuada non a nibh. Maecenas sodales porta bibendum. Vestibulum volutpat porta fringilla. Mauris at ultrices dui, eget vestibulum nisl. Etiam sit amet odio
              consequat, gravida justo ac, pretium quam. Morbi maximus neque nec eros blandit, eu lacinia arcu vulputate. In dictum interdum leo. Vivamus auctor hendrerit enim, ac
              elementum turpis bibendum ac. Nulla posuere aliquet porttitor. Etiam a ornare nunc, sit amet vehicula risus. Cras dapibus eleifend est, eget aliquet velit molestie
              sit amet. Donec massa magna, hendrerit at cursus sit amet, fringilla sitLorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at finibus nisi. Proin
              placerat sagittis nibh pellentesque accumsan. Mauris vel ornare felis, non tincidunt urna. Phasellus tempor tellus id pretium vehicula. Donec semper blandit tellus
              nec varius. Aliquam arcu massa, semper et venenatis sit amet, auctor ac ipsum. Donec pharetra metus ac tempor ornare. Praesent vel volutpat risus. Fusce laoreet quam
            </div>
          </np-scrollbar>
        </div>
      </div>
    );
  }
}
