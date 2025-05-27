import React from 'react';
import classNames from 'classnames';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80',
  secondary: 'bg-surface border border-neutral4 text-primary hover:bg-neutral2 active:bg-neutral3',
  ghost: 'bg-transparent hover:bg-neutral2 active:bg-neutral3 text-primary',
  danger: 'bg-danger text-on-primary hover:bg-danger/90 active:bg-danger/80',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center rounded-sm font-medium focus:outline focus:outline-[3px] focus:outline-offset-2 focus:outline-primary disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    />
  );
}
