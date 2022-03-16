import './editableKey.scss';

import { Button, NumberInput, useDialog } from '@rocketmakers/armstrong-edge';
import n2m from 'num2fraction';
import * as React from 'react';

import { MathsUtils } from '../utils/maths';
import { IntervalPicker } from './intervalPicker';
import { IKeyProps, Key } from './key';
import { NotePicker } from './notePicker';

export type EditableKeyEditMode = 'frequency' | 'fraction' | 'decimal';

export interface IEditableKeyProps extends Pick<IKeyProps, 'totalNotes' | 'waveform' | 'triggerMode' | 'index'> {
  rootFrequency: number;
  editMode?: EditableKeyEditMode;

  // use if on frequency mode
  frequency?: number;
  onChangeFrequency?: (newFrequency: number) => void;
  onRemove?: () => void;
  canPickInteral?: boolean;
}

export const EditableKey: React.FC<IEditableKeyProps> = ({
  editMode,
  frequency,
  onChangeFrequency,
  rootFrequency,
  totalNotes,
  waveform,
  triggerMode,
  onRemove,
  index,
  canPickInteral,
}) => {
  const decimal = React.useMemo(() => frequency / rootFrequency, [frequency, rootFrequency]);

  const fraction = React.useMemo(() => {
    const fr = n2m(frequency / rootFrequency);
    return { numerator: parseInt(fr.split('/')[0], 10), denominator: parseInt(fr.split('/')[1], 10) };
  }, [frequency, rootFrequency]);

  const [numerator, setNumerator] = React.useState(fraction.numerator);
  const [denominator, setDenominator] = React.useState(fraction.denominator);

  const [openNotePicker] = useDialog<number>(({ resolve }) => <NotePicker onPickNote={(_, newFrequency) => resolve(newFrequency)} />);
  const pickNote = React.useCallback(async () => {
    const note = await openNotePicker();
    if (note) {
      onChangeFrequency(note);

      const fr = n2m(note / rootFrequency);
      setNumerator(parseInt(fr.split('/')[0], 10));
      setDenominator(parseInt(fr.split('/')[1], 10));
    }
  }, [rootFrequency, onChangeFrequency]);

  const [openIntervalPicker] = useDialog<number>(({ resolve }) => <IntervalPicker onPickInterval={(_, newInterval) => resolve(newInterval)} />);
  const pickInterval = React.useCallback(async () => {
    const interval = await openIntervalPicker();
    if (interval) {
      const note = rootFrequency * interval;
      onChangeFrequency(note);

      const fr = n2m(interval);
      setNumerator(parseInt(fr.split('/')[0], 10));
      setDenominator(parseInt(fr.split('/')[1], 10));
    }
  }, [rootFrequency, onChangeFrequency]);

  return (
    <div className="editable-key">
      <Key frequency={frequency} totalNotes={totalNotes} waveform={waveform} triggerMode={triggerMode} index={index} />

      {editMode === 'frequency' && (
        <NumberInput
          value={frequency}
          onChange={(event) => event.currentTarget.valueAsNumber && onChangeFrequency(event.currentTarget.valueAsNumber)}
          step={1}
          rightOverlay="Hz"
        />
      )}
      {editMode === 'fraction' && (
        <div className="fraction-input">
          <NumberInput
            value={numerator}
            onChange={(event) => {
              setNumerator(event.currentTarget.valueAsNumber);
              onChangeFrequency((rootFrequency * event.currentTarget.valueAsNumber) / denominator);
            }}
            step={1}
          />
          <NumberInput
            value={denominator}
            onChange={(event) => {
              setDenominator(event.currentTarget.valueAsNumber);
              onChangeFrequency((numerator / rootFrequency) * event.currentTarget.valueAsNumber);
            }}
            step={1}
          />
        </div>
      )}
      {editMode === 'decimal' && (
        <NumberInput
          value={decimal}
          onChange={(event) => event.currentTarget.valueAsNumber && onChangeFrequency(rootFrequency * event.currentTarget.valueAsNumber)}
          step={0.01}
        />
      )}
      {editMode !== 'frequency' && <p className="frequency">{MathsUtils.round(frequency, 2)}Hz</p>}

      <div className="buttons">
        {onRemove && (
          <Button minimalStyle onClick={onRemove}>
            delete
          </Button>
        )}
        <Button minimalStyle onClick={pickNote}>
          pick note
        </Button>
        {canPickInteral && (
          <Button minimalStyle onClick={pickInterval}>
            pick interval
          </Button>
        )}
      </div>
    </div>
  );
};

EditableKey.defaultProps = {
  editMode: 'frequency',
};
