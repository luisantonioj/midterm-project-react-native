import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Space between search bar and filter button
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  clearBtn: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});