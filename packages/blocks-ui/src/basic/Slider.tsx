import { Slider as AntSlider } from 'antd';
import { SliderSingleProps, SliderRangeProps } from 'antd/es/slider';
import 'antd/es/slider/style/index.less';

import { system } from '../system';

export const Slider = system<SliderSingleProps | SliderRangeProps>(AntSlider);
