import { pdf } from '@react-pdf/renderer';
import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import NSTPLogo from '../assets/nstplogocolored.png';
import ReactDOM from 'react-dom';
import showToast from './toast';

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  logoContainer: {
    width: 100,
    height: 50,
    marginBottom: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#F4F4F4',
  },
  tableCol: {
    flex: 1,
    padding: 5,
  },
  tableCell: {
    fontSize: 12,
    padding: 5,
  },
  subCategoryRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    minHeight: 25,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  subCategoryCell: {
    fontSize: 11,
    padding: 5,
    paddingLeft: 15,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  status: {
    padding: 5,
    borderRadius: 4,
    fontSize: 12,
    marginTop: 5,
  },
  paymentInfo: {
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
  },
});

const calculateDaysDifference = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getPaymentInfo = (bill) => {
  const today = new Date();
  const dueDate = new Date(bill.dueDate);

  if (bill.status === 'Paid') {
    return `Paid on: ${bill.paidDate}`;
  } else if (today.getTime() < dueDate.getTime()) {
    const daysRemaining = calculateDaysDifference(today, dueDate);
    return `Due in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`;
  } else {
    const daysOverdue = calculateDaysDifference(dueDate, today);
    return `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`;
  }
};

{/* Add this helper function at the top of your component/file */ }
const calculateCategoryTotal = (category) => {
  if (category.amount !== undefined) {
    return category.amount;
  } else if (category.subCategory) {
    return category.subCategory.reduce((sum, sub) => sum + sub.amount, 0);
  } else {
    return 0;
  }
};


// PDF Document Component
const BillPDF = ({ bill, overdueDetails, downloadTimestamp }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <View>
          <View style={styles.logoContainer}>
            <Image src={NSTPLogo} style={styles.logo} />
          </View>
          <Text style={styles.title}>{bill.companyName}</Text>
          <Text style={styles.title}>Invoice</Text>
          <Text style={styles.subtitle}>#{bill.id}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.subtitle}>Generated: {format(new Date(bill.date), 'dd/MM/yyyy')}</Text>
          <Text style={styles.subtitle}>Due Date: {format(new Date(bill.dueDate), 'dd/MM/yyyy')}</Text>
          <Text style={[
            styles.status,
            { backgroundColor: bill.status === 'Paid' ? '#DCF7E3' : bill.status === 'OVERDUE' ? '#FECACA' : '#FEF3C7' }
          ]}>
            {bill.status}
          </Text>
          <Text style={styles.paymentInfo}>{getPaymentInfo(bill)}</Text>
        </View>
      </View>

      {/* Bill Details */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Bill Details</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCol}><Text style={styles.bold}>Category</Text></View>
            <View style={styles.tableCol}><Text style={styles.bold}>Description</Text></View>
            <View style={styles.tableCol}><Text style={styles.bold}>Amount</Text></View>
          </View>

          {/* Existing code with the updated amount display */}
          {bill.breakDown.map((category, index) => (
            <View key={index}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{category.category}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {category.subCategory ? '-' : 'Base Amount'}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    PKR {calculateCategoryTotal(category)}
                  </Text>
                </View>
              </View>
              {category.subCategory?.map((sub, subIndex) => (
                <View key={`${index}-${subIndex}`} style={styles.subCategoryRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.subCategoryCell}>└ {sub.name}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.subCategoryCell}></Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.subCategoryCell}>PKR {sub.amount}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Overdue Details if applicable */}
      {overdueDetails && (
        <View style={[styles.section, { backgroundColor: '#FEE2E2', padding: 10 }]}>
          <Text style={styles.subtitle}>Overdue Details</Text>
          <Text>Days Overdue: {overdueDetails.overdueDays}</Text>
          <Text>Penalty Rate: PKR {overdueDetails.PENALTY_RATE} per day</Text>
          <Text style={styles.bold}>Total Penalty: PKR {overdueDetails.penalty}</Text>
        </View>
      )}

      {/* Total */}
      <View style={styles.total}>
        <Text style={styles.bold}>Total Amount</Text>
        <Text style={styles.bold}>
          PKR {overdueDetails
            ? (bill.amount + overdueDetails.penalty).toFixed(2)
            : bill.amount.toFixed(2)}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Generated on: {format(new Date(downloadTimestamp), "dd/MM/yyyy 'at' HH:mm:ss")}</Text>
        <Text>This is a computer-generated document. No signature is required.</Text>
      </View>
    </Page>
  </Document>
);

export const generatePDF = async (bill) => {
  try {
    // Calculate overdue details if applicable
    const overdueDetails = bill.status === 'Overdue'
      ? {
        overdueDays: calculateDaysDifference(new Date(bill.dueDate), new Date()),
        PENALTY_RATE: 100, // Define your penalty rate
        penalty: calculateDaysDifference(new Date(bill.dueDate), new Date()) * 100
      }
      : null;

    const downloadTimestamp = new Date().toISOString();

    // Generate PDF blob
    const blob = await pdf(
      <BillPDF
        bill={bill}
        overdueDetails={overdueDetails}
        downloadTimestamp={downloadTimestamp}
      />
    ).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${bill.id}-${bill.name}-${format(new Date(downloadTimestamp), 'yyyyMMdd-HHmmss')}.pdf`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);
    showToast(true, 'PDF downloaded successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    showToast(false, 'Error generating PDF');}
    finally{
    }
};


// Function to print the PDF
export const printPDF = async (bill) => {
  try {
    console.log("got bill: " , bill);
    // Calculate overdue details if applicable
    const overdueDetails = bill.status === 'Overdue'
      ? {
          overdueDays: calculateDaysDifference(new Date(bill.dueDate), new Date()),
          PENALTY_RATE: 100, // Define your penalty rate
          penalty: calculateDaysDifference(new Date(bill.dueDate), new Date()) * 100
        }
      : null;

    const downloadTimestamp = new Date().toISOString();

    // Generate PDF blob
    const blob = await pdf(
      <BillPDF
        bill={bill}
        overdueDetails={overdueDetails}
        downloadTimestamp={downloadTimestamp}
      />
    ).toBlob();

    // Create a blob URL
    const blobUrl = URL.createObjectURL(blob);

    // Open the PDF in a new window or tab
    const newWindow = window.open(blobUrl, '_blank');

    // Wait for the new window to load the PDF, then trigger print
    newWindow.onload = () => {
      newWindow.focus();
      newWindow.print();
    };
    
  } catch (error) {
    console.error('Error generating PDF for print:', error);
    showToast(false, 'Error generating PDF for print');
  } finally{
  }
};
