const mongoose = require("mongoose");
const createResponse = (isValid, error = null, data = {}) => ({
  isValid,
  error,
  ...data,
});

const getTodayAtMidnight = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const validateDuration = (duration) => {
  if (!duration) {
    return createResponse(false, "Duration is required", { value: null });
  }

  const parsedDuration = Number(duration);

  if (isNaN(parsedDuration)) {
    return createResponse(false, "Duration must be a valid number", {
      value: null,
    });
  }

  if (parsedDuration <= 0) {
    return createResponse(false, "Duration must be greater than 0", {
      value: null,
    });
  }

  if (!Number.isInteger(parsedDuration)) {
    return createResponse(false, "Duration must be a whole number", {
      value: null,
    });
  }

  return createResponse(true, null, { value: parsedDuration });
};

const validateDate = (date) => {
  if (!date) {
    return createResponse(true, null, { value: new Date() });
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return createResponse(
      false,
      "Date must be a valid date format (YYYY-MM-DD)",
      { value: null }
    );
  }

  const today = getTodayAtMidnight();
  if (parsedDate > today) {
    return createResponse(false, "Date cannot be in the future", {
      value: null,
    });
  }

  return createResponse(true, null, { value: parsedDate });
};

const validateId = (id) => {
  if (!id) {
    return createResponse(false, "Id is required", { value: null });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return createResponse(false, "Invalid user id", { value: null });
  }

  return createResponse(true, null, { value: id });
};

const validateDateRange = (fromDate, toDate) => {
  // Both dates are optional
  if (!fromDate && !toDate) {
    return createResponse(true, null, { from: null, to: null });
  }

  let parsedFromDate = null;
  let parsedToDate = null;

  if (fromDate) {
    parsedFromDate = new Date(fromDate);
    if (isNaN(parsedFromDate.getTime())) {
      return createResponse(
        false,
        "Invalid 'from' date format (use YYYY-MM-DD)",
        { from: null, to: null }
      );
    }
  }

  if (toDate) {
    parsedToDate = new Date(toDate);
    if (isNaN(parsedToDate.getTime())) {
      return createResponse(
        false,
        "Invalid 'to' date format (use YYYY-MM-DD)",
        { from: null, to: null }
      );
    }
  }

  if (parsedFromDate && parsedToDate && parsedFromDate > parsedToDate) {
    return createResponse(false, "'from' date cannot be after 'to' date", {
      from: null,
      to: null,
    });
  }

  const today = getTodayAtMidnight();

  if (parsedFromDate && parsedFromDate > today) {
    return createResponse(false, "Date should not be in the future", {
      from: null,
      to: null,
    });
  }

  if (parsedToDate && parsedToDate > today) {
    return createResponse(false, "Date should not be in the future", {
      from: null,
      to: null,
    });
  }

  return createResponse(true, null, { from: parsedFromDate, to: parsedToDate });
};

module.exports = {
  validateDuration,
  validateDate,
  validateId,
  validateDateRange,
};
