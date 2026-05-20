import { useCallback, useEffect, useState } from 'react';
import useAxiosInstance from '../../../axios/axiosInstance';
import { showErrorToast, showSuccessToast } from 'authMF/toastFunction';
import { POST_PATHS } from '../services/postApi';

export interface InteractionUpdate {
  commentsCount?: number;
  isCommented?: boolean;
}

export function usePostInteractions(
  postID: string,
  initialLiked: boolean,
  initialCommented: boolean,
  initialSaved: boolean,
) {
  const axiosInstance = useAxiosInstance();

  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isCommented, setIsCommented] = useState(initialCommented);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    setIsCommented(initialCommented);
  }, [initialCommented]);

  useEffect(() => {
    axiosInstance
      .get(POST_PATHS.interaction(postID))
      .then((resp) => {
        setLikes(Number(resp?.data?.data?.likesCount));
        setComments(Number(resp?.data?.data?.commentsCount));
      })
      .catch(() => {});
  }, [postID, axiosInstance]);

  const toggleLike = useCallback(async () => {
    try {
      const resp = await axiosInstance.post(POST_PATHS.like(postID));
      const { likesCount, isLiked: liked } = resp.data?.data ?? {};
      setLikes(Number(likesCount));
      setIsLiked(Boolean(liked));
    } catch {
      showErrorToast('Unable to update like');
    }
  }, [axiosInstance, postID]);

  const savePost = useCallback(async () => {
    try {
      await axiosInstance.post(POST_PATHS.save(postID));
      setIsSaved(true);
      showSuccessToast('Post saved');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message;
      showErrorToast(message ?? 'Unable to save post');
    }
  }, [axiosInstance, postID]);

  const unsavePost = useCallback(async () => {
    try {
      await axiosInstance.delete(POST_PATHS.save(postID));
      setIsSaved(false);
      showSuccessToast('Post unsaved');
    } catch {
      showErrorToast('Unable to unsave post');
    }
  }, [axiosInstance, postID]);

  const toggleSave = useCallback(async () => {
    if (isSaved) await unsavePost();
    else await savePost();
  }, [isSaved, savePost, unsavePost]);

  const reportPost = useCallback(
    async (reason: string, description: string) => {
      try {
        await axiosInstance.post(POST_PATHS.report(postID), { reason, description });
        showSuccessToast('Post reported');
        return true;
      } catch {
        showErrorToast('Unable to report post');
        return false;
      }
    },
    [axiosInstance, postID],
  );

  const updateFromComments = useCallback(({ commentsCount, isCommented: commented }: InteractionUpdate) => {
    if (commentsCount != null) setComments(commentsCount);
    if (commented != null) setIsCommented(commented);
  }, []);

  return {
    likes,
    comments,
    isLiked,
    isCommented,
    isSaved,
    toggleLike,
    toggleSave,
    unsavePost,
    reportPost,
    updateFromComments,
  };
}
