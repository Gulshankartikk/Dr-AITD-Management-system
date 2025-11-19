export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateRollNumber = (rollNumber) => {
  return rollNumber && rollNumber.trim().length >= 3;
};

export const validateEmployeeId = (employeeId) => {
  return employeeId && employeeId.trim().length >= 3;
};

export const validateSemester = (semester) => {
  const sem = parseInt(semester);
  return sem >= 1 && sem <= 8;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateFileType = (file, allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']) => {
  if (!file) return false;
  const fileExtension = file.name.split('.').pop().toLowerCase();
  return allowedTypes.includes(fileExtension);
};

export const validateFileSize = (file, maxSizeInMB = 10) => {
  if (!file) return false;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const getValidationErrors = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];

    fieldRules.forEach(rule => {
      if (rule.required && !validateRequired(value)) {
        errors[field] = rule.message || `${field} is required`;
        return;
      }

      if (value && rule.type === 'email' && !validateEmail(value)) {
        errors[field] = rule.message || 'Invalid email format';
        return;
      }

      if (value && rule.type === 'password' && !validatePassword(value)) {
        errors[field] = rule.message || 'Password must be at least 6 characters';
        return;
      }

      if (value && rule.type === 'name' && !validateName(value)) {
        errors[field] = rule.message || 'Name must be at least 2 characters';
        return;
      }

      if (value && rule.type === 'phone' && !validatePhone(value)) {
        errors[field] = rule.message || 'Invalid phone number format';
        return;
      }

      if (value && rule.minLength && value.length < rule.minLength) {
        errors[field] = rule.message || `Minimum ${rule.minLength} characters required`;
        return;
      }

      if (value && rule.maxLength && value.length > rule.maxLength) {
        errors[field] = rule.message || `Maximum ${rule.maxLength} characters allowed`;
        return;
      }
    });
  });

  return errors;
};

// Predefined validation rules
export const validationRules = {
  student: {
    name: [
      { required: true, message: 'Name is required' },
      { type: 'name', message: 'Name must be at least 2 characters' }
    ],
    email: [
      { required: true, message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' }
    ],
    rollNumber: [
      { required: true, message: 'Roll number is required' },
      { minLength: 3, message: 'Roll number must be at least 3 characters' }
    ],
    course: [
      { required: true, message: 'Course is required' }
    ],
    semester: [
      { required: true, message: 'Semester is required' }
    ]
  },
  teacher: {
    name: [
      { required: true, message: 'Name is required' },
      { type: 'name', message: 'Name must be at least 2 characters' }
    ],
    email: [
      { required: true, message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' }
    ],
    employeeId: [
      { required: true, message: 'Employee ID is required' },
      { minLength: 3, message: 'Employee ID must be at least 3 characters' }
    ],
    department: [
      { required: true, message: 'Department is required' }
    ]
  },
  login: {
    email: [
      { required: true, message: 'Email/Username is required' }
    ],
    password: [
      { required: true, message: 'Password is required' }
    ]
  }
};
