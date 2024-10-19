import axiosInstance from './axiosConfig';
import { Payment, CreatePaymentData } from '../types';

export const fetchPayments = async (): Promise<Payment[]> => {
  try {
    const response = await axiosInstance.get<Payment[]>("/payments");
    return response.data
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export const createPayment = async (paymentData: CreatePaymentData): Promise<Payment> => {
  try {
    const response = await axiosInstance.post<Payment>('/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};
