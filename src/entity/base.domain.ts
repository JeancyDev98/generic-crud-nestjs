import { BasicPropsType } from './base.props';

export type BasicCreateType<D> = Omit<D, keyof BasicDomainType<unknown, unknown>>

export type BasicUpdateType<D> = Partial<D>;

export type BasicDomainType<C, U> = BasicPropsType & {
  create(props: C, id?: string): BasicDomainType<C, U>;
  update(props: U, id?: string): BasicDomainType<C, U>;
}