import { Controller, Post, UseInterceptors, UploadedFile, HttpStatus, HttpCode, HttpException, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class FileUploadController {
  @Post('single')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExt = extname(file.originalname);
        callback(null, `${uniqueSuffix}${fileExt}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        callback(null, true);
      } else {
        callback(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
  }))

  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return {
        success: false,
        message: 'No file uploaded',
      };
    }
    return {
      success: true,
      message: 'File uploaded successfully',
      data: file,
    };
  }


  // Multiple files upload
  @Post('multiple')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 3, {
    storage: diskStorage({
      destination: './public/uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExt = extname(file.originalname);
        callback(null, `${uniqueSuffix}${fileExt}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        callback(null, true);
      } else {
        callback(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
  }))
  
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    // Determine if single or multiple files were uploaded
    const isSingleFile = Array.isArray(files) && files.length === 1;

    const mappedFiles = files.map((file) => ({
      filename: file.filename,
      path: file.path
    }))

    return {
      success: true,
      message: isSingleFile ? 'file uploaded successfully' : 'files uploaded successfully',
      data: mappedFiles
    };
  }

}
