import * as React from 'react';

export type CardType = 'inner';
export interface CardTabListType {
  key: string;
  tab: React.ReactNode;
}

export interface CardProps {
  prefixCls?: string;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  bordered?: boolean;
  bodyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  loading?: boolean;
  noHovering?: boolean;
  hoverable?: boolean;
  children?: React.ReactNode;
  id?: string;
  className?: string;
  type?: CardType;
  cover?: React.ReactNode;
  actions?: Array<React.ReactNode>;
  tabList?: CardTabListType[];
  onTabChange?: (key: string) => void;
  activeTabKey?: string;
  defaultActiveTabKey?: string;
}

export default class Demo extends React.Component<CardProps, {}> {
  render() {
    return <div> 123123 </div>;
  }
}
