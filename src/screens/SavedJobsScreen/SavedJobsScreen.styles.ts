import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // 👇 1. Synced with JobFinderScreen exactly
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, // Changed from 20
    paddingTop: 60,        // Re-added if JobFinder has it (depending on your SafeArea setup)
    paddingBottom: 16,     // Changed from 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  // 👇 2. Synced with JobFinderScreen exactly
  content: {
    flex: 1,
    paddingHorizontal: 16, // Changed from 20
  },
  // 👇 3. Renamed to match JobFinder's class naming and spacing
  resultsCount: {
    fontSize: 14,
    marginBottom: 12,
  },
  // 👇 4. Kept the custom Empty state but adjusted padding
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32, // Changed to match JobFinder
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16, // Changed from 18 to match JobFinder
    textAlign: 'center', // Added to match JobFinder
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },

  // --- Filter Badges (Already matched) ---
  activeFilterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,               
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    maxWidth: 160,
  },

  // --- Slide-Up Filter Modal Styles (Already matched) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  filterOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOptionBtn: {
    justifyContent: 'center',
    height: 36,              
    paddingHorizontal: 14,
    borderRadius: 18,         
    borderWidth: 1,
    maxWidth: '100%',
    alignSelf: 'flex-start',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // --- Fade-in Remove Modal Styles (Specific to Saved Jobs) ---
  modalOverlayRemove: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContentRemove: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});