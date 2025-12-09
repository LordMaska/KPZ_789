import { z, ZodSchema } from 'zod';

/**
 * Result of validation attempt
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]>; raw: z.ZodError };

/**
 * Safely validate data against a schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Result object with success flag and data or errors
 */
export function validateData<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Flatten errors into a more user-friendly format
  const errors: Record<string, string[]> = {};
  const flattened = result.error.flatten();

  if (flattened.fieldErrors) {
    Object.entries(flattened.fieldErrors).forEach(([path, fieldErrors]) => {
      errors[path] = (fieldErrors || []) as string[];
    });
  }

  return {
    success: false,
    errors,
    raw: result.error,
  };
}

/**
 * Validate data and throw if invalid
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated data
 * @throws ZodError if validation fails
 */
export function validateOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safe validation with type inference
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result
 */
export function safeParse<T>(schema: ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: z.ZodError;
} {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Format validation errors for display
 * @param errors - Validation errors object
 * @returns Formatted error message
 */
export function formatValidationErrors(errors: Record<string, string[]>): string {
  const messages = Object.entries(errors).flatMap(([field, fieldErrors]) =>
    fieldErrors.map(error => `${field}: ${error}`)
  );

  return messages.join('\n');
}

/**
 * Get first error for a specific field
 * @param errors - Validation errors object
 * @param fieldPath - Path to the field
 * @returns First error message or undefined
 */
export function getFieldError(
  errors: Record<string, string[]>,
  fieldPath: string
): string | undefined {
  return errors[fieldPath]?.[0];
}

/**
 * Transform API response data using a schema
 * @param schema - Zod schema for the response
 * @param response - API response data
 * @returns Transformed data if valid
 * @throws ZodError if validation fails
 */
export function transformResponse<T>(schema: ZodSchema<T>, response: unknown): T {
  return schema.parse(response);
}
