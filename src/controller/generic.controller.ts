import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { GenericServiceType } from '../service/generic.service';

export type GenericControllerType<C, U, V> = {
  find(): Promise<V[]>;
  findOne(id: string): Promise<V>;
  create(dto: C): Promise<V>;
  update(id: string, dto: U): Promise<V>;
  delete(id: string): Promise<V>;
}

export function GenericController<C, U, V>() {
  class Controller implements GenericControllerType<C, U, V> {
    constructor(readonly service: GenericServiceType<C, U, V>) { }

    @Get()
    find(): Promise<V[]> {
      return this.service.find();
    }

    @Get(':id')
    findOne(
      @Param('id', ParseUUIDPipe)
      id: string
    ): Promise<V> {
      return this.service.findOne(id);
    }

    @Post()
    create(
      @Body()
      dto: C
    ): Promise<V> {
      return this.service.create(dto);
    }

    @Patch(':id')
    update(
      @Param('id', ParseUUIDPipe)
      id: string,
      @Body()
      dto: U
    ): Promise<V> {
      return this.service.update(id, dto);
    }

    @Delete(':id')
    delete(
      @Param('id', ParseUUIDPipe)
      id: string
    ): Promise<V> {
      return this.service.delete(id);
    }
  }
  return Controller;
}