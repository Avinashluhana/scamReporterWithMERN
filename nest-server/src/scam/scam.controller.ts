import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { AppLogger } from "src/app.logger";
import { AuthUser } from "src/auth/decorators/auth-user.decorator";
import { Public } from "src/auth/decorators/is-public.decorator";
import { IAuthUser } from "src/auth/interface/user.interface";
import { Roles } from "src/decorators/role.decorator";
import { ParseObjectIdPipe } from "src/pipes/object-id.pipe";
import { Role } from "src/user/constants";
import { AddCommentDto } from "./dtos/add-comment.dto";
import { CheckScamQuery } from "./dtos/check-scam-query.dto";
import { RegisterScamDto } from "./dtos/register-scam.dto";
import { ScamListOutDto } from "./dtos/scam-list-out.dto";
import { ScamOutDto } from "./dtos/scam-out.dto";
import { SubscribeNewsLetterDto } from "./dtos/subscribe-newsletter.dto";
import { UpdateScamDto } from "./dtos/update-scam.dto";
import { ScamService } from "./scam.service";
import { FilterScamDto } from './dtos/filter-scam.dto';
import { UpdateStatusDto } from "./dtos/update-status.dto";
import { PaginationParams } from "src/dtos/pagination-params.dto";
import { SearchScamDto } from "./dtos/search-scam.dto";

@ApiTags('Scam Controller')
@Controller('scam')
export class ScamController {

  private readonly logger = new AppLogger(ScamController.name);

  constructor(private readonly scamService: ScamService) {}

  @Get('types')
  @Public()
  getScamTypes() {
    this.logger.log(`${this.getScamTypes.name} was called`);
    return this.scamService.getScamTypes();
  }

  @Get('list')
  @Roles(Role.Admin)
  getScamList(@AuthUser() authUser: IAuthUser) {
    this.logger.log(`${this.getScamList.name} was called`);
    return this.scamService.getScamList();
  }

  @Post('subscribe-newsletter')
  @Public()
  handleSubscribeNewsletter(@Body() input: SubscribeNewsLetterDto) {
    this.logger.log(`${this.handleSubscribeNewsletter.name} was called`);
    return this.scamService.subscribeNewsLetter(input);
  }

  @Get('check')
  @Public()
  getCheckScam(@Query() query: CheckScamQuery) {
    this.logger.log(`${this.getCheckScam.name} was called`);
    return this.scamService.checkScam(query.url);
  }

  @Get('stats')
  @Roles(Role.Admin)
  getScamStats() {
    this.logger.log(`${this.getScamStats.name} was called`);
    return this.scamService.scamStats();
  }

  @Get('my')
  getUserScams(@AuthUser() authUser: IAuthUser) {
    this.logger.log(`${this.getUserScams.name} was called`);
    return this.scamService.getUserScams(authUser);
  }

  @Get('my-stats')
  getMyStats(@AuthUser() authUser: IAuthUser) {
    return this.scamService.getMyStats(authUser);
  }

  @Get('subscriptions')
  @Roles(Role.Admin)
  getSubscriptionList() {
    this.logger.log(`${this.getSubscriptionList.name} was called`);
    return this.scamService.getSubscriptionList();
  }

  @Delete('subscriptions/:subscriptionId')
  @Roles(Role.Admin)
  deleteSubscription(@Param('subscriptionId', ParseObjectIdPipe) subscriptionId: string) {
    this.logger.log(`${this.deleteSubscription.name} was called`);
    return this.scamService.deleteSubscription(subscriptionId);
  }

  @Get(':id/comments')
  @Public()
  getScamComments(@Param('id', ParseObjectIdPipe) scamId: string) {
    this.logger.log(`${this.getScamComments.name} was called`);
    return this.scamService.getScamComments(scamId);
  }

  @Post(':id/comments')
  addScamComment(
    @AuthUser() authUser: IAuthUser, 
    @Param('id', ParseObjectIdPipe) scamId: string,
    @Body() input: AddCommentDto
  ) {
    this.logger.log(`${this.addScamComment.name} was called`);    
    return this.scamService.addScamComment(authUser, scamId, input);
  }

  @Patch(':scamId/status')
  @Roles(Role.Admin)
  updateStatus(
    @Param('scamId', ParseObjectIdPipe) scamId: string,
    @Body() input: UpdateStatusDto,
  ) {
    this.logger.log(`${this.updateStatus.name} was called`);
    return this.scamService.updateScamStatus(scamId, input);
  }

  @Get(':scamId')
  @Public()
  getScamById(@Param('scamId', ParseObjectIdPipe) scamId: string) {
    this.logger.log(`${this.getScamById.name} was called`);
    return this.scamService.findScamById(scamId);
  }

  @Delete(':scamId')
  deleteScam(
    @AuthUser() authUser: IAuthUser,
    @Param('scamId', ParseObjectIdPipe) scamId: string
  ) {
    this.logger.log(`${this.deleteScam.name} was called`);
    return this.scamService.deleteScam(authUser, scamId);
  }

  @Patch(':scamId')
  @UseInterceptors(FilesInterceptor('files'))
  updateScam(
    @AuthUser() authUser: IAuthUser, 
    @Param('scamId', ParseObjectIdPipe) scamId: string, 
    @Body() input: UpdateScamDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    this.logger.log(`${this.updateScam.name} was called`);
    if (files && files.length) input['media'] = files.map(file => file['__uploadPath'])
    return this.scamService.updateScam(authUser, scamId, input); 
  }

  @Get()
  @Public()
  getScams(@Query() search: SearchScamDto, @Query('limit') limit: string  ) {
    this.logger.log(`${this.getScams.name} was called`);
    return this.scamService.getScam(search, limit);
  }

  @Post()
  @Public()
  @UseInterceptors(FilesInterceptor('files'))
  registerScam(
    @Body() input: RegisterScamDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<ScamOutDto> {
    this.logger.log(`${this.registerScam.name} was called`);
    if (files && files.length) input['media'] = files.map(file => file['__uploadPath'])
    return this.scamService.registerScam(input);
  }

}
