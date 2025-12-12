import * as yup from 'yup'

/**
 * Risk creation validation schema
 */
export const riskCreateSchema = yup.object({
  refNo: yup.string().required('Reference number is required').max(20, 'Reference number too long'),
  title: yup
    .string()
    .required('Title is required')
    .max(200, 'Title must be at most 200 characters'),
  description: yup
    .string()
    .required('Description is required')
    .max(2000, 'Description must be at most 2000 characters'),
  timeHorizon: yup
    .string()
    .required('Time horizon is required')
    .oneOf(['< 1 year', '1-3 years', '> 3 years'], 'Invalid time horizon'),
  category: yup
    .string()
    .required('Category is required')
    .oneOf(['Strategic', 'Operational', 'Financial', 'Compliance'], 'Invalid category'),
  financialImpact: yup.object({
    hasImpact: yup.boolean().required(),
    amount: yup.number().when('hasImpact', {
      is: true,
      then: (schema) => schema.required('Amount is required when financial impact is Yes').min(0, 'Amount must be positive'),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
  owners: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one risk owner is required')
    .required('Risk owners are required'),
})

/**
 * Rating submission validation schema
 */
export const ratingSubmissionSchema = yup.object({
  currentLikelihood: yup
    .number()
    .required('Likelihood is required')
    .min(1, 'Likelihood must be between 1 and 5')
    .max(5, 'Likelihood must be between 1 and 5')
    .integer('Likelihood must be a whole number'),
  currentImpact: yup
    .number()
    .required('Impact is required')
    .min(1, 'Impact must be between 1 and 5')
    .max(5, 'Impact must be between 1 and 5')
    .integer('Impact must be a whole number'),
  basisForRating: yup
    .string()
    .required('Basis for rating is required')
    .min(50, 'Basis for rating must be at least 50 characters'),
  residualLikelihood: yup
    .number()
    .notRequired()
    .min(1, 'Residual likelihood must be between 1 and 5')
    .max(5, 'Residual likelihood must be between 1 and 5')
    .integer('Residual likelihood must be a whole number'),
  residualImpact: yup
    .number()
    .notRequired()
    .min(1, 'Residual impact must be between 1 and 5')
    .max(5, 'Residual impact must be between 1 and 5')
    .integer('Residual impact must be a whole number'),
})

/**
 * Mitigation creation validation schema
 */
export const mitigationCreateSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .max(500, 'Title must be at most 500 characters'),
  details: yup.string().required('Details are required'),
  controlOwnerId: yup.string().required('Control owner is required'),
  actionOwnerId: yup.string().required('Action owner is required'),
  targetDate: yup
    .date()
    .required('Target date is required')
    .min(new Date(), 'Target date must be in the future'),
  status: yup
    .string()
    .oneOf(['Not Started', 'Ongoing', 'Completed'], 'Invalid status')
    .notRequired(),
})

/**
 * Mitigation status update validation schema
 */
export const mitigationStatusUpdateSchema = yup.object({
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['Not Started', 'Ongoing', 'Completed'], 'Invalid status'),
  progressPercentage: yup
    .number()
    .notRequired()
    .min(0, 'Progress must be between 0 and 100')
    .max(100, 'Progress must be between 0 and 100'),
  targetDate: yup.date().notRequired(),
  actualCompletionDate: yup.date().when('status', {
    is: 'Completed',
    then: (schema) => schema.required('Completion date is required when status is Completed').max(new Date(), 'Completion date cannot be in the future'),
    otherwise: (schema) => schema.notRequired(),
  }),
  comment: yup.string().notRequired(),
})

/**
 * Question creation validation schema
 */
export const questionCreateSchema = yup.object({
  text: yup
    .string()
    .required('Question text is required')
    .max(500, 'Question must be at most 500 characters'),
  assignedToUserId: yup.string().required('Assigned user is required'),
  priority: yup
    .string()
    .required('Priority is required')
    .oneOf(['Low', 'Medium', 'High'], 'Invalid priority'),
  dueDate: yup.date().notRequired().min(new Date(), 'Due date must be in the future'),
})

/**
 * Question reply validation schema
 */
export const questionReplySchema = yup.object({
  reply: yup
    .string()
    .required('Reply is required')
    .min(20, 'Reply must be at least 20 characters'),
})

/**
 * Comment validation schema
 */
export const commentSchema = yup.object({
  message: yup.string().required('Comment is required').min(1, 'Comment cannot be empty'),
  mentions: yup.array().of(yup.string()).notRequired(),
})

/**
 * Version creation validation schema
 */
export const versionCreateSchema = yup.object({
  cycle: yup
    .string()
    .required('Cycle is required')
    .matches(/^\d{4} Q[1-4]$/, 'Cycle must be in format "YYYY Qn" (e.g., "2025 Q2")'),
  copyFromVersionId: yup.string().notRequired(),
  riskIdsToCopy: yup.array().of(yup.string()).notRequired(),
})

/**
 * User creation validation schema
 */
export const userCreateSchema = yup.object({
  name: yup.string().required('Name is required').max(100, 'Name too long'),
  email: yup.string().required('Email is required').email('Invalid email address'),
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['RiskManagement', 'RiskOwner', 'ActionOwner', 'HOD', 'Admin'], 'Invalid role'),
  department: yup.string().required('Department is required'),
})

/**
 * Validate a value against a schema
 */
export async function validate<T>(schema: yup.Schema<T>, value: any): Promise<{ valid: boolean; errors: Record<string, string> }> {
  try {
    await schema.validate(value, { abortEarly: false })
    return { valid: true, errors: {} }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {}
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message
        }
      })
      return { valid: false, errors }
    }
    return { valid: false, errors: { _general: 'Validation failed' } }
  }
}
