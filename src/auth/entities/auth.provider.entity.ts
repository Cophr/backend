import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { OauthIntegration } from "./oauth.integrations.entity";

@Entity({ name: "authProviders" })
export class AuthProviders extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: "canLogin" })
  canLogin: boolean;

  @OneToMany(() => OauthIntegration, integration => integration.authProvider, {
    cascade: true,
  })
  oauthIntegration: OauthIntegration[];
}
