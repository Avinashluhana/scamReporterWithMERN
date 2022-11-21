import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model } from "mongoose";
import { IAuthUser } from "src/auth/interface/user.interface";
import { AddCommentDto } from "./dtos/add-comment.dto";
import { CommentOut } from "./dtos/comment-out.dto";
import { RegisterScamDto } from "./dtos/register-scam.dto";
import { ScamOutDto } from "./dtos/scam-out.dto";
import { SubscribeNewsLetterDto } from "./dtos/subscribe-newsletter.dto";
import { SubscriptionOutDto } from "./dtos/subscription-out.dto";
import { UpdateScamDto } from "./dtos/update-scam.dto";
import { Subscription } from "./models/newsletter-subsription.model";
import { Scam, ScamDocument, Status } from "./models/scam.model";
import { Comment, CommentDocument } from './models/comment.model';
import { tap, catchError } from "rxjs";
import { ScamCheckResult } from "./dtos/scam-check-result.dto";
import { ConfigService } from "@nestjs/config";
import { HttpService } from '@nestjs/axios';
import { ScamListOutDto } from "./dtos/scam-list-out.dto";
import { FilterScamDto } from "./dtos/filter-scam.dto";
import { AppLogger } from "src/app.logger";
import { UpdateStatusDto } from "./dtos/update-status.dto";
import { Role } from "src/user/constants";
import { ScamListAdminOutDto } from "./dtos/scam-list-admin.out";
import { User, UserDocument } from "src/user/user.model";
import { SearchScamDto } from "./dtos/search-scam.dto";
import { ScamType, ScamTypeDocument } from "./models/scam-type.model";
import { ScamTypeDto } from "./dtos/ScamType.dto";

@Injectable()
export class ScamService {

  private readonly logger = new AppLogger(ScamService.name);

  constructor(
    @InjectModel(Scam.name) private readonly scamModel: Model<ScamDocument>,
    @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ScamType.name) private readonly scamType: Model<ScamTypeDocument>,
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) { }

  async registerScam(input: RegisterScamDto): Promise<ScamOutDto> {
    const scam = new this.scamModel(input);
    await scam.save();

    // if user have checked subscribed to newsletter 
    if (input.subscribeNewsLetter && input.userEmail) {

      // get user account info
      const userAccount = await this.userModel.findOne({ email: input.userEmail });

      await this.subscriptionModel.updateOne({ email: input.userEmail }, {
        user: userAccount ? userAccount._id : null,
        email: input.userEmail,
      }, { upsert: true });

    }

    return plainToInstance(ScamOutDto, scam, {
      excludeExtraneousValues: true,
    });
  }

  async deleteSubscription(subscriptionId: string) {
    const subscription = await this.subscriptionModel.findById(subscriptionId);
    if (!subscription) throw new NotFoundException();

    await subscription.remove();
    
    return { id: subscriptionId };
  }

  async findScamById(scamId: string): Promise<ScamOutDto> {
    const scam = await this.scamModel.findById(scamId);
    if (!scam) throw new NotFoundException();
    return plainToInstance(ScamOutDto, scam, {
      excludeExtraneousValues: true,
    })
  }

  async getUserScams(authUser: IAuthUser): Promise<ScamListOutDto[]> {
    const scams = await this.scamModel.find({ userEmail: authUser.email }).sort({ createdAt: -1 }).exec();
    return plainToInstance(ScamListOutDto, scams, {
      excludeExtraneousValues: true,
    });
  }

  async getScam(search: SearchScamDto, limit?: string): Promise<ScamListOutDto[]> {
    const query = { status: Status.Approved };
    if (search.text) query['$text'] = { '$search': search.text };

    const dbQuery = this.scamModel.find(query).sort({ createdAt: -1 });
    if (limit) dbQuery.limit(parseInt(limit));

    const scamList = await dbQuery.exec();
    return plainToInstance(ScamListOutDto, scamList, {
      excludeExtraneousValues: true
    });
  }

  async getScamList(): Promise<ScamListAdminOutDto[]> {

    const scamList = await this.scamModel.find().sort({ createdAt: -1 }).exec();
    return plainToInstance(ScamListAdminOutDto, scamList, {
      excludeExtraneousValues: true,
    });
  }

  async deleteScam(authUser: IAuthUser, scamId: string): Promise<ScamListAdminOutDto> {
    const scam = await this.scamModel.findById(scamId);
    if (!scam) throw new NotFoundException();

    let allowDelete = false;

    if (authUser.email == scam.userEmail) allowDelete = true;
    if (authUser.roles.includes(Role.Admin)) allowDelete = true;

    if (!allowDelete) throw new ForbiddenException();

    await scam.remove();

    return plainToInstance(ScamListAdminOutDto, scam, {
      excludeExtraneousValues: true,
    })
  }

  async getScamTypes(): Promise<ScamTypeDto[]> {
    const defaultScamTypes = [
      { name: 'Website Scam' },
      { name: 'Email Scam' },
      { name: 'Double shah Scam' },
      { name: 'Other' }
    ];

    let stypes = await this.scamType.find().exec();

    if (stypes.length == 0) {
      await this.scamType.insertMany(defaultScamTypes);
      stypes = await this.scamType.find().exec();
    }

    return plainToInstance(ScamTypeDto, stypes, {
      excludeExtraneousValues: true,
    });
  }

  async getSubscriptionList(): Promise<SubscriptionOutDto[]> {
    const subscriptions = await this.subscriptionModel.find()
      .populate([
        { path: 'user', model: 'User' }
      ]).exec();

    // return subscriptions;
    return plainToInstance(SubscriptionOutDto, subscriptions, {
      excludeExtraneousValues: true,
    })
  }

  async subscribeNewsLetter(input: SubscribeNewsLetterDto) {

    const userAccount = await this.userModel.findOne({ email: input.email });

    await this.subscriptionModel.updateOne({ email: input.email }, {
      user: userAccount ? userAccount._id : null,
      email: input.email,
    }, { upsert: true });

    return { message: 'Subscribed to Newsletter' };
  }

  async checkScam(url: string): Promise<ScamCheckResult | Error> {
    return new Promise((resolve, reject) => {
      const BASE = this.configService.get<string>('url.scam');
      this.httpService.post<ScamCheckResult>(`${BASE}/check`, { url }).pipe(
        tap({
          next: resp => { this.logger.log(`[POST] ${BASE}/check ${resp.status}`) },
          error: error => { reject(error) }
        }),
      ).subscribe({
        next: api => resolve(api.data),
        error: error => reject(error.message)
      });
    });
  }

  async updateScam(authUser: IAuthUser, scamId: string, input: UpdateScamDto): Promise<ScamOutDto> {
    const scam = await this.scamModel.findById(scamId);
    if (!scam) throw new NotFoundException();

    let isAllowedOp = false;

    if (authUser.roles.includes(Role.Admin)) isAllowedOp = true;
    if (scam.userEmail == authUser.email) isAllowedOp = true;

    if (!isAllowedOp) throw new ForbiddenException();

    Object.assign(scam, input);
    await scam.save();

    return plainToInstance(ScamOutDto, scam, {
      excludeExtraneousValues: true,
    });
  }

  async scamStats() {
    const totalScamReported = await this.scamModel.find().count();
    const totalSubscribers = await this.subscriptionModel.find().count();
    const approvedScams = await this.scamModel.find({ status: Status.Approved }).count();
    const pendingScams = await this.scamModel.find({ status: Status.Pending }).count();

    return {
      subscribers: totalSubscribers,
      scams: {
        total: totalScamReported,
        approved: approvedScams,
        pending: pendingScams
      }
    }
  }

  async addScamComment(authUser: IAuthUser, scamId: string, input: AddCommentDto) {
    const scam = await this.scamModel.findById(scamId);
    if (!scam) throw new NotFoundException();

    input['author'] = authUser.sub;
    input['scam'] = scamId;

    const comment = new this.commentModel(input);

    await comment.save();
    await comment.populate({ path: 'author', model: 'User' });

    const commentOut = plainToInstance(CommentOut, comment, {
      excludeExtraneousValues: true,
    });

    return commentOut;
  }

  async getScamComments(scamId: string): Promise<CommentOut[]> {
    const comments = await this.commentModel.find({ scam: scamId }).populate([
      { path: 'author', model: 'User' }
    ]);

    return plainToInstance(CommentOut, comments, {
      excludeExtraneousValues: true,
    });
  }

  async getMyStats(authUser: IAuthUser) {
    const totalReportedScams = await this.scamModel.find({ userEmail: authUser.email }).count();
    const totalSubscription = await this.subscriptionModel.find({ email: authUser.email }).count();

    return {
      totalReportedScams,
      isNewsSubscribed: totalSubscription > 0
    }
  }

  async updateScamStatus(scamId: string, input: UpdateStatusDto) {

    const scam = await this.scamModel.findById(scamId);
    if (!scam) throw new NotFoundException();

    scam.status = input.approve ? Status.Approved : Status.Rejected;
    await scam.save();

    return plainToInstance(ScamListAdminOutDto, scam, {
      excludeExtraneousValues: true,
    });
  }

}