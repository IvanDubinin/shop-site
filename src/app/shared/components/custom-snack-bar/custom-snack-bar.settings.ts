import { IInnerNotificationType } from 'src/app/types/notification.interface';

export const MODAL_DISMISS_TIMEOUT = 250;
export const animations = {
  name: 'inOutAnimation',
  leave: {
    effectName: ':leave',
    startStyle: { opacity: 1 },
    endStyle: { right: -500, opacity: 0 },
    timings: `${MODAL_DISMISS_TIMEOUT / 1000}s ease-in`
  },
  enter: {
    effectName: ':enter',
    startStyle: { opacity: 0, right: '100%' },
    endStyle: { right: '0%', opacity: 1 },
    timings: '0.5s ease-in'
  }
};
export const SNACK_BAR_VIEWMODES: { mobile: 'mobile'; desktop: 'desktop' } = {
  mobile: 'mobile',
  desktop: 'desktop'
};
export const SNACK_BAR_SIZE = {
  desktop: {
    gap: 10,
    height: 125,
    width: 500,
    widthUnits: 'px',
    maxWidth: 500,
    maxWidthUnits: 'px'
  },
  mobile: {
    gap: 10,
    height: 125,
    width: 80,
    widthUnits: '%',
    maxWidth: 350,
    maxWidthUnits: 'px'
  }
};

export const SNACK_BAR_ICONS: { [K in IInnerNotificationType]: string } = {
  error: 'error_outline',
  'business-action': 'done',
  information: 'mode_comment'
};
