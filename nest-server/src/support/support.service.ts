import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model } from "mongoose";
import { IAuthUser } from "src/auth/interface/user.interface";
import { PaginationParams } from "src/dtos/pagination-params.dto";
import { HelperService } from "src/shared/helper.service";
import { Role } from "src/user/constants";
import { User, UserDocument } from "src/user/user.model";
import { ChatOutDto } from "./dtos/chat-out.dto";
import { CreateChatDto } from "./dtos/create-chat.dto";
import { MessageDto } from "./dtos/create-message.dto";
import { MessageOutDto } from "./dtos/message-out.dto";
import { PersonalOutDto } from "./dtos/personal-out.dto";
import { UpdateMessageDto } from "./dtos/update-message.dto";
import { ChatDocument, Chat } from "./models/chat.model";
import { Message, MessageDocument } from "./models/message.model";
import { ServerEvents } from "./socker.events";
import { SupportGateway } from "./support.gateway";

@Injectable()
export class SupportService {

  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly helperService: HelperService,
    private readonly supportGateway: SupportGateway,
  ) {}

  async getChats(authUser: IAuthUser): Promise<ChatOutDto[]> {
    const userId = authUser.sub;
    const chats = await this.chatModel.find({ 
      participants: { $in: [userId] } 
    })
    .populate([
      { path: 'participants', model: 'User' }
    ])
    .exec();
    return plainToInstance(ChatOutDto, chats, {
      excludeExtraneousValues: true,
    })
  }
  
  async getPersonals(): Promise<PersonalOutDto[]> {
    const personals = await this.userModel.find({ role: Role.Admin }).exec();
    return plainToInstance(PersonalOutDto, personals, {
      excludeExtraneousValues: true,
    });
  }

  async initChat(authUser: IAuthUser, input: CreateChatDto): Promise<ChatOutDto> {
    if (input.participants.includes(authUser.sub))
      throw new BadRequestException("can't initiate chat with yourself");

    input.participants.push(authUser.sub);
    input.participants.sort(
      (a: string, b: string) => a.localeCompare(b)
    );

    const participants = Array.from(new Set(input.participants));
    const pHash = await this.helperService.generateSha256(participants);

    const chatExists = await this.chatModel.findOne({ hash: pHash })
      .populate([{ path: 'participants', model: 'User' }]);
    if (chatExists) 
      return plainToInstance(ChatOutDto, chatExists, {
      excludeExtraneousValues: true,
    })

    const chat = new this.chatModel({ 
      participants: participants, 
      hash: pHash 
    });
    await chat.save();

    const pChat = await chat.populate([{ path: 'participants', model: 'User' }]);

    const cout = plainToInstance(ChatOutDto, pChat, {
      excludeExtraneousValues: true,
    })
    this.supportGateway.emitToUsers(participants, ServerEvents.chat.new, cout);
    return cout;
  }

  async getMessages(
    authUser: IAuthUser, 
    chatId: string, 
    query: PaginationParams
  ): Promise<MessageOutDto[]> {
    const messages = await this.messageModel.find({
      chatId: chatId,
    })
    .sort({ createdAt: -1 })
    .skip(query.skip)
    .limit(query.limit)
    .populate([{ path: 'sender', model: 'User' }])
    .exec();

    return plainToInstance(MessageOutDto, messages, {
      excludeExtraneousValues: true,
    });
  }
  
  async sendMessage(
    authUser: IAuthUser, 
    chatId: string, 
    input: MessageDto
  ): Promise<MessageOutDto> {

    const msg = new this.messageModel({ 
      chatId: chatId, 
      sender: authUser.sub,
      content: input.content,
    })
    await msg.save();

    const pmsg = await msg.populate({ path: 'sender', model: 'User' });

    const mout = plainToInstance(MessageOutDto, pmsg, {
      excludeExtraneousValues: true,
    })

    this.supportGateway.chatMessage(chatId, ServerEvents.chat.message.new, mout);
    return mout;
  }
  
  async updateMessage(
    authUser: IAuthUser, 
    messageId: string,
    input: UpdateMessageDto
  ): Promise<MessageOutDto> {

    const message = await this.messageModel.findById(messageId);
    if (!message) throw new NotFoundException('message not found');

    if (message.sender != authUser.sub) throw new ForbiddenException('only message sender is allowed to update');

    Object.assign(message, input);
    await message.save();

    const pmsg = await message.populate({ path: 'sender', model: 'User' });

    const mout = plainToInstance(MessageOutDto, pmsg, {
      excludeExtraneousValues: true,
    });
    this.supportGateway.chatMessage(message.chatId, ServerEvents.chat.message.updated, mout);
    return mout;
  }

}