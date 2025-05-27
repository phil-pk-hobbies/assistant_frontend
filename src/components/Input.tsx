import React from 'react';
import classNames from 'classnames';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={classNames('border border-neutral3 p-2 rounded', className)}
    />
  );
}
