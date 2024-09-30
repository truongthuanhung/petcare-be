import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from '../user/user.service';
import { CreatePetDto } from './dtos/create-pet.dto';
import { UpdatePetDto } from './dtos/update-pet.dto';

@Controller('pets')
export class PetController {
  constructor(
    private readonly petService: PetService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPets(@Request() req) {
    try {
      await this.userService.validateUserExists(req.user.userId as string);
      const result = await this.petService.getPetsByUserId(req.user.userId);
      return {
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addPet(@Request() req, @Body() createPetDto: CreatePetDto) {
    try {
      await this.userService.validateUserExists(req.user.userId as string);
      const result = await this.petService.addPet(
        req.user.userId,
        createPetDto,
      );
      return {
        message: 'Add new pet success',
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updatePet(@Request() req, @Body() updatePetDto: UpdatePetDto) {
    try {
      await this.userService.validateUserExists(req.user.userId as string);
      const result = await this.petService.updatePet(
        req.user.userId,
        updatePetDto,
      );
      return {
        message: 'Update pet success',
        result,
      };
    } catch (error) {
      throw error;
    }
  }
}
