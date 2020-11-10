import { Button as BaseButton, ButtonProps } from 'baseui/button';
import { system, SystemProps } from '../system';

export const Button = system<ButtonProps & SystemProps>(BaseButton);
