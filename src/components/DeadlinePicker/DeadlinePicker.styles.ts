// -----------------------------------------------------------
// 💅 FlowMind 2.0 — DeadlinePicker.styles
// -----------------------------------------------------------

import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/colors';

export const styles = StyleSheet.create({
  row: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  button: {
    backgroundColor: Colors.creamLight,
    borderColor: Colors.beigeBorder,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  buttonText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  iosLabel: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  clearButton: { paddingHorizontal: 8, paddingVertical: 10 },
  clearText: { color: Colors.error, fontSize: 13, fontWeight: '600' },
});
