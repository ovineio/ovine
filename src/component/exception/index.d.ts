import * as React from 'react';
export type ExceptionType = '403' | '404' | '500';
export interface ExceptionProps {
  type?: ExceptionType;
  title?: React.ReactNode;
  desc?: React.ReactNode;
  img?: string;
  actions?: React.ReactNode;
  linkElement?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default class Exception extends React.Component<ExceptionProps, any> {}
