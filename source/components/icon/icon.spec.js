import '../../../internals/test/helper';

import Icon from './icon-component';

/** @test {Icon} */
describe('Icon component', () => {
/** @test {Icon#render} */
  describe('#render', () => {
    it('render correctly', () => {
      const wrapper = shallow(
        <Icon />
      );
      expect(wrapper.length).toEqual(1);
    });
  });
});
