// Email validation regex
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Validate email format
exports.validateEmail = (email) => {
  return emailRegex.test(email);
};

// Validate password strength
exports.validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      valid: false,
      error: "Password must be at least 6 characters",
    };
  }

  // Optional: Add more strength requirements
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return {
    valid: true,
    strength: {
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    },
  };
};

// Validate user input
exports.validateUserInput = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!data.email || !this.validateEmail(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (!data.password || data.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Sanitize user object (remove sensitive data)
exports.sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// Check if email is valid
exports.isValidEmail = (email) => {
  return this.validateEmail(email);
};
