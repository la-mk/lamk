import { DatePicker as AntDatePicker } from 'antd';
import { DatePickerProps, WeekPickerProps, MonthPickerProps, RangePickerProps } from 'antd/es/date-picker/interface';
import 'antd/es/date-picker/style/index.less';

import { system } from '../system';

export const DatePicker = system<DatePickerProps>(AntDatePicker);
export const RangePicker = system<RangePickerProps>(AntDatePicker.RangePicker);
export const WeekPicker = system<WeekPickerProps>(AntDatePicker.WeekPicker);
export const MonthPicker = system<MonthPickerProps>(AntDatePicker.MonthPicker);
