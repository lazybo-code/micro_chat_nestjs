import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Friends {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    user => user.id,
    { cascade: true, onDelete: 'CASCADE' },
  )
  user: number;

  @ManyToOne(
    () => User,
    user => user.id,
    { cascade: true, onDelete: 'CASCADE' },
  )
  friend: number;

  @Column({ default: null, comment: '好友备注' })
  remark: string;

  @Column({ default: null, comment: "添加说明" })
  description: string;

  @Column({ default: 'apply', comment: '好友状态' })
  status: 'apply' | 'agree' | 'refusal';

  @Column({ default: null, comment: '拒绝说明' })
  refusal: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdTime?: Date;

  @Column({
    type: 'timestamp',
    default: () => 'current_timestamp on update current_timestamp',
    comment: '更新时间',
  })
  updatedTime?: Date;

  @Column({ default: null, comment: '删除时间' })
  deletedTime?: Date;
}
