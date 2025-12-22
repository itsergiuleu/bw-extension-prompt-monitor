import { requestValidator } from '@/backend/services/request-validator.service';

describe('findSensitiveData', () => {
  describe('Email issue', () => {
    it('should detect email in ChatGPT prompt', () => {
      const prompt = 'Can you send a summary to sergiu@gmail.com?';
      const result = requestValidator.findSensitiveData(prompt);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual({
        type: 'email',
        value: 'sergiu@gmail.com',
      });
    });

    it('should detect multiple emails in prompt', () => {
      const prompt = 'Forward this to john@example.com and sarah@company.org';
      const result = requestValidator.findSensitiveData(prompt);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].type).toBe('email');
      expect(result.data[0].value).toBe('john@example.com');
      expect(result.data[1].value).toBe('sarah@company.org');
    });

    it('should detect email in code snippet', () => {
      const prompt = 'Create a user with email: developer+test@company.co.uk';
      const result = requestValidator.findSensitiveData(prompt);

      expect(result.success).toBe(true);
      expect(result.data[0].value).toBe('developer+test@company.co.uk');
    });

    it('should detect sensitive data in JSON example', () => {
      const prompt = `Parse this JSON: {"name": "John", "email": "john@test.com", "phone": "555-0123"}`;
      const result = requestValidator.findSensitiveData(prompt);

      expect(result.success).toBe(true);
      expect(result.data[0].value).toBe('john@test.com');
    });
  });

  describe('No sensitive data', () => {
    it('should return success false for clean prompt', () => {
      const prompt = 'Write a Python function to calculate fibonacci numbers';
      const result = requestValidator.findSensitiveData(prompt);

      expect(result.success).toBe(false);
      expect(result.data).toHaveLength(0);
    });

    it('should not detect fake email-like strings', () => {
      const prompt = 'Use the format name@domain for variables';
      const result = requestValidator.findSensitiveData(prompt);

      expect(result.success).toBe(false);
      expect(result.data).toHaveLength(0);
    });

    it('should handle empty string', () => {
      const result = requestValidator.findSensitiveData('');

      expect(result.success).toBe(false);
      expect(result.data).toHaveLength(0);
    });
  });
});