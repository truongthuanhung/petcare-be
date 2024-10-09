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
import { PetService } from './pet.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreatePetDto } from './dtos/create-pet.dto';
import { UpdatePetDto } from './dtos/update-pet.dto';
import { USER_MESSAGES } from 'src/shared/constants/messages';

@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPets(@Request() req) {
    return this.petService.getPetsByUserId(req.user.userId as string);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addPet(@Request() req, @Body() createPetDto: CreatePetDto) {
    const result = await this.petService.addPet(req.user.userId, createPetDto);
    return {
      message: USER_MESSAGES.ADD_NEW_PET_SUCCESSFULLY,
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updatePet(@Request() req, @Body() updatePetDto: UpdatePetDto) {
    const result = await this.petService.updatePet(
      req.user.userId,
      updatePetDto,
    );
    return {
      message: USER_MESSAGES.UPDATE_PET_SUCCESSFULLY,
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':petId')
  async deletePet(@Request() req, @Param('petId') petId: string) {
    const userId = req.user.userId as string;
    await this.petService.deletePet(userId, petId);
    return {
      message: USER_MESSAGES.DELETE_PET_SUCCESSFULLY,
    };
  }
}
