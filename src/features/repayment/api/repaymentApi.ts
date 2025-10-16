/**
 * API для досрочного погашения
 */

import { apiClient } from '@/shared/lib/api/client';
import { RepaymentRequest, RepaymentResponse } from '@/entities/payment';
import { API_ENDPOINTS } from '@/shared/config/constants';

export async function makeRepayment(
  request: RepaymentRequest
): Promise<RepaymentResponse> {
  return apiClient.post<RepaymentResponse>(API_ENDPOINTS.REPAYMENT, request);
}

