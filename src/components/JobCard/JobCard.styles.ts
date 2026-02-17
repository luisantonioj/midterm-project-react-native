import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  company: {
    fontSize: 16,
    marginBottom: 12,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});