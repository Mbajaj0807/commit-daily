// src/utils/dateUtils.js

/**
 * Get current date in IST timezone (YYYY-MM-DD format)
 * This ensures the date changes at midnight IST, not UTC
 */
export const getTodayIST = () => {
  const now = new Date();
  
  // Convert to IST (Asia/Kolkata)
  const istDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  
  // Format as YYYY-MM-DD
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Convert a Date object to IST date string (YYYY-MM-DD)
 */
export const toISTDateString = (date) => {
  if (!date) return getTodayIST();
  
  const istDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Get date from X days ago in IST
 */
export const getISTDateDaysAgo = (daysAgo) => {
  const now = new Date();
  const istDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  
  istDate.setDate(istDate.getDate() - daysAgo);
  
  return toISTDateString(istDate);
};

/**
 * Format IST date for display
 */
export const formatISTDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString + 'T00:00:00');
  
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Get IST time (HH:MM format)
 */
export const getCurrentISTTime = () => {
  const now = new Date();
  
  return now.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Check if a date string is today in IST
 */
export const isToday = (dateString) => {
  return dateString === getTodayIST();
};

/**
 * Get start of month in IST based on pocket money day
 */
export const getMonthStartIST = (pocketMoneyDay) => {
  const now = new Date();
  const istDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  
  const cycleStart = new Date(istDate);
  cycleStart.setDate(pocketMoneyDay);
  
  // If pocket money day hasn't arrived yet this month
  if (cycleStart > istDate) {
    cycleStart.setMonth(cycleStart.getMonth() - 1);
  }
  
  return toISTDateString(cycleStart);
};