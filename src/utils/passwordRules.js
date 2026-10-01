/** Règles alignées sur backend validatePasswordStrength */
export function validatePasswordRules(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Au moins 8 caractères.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Au moins une lettre majuscule.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Au moins une lettre minuscule.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Au moins un chiffre.' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Au moins un caractère spécial (!@#$…).' };
  }
  return { valid: true };
}

export const PASSWORD_HINT =
  'Min. 8 caractères, majuscule, minuscule, chiffre et caractère spécial.';
