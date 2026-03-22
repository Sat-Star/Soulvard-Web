// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && phoneRegex.test(phone);
};

const validatePincode = (pincode) => {
  const pincodeRegex = /^\d{5,6}$/;
  return pincodeRegex.test(pincode);
};

// Price calculation utilities
const calculateDiscount = (mrp, price) => {
  if (mrp <= 0) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

const calculateTotals = (subtotal, discount, shipping) => {
  const tax = Math.round((subtotal - discount) * 0.18); // 18% GST
  const total = subtotal - discount + shipping + tax;

  return {
    subtotal,
    discount,
    tax,
    shipping,
    total: Math.round(total),
  };
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePincode,
  calculateDiscount,
  calculateTotals,
};
