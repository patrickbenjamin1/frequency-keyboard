import './key.scss';

import { useDidUpdateEffect } from '@rocketmakers/armstrong-edge';
import * as React from 'react';

import { useOscillator } from '../../../react-audio/source/hooks/useOscillator';
import { KeyboardUtils } from '../utils/keyboard';

export type KeyTriggerMode = 'hold' | 'one' | 'toggle';

export interface IKeyProps {
  triggerMode?: KeyTriggerMode;
  /** use with press */
  length?: number;
  frequency: number;
  waveform?: OscillatorType;

  /** used to calculate gain */
  totalNotes?: number;

  /** out of 1 */
  gain?: number;

  index?: number;
}

export const Key: React.FC<IKeyProps> = ({ triggerMode, length, frequency, waveform, totalNotes, gain, index }) => {
  const [toggleOn, setToggleOn] = React.useState(false);

  const { start, stop, isOn } = useOscillator({ frequency, type: waveform, gain: gain / totalNotes });

  const onMouseDown = React.useCallback(() => {
    if (triggerMode === 'one') {
      start(length);
    }
    if (triggerMode === 'toggle') {
      if (toggleOn) {
        stop();
      } else {
        start();
      }
      setToggleOn(!toggleOn);
    }
    if (triggerMode === 'hold') {
      start();
    }
  }, [length, triggerMode, start, toggleOn]);

  const onMouseUp = React.useCallback(() => {
    if (triggerMode === 'hold') {
      stop();
    }
  }, [start, triggerMode]);

  useDidUpdateEffect(() => stop(), [triggerMode]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keyIndex = KeyboardUtils.keyToNumber(event.key);
      if (index === keyIndex) {
        onMouseDown();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onMouseUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onMouseUp);
    };
  }, [index, onMouseDown, onMouseUp]);

  return (
    <div data-on={isOn} className="key" onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
      <p className="key-keyboard">{KeyboardUtils.numberToKey(index)}</p>
    </div>
  );
};

Key.defaultProps = {
  length: 500,
  triggerMode: 'toggle',
  totalNotes: 1,
  gain: 1,
};
