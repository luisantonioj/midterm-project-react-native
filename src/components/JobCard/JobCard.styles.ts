import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center', // Align logo and text vertically
    marginBottom: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
    lineHeight: 20,
  },
  company: {
    fontSize: 13,
    fontWeight: '500',
  },
  saveIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  tags: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1, // Adds a subtle line separating content from footer
    borderTopColor: '#f0f0f0', 
  },
  footerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  salaryText: {
    fontSize: 15,
    fontWeight: '800', // Bolder as requested
    marginBottom: 2,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  applyBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25, // Pill shape
    marginLeft: 12,
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});