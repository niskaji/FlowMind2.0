import { StyleSheet } from 'react-native';

import { Colors } from '../../styles/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    marginBottom: 20,
    padding: 18,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  container: { paddingHorizontal: 18, paddingVertical: 20 },
  header: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    textShadowColor: Colors.shadowDark,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  legendContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    flexShrink: 1,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  percentText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  row: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  safeArea: { backgroundColor: Colors.background, flex: 1 },
  shadow: {
    elevation: 6,
    shadowColor: Colors.shadowBlack,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  statusText: {
    color: Colors.textPrimary,
    flexShrink: 1,
    flexWrap: 'wrap',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 6,
  },
});
