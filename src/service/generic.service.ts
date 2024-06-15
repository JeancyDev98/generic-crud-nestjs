import { BasicDomainType } from '../entity/base.domain';
import { GenericRepositoryType } from '../repository/generic.repository';

export type GenericServiceType<C, U, V> = {
  find(): Promise<V[]>;
  findOne(id: string): Promise<V>;
  create(props: C): Promise<V>;
  update(id: string, props: U): Promise<V>;
  delete(id: string): Promise<V>;
}

export function GenericService<
  C,
  U,
  V,
  D extends BasicDomainType<C, U>,
>(
  View: { new(domain: D): V },
) {
  return class BasicService implements GenericServiceType<C, U, V> {
    constructor(readonly repo: GenericRepositoryType<C, U, D>) { }

    async find(): Promise<V[]> {
      return this.repo.find()
        .then((domains: D[]) =>
          domains.map((domain) => new View(domain))
        );
    }

    async findOne(id: string): Promise<V> {
      return this.repo.findOne(id)
        .then((domain: D) =>
          new View(domain)
        );
    }

    async create(props: C): Promise<V> {
      return this.repo.create(props)
        .then((domain: D) =>
          new View(domain)
        );
    }

    async update(id: string, props: U): Promise<V> {
      return this.repo.update(id, props)
        .then((domain: D) =>
          new View(domain)
        );
    }

    async delete(id: string): Promise<V> {
      return this.repo.delete(id)
        .then((domain: D) =>
          new View(domain)
        );
    }
  }
}