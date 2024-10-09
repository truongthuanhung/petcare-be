import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateRecordDto } from './dtos/create-record.dto';
import { USER_MESSAGES } from 'src/shared/constants/messages';
import { UpdateRecordDto } from './dtos/update-record.dto';

@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}
  @UseGuards(JwtAuthGuard)
  @Get('pets/:petId')
  async getRecordsByPetId(@Request() req, @Param('petId') petId: string) {
    const userId = req.user.userId as string;
    return this.recordService.getRecordsByPetId(userId, petId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createRecord(@Request() req, @Body() createRecordDto: CreateRecordDto) {
    const userId = req.user.userId as string;
    const result = await this.recordService.createRecord(
      userId,
      createRecordDto,
    );
    return {
      message: USER_MESSAGES.CREATE_RECORD_SUCCESSFULLY,
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateRecord(@Request() req, @Body() updateRecordDto: UpdateRecordDto) {
    const userId = req.user.userId as string;
    const result = await this.recordService.updateRecord(
      userId,
      updateRecordDto,
    );
    return {
      message: USER_MESSAGES.CREATE_RECORD_SUCCESSFULLY,
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':recordId')
  async deleteReminder(@Request() req, @Param('recordId') recordId: string) {
    const userId = req.user.userId as string;
    await this.recordService.deleteRecord(userId, recordId);
    return {
      message: USER_MESSAGES.DELETE_RECORD_SUCCESSFULLY,
    };
  }
}
