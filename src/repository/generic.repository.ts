import { Logger } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BasicEntityType } from '../entity/base.entity';
import { BasicDomainType } from '../entity/base.domain';
import { GenericMapperType } from '../mapper/generic.mapper';

export type GenericRepositoryType<C, U, D extends BasicDomainType<C, U>> = {
  exist(id: string): Promise<boolean>;
  find(): Promise<D[]>;
  findOne(id: string): Promise<D>;
  create(props: C): Promise<D>;
  update(id: string, props: U): Promise<D>;
  delete(id: string): Promise<D>;
}

export function GenericRepository<
  C,
  U,
  D extends BasicDomainType<C, U>,
  E extends BasicEntityType,
  M extends GenericMapperType<C, U, D, E>,
>(
  Mapper: { new(): M },
  Domain: { new(): D },
) {
  return class Service implements GenericRepositoryType<C, U, D> {
    readonly logger: Logger;
    readonly mapper: M;
    constructor(readonly repo: Repository<E>) {
      this.logger = new Logger(repo.metadata.name);
      this.mapper = new Mapper();
    }

    exist(id: string): Promise<boolean> {
      return this.repo.exists({ where: { id } as FindOptionsWhere<E> });
    }

    async find(): Promise<D[]> {
      return this.repo.find()
        .then((entities: E[]) =>
          entities.map(
            (e: E) =>
              this.mapper.entityToDomain(e)
          )
        );
    }

    async findOne(id: string): Promise<D> {
      return this.repo.findOne({ where: { id } as FindOptionsWhere<E> })
        .then((entity: E | null) => {
          if (entity != null)
            return this.mapper.entityToDomain(entity);
          throw new Error('Not Found');
        });
    }

    async create(props: C): Promise<D> {
      const domain = new Domain();
      domain.create(props);
      return this.repo.save(this.mapper.domainToEntity(domain))
        .then((entity: E) =>
          this.mapper.entityToDomain(entity)
        );
    }

    async update(id: string, props: U): Promise<D> {
      const domain = new Domain();
      domain.update(props, id);
      return this.repo.save(this.mapper.domainToEntity(domain))
        .then((entity: E) =>
          this.mapper.entityToDomain(entity));
    }

    async delete(id: string): Promise<D> {
      const domain = await this.findOne(id);
      await this.repo.softDelete({ id } as FindOptionsWhere<E>);
      return domain;
    }
  }
}