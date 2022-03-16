import * as React from 'react';

import { useAudioContext } from './useAudioContext';

interface IOscillatorsContext {
  length: number;
  add: () => void;
  remove: () => void;
}

// used to keep track of currently active oscillators for gain management
const OscillatorsContext = React.createContext<IOscillatorsContext>({ length: 0, add: undefined, remove: undefined });
export const OscillatorsProvider: React.FC = ({ children }) => {
  const [length, setLength] = React.useState(0);

  return (
    <OscillatorsContext.Provider value={{ length, add: () => setLength(length + 1), remove: () => setLength(length - 1) }}>
      {children}
    </OscillatorsContext.Provider>
  );
};

export interface IOscillatorConfig {
  frequency: number;
  type?: OscillatorType;
  gain?: number;
}

const defaultConfig: Partial<IOscillatorConfig> = {
  type: 'triangle',
  gain: 0.9,
};

/** store an oscillator in a ref and expose some callbacks to play it */

export const useOscillator = (config: IOscillatorConfig) => {
  const { length: numberOfActiveOscillators, add, remove } = React.useContext(OscillatorsContext);

  /** get current audio context from react context */
  const audioContext = useAudioContext();

  const combinedConfig = { ...defaultConfig, ...config };

  // create necessary audio nodes
  const oscillator = React.useRef(audioContext.createOscillator());
  const gain = React.useRef(audioContext.createGain());

  const [isOn, setIsOn] = React.useState(false);

  // initialise audio nodes
  React.useEffect(() => {
    oscillator.current.start();
    gain.current.connect(audioContext.destination);
    gain.current.gain.setValueAtTime(0, audioContext.currentTime);
    oscillator.current.connect(gain.current);
  }, []);

  // if given frequency changes, update the oscillator
  React.useEffect(() => {
    if (combinedConfig.frequency) {
      oscillator.current.frequency.setValueAtTime(combinedConfig.frequency, audioContext.currentTime);
    }
  }, [combinedConfig.frequency]);

  // if given gain changes, update the oscillator
  React.useEffect(() => {
    if (combinedConfig.gain && isOn) {
      gain.current.gain.setTargetAtTime(
        // divide gain by number of active notes to avoid distortion
        combinedConfig.gain / (numberOfActiveOscillators || 1),
        audioContext.currentTime,
        0.1
      );
    }
  }, [combinedConfig.gain, numberOfActiveOscillators]);

  // if given type (waveform) changes, update the oscillator
  React.useEffect(() => {
    oscillator.current.type = combinedConfig.type;
  }, [combinedConfig.type]);

  // timeout for tracking the note's length
  const stopTimeout = React.useRef<NodeJS.Timeout>();

  const stop = React.useCallback(() => {
    setIsOn(false);
    remove();
    gain.current.gain.setTargetAtTime(0, audioContext.currentTime, 0.1);
  }, [remove]);

  const start = React.useCallback(
    (length?: number) => {
      clearTimeout(stopTimeout.current);
      add();

      gain.current.gain.setTargetAtTime(combinedConfig.gain / (numberOfActiveOscillators + 1), audioContext.currentTime, 0.1);
      setIsOn(true);

      if (length) {
        stopTimeout.current = setTimeout(() => {
          stop();
        }, length);
      }
    },
    [combinedConfig.gain, add]
  );

  return { start, stop, isOn };
};
