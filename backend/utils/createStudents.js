const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { Student, Course, Subject, Attendance, Teacher } = require('./models/CompleteModels');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-erp');

async function createStudents() {
  try {
    // Get courses
    const courses = await Course.find();
    if (courses.length === 0) {
      console.log('No courses found. Run setupCompleteERP.js first.');
      return;
    }

    // Create students
    const students = [
      // {
      //   name: 'kartikeya',
      //   email: 'student',//alice@student.edu
      //   phone: '+91-9876543220',
      //   rollNo: 'CSE2021001',
      //   password: await bcrypt.hash('student123', 10),
      //   courseId: courses[0]._id
      // },
      // {
      //   name: 'sandy',
      //   email: 'student2',//bob@student.edu
      //   phone: '+91-9876543221',
      //   rollNo: 'CSE2021002',
      //   password: await bcrypt.hash('student123', 10),
      //   courseId: courses[0]._id
      // },
      {
  name: 'AADESH KUMAR',
  email: 'student1',
  phone: '',
  rollNo: '2301660100001',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'AALOK SINGH',
  email: 'student2',
  phone: '',
  rollNo: '2301660100002',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'AARTI SAMANT',
  email: 'student3',
  phone: '',
  rollNo: '2301660100003',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ABHAY KUMAR CHAUDHARY',
  email: 'student4',
  phone: '',
  rollNo: '2301660100004',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ABHAY MAURYA',
  email: 'student5',
  phone: '',
  rollNo: '2301660100005',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ABHINAV KANNOUGIYA',
  email: 'student6',
  phone: '',
  rollNo: '2301660100006',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ABHINAV SINGH',
  email: 'student7',
  phone: '',
  rollNo: '2301660100007',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ABHINAY KUMAR',
  email: 'student8',
  phone: '',
  rollNo: '2301660100008',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ABHISHEK GOND',
  email: 'student9',
  phone: '',
  rollNo: '2301660100009',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ABHISHEK SHARMA',
  email: 'student10',
  phone: '',
  rollNo: '2301660100010',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ABHISHEK SRIVASTAVA',
  email: 'student11',
  phone: '',
  rollNo: '2301660100011',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ADARSH DHUSIA',
  email: 'student12',
  phone: '',
  rollNo: '2301660100012',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ADARSH PANDEY',
  email: 'student13',
  phone: '',
  rollNo: '2301660100013',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ADITYA KUMAR',
  email: 'student14',
  phone: '',
  rollNo: '2301660100014',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ADITYA KUMAR GOND',
  email: 'student15',
  phone: '',
  rollNo: '2301660100015',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ADITYA KUMAR SHARMA',
  email: 'student16',
  phone: '',
  rollNo: '2301660100016',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ADITYA MISHRA',
  email: 'student17',
  phone: '',
  rollNo: '2301660100017',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'AKANKSHA SHUKLA',
  email: 'student18',
  phone: '',
  rollNo: '2301660100018',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'AKARSH KUMAR SINGH',
  email: 'student19',
  phone: '',
  rollNo: '2301660100019',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ALOK RANJAN',
  email: 'student20',
  phone: '',
  rollNo: '2301660100020',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'AMAN',
  email: 'student21',
  phone: '',
  rollNo: '2301660100021',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'AMAN GUPTA',
  email: 'student22',
  phone: '',
  rollNo: '2301660100022',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'AMAN KUMAR',
  email: 'student23',
  phone: '',
  rollNo: '2301660100023',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'AMARJEET YADAV',
  email: 'student24',
  phone: '',
  rollNo: '2301660100024',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'AMIT KUSHWAHA',
  email: 'student25',
  phone: '',
  rollNo: '2301660100025',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANAMIKA',
  email: 'student26',
  phone: '',
  rollNo: '2301660100026',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANAMIKA SINGH',
  email: 'student27',
  phone: '',
  rollNo: '2301660100027',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANANT KUMAR',
  email: 'student28',
  phone: '',
  rollNo: '2301660100028',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANANYA CHATURVEDI',
  email: 'student29',
  phone: '',
  rollNo: '2301660100029',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANCHAL SINGH',
  email: 'student30',
  phone: '',
  rollNo: '2301660100030',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANJALI DWIVEDI',
  email: 'student31',
  phone: '',
  rollNo: '2301660100031',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANKIT KUMAR',
  email: 'student32',
  phone: '',
  rollNo: '2301660100032',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANKIT MATHUR',
  email: 'student33',
  phone: '',
  rollNo: '2301660100033',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANKIT YADAV',
  email: 'student34',
  phone: '',
  rollNo: '2301660100034',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANKITA MAURYA',
  email: 'student35',
  phone: '',
  rollNo: '2301660100035',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANKUSH KUMAR',
  email: 'student36',
  phone: '',
  rollNo: '2301660100036',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANMOL KUMAR DUBEY',
  email: 'student37',
  phone: '',
  rollNo: '2301660100037',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANSHUMAAN GUPTA',
  email: 'student38',
  phone: '',
  rollNo: '2301660100038',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANUJ GUPTA',
  email: 'student39',
  phone: '',
  rollNo: '2301660100039',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANUJ SINGH',
  email: 'student40',
  phone: '',
  rollNo: '2301660100040',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ANUP',
  email: 'student41',
  phone: '',
  rollNo: '2301660100041',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'APURVA SINGH',
  email: 'student42',
  phone: '',
  rollNo: '2301660100042',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ARPIT GANGWAR',
  email: 'student43',
  phone: '',
  rollNo: '2301660100043',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ARPIT TIWARI',
  email: 'student44',
  phone: '',
  rollNo: '2301660100044',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ARYAN KUMAR',
  email: 'student45',
  phone: '',
  rollNo: '2301660100045',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ARYAN PATEL',
  email: 'student46',
  phone: '',
  rollNo: '2301660100046',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ARYAN SHRIVASTAVA',
  email: 'student47',
  phone: '',
  rollNo: '2301660100047',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ARYAN YADAV',
  email: 'student48',
  phone: '',
  rollNo: '2301660100048',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ASHLOK YADAV',
  email: 'student49',
  phone: '',
  rollNo: '2301660100049',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ATITH SINGH',
  email: 'student50',
  phone: '',
  rollNo: '2301660100050',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'AYUSH PATEL',
  email: 'student51',
  phone: '',
  rollNo: '2301660100051',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'AYUSH SAXENA',
  email: 'student52',
  phone: '',
  rollNo: '2301660100052',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'AYUSH VERMA',
  email: 'student53',
  phone: '',
  rollNo: '2301660100053',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'BADAL KUMAR',
  email: 'student54',
  phone: '',
  rollNo: '2301660100054',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'BHAVESH SINGH',
  email: 'student55',
  phone: '',
  rollNo: '2301660100055',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'CHITTRANSHI GUPTA',
  email: 'student56',
  phone: '',
  rollNo: '2301660100056',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'DESHRAJ SINGH PARMAR',
  email: 'student57',
  phone: '',
  rollNo: '2301660100057',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'DHEERENDRA KUMAR',
  email: 'student58',
  phone: '',
  rollNo: '2301660100058',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'DURGESH DIWAKAR',
  email: 'student59',
  phone: '',
  rollNo: '2301660100059',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'DURGESH KUMAR',
  email: 'student60',
  phone: '',
  rollNo: '2301660100060',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ESMOLI GUPTA',
  email: 'student61',
  phone: '',
  rollNo: '2301660100061',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'FAIZ HUSSAIN KHAN',
  email: 'student62',
  phone: '',
  rollNo: '2301660100062',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'GARIMA DAROLIA',
  email: 'student63',
  phone: '',
  rollNo: '2301660100063',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'GAURAV KUMAR',
  email: 'student64',
  phone: '',
  rollNo: '2301660100064',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'GULSHAN KUMAR',
  email: 'student65',
  phone: '',
  rollNo: '2301660100065',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'HARSH KUMAR',
  email: 'student66',
  phone: '',
  rollNo: '2301660100066',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'HARSH RAI',
  email: 'student67',
  phone: '',
  rollNo: '2301660100067',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'HARSH RAJ PAL',
  email: 'student68',
  phone: '',
  rollNo: '2301660100068',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'HARSH VERMA',
  email: 'student69',
  phone: '',
  rollNo: '2301660100069',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'HARSHIT KUMAR',
  email: 'student70',
  phone: '',
  rollNo: '2301660100070',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'HARSHITA OJHA',
  email: 'student71',
  phone: '',
  rollNo: '2301660100071',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'HARSHITA SINGH',
  email: 'student72',
  phone: '',
  rollNo: '2301660100072',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'HIMANSHU SINGH',
  email: 'student73',
  phone: '',
  rollNo: '2301660100073',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'HIMANSHU YADAV',
  email: 'student74',
  phone: '',
  rollNo: '2301660100074',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'JAISWAR SACHIN LAXMISHANKAR',
  email: 'student75',
  phone: '',
  rollNo: '2301660100075',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'JAY SRIVASTAVA',
  email: 'student76',
  phone: '',
  rollNo: '2301660100076',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'JHANVI SINGH',
  email: 'student77',
  phone: '',
  rollNo: '2301660100077',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'KAJAL',
  email: 'student78',
  phone: '',
  rollNo: '2301660100078',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'KISLAYA SRIVASTAVA',
  email: 'student79',
  phone: '',
  rollNo: '2301660100079',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'KOMAL GUPTA',
  email: 'student80',
  phone: '',
  rollNo: '2301660100080',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'KRATIKA',
  email: 'student81',
  phone: '',
  rollNo: '2301660100081',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'KRISHNA RAJ MISHRA',
  email: 'student82',
  phone: '',
  rollNo: '2301660100082',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'KUMAR KAUSTUBH',
  email: 'student83',
  phone: '',
  rollNo: '2301660100083',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'MANISH KUMAR MAURYA',
  email: 'student84',
  phone: '',
  rollNo: '2301660100084',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'MEHTAB ALI',
  email: 'student85',
  phone: '',
  rollNo: '2301660100085',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'MOHAMMAD ZUBAIR',
  email: 'student86',
  phone: '',
  rollNo: '2301660100086',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'MOHD AAMIR',
  email: 'student87',
  phone: '',
  rollNo: '2301660100087',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'NIDHI GUPTA',
  email: 'student89',
  phone: '',
  rollNo: '2301660100089',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'NIDHI MISHRA',
  email: 'student90',
  phone: '',
  rollNo: '2301660100090',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'NIKITA YADAV',
  email: 'student91',
  phone: '',
  rollNo: '2301660100091',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'NISHANT',
  email: 'student92',
  phone: '',
  rollNo: '2301660100092',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'NISHANT KUMAR',
  email: 'student93',
  phone: '',
  rollNo: '2301660100093',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'NISHANT PRATAP SINGH',
  email: 'student94',
  phone: '',
  rollNo: '2301660100094',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'NITIN BAGHEL',
  email: 'student95',
  phone: '',
  rollNo: '2301660100095',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'NITISH OJHA',
  email: 'student96',
  phone: '',
  rollNo: '2301660100096',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'OSHIM RAEEN',
  email: 'student97',
  phone: '',
  rollNo: '2301660100097',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'OUM GUPTA',
  email: 'student98',
  phone: '',
  rollNo: '2301660100098',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'PAWAN KUSHWAHA',
  email: 'student99',
  phone: '',
  rollNo: '2301660100099',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'PRAKHAR DEV DUBEY',
  email: 'student100',
  phone: '',
  rollNo: '2301660100100',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'PRATIBHA SINGH',
  email: 'student101',
  phone: '',
  rollNo: '2301660100101',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},{
  name: 'PRIYANSHU KUMAR PANDEY',
  email: 'student102',
  phone: '',
  rollNo: '2301660100102',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'PRIYANSHU SINGH SIKARWAR',
  email: 'student103',
  phone: '',
  rollNo: '2301660100103',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'RAHUL PRAJAPATI',
  email: 'student104',
  phone: '',
  rollNo: '2301660100104',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'RAJ ARYAN',
  email: 'student105',
  phone: '',
  rollNo: '2301660100105',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'RAJ KAMAL SINGH',
  email: 'student106',
  phone: '',
  rollNo: '2301660100106',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'RAJ KUSHWAHA',
  email: 'student107',
  phone: '',
  rollNo: '2301660100107',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'RAJ MAURYA',
  email: 'student108',
  phone: '',
  rollNo: '2301660100108',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'RAJAN VERMA',
  email: 'student109',
  phone: '',
  rollNo: '2301660100109',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'RIDDHIMA SINHA',
  email: 'student110',
  phone: '',
  rollNo: '2301660100110',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'RISHABH KUMAR',
  email: 'student111',
  phone: '',
  rollNo: '2301660100111',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'RISHABH SHUKLA',
  email: 'student112',
  phone: '',
  rollNo: '2301660100112',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'RIYA SINGH',
  email: 'student113',
  phone: '',
  rollNo: '2301660100113',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'ROHIT YADAV',
  email: 'student114',
  phone: '',
  rollNo: '2301660100114',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SACHIN RAJPUT',
  email: 'student115',
  phone: '',
  rollNo: '2301660100115',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SAHIL KANAUJIYA',
  email: 'student116',
  phone: '',
  rollNo: '2301660100116',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SANDEEP KUMAR PATEL',
  email: 'student117',
  phone: '',
  rollNo: '2301660100117',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SANDEEP SINGH',
  email: 'student118',
  phone: '',
  rollNo: '2301660100118',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SANDHYA PANDEY',
  email: 'student119',
  phone: '',
  rollNo: '2301660100119',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SANGRAM',
  email: 'student120',
  phone: '',
  rollNo: '2301660100120',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SANJANA BHARTI',
  email: 'student121',
  phone: '',
  rollNo: '2301660100121',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SANKET YADAV',
  email: 'student122',
  phone: '',
  rollNo: '2301660100122',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SATISH KUMAR',
  email: 'student123',
  phone: '',
  rollNo: '2301660100123',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SATYAM MISHRA',
  email: 'student124',
  phone: '',
  rollNo: '2301660100124',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SHAILESH YADAV',
  email: 'student125',
  phone: '',
  rollNo: '2301660100125',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SHIVAM',
  email: 'student126',
  phone: '',
  rollNo: '2301660100126',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SHIVAM SHARMA',
  email: 'student127',
  phone: '',
  rollNo: '2301660100127',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SHIVAM SINGH',
  email: 'student128',
  phone: '',
  rollNo: '2301660100128',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SHIVANGI',
  email: 'student129',
  phone: '',
  rollNo: '2301660100129',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SHOBHIT KATIYAR',
  email: 'student130',
  phone: '',
  rollNo: '2301660100130',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SHREYA PANDEY',
  email: 'student131',
  phone: '',
  rollNo: '2301660100131',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SHREYANSH KANDU',
  email: 'student132',
  phone: '',
  rollNo: '2301660100132',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SIDDHARTH JAISWAL',
  email: 'student133',
  phone: '',
  rollNo: '2301660100133',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SONAL YADAV',
  email: 'student134',
  phone: '',
  rollNo: '2301660100134',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SRISHTI GUPTA',
  email: 'student135',
  phone: '',
  rollNo: '2301660100135',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SULABH GUPTA',
  email: 'student136',
  phone: '',
  rollNo: '2301660100136',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SUMIT KUMAR',
  email: 'student137',
  phone: '',
  rollNo: '2301660100137',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SURAJ KUMAR YADAV',
  email: 'student138',
  phone: '',
  rollNo: '2301660100138',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'SURYBHAN KUMAR',
  email: 'student139',
  phone: '',
  rollNo: '2301660100139',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'TANISHK SONI',
  email: 'student140',
  phone: '',
  rollNo: '2301660100140',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'TAPAN KUMAR YADAV',
  email: 'student141',
  phone: '',
  rollNo: '2301660100141',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'TARKESHWAR GUPTA',
  email: 'student142',
  phone: '',
  rollNo: '2301660100142',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'TAUSIF',
  email: 'student143',
  phone: '',
  rollNo: '2301660100143',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'UTKARSH KUSHWAHA',
  email: 'student144',
  phone: '',
  rollNo: '2301660100144',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'UTKARSH PATHAK',
  email: 'student145',
  phone: '',
  rollNo: '2301660100145',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'UTKARSH SAHU',
  email: 'student146',
  phone: '',
  rollNo: '2301660100146',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'UTKARSH SINGH',
  email: 'student147',
  phone: '',
  rollNo: '2301660100147',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'VIJAY KUMAR',
  email: 'student148',
  phone: '',
  rollNo: '2301660100148',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'VISHAL SHARMA',
  email: 'student149',
  phone: '',
  rollNo: '2301660100149',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'VISHESH YADAV',
  email: 'student150',
  phone: '',
  rollNo: '2301660100150',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
},
{
  name: 'VISHWAS CHAUHAN',
  email: 'student151',
  phone: '',
  rollNo: '2301660100151',
  password: await bcrypt.hash('student123', 10),
  courseId: courses[0]._id
}
    ];

    for (const studentData of students) {
      try {
        await Student.create(studentData);
        console.log('✅ Student created:', studentData.name);
      } catch (error) {
        if (error.code === 11000) {
          console.log('Student already exists:', studentData.name);
        } else {
          console.error('Error creating student:', error.message);
        }
      }
    }

    // Create sample attendance data
    const subjects = await Subject.find();
    const createdStudents = await Student.find();
    const teachers = await Teacher.find();
    
    if (subjects.length > 0 && createdStudents.length > 0 && teachers.length > 0) {
      console.log('\n📊 Creating attendance data...');
      
      const attendanceData = [];
      const startDate = new Date('2024-01-01');
      const endDate = new Date();
      
      for (let subject of subjects) {
        const courseStudents = createdStudents.filter(s => s.courseId.toString() === subject.courseId.toString());
        const teacher = teachers[0]; // Use first teacher
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
          for (let student of courseStudents) {
            const isPresent = Math.random() > 0.2; // 80% attendance rate
            attendanceData.push({
              studentId: student._id,
              subjectId: subject._id,
              teacherId: teacher._id,
              date: new Date(d),
              status: isPresent ? 'Present' : 'Absent'
            });
          }
        }
      }
      
      await Attendance.insertMany(attendanceData);
      console.log(`✅ Created ${attendanceData.length} attendance records`);
      
      // Calculate attendance percentages
      for (let student of createdStudents) {
        for (let subject of subjects) {
          const totalClasses = await Attendance.countDocuments({
            studentId: student._id,
            subjectId: subject._id
          });
          
          const presentClasses = await Attendance.countDocuments({
            studentId: student._id,
            subjectId: subject._id,
            status: 'Present'
          });
          
          const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(2) : 0;
          console.log(`📈 ${student.name} - ${subject.subjectName}: ${percentage}% (${presentClasses}/${totalClasses})`);
        }
      }
    }
    
    console.log('\n📋 Student Login Credentials:');
    console.log('👨🎓 Student 1: student1 / student123');
    console.log('👨🎓 Student 151: student151 / student123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

createStudents();