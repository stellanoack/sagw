import React from 'react';

import './button.css';

export interface InterfaceButtonProps {
  primary?: boolean;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  label: string;
  onClick?: () => void;
}

export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: InterfaceButtonProps): React.JSX.Element => {
  const mode = primary
    ? 'button--primary'
    : 'button--secondary';

  return (
    <button
      type='button'
      className={[
        'button',
        `button--${size}`,
        mode,
      ].join(' ')}
      {...props}
    >
      {label}
      <style jsx>{`
        button {
          background-color: ${backgroundColor};
        }
      `}</style>
    </button>
  );
};
