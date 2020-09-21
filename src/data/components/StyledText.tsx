// import * as React from 'react';
// import { Text as DefaultText, View as DefaultView } from 'react-native';

// type ThemeProps = {
//   lightColor?: string;
//   darkColor?: string;
// };

// export type TextProps = ThemeProps & DefaultText['props'];
// export type ViewProps = ThemeProps & DefaultView['props'];

// export function Text(props: TextProps) {
//   const { style, lightColor, darkColor, ...otherProps } = props;
//   const color = darkColor;

//   return <DefaultText style={[{ color }, style]} {...otherProps} />;
// }

// export function MonoText(props: TextProps) {
//     return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
//   }
  
//   export function BebasText(props: TextProps) {
//     return <Text {...props} style={[props.style, { fontFamily: 'bebas-neue' }]} />;
//   }
  
//   export function SourceText(props: TextProps) {
//     return <Text {...props} style={[props.style, { fontFamily: 'source-sans' }]} />;
//   }

