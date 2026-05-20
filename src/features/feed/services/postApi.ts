import { GATEWAY_PATHS } from '../../../constants/constants';

export const POST_PATHS = {
  interaction: GATEWAY_PATHS.post.interaction,
  like: GATEWAY_PATHS.post.like,
  save: GATEWAY_PATHS.post.saveById,
  report: GATEWAY_PATHS.post.report,
  delete: GATEWAY_PATHS.post.delete,
} as const;
