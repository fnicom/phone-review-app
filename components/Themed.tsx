import { Text as DefaultText, View as DefaultView } from 'react-native';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof lightColors | keyof typeof darkColors
) {
  const theme = 'light'; // Forçando tema claro
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return lightColors[colorName];
  }
}

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: DefaultText['props']) {
  return <DefaultText style={[{ color: '#000000' }, props.style]} {...props} />;
}

export function View(props: DefaultView['props']) {
  return (
    <DefaultView
      style={[
        {
          backgroundColor: '#FFFFFF',
          flex: 1,
        },
        props.style,
      ]}
      {...props}
    />
  );
}

const lightColors = {
  text: '#000000',
  background: '#FFFFFF',
};

const darkColors = {
  text: '#FFFFFF',
  background: '#000000',
}; 