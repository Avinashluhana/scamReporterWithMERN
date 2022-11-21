import * as Yup from 'yup';

export const registerScamSchema = Yup.object().shape({
  userEmail: Yup.string().email().required(),
  subscribeNewsLetter: Yup.string().oneOf(['on']).optional(),
  scamType: Yup.string().notOneOf(['none'], 'select scam type').required(),
  pseudonumUsed: Yup.string().optional(),
  fraudulentEmail: Yup.string().email().optional(),
  phoneCode: Yup.string().optional(),
  phoneNumber: Yup.string().optional(),
  fraudulentWebsite: Yup.string().optional(),
  scamContent: Yup.string().required(),
  explanation: Yup.string().required(),
  iaccept: Yup.string().oneOf(['on']).required(),
});

export const updateScamSchema = Yup.object().shape({
  userEmail: Yup.string().email().required(),
  scamType: Yup.string().notOneOf(['none'], 'select scam type').required(),
  pseudonumUsed: Yup.string().optional(),
  fraudulentEmail: Yup.string().email().optional(),
  phoneCode: Yup.string().optional(),
  phoneNumber: Yup.string().optional(),
  fraudulentWebsite: Yup.string().optional(),
  scamContent: Yup.string().required(),
  explanation: Yup.string().required(),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
})

export const registerSchema = Yup.object().shape({
  fullName: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
})

export const subscribeNewsletterSchema = Yup.object().shape({
  email: Yup.string().email().required(),
})

export const commentSchema = Yup.object().shape({
  content: Yup.string().min(1).max(2000).required(),
})

export const messageSchema = Yup.object().shape({
  content: Yup.string().min(1).max(2000).required(),
})