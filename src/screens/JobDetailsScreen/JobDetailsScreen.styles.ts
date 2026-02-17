import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for footer
  },
  
  // --- Header Section ---
  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 12,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  salary: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  // --- Badges ---
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // --- Tabs ---
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent', // Hidden unless active
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // --- Content ---
  contentArea: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
  },

  // --- Tags ---
  tagsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 13,
    fontWeight: '500',
    overflow: 'hidden', // Required for borderRadius on Text in iOS sometimes
  },

  // --- Footer ---
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    elevation: 20, // High elevation for shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  saveButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
});