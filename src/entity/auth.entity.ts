// import * as bcrypt from 'bcrypt';
// import { classToPlain, Exclude } from 'class-transformer';
// import { IsEmail, IsOptional, IsString } from 'class-validator';
// import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

// export enum Provider {
//   Local,
//   Google,
// }

// @Entity()
// export class Auth {
//   @Column({ nullable: true })
//   @IsOptional()
//   @IsString()
//   public photo?: string;

//   @Exclude({ toPlainOnly: true })
//   @Column({ nullable: true })
//   @IsOptional()
//   @IsString()
//   public password?: string;

//   @Column({ type: 'enum', enum: Provider, default: Provider.Local })
//   public provider: Provider;
// }
