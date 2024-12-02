import { Expose } from 'class-transformer';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Marking from '@modules/markings/infra/typeorm/entities/Marking';

@Entity('scores')
class Score {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column()
  weight: string;

  @Column()
  type: string;

  @Column()
  nfe: string;

  @Column()
  name: string;

  @Column()
  lote: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  status: boolean;

  @OneToMany(() => Marking, marking => marking.score, {
    eager: true,
  })
  @JoinTable()
  markings: Marking[];

  @Column()
  producer_id_sender: string;

  @Column()
  farm_id_sender: string;

  @Column()
  producer_id_received: string;

  @Column()
  farm_id_received: string;

  @Column()
  producer_id_internal: string;

  @Column()
  farm_id_internal: string;

  @Column()
  file: string;

  @Expose({ name: 'file_url' })
  file_url(): string {
    switch (process.env.STORAGE_DRIVER) {
      case 'disk':
        return `${process.env.APP_API_URL}/scores/file/${this.file}`;
      case 's3':
        return `${process.env.AWS_BUCKET_URL}/scores/file/${this.file}`;
      default:
        return '';
    }
  }

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Score;
