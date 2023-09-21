import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOfficialStoreDto } from './dto/create-official-store.dto';
import { UpdateOfficialStoreDto } from './dto/update-official-store.dto';
import { OfficialStore } from './entities/official-store.entity';
import { Request } from 'express';

@Injectable()
export class OfficialStoresService {
  constructor(
    @InjectModel('OfficialStore') private OfficialStore: Model<OfficialStore>,
  ) { }

  async create(createOfficialStoreDto: CreateOfficialStoreDto) {
    const officialStore = await this.OfficialStore.create(createOfficialStoreDto);
    const data = {
      ...officialStore,
      followers_count: officialStore.followers.length
    }
    delete data.followers;
    return officialStore;
  }

  async findAll() {
    const officialStores = await this.OfficialStore.find().lean();
    const data = officialStores.map(officialStore => {
      return {
        ...officialStore,
        followers_count: officialStore.followers.length
      }
    }
    );

    data.forEach(officialStore => {
      delete officialStore.followers;
    });

    return data
  }

  async findOne(id: string, req: Request) {
    const userId = req['user'].id;

    const officialStore = await this.OfficialStore.findById(id).lean();
    const data = {
      ...officialStore,
      isFollowing: false,
      followers_count: officialStore.followers.length
    }

    // check if user has followed this official store
    const isFollowing = data.followers.includes(userId);

    if (isFollowing) {
      data.isFollowing = true;
    } else {
      data.isFollowing = false;
    }

    delete data.followers;
    return data
  }

  async follow(id: string, req: Request) {
    const userId = req['user'].id;

    const officialStore = await this.OfficialStore.findById(id).lean();

    const isFollowing = officialStore.followers.includes(userId);
    let result = new this.OfficialStore()

    if (isFollowing) {
      const index = officialStore.followers.indexOf(userId);
      officialStore.followers.splice(index, 1);

      result = await this.OfficialStore.findByIdAndUpdate(id, officialStore, { new: true }).lean();
    } else {
      officialStore.followers.push(userId);
      result = await this.OfficialStore.findByIdAndUpdate(id, officialStore, { new: true }).lean();
    }

    const data = {
      ...result,
      isFollowing: !isFollowing,
      followers_count: result.followers.length
    }

    delete data.followers;
    return data
  }

  async update(id: string, updateOfficialStoreDto: UpdateOfficialStoreDto) {
    const officialStore = await this.OfficialStore.findByIdAndUpdate(id, updateOfficialStoreDto, { new: true }).lean();

    const data = {
      ...officialStore,
      followers_count: officialStore.followers.length
    }

    delete data.followers;
    return data
  }

  remove(id: string) {
    return this.OfficialStore.findByIdAndDelete(id).lean();
  }
}
