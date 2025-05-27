import React from 'react';
import classNames from 'classnames';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames('bg-primary text-on-primary px-3 py-1 rounded', className)}
    />
  );
}
