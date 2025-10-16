/**
 * API для работы с займами
 */

import { apiClient } from '@/shared/lib/api/client';
import { LoanApplication, LoanCreateResponse } from '@/entities/loan';
import { API_ENDPOINTS } from '@/shared/config/constants';

export async function createLoan(
  application: LoanApplication
): Promise<LoanCreateResponse> {
  return apiClient.post<LoanCreateResponse>(API_ENDPOINTS.LOANS, application);
}

