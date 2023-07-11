import { Category } from 'src/category/entities/category.entity';
import { Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

export enum postStatusEnum {
    DRAW = 'Черновик',
    PUBLISHED = 'Опубликован',
    DELETE = 'Снят с публикации'
}

export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string

    @Column()
    description: string

    @ManyToOne(type => Category, category => category.posts, {eager: true})
    category: Category

    @Column({
        type: 'enum',
        enum: postStatusEnum,
        default: postStatusEnum.DRAW
    })
    status: postStatusEnum

    @Column({
        type: 'datetime'
    })
    changed_at: Date
}
