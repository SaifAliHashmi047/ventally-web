import apiInstance from '../apiInstance';

export interface VerificationSubmission {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUrl?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface SubmitVerificationResponse {
  verification: VerificationSubmission;
  message?: string;
}

export interface GetSubmissionsResponse {
  submissions: VerificationSubmission[];
  pagination?: {
    total: number;
    hasMore: boolean;
  };
}

export interface GetSubmissionDetailResponse {
  submission: VerificationSubmission;
}

export interface ReviewVerificationPayload {
  status: 'approved' | 'rejected';
  notes?: string;
}

/**
 * Custom hook for Listener Verification API endpoints
 */
export const useListenerVerification = () => {
  /**
   * Submit verification document (multipart/form-data)
   */
  const submitVerification = async (document: File): Promise<SubmitVerificationResponse> => {
    const formData = new FormData();
    formData.append('document', document);

    const response = await apiInstance.post<SubmitVerificationResponse>('listener-verifications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response?.data;
  };

  /**
   * Get my verification submissions
   */
  const getMySubmissions = async (limit: number = 10, offset: number = 0): Promise<GetSubmissionsResponse> => {
    const response = await apiInstance.get<GetSubmissionsResponse>(`listener-verifications/me?limit=${limit}&offset=${offset}`);
    return response?.data;
  };

  /**
   * Admin: List all listener verification submissions
   */
  const getAllSubmissions = async (status?: string, limit: number = 50, offset: number = 0): Promise<GetSubmissionsResponse> => {
    let url = `listener-verifications/admin/all?limit=${limit}&offset=${offset}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await apiInstance.get<GetSubmissionsResponse>(url);
    return response?.data;
  };

  /**
   * Admin: Get verification submission detail
   */
  const getSubmissionDetail = async (verificationId: string): Promise<GetSubmissionDetailResponse> => {
    const response = await apiInstance.get<GetSubmissionDetailResponse>(`listener-verifications/admin/${verificationId}`);
    return response?.data;
  };

  /**
   * Admin: Review verification submission
   */
  const reviewSubmission = async (verificationId: string, payload: ReviewVerificationPayload): Promise<GetSubmissionDetailResponse> => {
    const response = await apiInstance.put<GetSubmissionDetailResponse>(`listener-verifications/admin/${verificationId}`, payload);
    return response?.data;
  };

  return {
    submitVerification,
    getMySubmissions,
    getAllSubmissions,
    getSubmissionDetail,
    reviewSubmission,
  };
};
