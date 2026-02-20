import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },

  // --- Header Row Updates ---
  header: {
    marginBottom: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 4,
  },

  // --- Summary Card Updates ---
  summaryCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#f4f4f4',
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 22,
  },
  company: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  detailsGrid: {
    gap: 10, 
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
    flexShrink: 1, 
  },

  // --- Form Styles ---
  form: {
    flex: 1,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 8,
  },

  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  reviewBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewValue: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  successIconBox: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});