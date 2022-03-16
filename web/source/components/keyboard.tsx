import './keyboard.scss';

import { Button, Objects, Select } from '@rocketmakers/armstrong-edge';
import * as React from 'react';

import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { EditableKey, EditableKeyEditMode } from './editableKey';
import { KeyTriggerMode } from './key';

interface IKeyboardKey {
  id: string;
  frequency: number;
}

export const Keyboard: React.FC = () => {
  const [editMode, setEditMode] = useLocalStorageState<EditableKeyEditMode>('edit_mode', 'fraction');
  const [triggerMode, setTriggerMode] = useLocalStorageState<KeyTriggerMode>('trigger_mode', 'toggle');
  const [intervalMode, setIntervalMode] = useLocalStorageState<'from root' | 'from previous note'>('interval_mode', 'from root');

  const [root, setRoot] = useLocalStorageState<number>('root', 440);

  const [keys, setKeys] = useLocalStorageState<IKeyboardKey[]>('keys', []);

  const addKey = React.useCallback(() => {
    setKeys([...keys, { id: new Date().getTime().toString() + keys.length, frequency: root }]);
  }, [Objects.contentDependency(keys)]);

  const onKeyChange = React.useCallback(
    (id: string, frequency: number) => {
      setKeys([
        ...keys.map((key) => {
          if (id === key.id) {
            return {
              ...key,
              frequency,
            };
          }

          return key;
        }),
      ]);
    },
    [Objects.contentDependency(keys)]
  );

  const removeKey = React.useCallback(
    (id: string) => {
      setKeys(keys.filter((key) => key.id !== id));
    },
    [Objects.contentDependency(keys)]
  );

  return (
    <div className="keyboard">
      <div className="settings">
        <label>
          edit mode
          <Select
            value={editMode}
            onSelectOption={({ id }) => setEditMode(id)}
            options={[{ id: 'decimal' }, { id: 'fraction' }, { id: 'frequency' }]}
          />
        </label>
        <label>
          trigger mode
          <Select value={triggerMode} onSelectOption={({ id }) => setTriggerMode(id)} options={[{ id: 'toggle' }, { id: 'hold' }, { id: 'one' }]} />
        </label>
        <label>
          interval mode
          <Select
            value={intervalMode}
            onSelectOption={({ id }) => setIntervalMode(id)}
            options={[{ id: 'from root' }, { id: 'from previous note' }]}
          />
        </label>
      </div>

      <div className="keyboard-keys">
        <EditableKey rootFrequency={root} frequency={root} onChangeFrequency={setRoot} editMode="frequency" triggerMode={triggerMode} index={0} />

        {keys.map((key, index) => (
          <EditableKey
            key={key.id}
            // eslint-disable-next-line no-nested-ternary
            rootFrequency={intervalMode === 'from root' ? root : index === 0 ? root : keys[index - 1].frequency}
            editMode={editMode}
            triggerMode={triggerMode}
            frequency={key.frequency}
            onChangeFrequency={(newFrequency) => onKeyChange(key.id, newFrequency)}
            onRemove={() => removeKey(key.id)}
            index={index + 1}
            canPickInteral
          />
        ))}
        <Button onClick={addKey}>Add Key</Button>
      </div>
    </div>
  );
};
