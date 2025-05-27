import React from 'react';
import classNames from 'classnames';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export default function Select({ className, ...rest }: SelectProps) {
  return (
    <select
      className={classNames(
        'border border-neutral4 rounded-sm px-3 py-2 focus:outline focus:outline-[3px] focus:outline-offset-2 focus:outline-primary disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...rest}
    />
  );
}
