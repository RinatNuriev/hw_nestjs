import { Category } from 'src/category/entities/category.entity';
import { Column, PrimaryGeneratedColumn, ManyToOne, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum postStatusEnum {
    DRAW = 'Черновик',
    PUBLISHED = 'Опубликован',
    DELETE = 'Снят с публикации'
}

@Entity()
export class Post {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    title: string

    @ApiProperty()
    @Column()
    description: string

    @ManyToOne(type => Category, category => category.posts, {eager: true})
    category: Category

    @ApiProperty()
    @Column({
        type: 'enum',
        enum: postStatusEnum,
        default: postStatusEnum.DRAW
    })
    status: postStatusEnum

    @ApiProperty()
    @Column({
        type: 'datetime'
    })
    changed_at: Date
}
