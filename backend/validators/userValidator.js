class UserValidator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    // At least 6 characters
    return password && password.length >= 6;
  }

  static validateName(name) {
    return name && name.trim().length >= 2;
  }

  static validatePhone(phone) {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  static validateStudentData(data) {
    const errors = [];

    if (!this.validateName(data.name)) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!this.validateEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!data.rollNumber || data.rollNumber.trim().length < 3) {
      errors.push('Roll number must be at least 3 characters long');
    }

    if (!data.course) {
      errors.push('Course is required');
    }

    if (!data.semester || data.semester < 1 || data.semester > 8) {
      errors.push('Semester must be between 1 and 8');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateTeacherData(data) {
    const errors = [];

    if (!this.validateName(data.name)) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!this.validateEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!data.employeeId || data.employeeId.trim().length < 3) {
      errors.push('Employee ID must be at least 3 characters long');
    }

    if (!data.department) {
      errors.push('Department is required');
    }

    if (data.phone && !this.validatePhone(data.phone)) {
      errors.push('Invalid phone number format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateLoginData(data) {
    const errors = [];

    if (!data.email || data.email.trim().length === 0) {
      errors.push('Email/Username is required');
    }

    if (!data.password || data.password.length === 0) {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateCourseData(data) {
    const errors = [];

    if (!this.validateName(data.name)) {
      errors.push('Course name must be at least 2 characters long');
    }

    if (!data.code || data.code.trim().length < 2) {
      errors.push('Course code must be at least 2 characters long');
    }

    if (!data.duration || data.duration < 1) {
      errors.push('Course duration must be at least 1 year');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateSubjectData(data) {
    const errors = [];

    if (!this.validateName(data.name)) {
      errors.push('Subject name must be at least 2 characters long');
    }

    if (!data.code || data.code.trim().length < 2) {
      errors.push('Subject code must be at least 2 characters long');
    }

    if (!data.course) {
      errors.push('Course is required');
    }

    if (!data.semester || data.semester < 1 || data.semester > 8) {
      errors.push('Semester must be between 1 and 8');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = UserValidator;