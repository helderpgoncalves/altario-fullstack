import axiosInstance from './axiosConfig';
import { GridData } from '../types';

export const fetchGridData = async (): Promise<GridData> => {
  try {
    const response = await axiosInstance.get<GridData>('/grid');
    return response.data;
  } catch (error) {
    console.error('Error fetching grid data:', error);
    throw error;
  }
};

export const updateGridData = async (gridData: GridData): Promise<GridData> => {
  try {
    const response = await axiosInstance.put<GridData>('/grid', gridData);
    return response.data;
  } catch (error) {
    console.error('Error updating grid data:', error);
    throw error;
  }
};
