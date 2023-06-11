import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { extname } from 'path';
import { PostService } from './post.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post as PostModel } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
      fileFilter(req, file, callback) {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext file ext are: ${allowedExtArr.toString()}`;
          callback(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5MB';
            callback(null, false);
          } else {
            callback(null, true);
          }
        }
      },
    }),
  )
  create(
    @Req() req: any,
    @Body() body: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.postService.create(req['userData'].id, {
      ...body,
      thumbnail: file.destination + '/' + file.filename,
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: FilterPostDto): Promise<any> {
    return this.postService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostModel> {
    return this.postService.findOne(Number(id));
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
      fileFilter(req, file, callback) {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext file ext are: ${allowedExtArr.toString()}`;
          callback(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5MB';
            callback(null, false);
          } else {
            callback(null, true);
          }
        }
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (file) {
      updatePostDto.thumbnail = file.destination + '/' + file.filename;
    }

    return this.postService.update(Number(id), updatePostDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postService.delete(Number(id));
  }
}
