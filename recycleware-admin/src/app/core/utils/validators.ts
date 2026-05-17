export class CustomValidators {
  
  static isValidDniNieCif(value: string): boolean {
    if (!value) return false;
    
    const str = value.toString().toUpperCase().trim();
    
    const nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
    const nieRexp = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
    const cifRexp = /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/i;

    return nifRexp.test(str) || nieRexp.test(str) || cifRexp.test(str);
  }
  static isValidEmail(email: string): boolean {
    if (!email) 
      return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }
}