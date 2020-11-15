import { Button as BaseButton, ButtonProps } from 'baseui/button';
import { system } from '../../newSystem';
export { ButtonProps } from 'baseui/button';

export const Button = system<ButtonProps>(BaseButton);
