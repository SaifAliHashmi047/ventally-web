import appIcon from '../../assets/brand/app-icon.png';
import { cn } from '../../utils/cn';

/** Squircle app mark — use next to "Ventally" or headings; keep aria-hidden when redundant text is present. */
export const AppBrandIcon = ({
  className,
  'aria-hidden': ariaHidden = true,
}: {
  className?: string;
  'aria-hidden'?: boolean;
}) => (
  <img
    src={appIcon}
    alt=""
    aria-hidden={ariaHidden}
    className={cn('object-cover shadow-lg ring-1 ring-white/10 select-none', className)}
  />
);
