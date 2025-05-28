import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
}

export default function TextArea({ className, autoResize, onInput, ...rest }: TextAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = ref.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (autoResize) {
      adjustHeight();
    }
  }, [rest.value, autoResize]);

  return (
    <textarea
      ref={ref}
      className={classNames(
        'border border-neutral4 rounded-sm px-3 py-2 focus:outline focus:outline-[3px] focus:outline-offset-2 focus:outline-primary disabled:opacity-50 disabled:cursor-not-allowed aria-invalid:border-danger',
        className,
      )}
      onInput={(e) => {
        if (autoResize) {
          adjustHeight();
        }
        onInput?.(e);
      }}
      {...rest}
    />
  );
}
