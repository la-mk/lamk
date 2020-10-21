import TextWidget from './TextWidget';
import TextareaWidget from './TextareaWidget';
import SelectWidget from './SelectWidget';
import PasswordWidget from './PasswordWidget';
import EmailWidget from './EmailWidget';
import ColorWidget from './ColorWidget';
import CheckboxWidget from './CheckboxWidget';
import ImageUploadWidget from './ImageUploadWidget';

export default {
  TextWidget,
  TextareaWidget,
  SelectWidget,
  PasswordWidget,
  EmailWidget,
  ColorWidget,
  CheckboxWidget,
  // Custom widgets are named differently.
  imageUpload: ImageUploadWidget,
};
