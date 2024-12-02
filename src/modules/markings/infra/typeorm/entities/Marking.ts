import Score from '@modules/scores/infra/typeorm/entities/Score';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('markings')
class Marking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column()
  weight: string;

  @Column()
  sequence: number;

  @Column()
  score_id: string;

  @ManyToOne(() => Score, score => score.markings)
  @JoinColumn({ name: 'score_id' })
  score: Score;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Marking;
