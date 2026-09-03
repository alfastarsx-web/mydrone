import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './application/content.service';
import { Faq } from './infrastructure/faq.entity';
import { Lead } from './infrastructure/lead.entity';
import { Post } from './infrastructure/post.entity';
import { Setting } from './infrastructure/setting.entity';
import { AdminContentController, ContentController } from './presentation/content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Faq, Setting, Lead])],
  controllers: [ContentController, AdminContentController],
  providers: [ContentService],
  exports: [ContentService, TypeOrmModule]
})
export class ContentModule {}
