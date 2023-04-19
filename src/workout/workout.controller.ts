import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Controller('workout')
export class WorkoutController {
  constructor(
    private readonly workoutService: WorkoutService,
    private jwtService: JwtService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() body: any) {
    const pureToken = req?.headers['authorization']?.substring(7);
    const response = this.jwtService.decode(pureToken) as {
      userId: string;
      sub: number;
    };
    const id = response.sub;
    return this.workoutService.create(id, body);
  }

  @Get()
  findAll() {
    return this.workoutService.findAll();
  }

  @Delete('/workoutNum')
  @UseGuards(JwtAuthGuard)
  deleteWorkoutNum(
    @Req() req,
    @Body() body: { datesId: number; workoutNum: number },
  ) {
    const pureToken = req?.headers['authorization']?.substring(7);
    const response = this.jwtService.decode(pureToken) as {
      userId: string;
      sub: number;
    };
    const id = response.sub;

    return this.workoutService.deleteWorkoutNum(body.datesId, body.workoutNum);
  }

  @Delete('/workoutName')
  @UseGuards(JwtAuthGuard)
  deleteWorkoutName(
    @Req() req,
    @Body() body: { id: number; workoutNumId: number; datesId: number },
  ) {
    return this.workoutService.deleteWorkoutName(
      body.id,
      body.workoutNumId,
      body.datesId,
    );
  }

  @Delete('/workout')
  @UseGuards(JwtAuthGuard)
  deleteWorkout(
    @Req() req,
    @Body()
    body: {
      id: number;
      datesId: number;
      workoutNumId: number;
      workoutNameId: number;
    },
  ) {
    return this.workoutService.deleteWorkout(
      body.id,
      body.datesId,
      body.workoutNumId,
      body.workoutNameId,
    );
  }

  @Get('/:date')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req, @Param('date') date: string) {
    const pureToken = req?.headers['authorization']?.substring(7);
    const response = this.jwtService.decode(pureToken) as {
      userId: string;
      sub: number;
    };
    const id = response.sub;
    return this.workoutService.findWorkouts(id, date);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWorkoutDto: UpdateWorkoutDto) {
  //   return this.workoutService.update(+id, updateWorkoutDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.workoutService.remove(+id);
  // }
}
