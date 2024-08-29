import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports:[
    MulterModule.register({
      dest: './public/uploads'
    })
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService]
})
export class FileUploadModule {}
