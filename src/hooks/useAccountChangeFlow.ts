import { useLocation } from 'react-router-dom';

/**
 * Detects whether the current screen is part of an in-app account-type change flow
 * (as opposed to the first-time /signup/* flow) by inspecting the URL.
 *
 * Listener → Venter: paths under /listener/change-account/*
 * Venter  → Listener: paths under /venter/change-account/*
 *
 * resolve(slug) returns the next path within the same flow, e.g.
 *   resolve('choose-plan') → '/listener/change-account/choose-plan'  (change flow)
 *                          → '/signup/choose-plan'                    (signup flow)
 */
export const useAccountChangeFlow = () => {
  const { pathname } = useLocation();

  const isFromListener = pathname.startsWith('/listener/change-account/');
  const isFromVenter   = pathname.startsWith('/venter/change-account/');
  const isAccountChanging = isFromListener || isFromVenter;

  const sourceRole = isFromListener ? 'listener' : isFromVenter ? 'venter' : null;
  const changeBasePath = isFromListener
    ? '/listener/change-account'
    : isFromVenter
    ? '/venter/change-account'
    : null;

  const resolve = (slug: string) =>
    isAccountChanging && changeBasePath
      ? `${changeBasePath}/${slug}`
      : `/signup/${slug}`;

  return { isAccountChanging, isFromListener, isFromVenter, sourceRole, changeBasePath, resolve };
};
