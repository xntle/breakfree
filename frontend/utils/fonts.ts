// Font utility to map font weights to Open Sans font families
export const getFontFamily = (weight: string | number = '400'): string => {
  const weightStr = weight.toString();
  
  if (weightStr === '300' || weightStr === 'light') {
    return 'OpenSans-Light';
  }
  if (weightStr === '400' || weightStr === 'normal' || weightStr === 'regular') {
    return 'OpenSans-Regular';
  }
  if (weightStr === '500' || weightStr === 'medium') {
    return 'OpenSans-Medium';
  }
  if (weightStr === '600' || weightStr === 'semi-bold' || weightStr === 'semibold') {
    return 'OpenSans-SemiBold';
  }
  if (weightStr === '700' || weightStr === 'bold') {
    return 'OpenSans-Bold';
  }
  if (weightStr === '800' || weightStr === 'extra-bold' || weightStr === 'extrabold') {
    return 'OpenSans-ExtraBold';
  }
  
  return 'OpenSans-Regular';
};

