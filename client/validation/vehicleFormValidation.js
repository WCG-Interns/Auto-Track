// validation/vehicleFormValidation.js
import * as Yup from 'yup';

export const vehicleFormSchema = Yup.object({
  vehicleNumber: Yup.string().min(10).max(10).required('Vehicle number is required'),
  vehicleType: Yup.string().required('Type is required'),
  ownerName: Yup.string().required('Owner name is required'),
  insuranceExpiry: Yup.date().required('Insurance status is required'),
  fitnessExpiry: Yup.date().required('Fitness info is required'),
  permitExpiry: Yup.date().required('Permit info is required'),
  pollutionExpiry: Yup.date().required('Pollution info is required'),
  taxExpiry: Yup.date().required('Tax info is required'),
  documentStatus: Yup.string().required('Status is required'),
  //createdBy: Yup.required('Created By is required'),
});
