export const cascaderFilter = (inputValue: string, path: any[]) => {
  return path.some(
    option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
}