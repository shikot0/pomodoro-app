import { Text, TextProps } from './Themed';

// export function MonoText(props: TextProps) {
//   return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
// }

export function Heading(props: TextProps) {
  // return <Text {...props} style={[props.style, {fontFamily: 'Alata', fontSize: 32}]} />
  return <Text {...props} style={[{fontFamily: 'Alata', fontSize: 32}, props.style]} />
}