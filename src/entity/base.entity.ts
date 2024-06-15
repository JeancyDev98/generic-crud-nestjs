import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BasicPropsType } from './base.props';

export type BasicEntityType = BasicPropsType;

export function BasicEntity() {
  class Basic implements BasicEntityType {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;
  }
  return Basic;
}