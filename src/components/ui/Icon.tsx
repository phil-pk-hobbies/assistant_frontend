import React from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import classNames from 'classnames';

// Only import icons used in the application. Add new ones here as needed.
const icons = { Pencil, Trash2, X };

export type IconName = keyof typeof icons;

const sizeMap = { sm: 16, md: 20, lg: 24 } as const;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: keyof typeof sizeMap;
  colorToken?: string;
  className?: string;
}

export default function Icon({
  name,
  size = 'md',
  className,
  colorToken,
  ...rest
}: IconProps) {
  const Lucide = icons[name];
  return (
    <Lucide
      stroke="currentColor"
      width={sizeMap[size]}
      height={sizeMap[size]}
      className={classNames(className)}
      style={colorToken ? { color: `var(${colorToken})` } : undefined}
      aria-hidden={rest['aria-label'] ? undefined : true}
      {...rest}
    />
  );
}
