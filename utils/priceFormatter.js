// Price formatting utility
export const formatPrice = (price) => {
  if (!price || price === 0) {
    return 'Price on Request';
  }

  const priceNum = typeof price === 'number' ? price : parseInt(price);

  // 1 Crore = 1,00,00,000
  if (priceNum >= 10000000) {
    const crores = priceNum / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  }
  
  // 1 Lakh = 1,00,000
  if (priceNum >= 100000) {
    const lakhs = priceNum / 100000;
    return `₹${lakhs.toFixed(2)} Lakh`;
  }
  
  // Thousands
  if (priceNum >= 1000) {
    const thousands = priceNum / 1000;
    return `₹${thousands.toFixed(2)} K`;
  }
  
  // Less than 1000
  return `₹${priceNum.toLocaleString()}`;
};

// Format price with "onwards" suffix (for builder properties)
export const formatPriceOnwards = (price) => {
  const formatted = formatPrice(price);
  if (formatted === 'Price on Request') {
    return formatted;
  }
  return `${formatted} onwards`;
};

export default formatPrice;
