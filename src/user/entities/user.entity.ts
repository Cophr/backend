import { OauthIntegration } from "src/auth/entities/oauth.integrations.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ unique: true })
  account: string;

  @Column("varchar", { default: () => "NULL", length: 60, nullable: true })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OauthIntegration, integration => integration.authProvider, {
    cascade: true,
  })
  oauthIntegration: OauthIntegration[];
}
