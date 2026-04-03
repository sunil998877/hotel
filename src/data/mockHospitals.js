export const mockHospitalDetails = {
  name: 'City Medical Center',
  address: '123 Main Street, New Delhi',
  phone: '+91 11 1234 5678',
  email: 'contact@cityhospital.com',
  website: 'www.cityhospital.com',
  rating: 4.8,
  totalReviews: 240,
  established: 2010,
  beds: 250,
  doctors: 45,
  facilities: [
    'Emergency',
    '24/7 ICU',
    'Trauma Center',
    'Laboratory',
    'Imaging Center',
    'Cardiology',
    'Neurology',
    'Orthopedics',
  ],
  accreditation: ['NABH', 'ISO 9001', 'JCI'],
  openingTime: '6:00 AM',
  closingTime: '11:00 PM',

  tests: [
    { name: 'Blood Test (CBC)', cost: 800 },
    { name: 'COVID-19 RT-PCR', cost: 1200 },
    { name: 'Thyroid Panel (TSH)', cost: 1500 },
    { name: 'Lipid Profile', cost: 2000 },
    { name: 'CT Scan (Head)', cost: 8000 },
    { name: 'MRI (Brain)', cost: 12000 },
  ],

  treatments: [
    { name: 'General Consultation', cost: 500 },
    { name: 'Physiotherapy (per session)', cost: 1000 },
    { name: 'Vaccination (COVID-19)', cost: 0 },
    { name: 'Minor Surgical Procedure', cost: 15000 },
    { name: 'Major Surgery', cost: 150000 },
  ],

  reviews: [
    {
      author: 'Rajesh Kumar',
      rating: 5,
      text: 'Excellent service and professional staff. Highly recommended!',
      date: '2 weeks ago',
    },
    {
      author: 'Priya Sharma',
      rating: 4,
      text: 'Good facilities but waiting time could be improved.',
      date: '1 month ago',
    },
    {
      author: 'Amit Patel',
      rating: 5,
      text: 'Best experience. Very caring doctors and nurses.',
      date: '2 months ago',
    },
  ],
};
