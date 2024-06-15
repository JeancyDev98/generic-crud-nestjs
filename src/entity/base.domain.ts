import { BasicPropsType } from './base.props';

export type BasicDomainType<C, U> = BasicPropsType & {
  create(props: C, id?: string): BasicDomainType<C, U>;
  update(props: U, id?: string): BasicDomainType<C, U>;
}