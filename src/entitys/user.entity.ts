import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, comment: '昵称' })
  nickname: string;

  @Column({ unique: true, comment: '账号' })
  username: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ default: null, comment: '头像' })
  avatar?: string;

  @Column({ default: null, comment: '个性签名' })
  signature?: string;

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
