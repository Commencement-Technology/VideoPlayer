export type Undefined<T> = T | undefined;
export type TVideoDisplayModes = {
  portrait: 'portrait';
  landscape: 'landscape';
};

export type TVideo = {
  controlAnimationTiming: number;
  controlTimeoutDelay: number;
  rewindTime: number;
  resizeMode: Undefined<'cover' | 'stretch' | 'contain' | 'none'>;
  videoDisplayModes: TVideoDisplayModes;
};
