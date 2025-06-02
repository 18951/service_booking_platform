// Loader
window.onload = function() {
  setTimeout(() => {
      document.getElementById('loader').style.display = 'none';
  }, 2000);
  
  // Initialize carousels after page load
  initializeCarousels();
};

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease',
  once: true,
  offset: 100
});

// Toast notification system
function showToast(message, type = 'success') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
        <div class="toast-message">${message}</div>
      </div>
      <div class="toast-progress"></div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-hide');
      toast.addEventListener('transitionend', () => {
        toast.remove();
      });
    }, 3000);
  }
  
  // State
  let isLoggedIn = false;
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let isSignupMode = false;
  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  let userAddresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
  let isProfileEditable = false;
  let appliedCoupon = null;
  let users = JSON.parse(localStorage.getItem('users')) || [];
  
  
  // Indore pincode database
  const indorePincodes = [
    { pincode: "452001", address: "Indore GPO, MG Road, Indore" },
    { pincode: "452002", address: "Indore Kothari Market, Indore" },
    { pincode: "452003", address: "Vijay Nagar, Indore" },
    { pincode: "452004", address: "Navlakha, Indore" },
    { pincode: "452005", address: "Sudama Nagar, Indore" },
    { pincode: "452006", address: "Scheme No. 54, Indore" },
    { pincode: "452007", address: "Lasudia Mori, Indore" },
    { pincode: "452008", address: "Rau, Indore" },
    { pincode: "452009", address: "Palda, Indore" },
    { pincode: "452010", address: "MR 10, Indore" },
    { pincode: "452011", address: "Manorama Ganj, Indore" },
    { pincode: "452012", address: "Bhawrasla, Indore" },
    { pincode: "452013", address: "Banganga, Indore" },
    { pincode: "452014", address: "Mhow Naka, Indore" },
    { pincode: "452015", address: "Palasia, Indore" },
    { pincode: "452016", address: "Depalpur, Indore" },
    { pincode: "452017", address: "Chhoti Gwaltoli, Indore" },
    { pincode: "452018", address: "Supela, Indore" },
    { pincode: "452019", address: "Sanyogitaganj, Indore" },
    { pincode: "452020", address: "Tukoganj, Indore" },
    { pincode: "452110", address: "Sanwer, Indore" },
    { pincode: "452111", address: "Hatod, Indore" },
    { pincode: "452120", address: "Pithampur, Indore" },
    { pincode: "452121", address: "Sanwer Road, Indore" },
    { pincode: "452124", address: "Snehnagar, Indore" },
    { pincode: "452126", address: "Lig Square, Indore" },
    { pincode: "452127", address: "Scheme No. 71, Indore" },
    { pincode: "452128", address: "Nipania, Indore" },
    { pincode: "452129", address: "Limbodi, Indore" },
    { pincode: "452149", address: "Sector D, Indore" },
    { pincode: "452150", address: "Ring Road, Indore" },
    { pincode: "452160", address: "Usha Nagar, Indore" },
    { pincode: "452170", address: "Mahalakshmi Nagar, Indore" },
    { pincode: "452201", address: "Pipliyahana, Indore" },
    { pincode: "452202", address: "AB Road, Indore" },
    { pincode: "452203", address: "Scheme No. 78, Indore" },
    { pincode: "452204", address: "Rajendra Nagar, Indore" },
    { pincode: "452205", address: "Snehnagar Extension, Indore" },
    { pincode: "452206", address: "Vijay Nagar Extension, Indore" },
    { pincode: "452220", address: "MR 10, Indore" },
    { pincode: "452221", address: "Scheme No. 94, Indore" },
    { pincode: "452222", address: "Navlakha, Indore" },
    { pincode: "452223", address: "Rau, Indore" },
    { pincode: "452224", address: "Scheme No. 114, Indore" },
    { pincode: "452225", address: "Lasudia Mori, Indore" },
    { pincode: "452226", address: "Kanadia, Indore" },
    { pincode: "452227", address: "Pardesipura, Indore" },
    { pincode: "452228", address: "Alwasa, Indore" },
    { pincode: "452229", address: "Khajrana, Indore" },
    { pincode: "452331", address: "Sukhliya, Indore" },
    { pincode: "452332", address: "Bhawarkua, Indore" },
    { pincode: "452333", address: "Manglia, Indore" },
    { pincode: "452334", address: "Annapurna Road, Indore" },
    { pincode: "452335", address: "Palasia, Indore" },
    { pincode: "452336", address: "Airport Road, Indore" },
    { pincode: "452337", address: "Nanda Nagar, Indore" },
    { pincode: "452338", address: "Dadiya, Indore" },
    { pincode: "452339", address: "Chhavni, Indore" },
    { pincode: "452340", address: "Bengali Square, Indore" },
    { pincode: "452431", address: "Tukoganj, Indore" },
    { pincode: "452432", address: "Regal Square, Indore" },
    { pincode: "452433", address: "Sardar Patel Nagar, Indore" },
    { pincode: "452434", address: "Indrapuri, Indore" },
    { pincode: "452435", address: "New Palasia, Indore" },
    { pincode: "452436", address: "Tilak Nagar, Indore" },
    { pincode: "452437", address: "Manorama Ganj, Indore" },
    { pincode: "452438", address: "Nehru Nagar, Indore" },
    { pincode: "452439", address: "Kolar Road, Indore" },
    { pincode: "452440", address: "Kanadia Road, Indore" }
  ];
  
   // Pincode Validation
   function initPincode() {
    const pincodeInput = document.getElementById('pincodeInput');
    const pincodeContainer = document.querySelector('.pincode-suggestions');
    if (!pincodeInput || !pincodeContainer) return;
    pincodeInput.addEventListener('input', async function() {
      const inputVal = this.value.trim();
      if (inputVal.length >= 3 && /^\d+$/.test(inputVal)) {
        try {
          const matchingPincodes = indorePincodes.filter(p => p.pincode.startsWith(inputVal));
          let suggestionsHTML = '';
          if (matchingPincodes.length > 0) {
            suggestionsHTML = matchingPincodes.map(p => `
              <div class="pincode-suggestion" data-pincode="${p.pincode}">
                <div>${p.pincode}</div>
                <div class="pincode-address">${p.address}</div>
              </div>
            `).join('');
          } else {
            const randomCity = citiesComingSoon[Math.floor(Math.random() * citiesComingSoon.length)];
            suggestionsHTML = `
              <div class="coming-soon">
                Service not yet available for this pincode.<br>
                Coming soon to <span class="city-name">${randomCity}</span>!
              </div>
            `;
          }
          pincodeContainer.innerHTML = suggestionsHTML;
          pincodeContainer.style.display = 'block';
        } catch (error) {
          pincodeContainer.innerHTML = '<div class="no-pincode">Error fetching pincode data</div>';
          pincodeContainer.style.display = 'block';
        }
      } else {
        pincodeContainer.innerHTML = '<div class="no-pincode">Enter a valid 6-digit pincode</div>';
        pincodeContainer.style.display = 'block';
      }
    });
    pincodeContainer.addEventListener('click', function(e) {
      const suggestion = e.target.closest('.pincode-suggestion');
      if (suggestion) {
        const pincode = suggestion.dataset.pincode;
        const address = suggestion.querySelector('.pincode-address').textContent;
        pincodeInput.value = pincode;
        localStorage.setItem('selectedPincode', pincode);
        localStorage.setItem('selectedArea', address);
        showToast(`Service available at ${address}`, 'success');
        pincodeContainer.style.display = 'none';
      }
    });
    document.addEventListener('click', function(e) {
      if (!pincodeInput.contains(e.target) && !pincodeContainer.contains(e.target)) {
        pincodeContainer.style.display = 'none';
      }
    });
    pincodeInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const firstSuggestion = pincodeContainer.querySelector('.pincode-suggestion');
        if (firstSuggestion) {
          firstSuggestion.click();
        }
      }
    });
    const savedPincode = localStorage.getItem('selectedPincode');
    if (savedPincode) {
      pincodeInput.value = savedPincode;
    }
  }
  
  function isServiceAvailableAtLocation() {
    const pincode = localStorage.getItem('selectedPincode');
    return pincode && indorePincodes.some(p => p.pincode === pincode);
  }

  // Cities coming soon
  const citiesComingSoon = ['your city'];
  
  // Coupons
  const coupons = [
    { code: 'CAREMATE100', discount: 100 },
    { code: 'SAVE50', discount: 50 },
  ];
  
 // Services data correction - notice the name for Women's Haircut vs womens_haircut.jpg
const services = [
  { id: 1, name: "Men's Haircut", price: 299, image: "img/mens hair cut.png", category: "mensSalon" },
  { id: 2, name: "Beard Trim", price: 199, image: "img/mens hair cut.png", category: "mensSalon" },
  { id: 3, name: "Men's Facial", price: 499, image: "img/Mens Massage.png", category: "mensSalon" },
  { id: 4, name: "Hair Coloring", price: 799, image: "img/mens hair cut.png", category: "mensSalon" },
  { id: 5, name: "Head Massage", price: 249, image: "img/mens hair cut.png", category: "mensSalon" },
  { id: 6, name: "Women's Haircut", price: 499, image: "img/Womens Hair cut.png", category: "girlsSalon" },
  { id: 7, name: "Manicure", price: 399, image: "img/Womens Massage.png", category: "girlsSalon" },
  { id: 8, name: "Pedicure", price: 399, image: "img/pedicure.jpg", category: "girlsSalon" },
  { id: 9, name: "Waxing", price: 599, image: "img/waxing.jpg", category: "girlsSalon" },
  { id: 10, name: "Threading", price: 149, image: "img/threading.jpg", category: "girlsSalon" },
  { id: 11, name: "Facial", price: 699, image: "img/facial.jpg", category: "girlsSalon" },
  { id: 12, name: "Electrician", price: 499, image: "img/Electrician.png", category: "mostBooked" },
  { id: 13, name: "Plumber", price: 599, image: "img/Plumbing.png", category: "mostBooked" },
  { id: 14, name: "House Cleaning", price: 899, image: "img/Cleaning.png", category: "mostBooked" },
  { id: 15, name: "AC Repair", price: 799, image: "img/AC.jpg", category: "mostBooked" },
  { id: 16, name: "Refrigerator Repair ", price: 999, image: "img/Refrigerator.jpg", category: "mostBooked" },
  { id: 17, name: "Photography", price: 1999, image: "img/Photo.jpeg", category: "mostBooked" },
  { id: 18, name: "Wall Painting", price: 1499, image: "img/wall_painting.jpg", category: "homeDecoration" },
  { id: 19, name: "Curtain Installation", price: 799, image: "img/curtain_installation.jpg", category: "homeDecoration" },
  { id: 20, name: "Furniture Assembly", price: 999, image: "img/furniture_assembly.jpg", category: "homeDecoration" },
  { id: 21, name: "Interior Consultation", price: 1999, image: "img/interior_consultation.jpg", category: "homeDecoration" },
  { id: 22, name: "Lighting Installation", price: 1299, image: "img/lighting_installation.jpg", category: "homeDecoration" },
];

// Search Functionality - Updated to handle apostrophes and special characters
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBox = document.querySelector('.search-box');
  if (!searchInput || !searchBox) return;
  
  // Get all service names
  const allServices = services.map(service => service.name);
  
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    if (searchTerm.length > 0) {
      const matchingServices = allServices.filter(service => 
        service.toLowerCase().includes(searchTerm)
      );
      
      if (matchingServices.length > 0) {
        searchBox.innerHTML = matchingServices.map(service =>
          `<div class="search-suggestion" onclick="selectSearchSuggestion(this.getAttribute('data-service'))" data-service="${service}">${service}</div>`
        ).join('');
        searchBox.style.display = 'block';
      } else {
        searchBox.innerHTML = '<div class="no-results">No services found</div>';
        searchBox.style.display = 'block';
      }
    } else {
      searchBox.style.display = 'none';
    }
  });
  
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchBox.contains(e.target)) {
      searchBox.style.display = 'none';
    }
  });
  
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const firstSuggestion = searchBox.querySelector('.search-suggestion');
      if (firstSuggestion) {
        selectSearchSuggestion(firstSuggestion.getAttribute('data-service'));
      }
    }
  });
}

function selectSearchSuggestion(serviceName) {
  const searchInput = document.getElementById('searchInput');
  const searchBox = document.querySelector('.search-box');
  searchInput.value = serviceName;
  searchBox.style.display = 'none';
  
  // Find the selected service
  const service = services.find(s => s.name === serviceName);
  if (service) {
    highlightService(service);
  }
}

function highlightService(service) {
  // Debug the search
  console.log("Looking for service:", service.name);
  
  // Get all service cards
  const serviceCards = document.querySelectorAll('.carousel-item.card');
  console.log("Total cards found:", serviceCards.length);
  
  let found = false;
  
  // Normalize the service name for comparison - remove apostrophes and special chars
  const normalizeText = (text) => {
    return text.toLowerCase()
              .trim()
              .replace(/['´'']/g, '') // Remove different types of apostrophes
              .replace(/\s+/g, ' ');  // Normalize spaces
  };
  
  const normalizedServiceName = normalizeText(service.name);
  console.log("Normalized service name:", normalizedServiceName);
  
  // Check each card for a match
  serviceCards.forEach(card => {
    const cardTitle = card.querySelector('.card-title');
    
    if (cardTitle) {
      const cardTitleText = cardTitle.textContent;
      const normalizedCardTitle = normalizeText(cardTitleText);
      
      console.log("Checking card:", cardTitleText, "→", normalizedCardTitle);
      
      // First try exact match (case insensitive)
      if (normalizedCardTitle === normalizedServiceName || 
          cardTitleText.toLowerCase().trim() === service.name.toLowerCase().trim()) {
        highlightCard(card);
        found = true;
        console.log("MATCH FOUND!");
      }
    }
  });
  
  // If no exact match was found, try a more flexible matching approach
  if (!found) {
    serviceCards.forEach(card => {
      const cardTitle = card.querySelector('.card-title');
      
      if (cardTitle) {
        const normalizedCardTitle = normalizeText(cardTitle.textContent);
        
        // Check if the normalized service name is contained within the card title or vice versa
        if (normalizedCardTitle.includes(normalizedServiceName) || 
            normalizedServiceName.includes(normalizedCardTitle)) {
          highlightCard(card);
          found = true;
          console.log("PARTIAL MATCH FOUND!");
        }
      }
    });
  }
  
  if (!found) {
    // Log all available card titles for debugging
    console.log("Service not found:", service.name);
    console.log("Available card titles:", 
      Array.from(document.querySelectorAll('.card-title'))
        .map(t => t.textContent + " (normalized: " + normalizeText(t.textContent) + ")")
    );
    
    showToast(`Service "${service.name}" found in our catalog. Please check the corresponding category section.`, 'info');
  }
}

// Extracted the highlighting logic to a separate function
function highlightCard(card) {
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.add('highlight-service');
  
  // Add a more noticeable highlight effect
  card.style.boxShadow = '0 0 20px rgba(0, 123, 255, 0.8)';
  
  // Remove the highlighting after 2 seconds
  setTimeout(() => {
    card.classList.remove('highlight-service');
    card.style.boxShadow = '';
  }, 2000);
}
  
  // Profile Menu
  function updateProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    const userName = localStorage.getItem('currentUserName') || 'User';
    profileMenu.innerHTML = isLoggedIn ?
      `<div class="profile-user-info">Hello, ${userName}</div>
      <a href="#profile" id="myprofile" class="profile-menu-item" onclick="openProfileModal()"><i class="fas fa-user"></i> My Profile</a>
      <a href="#my_booking" id="mybooking" class="profile-menu-item" onclick="openMyBookings()"><i class="fas fa-calendar-check"></i> My Bookings</a>
      <a href="#" id="logout" class="profile-menu-item" onclick="confirmLogout()"><i class="fas fa-sign-out-alt"></i> Logout</a>` :
      `<a href="#" id="register" class="profile-menu-item" onclick="openAuthModal(true)"><i class="fas fa-user-plus"></i> Register</a>
      <a href="#" id="signin" class="profile-menu-item" onclick="openAuthModal(false)"><i class="fas fa-sign-in-alt"></i> Signin</a>`;
  }
  
  // Confirmation Modal
  function openConfirmModal(title, message, onConfirm, onCancel) {
    const confirmModal = document.createElement('div');
    confirmModal.id = 'confirmModal';
    confirmModal.className = 'modal';
    confirmModal.innerHTML = `
      <div class="modal-content confirm-modal">
        <div class="modal-header">
          <h2>${title}</h2>
          <span class="close-modal" onclick="closeConfirmModal()">×</span>
        </div>
        <div class="confirm-content">
          <p>${message}</p>
          <div class="confirm-actions">
            <button class="btn-primary" onclick="${onConfirm}">Yes</button>
            <button class="btn-secondary" onclick="${onCancel || 'closeConfirmModal()'}">No</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(confirmModal);
    confirmModal.classList.add('active');
  }
  
  function closeConfirmModal() {
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
      confirmModal.classList.remove('active');
      confirmModal.classList.add('closing');
      setTimeout(() => confirmModal.remove(), 300);
    }
  }
  
  // Logout with Confirmation
  function confirmLogout() {
    openConfirmModal(
      'Confirm Logout',
      'Are you sure you want to log out?',
      'handleLogout()',
      'closeConfirmModal()'
    );
  }
  
  function handleLogout() {
    isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUserMobile');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentUserAddress');
    localStorage.removeItem('currentUserAvatar');
    updateProfileMenu();
    closeConfirmModal();
    showToast('Successfully logged out!', 'info');
  }
  
  // Auth Modal
  function openAuthModal(signupMode) {
    isSignupMode = signupMode;
    const authModal = document.getElementById('authModal');
    const authTitle = document.getElementById('authTitle');
    const nameLabel = document.getElementById('nameLabel');
    const emailLabel = document.getElementById('emailLabel');
    const toggleLink = document.getElementById('toggleLink');
    authTitle.textContent = signupMode ? 'Register' : 'Signin';
    nameLabel.style.display = signupMode ? 'block' : 'none';
    emailLabel.style.display = signupMode ? 'block' : 'none';
    toggleLink.textContent = signupMode ? 'Switch to Signin' : 'Switch to Register';
    authModal.classList.add('active');
    document.getElementById('otpContainer').classList.remove('active');
    document.getElementById('otpTimerContainer').style.display = 'none';
    document.getElementById('resendOtpBtn').style.display = 'none';
    document.getElementById('getOtpBtn').style.display = 'block';
    document.getElementById('mobile').value = '';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.querySelectorAll('.otp-input').forEach(input => input.value = '');
  }
  
  function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    authModal.classList.remove('active');
    authModal.classList.add('closing');
    setTimeout(() => authModal.classList.remove('closing'), 300);
  }
  
  function initAuth() {
    const getOtpBtn = document.getElementById('getOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const toggleLink = document.getElementById('toggleLink');
    const mobileInput = document.getElementById('mobile');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const otpInputs = document.querySelectorAll('.otp-input');
    let timerInterval;
  
    if (otpInputs && otpInputs.length > 0) {
      otpInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
          const value = e.target.value;
          if (value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
          }
        });
        input.addEventListener('keydown', function(e) {
          if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpInputs[index - 1].focus();
          }
        });
        input.addEventListener('paste', function(e) {
          e.preventDefault();
          const pasteData = (e.clipboardData || window.clipboardData).getData('text');
          if (/^\d+$/.test(pasteData)) {
            for (let i = 0; i < otpInputs.length && i < pasteData.length; i++) {
              otpInputs[i].value = pasteData[i];
            }
            if (pasteData.length < otpInputs.length) {
              otpInputs[pasteData.length].focus();
            } else {
              otpInputs[otpInputs.length - 1].focus();
            }
          }
        });
      });
    }
  
    function startOtpTimer() {
      getOtpBtn.style.display = 'none';
      document.getElementById('otpTimerContainer').style.display = 'block';
      resendOtpBtn.style.display = 'none';
      let timeLeft = 30;
      document.getElementById('otpTimer').textContent = timeLeft;
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('otpTimer').textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          document.getElementById('otpTimerContainer').style.display = 'none';
          resendOtpBtn.style.display = 'block';
        }
      }, 1000);
    }
  
    if (getOtpBtn) {
      getOtpBtn.addEventListener('click', () => {
        const mobile = mobileInput.value.trim();
        if (!/^[0-9]{10}$/.test(mobile)) {
          showToast('Please enter a valid 10-digit mobile number', 'error');
          return;
        }
        const userExists = users.some(user => user.mobile === mobile);
        if (isSignupMode && userExists) {
          showToast('This mobile number is already registered. Please sign in.', 'error');
          return;
        }
        if (!isSignupMode && !userExists) {
          showToast('This mobile number is not registered. Please register first.', 'error');
          return;
        }
        if (isSignupMode && !nameInput.value.trim()) {
          showToast('Please enter your name', 'error');
          return;
        }
        if (isSignupMode && !emailInput.value.trim()) {
          showToast('Please enter your email', 'error');
          return;
        }
        localStorage.setItem('currentMobile', mobile);
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        localStorage.setItem('currentOTP', otp);
        console.log(`OTP for ${mobile}: ${otp}`);
        showToast(`OTP sent to ${mobile}. Check SMS for OTP.`, 'success');
        document.getElementById('otpContainer').classList.add('active');
        startOtpTimer();
      });
    }
  
    if (verifyOtpBtn) {
      verifyOtpBtn.addEventListener('click', () => {
        const otpInputs = document.querySelectorAll('.otp-input');
        let enteredOTP = '';
        let allFilled = true;
        otpInputs.forEach(input => {
          enteredOTP += input.value;
          if (input.value.length === 0) allFilled = false;
        });
        if (!allFilled) {
          showToast('Please enter the complete OTP!', 'error');
          return;
        }
        const storedOTP = localStorage.getItem('currentOTP');
        const mobileNumber = localStorage.getItem('currentMobile');
        if (enteredOTP === storedOTP) {
          clearInterval(timerInterval);
          if (isSignupMode) {
            const newUser = {
              name: nameInput.value.trim(),
              mobile: mobileNumber,
              email: emailInput.value.trim(),
              address: '',
              registeredAt: new Date().toISOString()
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUserMobile', mobileNumber);
            localStorage.setItem('currentUserName', nameInput.value.trim());
            localStorage.setItem('currentUserEmail', emailInput.value.trim());
            localStorage.setItem('currentUserAddress', '');
            localStorage.setItem('currentUserAvatar', 'https://th.bing.com/th/id/OIP.LftRMxkISZ37h5xsxfDCWQHaHa?rs=1&pid=ImgDetMain');
            isLoggedIn = true;
            updateProfileMenu();
          } else {
            const user = users.find(u => u.mobile === mobileNumber);
            if (user) {
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('currentUserMobile', mobileNumber);
              localStorage.setItem('currentUserName', user.name);
              localStorage.setItem('currentUserEmail', user.email);
              localStorage.setItem('currentUserAddress', user.address || '');
              if (!localStorage.getItem('currentUserAvatar')) {
                localStorage.setItem('currentUserAvatar', 'https://th.bing.com/th/id/OIP.LftRMxkISZ37h5xsxfDCWQHaHa?rs=1&pid=ImgDetMain');
              }
              isLoggedIn = true;
              updateProfileMenu();
            } else {
              showToast('User not found. Please register.', 'error');
              return;
            }
          }
          closeAuthModal();
          showToast('Successfully logged in!', 'success');
          localStorage.removeItem('currentOTP');
          localStorage.removeItem('currentMobile');
        } else {
          showToast('Invalid OTP. Please try again.', 'error');
        }
      });
    }
  
    if (resendOtpBtn) {
      resendOtpBtn.addEventListener('click', () => {
        const mobile = mobileInput.value.trim();
        localStorage.setItem('currentMobile', mobile);
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        localStorage.setItem('currentOTP', otp);
        console.log(`OTP for ${mobile}: ${otp}`);
        showToast(`OTP resent to ${mobile}. Check SMS for OTP.`, 'success');
        startOtpTimer();
      });
    }
  
    if (toggleLink) {
      toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal(!isSignupMode);
      });
    }
  }
  
  // Profile Modal
  function openProfileModal() {
    const userName = localStorage.getItem('currentUserName') || '';
    const userMobile = localStorage.getItem('currentUserMobile') || '';
    const userEmail = localStorage.getItem('currentUserEmail') || '';
    const userAddress = localStorage.getItem('currentUserAddress') || '';
    const userAvatar = localStorage.getItem('currentUserAvatar') || 'https://th.bing.com/th/id/OIP.LftRMxkISZ37h5xsxfDCWQHaHa?rs=1&pid=ImgDetMain';
    const profileModal = document.createElement('div');
    profileModal.id = 'profileModal';
    profileModal.className = 'modal';
    profileModal.innerHTML = `
      <div class="modal-content profile-modal">
        <div class="modal-header">
          <h2>Manage Profile</h2>
          <span class="close-modal" onclick="closeProfileModal()" aria-label="Close Profile Modal">×</span>
        </div>
        <div class="profile-content">
          <div class="profile-avatar">
            <img id="profileAvatar" src="${userAvatar}" alt="Profile Photo" style="width: 100px; height: 100px; border-radius: 50%;">
            <div id="avatarControls" style="display: ${isProfileEditable ? 'block' : 'none'}; margin-top: 10px;">
              <input type="file" id="avatarInput" accept="image/*" style="display: none;">
              <button type="button" id="uploadAvatarBtn" class="btn btn-secondary" data-testid="upload-avatar">Upload Photo</button>
              <button type="button" id="removeAvatarBtn" class="btn btn-secondary" data-testid="remove-avatar">Remove Photo</button>
            </div>
          </div>
          <form id="profileForm">
            <div class="form-group">
              <label for="profileName">Name</label>
              <input type="text" id="profileName" value="${userName}" ${!isProfileEditable ? 'readonly' : ''} data-testid="profile-name">
            </div>
            <div class="form-group">
              <label for="profileMobile">Mobile Number</label>
              <input type="tel" id="profileMobile" value="${userMobile}" readonly data-testid="profile-mobile">
              <small>Mobile number cannot be changed</small>
            </div>
            <div class="form-group">
              <label for="profileEmail">Email</label>
              <input type="email" id="profileEmail" value="${userEmail}" ${!isProfileEditable ? 'readonly' : ''} data-testid="profile-email">
            </div>
            <div class="form-group">
              <label for="profileAddress">Address</label>
              <textarea id="profileAddress" ${!isProfileEditable ? 'readonly' : ''} data-testid="profile-address">${userAddress}</textarea>
            </div>
            <div class="profile-actions">
              <button type="button" id="editProfileBtn" class="btn-primary" onclick="toggleProfileEdit()" data-testid="edit-profile">${isProfileEditable ? 'Save Profile' : 'Edit Profile'}</button>
              <button type="button" class="btn-secondary" onclick="closeProfileModal()" data-testid="cancel-profile">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(profileModal);
    profileModal.classList.add('active');
  
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    const removeAvatarBtn = document.getElementById('removeAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
  
    if (uploadAvatarBtn && avatarInput) {
      uploadAvatarBtn.addEventListener('click', () => {
        avatarInput.click();
      });
      avatarInput.addEventListener('change', (e) => {
        uploadAvatar(e);
      });
    }
    if (removeAvatarBtn) {
      removeAvatarBtn.addEventListener('click', removeAvatar);
    }
  }
  
  function closeProfileModal() {
    const profileModal = document.getElementById('profileModal');
    if (profileModal) {
      profileModal.classList.remove('active');
      profileModal.classList.add('closing');
      setTimeout(() => profileModal.remove(), 300);
    }
  }
  
  function uploadAvatar(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const avatarImg = document.getElementById('profileAvatar');
        avatarImg.src = e.target.result;
        localStorage.setItem('currentUserAvatar', e.target.result);
        showToast('Profile photo uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    } else {
      showToast('Please select a valid image file', 'error');
    }
  }
  
  function removeAvatar() {
    const defaultAvatar = 'https://th.bing.com/th/id/OIP.LftRMxkISZ37h5xsxfDCWQHaHa?rs=1&pid=ImgDetMain';
    const avatarImg = document.getElementById('profileAvatar');
    avatarImg.src = defaultAvatar;
    localStorage.setItem('currentUserAvatar', defaultAvatar);
    showToast('Profile photo removed successfully!', 'success');
  }
  
  function toggleProfileEdit() {
    isProfileEditable = !isProfileEditable;
    const editProfileBtn = document.getElementById('editProfileBtn');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileAddress = document.getElementById('profileAddress');
    const avatarControls = document.getElementById('avatarControls');
    if (isProfileEditable) {
      profileName.removeAttribute('readonly');
      profileEmail.removeAttribute('readonly');
      profileAddress.removeAttribute('readonly');
      avatarControls.style.display = 'block';
      editProfileBtn.textContent = 'Save Profile';
    } else {
      const newName = profileName.value.trim();
      const newEmail = profileEmail.value.trim();
      const newAddress = profileAddress.value.trim();
      if (!newName || !newEmail) {
        showToast('Name and email cannot be empty', 'error');
        return;
      }
      const userMobile = localStorage.getItem('currentUserMobile');
      const userIndex = users.findIndex(u => u.mobile === userMobile);
      if (userIndex !== -1) {
        users[userIndex].name = newName;
        users[userIndex].email = newEmail;
        users[userIndex].address = newAddress;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUserName', newName);
        localStorage.setItem('currentUserEmail', newEmail);
        localStorage.setItem('currentUserAddress', newAddress);
      }
      profileName.setAttribute('readonly', 'true');
      profileEmail.setAttribute('readonly', 'true');
      profileAddress.setAttribute('readonly', 'true');
      avatarControls.style.display = 'none';
      editProfileBtn.textContent = 'Edit Profile';
      showToast('Profile updated successfully!', 'success');
      updateProfileMenu();
    }
  }
  
  // Cart Management
  function updateCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    if (!cartItemsContainer || !cartCount) return;
    cartCount.textContent = cartItems.reduce((total, item) => total + item.quantity, 0);
    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty!</div>';
      document.getElementById('cartCheckout').style.display = 'none';
      return;
    }
    document.getElementById('cartCheckout').style.display = 'block';
    cartItemsContainer.innerHTML = cartItems.map(item => `
      <div class="cart-item">
        <div class="cart-item-img" style="background-image: url('${item.image}');"></div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price * item.quantity}</div>
          <div class="quantity-controls">
            <button onclick="updateQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
      </div>
    `).join('');
  }
  
  function addToCart(serviceId) {
    if (!isServiceAvailableAtLocation()) {
      showToast('Please select a valid pincode first!', 'error');
      return;
    }
    if (!isLoggedIn) {
      showToast('Please log in to add items to cart!', 'error');
      openAuthModal(false);
      return;
    }
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    const existingItem = cartItems.find(item => item.id === serviceId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        id: service.id,
        name: service.name,
        price: service.price,
        image: service.image,
        quantity: 1
      });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCart();
    showToast(`${service.name} added to cart!`, 'success');
  }
  
  function updateQuantity(serviceId, change) {
    const item = cartItems.find(item => item.id === serviceId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        cartItems = cartItems.filter(item => item.id !== serviceId);
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCart();
    }
  }
  
  function removeFromCart(serviceId) {
    cartItems = cartItems.filter(item => item.id !== serviceId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCart();
    showToast('Item removed from cart!', 'success');
  }
  
  // Booking Details Modal
  function openBookingDetails() {
    if (!isLoggedIn) {
      showToast('Please log in to proceed!', 'error');
      openAuthModal(false);
      return;
    }
    if (cartItems.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }
    if (!isServiceAvailableAtLocation()) {
      showToast('Please select a valid pincode first!', 'error');
      return;
    }
    const userName = localStorage.getItem('currentUserName') || '';
    const userMobile = localStorage.getItem('currentUserMobile') || '';
    const userEmail = localStorage.getItem('currentUserEmail') || '';
    const userAddress = localStorage.getItem('currentUserAddress') || '';
    const bookingModal = document.createElement('div');
    bookingModal.id = 'bookingDetailsModal';
    bookingModal.className = 'modal';
    bookingModal.innerHTML = `
      <div class="modal-content booking-details-modal">
        <div class="modal-header">
          <h2>Booking Details</h2>
          <span class="close-modal" onclick="closeBookingDetailsModal()">×</span>
        </div>
        <div class="booking-details-content">
          <h3>User Information</h3>
          <div class="user-info">
            <div class="form-group">
              <label for="bookingName">Name</label>
              <input type="text" id="bookingName" value="${userName}">
            </div>
            <div class="form-group">
              <label for="bookingMobile">Mobile</label>
              <input type="tel" id="bookingMobile" value="${userMobile}">
            </div>
            <div class="form-group">
              <label for="bookingEmail">Email</label>
              <input type="email" id="bookingEmail" value="${userEmail}">
            </div>
          </div>
          <h3>Address</h3>
          <div class="address-selector">
            <textarea id="bookingAddress" placeholder="Enter your address">${userAddress}</textarea>
          </div>
          <h3>Date & Time</h3>
          <div class="date-time-selector">
            <div class="date-options" id="dateOptions"></div>
            <div class="time-options" id="timeOptions"></div>
          </div>
          <h3>Coupon</h3>
          <div class="coupon-input">
            <input type="text" id="couponCode" placeholder="Enter coupon code">
            <button type="button" id="applyCouponBtn" class="btn-primary">Apply</button>
            <button type="button" id="removeCouponBtn" class="btn-secondary" style="display: none;">Remove</button>
            <span id="couponStatus"></span>
          </div>
          <h3>Payment Summary</h3>
          <div class="payment-summary" id="paymentSummary"></div>
          <h3>Payment Method</h3>
          <div class="payment-methods">
            <div class="payment-method selected" data-method="razorpay">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay">
              <span>Razorpay</span>
            </div>
          </div>
          <div class="booking-actions">
            <button type="button" id="confirmBookingBtn" class="btn-primary" onclick="confirmBooking()">Confirm Booking</button>
            <button type="button" class="btn-secondary" onclick="closeBookingDetailsModal()">Cancel</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(bookingModal);
    bookingModal.classList.add('active');
    appliedCoupon = null;
    document.getElementById('couponCode').value = '';
    document.getElementById('couponStatus').textContent = '';
    initDateTimeSelector();
    updatePaymentSummary();
    document.getElementById('applyCouponBtn').addEventListener('click', applyCoupon);
    document.getElementById('removeCouponBtn').addEventListener('click', removeCoupon);
  }
  
  function closeBookingDetailsModal() {
    const bookingModal = document.getElementById('bookingDetailsModal');
    if (bookingModal) {
      bookingModal.classList.remove('active');
      bookingModal.classList.add('closing');
      setTimeout(() => bookingModal.remove(), 300);
    }
  }
  
  function initDateTimeSelector() {
    const dateOptions = document.getElementById('dateOptions');
    const timeOptions = document.getElementById('timeOptions');
    if (!dateOptions || !timeOptions) return;
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    dateOptions.innerHTML = dates.map(date => `
      <div class="date-option" data-date="${date}">${new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
    `).join('');
    const timeSlots = ['10:00 AM - 12:00 PM', '12:00 PM - 03:00 PM', '03:00 PM - 06:00 PM'];
    timeOptions.innerHTML = timeSlots.map(time => `
      <div class="time-option" data-time="${time}">${time}</div>
    `).join('');
    document.querySelectorAll('.date-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.date-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
      });
    });
    document.querySelectorAll('.time-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.time-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
      });
    });
  }
  
  function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.trim();
    const couponStatus = document.getElementById('couponStatus');
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const removeCouponBtn = document.getElementById('removeCouponBtn');
    if (!couponCode) {
      couponStatus.textContent = 'Please enter a coupon code';
      couponStatus.style.color = '#d63031';
      return;
    }
    const coupon = coupons.find(c => c.code === couponCode);
    if (coupon) {
      appliedCoupon = coupon;
      couponStatus.textContent = `Coupon applied! ₹${coupon.discount} off`;
      couponStatus.style.color = '#2ecc71';
      document.getElementById('couponCode').setAttribute('disabled', 'true');
      applyCouponBtn.setAttribute('disabled', 'true');
      removeCouponBtn.style.display = 'inline-block';
      updatePaymentSummary();
    } else {
      couponStatus.textContent = 'Invalid coupon code';
      couponStatus.style.color = '#d63031';
      appliedCoupon = null;
      updatePaymentSummary();
    }
  }
  
  function removeCoupon() {
    const couponStatus = document.getElementById('couponStatus');
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const removeCouponBtn = document.getElementById('removeCouponBtn');
    const couponCodeInput = document.getElementById('couponCode');
    appliedCoupon = null;
    couponStatus.textContent = '';
    couponCodeInput.value = '';
    couponCodeInput.removeAttribute('disabled');
    applyCouponBtn.removeAttribute('disabled');
    removeCouponBtn.style.display = 'none';
    updatePaymentSummary();
    showToast('Coupon removed!', 'info');
  }

    function updatePaymentSummary() {
      const paymentSummary = document.getElementById('paymentSummary');
      if (!paymentSummary) return;
      let subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      let tax = subtotal * 0.05; // 5% GST
      let discount = appliedCoupon ? appliedCoupon.discount : 0;
      let total = subtotal + tax - discount;
      paymentSummary.innerHTML = `
        <div><span>Subtotal:</span><span>₹${subtotal.toFixed(2)}</span></div>
        <div><span>Tax (5%):</span><span>₹${tax.toFixed(2)}</span></div>
        <div><span>Discount:</span><span>-₹${discount.toFixed(2)}</span></div>
        <div><span>Total:</span><span>₹${total.toFixed(2)}</span></div>
      `;
    }

    function confirmBooking() {
      const bookingName = document.getElementById('bookingName').value.trim();
      const bookingMobile = document.getElementById('bookingMobile').value.trim();
      const bookingEmail = document.getElementById('bookingEmail').value.trim();
      const bookingAddress = document.getElementById('bookingAddress').value.trim();
      const selectedDate = document.querySelector('.date-option.selected')?.dataset.date;
      const selectedTime = document.querySelector('.time-option.selected')?.dataset.time;

      // Validate user information
      if (!bookingName) {
        showToast('Please enter your name', 'error');
        return;
      }
      if (!/^[0-9]{10}$/.test(bookingMobile)) {
        showToast('Please enter a valid 10-digit mobile number', 'error');
        return;
      }
      if (!bookingEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingEmail)) {
        showToast('Please enter a valid email address', 'error');
        return;
      }
      if (!bookingAddress) {
        showToast('Please enter your address', 'error');
        return;
      }
      if (!selectedDate || !selectedTime) {
        showToast('Please select a date and time', 'error');
        return;
      }

      const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const tax = subtotal * 0.18;
      const discount = appliedCoupon ? appliedCoupon.discount : 0;
      const total = subtotal + tax - discount;

      const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag', // Replace with your Razorpay key
        amount: total * 100, // Amount in points (1 INR = 100 paise)
        currency: 'INR',
        name: 'CareMate',
        description: 'Service Booking',
        image: 'img/logo.jpg',
        handler: function(response) {
          const booking = {
            id: `BOOK${Math.floor(Math.random() * 1000000)}`,
            userMobile: bookingMobile,
            userName: bookingName,
            userEmail: bookingEmail,
            address: bookingAddress,
            items: cartItems,
            date: selectedDate,
            time: selectedTime,
            subtotal,
            tax,
            discount,
            total,
            paymentId: response.razorpay_payment_id,
            status: 'Confirmed',
            createdAt: new Date().toISOString()
          };
          bookings.push(booking);
          localStorage.setItem('bookings', JSON.stringify(bookings));
          cartItems = [];
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
          updateCart();
          closeBookingDetailsModal();
          showToast('Booking confirmed successfully!', 'success');
          openMyBookings();
        },
        prefill: {
          name: bookingName,
          email: bookingEmail,
          contact: bookingMobile
        },
        theme: {
          color: '#f39c12'
        }
      };
      const rzp = new Razorpay(options);
      rzp.open();
    }

// My Bookings Modal with Tracking Timeline
function openMyBookings() {
  if (!isLoggedIn) {
    showToast('Please log in to view your bookings!', 'error');
    openAuthModal(false);
    return;
  }
  
  const userMobile = localStorage.getItem('currentUserMobile');
  const userBookings = bookings.filter(booking => booking.userMobile === userMobile);
  
  
  // Sort bookings by createdAt date in descending order (newest first)
  userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const bookingsModal = document.createElement('div');
  bookingsModal.id = 'myBookingsModal';
  bookingsModal.className = 'modal';
  bookingsModal.innerHTML = `
    <div class="modal-content my-bookings-modal">
      <div class="modal-header">
        <h2>My Bookings</h2>
        <span class="close-modal" onclick="closeMyBookingsModal()">×</span>
      </div>
      <div class="booking-list" id="bookingList"></div>
    </div>
  `;
  
  document.body.appendChild(bookingsModal);
  bookingsModal.classList.add('active');
  
  const bookingList = document.getElementById('bookingList');
  if (userBookings.length === 0) {
    bookingList.innerHTML = '<p>No bookings found!</p>';
    return;
  }
  
  bookingList.innerHTML = userBookings.map(booking => {
    // Generate tracking timeline HTML directly here - ONLY within the My Bookings function
    let timelineHTML = '<div class="tracking-timeline">';
    
    // Always add the confirmed booking status
    timelineHTML += `
      <div class="timeline-item completed">
        <div class="timeline-node">✓</div>
        <div class="timeline-label">Booking Confirmed</div>
        <div class="timeline-date">${new Date(booking.createdAt).toLocaleDateString('en-GB')}</div>
      </div>
    `;
    
    // Check if booking is cancelled
    if (booking.status.toLowerCase() === 'cancelled') {
      // Add cancelled status
      timelineHTML += `
        <div class="timeline-item cancelled">
          <div class="timeline-node">✕</div>
          <div class="timeline-label">Cancelled</div>
          <div class="timeline-date">${booking.cancelledDate ? new Date(booking.cancelledDate).toLocaleDateString('en-GB') : '-'}</div>
        </div>
      `;
    } else {
      // Add in-progress status
      if (booking.status.toLowerCase() === 'in progress' || booking.status.toLowerCase() === 'completed') {
        timelineHTML += `
          <div class="timeline-item ${booking.status.toLowerCase() === 'in progress' ? 'active' : 'completed'}">
            <div class="timeline-node">${booking.status.toLowerCase() === 'in progress' ? '●' : '✓'}</div>
            <div class="timeline-label">In Progress</div>
            <div class="timeline-date">${booking.inProgressDate ? new Date(booking.inProgressDate).toLocaleDateString('en-GB') : '-'}</div>
          </div>
        `;
      } else if (booking.status.toLowerCase() === 'confirmed') {
        timelineHTML += `
          <div class="timeline-item">
            <div class="timeline-node">○</div>
            <div class="timeline-label">In Progress</div>
            <div class="timeline-date">-</div>
          </div>
        `;
      }
      
      // Add completed status
      if (booking.status.toLowerCase() === 'completed') {
        timelineHTML += `
          <div class="timeline-item completed">
            <div class="timeline-node">✓</div>
            <div class="timeline-label">Completed</div>
            <div class="timeline-date">${booking.completedDate ? new Date(booking.completedDate).toLocaleDateString('en-GB') : '-'}</div>
          </div>
        `;
      } else {
        timelineHTML += `
          <div class="timeline-item">
            <div class="timeline-node">○</div>
            <div class="timeline-label">Completed</div>
            <div class="timeline-date">-</div>
          </div>
        `;
      }
    }
    
    timelineHTML += '</div>';
    
    return `
      <div class="booking-item">
        <h4>Booking ID: ${booking.id}</h4>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-GB')} at ${booking.time}</p>
        <p><strong>Address:</strong> ${booking.address}</p>
        <p><strong>Services:</strong> ${booking.items.map(item => `${item.name} (₹${item.price} x ${item.quantity})`).join(', ')}</p>
        <p><strong>Total:</strong> ₹${booking.total.toFixed(2)}</p>
        <p><strong>Status:</strong> <span class="booking-status ${booking.status.toLowerCase()}">${booking.status}</span></p>
        ${timelineHTML}
      </div>
    `;
  }).join('');
}

function closeMyBookingsModal() {
  const bookingsModal = document.getElementById('myBookingsModal');
  if (bookingsModal) {
    bookingsModal.classList.remove('active');
    bookingsModal.classList.add('closing');
    setTimeout(() => bookingsModal.remove(), 300);
  }
}

// Function to update booking status - use this when admin changes status
function updateBookingStatus(bookingId, newStatus) {
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return;
  
  // Update status
  booking.status = newStatus;
  
  // Add date for status change
  const now = new Date();
  switch(newStatus.toLowerCase()) {
    case 'in progress':
      booking.inProgressDate = now;
      break;
    case 'completed':
      booking.completedDate = now;
      break;
    case 'cancelled':
      booking.cancelledDate = now;
      break;
  }
  
  // Update local storage
  localStorage.setItem('bookings', JSON.stringify(bookings));
  
  
  // Refresh the bookings modal if open
  const bookingsModal = document.getElementById('myBookingsModal');
  if (bookingsModal) {
    openMyBookings();
  }
}

    // View More Modal
    function openViewMoreModal(category) {
      const filteredServices = category === 'all' ? services : services.filter(s => s.category === category);
      const viewMoreModal = document.createElement('div');
      viewMoreModal.id = 'viewMoreModal';
      viewMoreModal.className = 'modal';
      viewMoreModal.innerHTML = `
        <div class="modal-content view-more-modal">
          <div class="modal-header">
            <h2>${category === 'all' ? 'All Services' : document.getElementById(category).querySelector('.section-title').textContent}</h2>
            <span class="close-modal" onclick="closeViewMoreModal()">×</span>
          </div>
          <div class="view-more-content" id="viewMoreContent"></div>
        </div>
      `;
      document.body.appendChild(viewMoreModal);
      viewMoreModal.classList.add('active');
      const viewMoreContent = document.getElementById('viewMoreContent');
      viewMoreContent.innerHTML = filteredServices.map(service => `
        <div class="carousel-item card">
          <div class="card-img" style="background-image: url('${service.image}');"></div>
          <div class="card-body">
            <h3 class="card-title">${service.name}</h3>
          </div>
          <div class="card-footer">
            <span class="card-price">₹${service.price}</span>
            <button class="btn-sm" onclick="addToCart(${service.id})">Add to Cart</button>
          </div>
        </div>
      `).join('');
    }

    function closeViewMoreModal() {
      const viewMoreModal = document.getElementById('viewMoreModal');
      if (viewMoreModal) {
        viewMoreModal.classList.remove('active');
        viewMoreModal.classList.add('closing');
        setTimeout(() => viewMoreModal.remove(), 300);
      }
    }

    // Carousel Scroll
    function scrollCarousel(carouselId, scrollAmount) {
      const carousel = document.getElementById(carouselId);
      if (carousel) {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }

    // Initialize Services
    function initServices() {
      const carousels = {
        allServicesCarousel: services,
        mensSalonCarousel: services.filter(s => s.category === 'mensSalon'),
        girlsSalonCarousel: services.filter(s => s.category === 'girlsSalon'),
        mostBookedCarousel: services.filter(s => s.category === 'mostBooked'),
        homeDecorationCarousel: services.filter(s => s.category === 'homeDecoration')
      };
      Object.keys(carousels).forEach(carouselId => {
        const carousel = document.getElementById(carouselId);
        if (carousel) {
          carousel.innerHTML = carousels[carouselId].map(service => `
            <div class="carousel-item card">
              <div class="card-img" style="background-image: url('${service.image}');"></div>
              <div class="card-body">
                <h3 class="card-title">${service.name}</h3>
              </div>
              <div class="card-footer">
                <span class="card-price">₹${service.price}</span>
                <button class="btn-sm" onclick="addToCart(${service.id})">Add to Cart</button>
              </div>
            </div>
          `).join('');
        }
      });
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      updateProfileMenu();
      updateCart();
      initServices();
      initSearch();
      initPincode();
      initAuth();
      document.getElementById('cartButton').addEventListener('click', () => {
        document.getElementById('cartModal').classList.toggle('active');
      });
      document.getElementById('closeCart').addEventListener('click', () => {
        document.getElementById('cartModal').classList.remove('active');
      });
      document.getElementById('profileButton').addEventListener('click', () => {
        document.getElementById('profileMenu').classList.toggle('active');
      });
      document.addEventListener('click', (e) => {
        const profileMenu = document.getElementById('profileMenu');
        const profileButton = document.getElementById('profileButton');
        if (!profileMenu.contains(e.target) && !profileButton.contains(e.target)) {
          profileMenu.classList.remove('active');
        }
      });
    });

//Footer

// Set current year in footer copyright
document.addEventListener('DOMContentLoaded', function() {
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
      currentYearElement.textContent = new Date().getFullYear();
  }
  
  handleFooterLinks();
});

// Newsletter subscription function
function subscribeNewsletter(event) {
  event.preventDefault();
  const emailInput = event.target.querySelector('input[type="email"]');
  const email = emailInput.value;
  
  // Here you would typically send this to your backend
  console.log('Newsletter subscription for:', email);
  
  // Show confirmation message
showToast('Thank you for subscribing to our newsletter!', 'success');
  
  // Reset form
  emailInput.value = '';
}

// Simple page router for footer links
function handleFooterLinks() {
// Get all footer links
const footerLinks = document.querySelectorAll('.footer-links a');

// Add click event to each link
footerLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const page = this.getAttribute('href').replace('#', '');
    
    // Check which page was clicked
    switch(page) {
      case 'about':
        showPage('About Us', `
          <div class="page-content">
            <h2>About CareMate</h2>
            <p>CareMate is a service platform connecting skilled professionals with customers who need home services. Founded in 2023, we've quickly grown to become one of the most trusted service providers in the region.</p>
            <p>Our mission is to make professional services accessible, affordable, and convenient for everyone.</p>
            <h3>Our Values</h3>
            <ul>
              <li>Quality Service</li>
              <li>Customer Satisfaction</li>
              <li>Reliability</li>
              <li>Transparency</li>
            </ul>
          </div>
        `);
        break;
        
      case 'faq':
        showPage('Frequently Asked Questions', `
          <div class="page-content">
            <div class="faq-item">
              <h3>How do I book a service?</h3>
              <p>Simply browse through our services, select the one you need, choose a date and time, and proceed to checkout.</p>
            </div>
            <div class="faq-item">
              <h3>What if I'm not satisfied with the service?</h3>
              <p>We offer a 100% satisfaction guarantee. If you're not happy with the service, we'll either redo it or provide a refund.</p>
            </div>
            <div class="faq-item">
              <h3>How are your professionals vetted?</h3>
              <p>All our professionals undergo a thorough background check, skill assessment, and training before joining our platform.</p>
            </div>
            <div class="faq-item">
              <h3>Can I reschedule my appointment?</h3>
              <p>Yes, you can reschedule up to 6 hours before your scheduled appointment without any charges.</p>
            </div>
          </div>
        `);
        break;
        
      case 'terms':
        showPage('Terms & Conditions', `
          <div class="page-content terms">
            <h2>Terms and Conditions</h2>
            <p>Last updated: April 2025</p>
            <p>Please read these terms and conditions carefully before using CareMate services.</p>
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
            <h3>2. Service Description</h3>
            <p>CareMate provides a platform to connect customers with service professionals. We do not provide the services directly but facilitate the connection.</p>
            <h3>3. User Accounts</h3>
            <p>When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your account.</p>
          </div>
        `);
        break;
        
      case 'privacy':
        showPage('Privacy Policy', `
          <div class="page-content privacy">
            <h2>Privacy Policy</h2>
            <p>Effective Date: April 2025</p>
            <p>At CareMate, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.</p>
            <h3>Information We Collect</h3>
            <p>We collect information that you provide directly to us, such as when you create an account, request a service, or contact customer support.</p>
            <h3>How We Use Your Information</h3>
            <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you.</p>
          </div>
        `);
        break;
        
      case 'refund':
        showPage('Refund Policy', `
          <div class="page-content refund">
            <h2>Refund Policy</h2>
            <p>Last Updated: April 2025</p>
            <h3>Service Cancellation</h3>
            <p>If you cancel a service more than 24 hours before the scheduled time, you will receive a full refund.</p>
            <p>For cancellations made between 6-24 hours before the scheduled time, you will receive a 50% refund.</p>
            <p>Cancellations made less than 6 hours before the scheduled time are not eligible for a refund.</p>
            <h3>Service Quality Issues</h3>
            <p>If you're not satisfied with the quality of service, please report it within 24 hours of service completion, and we'll arrange for a redo or refund as appropriate.</p>
          </div>
        `);
        break;
        
      case 'contact':
        showPage('Contact Us', `
          <div class="page-content contact">
            <h2>Contact Us</h2>
            <p>We'd love to hear from you! Reach out to us through any of the following channels:</p>
            <div class="contact-info">
              <div class="contact-method">
                <i class="fas fa-envelope"></i>
                <p>Email: support@caremate.com</p>
              </div>
              <div class="contact-method">
                <i class="fas fa-phone"></i>
                <p>Phone: +91 98765 43210</p>
              </div>
              <div class="contact-method">
                <i class="fas fa-map-marker-alt"></i>
                <p>Address: Tech Park, Vijay Nagar, Indore, MP</p>
              </div>
            </div>
            <form class="contact-form">
              <h3>Send us a message</h3>
              <div class="form-group">
                <input type="text" placeholder="Your Name" required>
              </div>
              <div class="form-group">
                <input type="email" placeholder="Your Email" required>
              </div>
              <div class="form-group">
                <textarea placeholder="Your Message" rows="5" required></textarea>
              </div>
              <button type="submit" class="btn submit">Send Message</button>
            </form>
          </div>
        `);
        break;
        
      case 'service':
        showPage('Our Services', `
          <div class="page-content">
            <h2>Our Services</h2>
            <p>We offer a wide range of professional home services:</p>
            <div class="services-grid">
              <div class="service-item">
                <h3>Home Cleaning</h3>
                <p>Professional cleaning services for all areas of your home.</p>
              </div>
              <div class="service-item">
                <h3>Appliance Repair</h3>
                <p>Expert repair services for all major household appliances.</p>
              </div>
              <div class="service-item">
                <h3>Plumbing</h3>
                <p>Reliable plumbing services for all your needs.</p>
              </div>
              <div class="service-item">
                <h3>Electrical Work</h3>
                <p>Professional electrical services for your home.</p>
              </div>
            </div>
          </div>
        `);
        break;
        
      default:
        // Toast function implementation
        function showToast(message, type) {
          const toast = document.createElement('div');
          toast.className = `toast toast-${type}`;
          toast.textContent = message;
          document.body.appendChild(toast);
          
          setTimeout(() => {
            toast.classList.add('show');
          }, 10);
          
          setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
              toast.remove();
            }, 300);
          }, 3000);
        }
        
        showToast('Page not found', 'error');
        break;
    }
  });
});
}

// Page display function
function showPage(title, content) {
// Create modal for page content
const pageModal = document.createElement('div');
pageModal.className = 'page-modal';
pageModal.innerHTML = `
  <div class="page-content-container">
    <div class="page-header">
      <h2>${title}</h2>
      <button class="close-page">&times;</button>
    </div>
    ${content}
  </div>
`;

document.body.appendChild(pageModal);

// Close button functionality
const closeBtn = pageModal.querySelector('.close-page');
closeBtn.addEventListener('click', () => {
  pageModal.classList.add('closing');
  setTimeout(() => {
    pageModal.remove();
  }, 300);
});

// Allow clicking outside to close
pageModal.addEventListener('click', (e) => {
  if (e.target === pageModal) {
    pageModal.classList.add('closing');
    setTimeout(() => {
      pageModal.remove();
    }, 300);
  }
});

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Animation
setTimeout(() => {
  pageModal.classList.add('active');
}, 10);

// Handle contact form submission if present
const contactForm = pageModal.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
    contactForm.reset();
  });
}
}

document.addEventListener('DOMContentLoaded', function() {
  const backToTopButton = document.getElementById('back-to-top');
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
          backToTopButton.classList.add('visible');
      } else {
          backToTopButton.classList.remove('visible');
      }
  });
  
  // Smooth scroll to top when clicked
  backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      // For modern browsers
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
      
      // Fallback for older browsers
      function scrollToTop(duration) {
          const startPosition = window.pageYOffset;
          const startTime = performance.now();
          
          function scrollStep(timestamp) {
              const currentTime = timestamp - startTime;
              const progress = Math.min(currentTime / duration, 1);
              
              window.scrollTo(0, startPosition * (1 - easeInOutCubic(progress)));
              
              if (currentTime < duration) {
                  window.requestAnimationFrame(scrollStep);
              }
          }
          
          function easeInOutCubic(t) {
              return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          }
          
          window.requestAnimationFrame(scrollStep);
      }
      
      // Check if modern scrollTo with behavior is supported
      if ('scrollBehavior' in document.documentElement.style) {
          return; // Modern browser will use the scrollTo with behavior: 'smooth'
      } else {
          // Fallback for browsers that don't support smooth scrolling
          scrollToTop(800); // 800ms duration
      }
  });
});