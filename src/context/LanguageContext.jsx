import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Header
    home: 'Home',
    dashboard: 'Dashboard',
    emergency: 'Emergency',
    login: 'Login',
    logout: 'Logout',
    hiw: 'How It Works',
    
    // Dashboard Components
    find_hospitals: 'Find Hospitals',
    search_desc: 'Search and compare hospitals near you',
    search_by_name: 'Search By Name or City',
    search_by_specialty: 'Search by Medical Specialty',
    radius: 'Radius',
    search_near_me: 'Search Near Me',
    details: 'Details',
    directions: 'Directions',
    verified: 'Verified',
    estimated: 'Estimated',
    filters: 'Filters',
    sort_by: 'Sort By',
    nearest: 'Distance (Nearest)',
    rating: 'Rating (Highest)',
    price_low: 'Price (Lowest)',
    
    // Hospital Details
    call_now: 'Call Now',
    save_hospital: 'Save Hospital',
    share: 'Share',
    facilities: 'Facilities & Services',
    reviews: 'Patient Reviews',
    avg_cost: 'Average Cost',
    starts_from: 'Starts From',
    
    // Common
    loading: 'Loading...',
    clear: 'Clear Results',
    no_results: 'No hospitals found',
  },
  hi: {
    // Header
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    emergency: 'आपातकालीन',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    hiw: 'यह कैसे काम करता है',
    
    // Dashboard Components
    find_hospitals: 'अस्पताल खोजें',
    search_desc: 'अपने आस-पास के अस्पतालों को खोजें और तुलना करें',
    search_by_name: 'नाम या शहर से खोजें',
    search_by_specialty: 'विशेषज्ञता द्वारा खोजें',
    radius: 'त्रिज्या (किमी)',
    search_near_me: 'मेरे पास खोजें',
    details: 'विवरण',
    directions: 'रास्ता',
    verified: 'सत्यापित',
    estimated: 'अनुमानित',
    filters: 'फ़िल्टर',
    sort_by: 'क्रमबद्ध करें',
    nearest: 'दूरी (सबसे पास)',
    rating: 'रेटिंग (उच्चतम)',
    price_low: 'कीमत (न्यूनतम)',
    
    // Hospital Details
    call_now: 'कॉल करें',
    save_hospital: 'अस्पताल सेव करें',
    share: 'शेयर करें',
    facilities: 'सुविधाएं और सेवाएं',
    reviews: 'मरीज की समीक्षा',
    avg_cost: 'औसत लागत',
    starts_from: 'से शुरू',
    
    // Common
    loading: 'लोड हो रहा है...',
    clear: 'परिणाम साफ करें',
    no_results: 'कोई अस्पताल नहीं मिला',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('appLanguage') || 'en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    localStorage.setItem('appLanguage', newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
