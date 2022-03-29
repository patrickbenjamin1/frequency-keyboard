import * as React from 'react';

const AudioContextContext = React.createContext<AudioContext>(null);

export const useAudioContext = () => {
  const context = React.useContext(AudioContextContext);

  return context;
};

export const AudioContextProvider: React.FC = ({ children }) => {
  const context = React.useRef(new window.AudioContext());

  return <AudioContextContext.Provider value={context.current}>{children}</AudioContextContext.Provider>;
};
