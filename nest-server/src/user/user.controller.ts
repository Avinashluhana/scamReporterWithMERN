import { Body, Controller, Delete, Get, Param, Patch, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { AppLogger } from "src/app.logger";
import { AuthUser } from "src/auth/decorators/auth-user.decorator";
import { IAuthUser } from "src/auth/interface/user.interface";
import { Roles } from "src/decorators/role.decorator";
import { ParseObjectIdPipe } from "src/pipes/object-id.pipe";
import { Role } from "./constants";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserService } from "./user.service";

@ApiTags('Users Controller')
@Controller('users')
export class UserController {

  private readonly logger = new AppLogger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get('me')
  getSelfInfo(@AuthUser() authUser: IAuthUser) {
    this.logger.log(`${this.getSelfInfo.name} was called`);
    return this.userService.findById(authUser.sub);
  }

  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar'))
  updateSelfInfo(
    @AuthUser() authUser: IAuthUser, 
    @Body() input: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.log(`${this.updateSelfInfo.name} was called`);
    if (file) input['avatar'] = file['__uploadPath'];
    return this.userService.updateUser(authUser, input);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  patchUser(@Param('id', ParseObjectIdPipe) userId: string, @Body() input: PatchUserDto) {
    this.logger.log(`${this.patchUser.name} was called`);
    return this.userService.patchUser(userId, input);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  handleDeleteUser(@Param('id', ParseObjectIdPipe) userId: string) {
    this.logger.log(`${this.handleDeleteUser.name} was called`);
    return this.userService.deleteById(userId);
  }

  @Get()
  @Roles(Role.Admin)
  getUserList() {
    this.logger.log(`${this.getUserList.name} was called`);
    return this.userService.findAll();
  }

}