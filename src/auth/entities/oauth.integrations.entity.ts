import { UserEntity } from "src/user/entities/user.entity";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { AuthProviders } from "./auth.provider.entity";

@Entity({ name: "oauthIntegrations" })
export class OauthIntegration extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AuthProviders, provider => provider.oauthIntegration, {
    nullable: false,
  })
  authProvider: AuthProviders;

  @ManyToOne(() => UserEntity, user => user.oauthIntegration, {
    nullable: false,
  })
  user: UserEntity;

  @Column()
  externalId: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  expireAt: Date;
}
