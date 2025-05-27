import React from 'react';
import Button from '../components/ui/Button';

export default {
  title: 'Components/Button',
};

export const Variants = () => (
  <div className="space-x-2">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
  </div>
);

export const Sizes = () => (
  <div className="space-x-2">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);
