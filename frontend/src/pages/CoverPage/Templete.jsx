import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import bubtImg from '../../assets/bubt.png';

const styles = StyleSheet.create({
  page: {
    width: 794,
    height: 1123,
    padding: 25,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  container: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'extrabold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'extrabold',
    textAlign: 'center',
    marginBottom: 30,
  },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { height: 140 },
  assignmentBox: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  infoSection: {
    marginBottom: 20,
    paddingLeft: 40,
    flexDirection: 'column',
    gap: '5px',
  },
  infoText: { fontSize: 14, marginTop: 8 },
  label: { fontWeight: 'bold' },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  box: {
    width: '49%',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 20,
    padding: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    fontSize: 14,
    gap: '10px',
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textDecoration: 'underline',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const formatDate = dateStr => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Templete = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Bangladesh University of Business and Technology
        </Text>
        <Text style={styles.subtitle}>(BUBT)</Text>

        <View style={styles.logoContainer}>
          <Image src={bubtImg} style={styles.logo} />
        </View>

        <View style={styles.assignmentBox}>
          <Text>{data.type || 'ASSIGNMENT'}</Text>
        </View>

        <View style={styles.infoSection}>
          {data.type?.toLowerCase() === 'assignment' && (
            <Text style={styles.infoText}>
              <Text style={styles.label}>Assignment no: </Text>
              {data.assignment}
            </Text>
          )}
          <Text style={styles.infoText}>
            <Text style={styles.label}>Course Code: </Text>
            {data.courseCode}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.label}>Course Title: </Text>
            {data.courseTitle}
          </Text>
          {data.type?.toLowerCase() === 'lab report' && (
            <>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Experiment no: </Text>
                {data.experiment}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Experiment Name: </Text>
                {data.experimentName}
              </Text>
            </>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Submitted By</Text>
            <Text>
              <Text style={styles.label}>Name: </Text>
              {data.name}
            </Text>
            <Text>
              <Text style={styles.label}>ID No: </Text>
              {data.id}
            </Text>
            <Text>
              <Text style={styles.label}>Intake: </Text>
              {data.intake || '54'}
            </Text>
            <Text>
              <Text style={styles.label}>Section: </Text>
              {data.section || '01'}
            </Text>
            <Text>
              <Text style={styles.label}>Program: </Text>B.Sc Engg in CSE
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.boxTitle}>Submitted To</Text>
            {data.teacher && (
              <Text>
                <Text style={styles.label}>Name: </Text>
                {data.teacher}
              </Text>
            )}
            {data.department && (
              <Text>
                <Text style={styles.label}>Department of: </Text>
                {data.department}
              </Text>
            )}
            <Text>Bangladesh University of Business & Technology</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          <Text style={styles.label}>Date of Submission: </Text>
          {formatDate(data.date)}
        </Text>
      </View>
    </Page>
  </Document>
);

export default Templete;
