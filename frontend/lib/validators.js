import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: 'Price must be a number' }).min(0.01, 'Price must be greater than 0')
  ),
  description: z.string().optional(),
  image: z.string().url('Must be a valid URL starting with http:// or https://').or(z.literal('')),
  available: z.boolean().default(true),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(7, 'Phone number is required (at least 7 digits)'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  address: z.string().min(10, 'Complete shipping address is required (at least 10 characters)'),
  notes: z.string().optional(),
});
