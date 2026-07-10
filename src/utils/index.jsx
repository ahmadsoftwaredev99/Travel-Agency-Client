import * as Yup from "yup";

export const registerSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  phone: Yup.string()
    .matches(/^[0-9]{11}$/, "Phone number must be 11 digits")
    .required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  name: Yup.string().trim().required("Name is required"),
});

export const loginSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export const tourSchema = Yup.object({
  duration: Yup.string().trim().required("Duration is required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),

  route: Yup.string().trim().required("Route is required"),

  location: Yup.string().trim().required("Location is required"),

  
  description: Yup.string()
  .trim()
  .required("Description is required")
  .min(10, "Description must be at least 10 characters"),
  
  category: Yup.string().required("Category is required"),
  title: Yup.string()
    .trim()
    .required("Package Title is required")
    .min(3, "Package Title must be at least 3 characters"),
});
