import { Slider as AntSlider } from 'antd';
import { SliderProps } from 'antd/es/slider';
import 'antd/es/slider/style/index.less';

import { system } from '../system';

export const Slider = system<SliderProps>(AntSlider);
