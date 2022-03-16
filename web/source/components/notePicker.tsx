import './notePicker.scss';

import { Button } from '@rocketmakers/armstrong-edge';
import * as React from 'react';

import { Frequencies } from '../../../react-audio/source/utils/frequencies';

export interface INotePickerProps {
  onPickNote: (name: string, frequency: number) => void;
}

export const NotePicker: React.FC<INotePickerProps> = ({ onPickNote }) => {
  return (
    <div className="note-picker">
      <p>Equal Temperament Notes</p>
      <div className="note-picker-notes">
        {Object.keys(Frequencies.EqualTemperamentNotes).map((note) => (
          <Button className="note-picker-note" key={note} onClick={() => onPickNote(note, Frequencies.EqualTemperamentNotes[note])}>
            {note}
          </Button>
        ))}
      </div>
    </div>
  );
};
