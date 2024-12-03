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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('pets') // Tên nhóm trong Swagger
@ApiBearerAuth() // Bảo mật JWT
@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all pets of the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'List of user pets retrieved successfully',
  })
  async getPets(@Request() req) {
    return this.petService.getPetsByUserId(req.user.userId as string);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Add a new pet for the logged-in user' })
  @ApiResponse({ status: 201, description: 'Pet added successfully' })
  async addPet(@Request() req, @Body() createPetDto: CreatePetDto) {
    const result = await this.petService.addPet(req.user.userId, createPetDto);
    return {
      message: USER_MESSAGES.ADD_NEW_PET_SUCCESSFULLY,
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Update a pet for the logged-in user' })
  @ApiResponse({ status: 200, description: 'Pet updated successfully' })
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
  @ApiOperation({ summary: 'Delete a pet by its ID' })
  @ApiResponse({ status: 200, description: 'Pet deleted successfully' })
  async deletePet(@Request() req, @Param('petId') petId: string) {
    const userId = req.user.userId as string;
    await this.petService.deletePet(userId, petId);
    return {
      message: USER_MESSAGES.DELETE_PET_SUCCESSFULLY,
    };
  }
}
