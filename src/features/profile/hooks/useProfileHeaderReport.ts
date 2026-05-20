/**
 * useProfileHeaderReport
 *
 * Profile header: report-user modal visibility and submit handler.
 */
import { useCallback, useState } from 'react';
import useAxiosInstance from 'hostApp/useAxiosInstance';
import { showSuccessToast, showErrorToast } from 'hostApp/toast';
import { PROFILE_PATHS } from '../../../constants/constants';

export function useProfileHeaderReport(userID: string | undefined) {
  const axiosInstance = useAxiosInstance();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleReportSubmit = useCallback(
    (reportData: {
      issue: string;
      description: string;
      priority: string;
    }) => {
      axiosInstance
        .post(PROFILE_PATHS.report(userID), { ...reportData })
        .then((resp) => {
          setIsReportModalOpen(false);
          showSuccessToast(resp?.data?.message);
        })
        .catch(() => showErrorToast('Unable to report profile'));
    },
    [axiosInstance, userID],
  );

  return {
    isReportModalOpen,
    openReportModal: () => setIsReportModalOpen(true),
    closeReportModal: () => setIsReportModalOpen(false),
    handleReportSubmit,
  };
}
