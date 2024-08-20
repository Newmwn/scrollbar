import { Component, h } from '@stencil/core';
import { Devkit, UnitTypeEnum } from '../../models';

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

  render() {
    return (
      <div class={'components-wrapper'} style={{ width: '400px', height: '300px', border: '1px solid black' }}>
        <np-scrollbar>
          <div style={{ width: '500px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at finibus nisi. Proin placerat sagittis nibh pellentesque accumsan. Mauris vel ornare felis, non
            tincidunt urna. Phasellus tempor tellus id pretium vehicula. Donec semper blandit tellus nec varius. Aliquam arcu massa, semper et venenatis sit amet, auctor ac ipsum.
            Donec pharetra metus ac tempor ornare. Praesent vel volutpat risus. Fusce laoreet quam libero, nec commodo urna cursus vitae. Quisque accumsan eget lacus eu accumsan.
            Etiam tincidunt dictum dui ut fermentum. Pellentesque at lectus eros. Mauris iaculis nunc a risus consequat, vel bibendum magna volutpat. Sed efficitur urna a risus
            tempor ullamcorper. Mauris nec purus eget odio finibus euismod. Morbi vitae urna ut quam tincidunt malesuada non a nibh. Maecenas sodales porta bibendum. Vestibulum
            volutpat porta fringilla. Mauris at ultrices dui, eget vestibulum nisl. Etiam sit amet odio consequat, gravida justo ac, pretium quam. Morbi maximus neque nec eros
            blandit, eu lacinia arcu vulputate. In dictum interdum leo. Vivamus auctor hendrerit enim, ac elementum turpis bibendum ac. Nulla posuere aliquet porttitor. Etiam a
            ornare nunc, sit amet vehicula risus. Cras dapibus eleifend est, eget aliquet velit molestie sit amet. Donec massa magna, hendrerit at cursus sit amet, fringilla sit
            amet urna. Maecenas in nulla faucibus, rutrum mi at, sodales velit. In hac habitasse platea dictumst. Nullam et massa eu neque pellentesque pharetra. Duis vel convallis
            tortor. Praesent consectetur, erat nec tincidunt volutpat, augue risus luctus sem, a mattis neque enim vel tortor. Maecenas fringilla facilisis efficitur. Orci varius
            natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
            Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam vitae purus sit amet mi porttitor venenatis at sit amet magna. Sed et sem consequat, pharetra massa
            vel, tempor turpis. Nam eget arcu felis. Integer efficitur tempor libero, sit amet molestie augue dictum sit amet. Etiam eu neque eu lorem porttitor convallis quis sed
            sapien. Praesent eleifend augue et odio eleifend, et lobortis ante pulvinar. Ut ultricies, massa vitae egestas auctor, neque urna pretium nisi, vel tincidunt leo lectus
            sed enim. In feugiat tellus a mi pharetra, vel efficitur turpis facilisis. Etiam mattis, eros in volutpat molestie, arcu ante consectetur augue, sit amet dignissim dui
            turpis lobortis nisl. Proin finibus at felis et fermentum. Cras nisl arcu, iaculis nec erat nec, fringilla mollis sem. Duis rutrum ut nulla et ultricies. Mauris non
            justo condimentum, interdum sapien a, mattis orci. Praesent efficitur lorem quis ipsum maximus finibus. Praesent ut ornare felis. Proin interdum mi eget ante varius
            tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed bibendum fringilla magna. Nam sit amet metus iaculis, ornare arcu
            eu, tincidunt leo. Proin viverra elit arcu, quis vehicula leo commodo a. Ut est odio, molestie sed orci sit amet, fermentum sagittis magna. Donec consectetur, nisi id
            vulputate ultricies,
          </div>
        </np-scrollbar>
      </div>
    );
  }
}
