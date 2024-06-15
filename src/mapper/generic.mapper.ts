import { BasicDomainType, BasicEntityType } from '../entity';

export type GenericMapperType<C, U, D extends BasicDomainType<C, U>, E extends BasicEntityType> = {
  domainToEntity(domain: D): E;
  entityToDomain(entity: E): D;
};
