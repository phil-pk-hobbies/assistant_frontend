import React from 'react';
import * as Icons from 'lucide-react';
import classNames from 'classnames';

export type LucideIconName = keyof typeof Icons;

const sizeMap = { sm: 16, md: 20, lg: 24 } as const;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: LucideIconName;
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
  const Lucide = Icons[name] as React.FC<React.SVGProps<SVGSVGElement>>;
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
