import { Body, Controller, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppLogger } from "src/app.logger";
import { AuthUser } from "src/auth/decorators/auth-user.decorator";
import { IAuthUser } from "src/auth/interface/user.interface";
import { PaginationParams } from "src/dtos/pagination-params.dto";
import { ParseObjectIdPipe } from "src/pipes/object-id.pipe";
import { CreateChatDto } from "./dtos/create-chat.dto";
import { MessageDto } from "./dtos/create-message.dto";
import { UpdateMessageDto } from "./dtos/update-message.dto";
import { SupportService } from "./support.service";

@ApiTags('Support Controller')
@Controller('support')
export class SupportController {

  private readonly logger = new AppLogger(SupportController.name);

  constructor(private readonly supportService: SupportService) {}

  @Get('personals')
  getSupportPersonals() {
    this.logger.log(`${this.getSupportPersonals.name} was called`);
    return this.supportService.getPersonals();
  }

  @Get('chats')
  getUserChats(@AuthUser() authUser: IAuthUser) {
    this.logger.log(`${this.getUserChats.name} was called`);
    return this.supportService.getChats(authUser);
  }

  @Put('chats')
  createChat(
    @AuthUser() authUser: IAuthUser,
    @Body() input: CreateChatDto,
  ) {
    this.logger.log(`${this.createChat.name} was called`);
    return this.supportService.initChat(authUser, input);
  }

  @Get('chats/:cid/messages')
  getMessages(
    @AuthUser() authUser: IAuthUser, 
    @Param('cid', ParseObjectIdPipe) cid: string,
    @Query() query: PaginationParams,
  ) {
    this.logger.log(`${this.getMessages.name} was called`);
    return this.supportService.getMessages(authUser, cid, query);
  }

  @Post('chats/:cid/messages')
  postMessage(
    @AuthUser() authUser: IAuthUser, 
    @Param('cid', ParseObjectIdPipe) cid: string, 
    @Body() input: MessageDto,
  ) {
    this.logger.log(`${this.postMessage.name} was called`);
    return this.supportService.sendMessage(authUser, cid, input);
  }

  @Patch('chats/messages/:mid')
  patchMessage(
    @AuthUser() authUser: IAuthUser, 
    @Param('mid', ParseObjectIdPipe) mid: string, 
    @Body() input: UpdateMessageDto,
  ) {
    this.logger.log(`${this.patchMessage.name} was called`);
    return this.supportService.updateMessage(authUser, mid, input);
  }

}