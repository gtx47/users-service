import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../domain/entities/user.entity';
import {
  UpdateUserChanges,
  UpsertUserData,
  UserRepositoryPort,
} from '../../domain/ports/user.repository.port';
import { USER_MODEL_NAME, UserDocument, UserMongo } from './user.schema';

@Injectable()
export class MongoUserRepository implements UserRepositoryPort {
  constructor(
    @InjectModel(USER_MODEL_NAME)
    private readonly userModel: Model<UserMongo>,
  ) {}

  async findAll(): Promise<User[]> {
    const docs = await this.userModel.find().exec();
    return docs.map((d) => this.toDomain(d));
  }

  async findById(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.userModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async update(id: string, changes: UpdateUserChanges): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.userModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async upsertByEmail(data: UpsertUserData): Promise<User> {
    const email = data.email.toLowerCase().trim();
    const doc = await this.userModel
      .findOneAndUpdate(
        { email },
        { $set: { name: data.name, email, role: data.role } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .exec();
    return this.toDomain(doc as UserDocument);
  }

  private toDomain(doc: UserDocument): User {
    return new User({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      role: doc.role,
    });
  }
}
