import './intervalPicker.scss';

import { Button } from '@rocketmakers/armstrong-edge';
import * as React from 'react';

import { Frequencies } from '../../utils/frequencies';

export interface IIntervalPickerProps {
  onPickInterval: (name: string, ratio: number) => void;
}

export const IntervalPicker: React.FC<IIntervalPickerProps> = ({ onPickInterval }) => {
  return (
    <div className="interval-picker">
      <p>Harmonic Series Intervals</p>
      <div className="interval-picker-intervals">
        {Object.keys(Frequencies.HarmonicSeriesIntervals).map((interval) => (
          <Button
            className="interval-picker-interval"
            key={interval}
            onClick={() => onPickInterval(interval, Frequencies.HarmonicSeriesIntervals[interval])}
          >
            {interval}
          </Button>
        ))}
      </div>
    </div>
  );
};
