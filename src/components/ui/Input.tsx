import React from 'react';
import classNames from 'classnames';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className, ...rest }: InputProps) {
  return (
    <input
      className={classNames(
        'border border-neutral4 rounded-sm px-3 py-2 focus:outline focus:outline-[3px] focus:outline-offset-2 focus:outline-primary disabled:opacity-50 disabled:cursor-not-allowed aria-invalid:border-danger',
        className,
      )}
      {...rest}
    />
  );
}
