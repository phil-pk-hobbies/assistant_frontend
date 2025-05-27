import React from 'react';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import Select from '../components/ui/Select';

export default {
  title: 'Components/Inputs',
};

export const Base = () => (
  <div className="space-y-2">
    <Input placeholder="Type here" />
    <TextArea placeholder="Enter text" />
    <Select>
      <option>Option A</option>
      <option>Option B</option>
    </Select>
  </div>
);

export const Disabled = () => (
  <div className="space-y-2">
    <Input disabled placeholder="Disabled" />
    <TextArea disabled placeholder="Disabled" />
    <Select disabled>
      <option>Option A</option>
    </Select>
  </div>
);
