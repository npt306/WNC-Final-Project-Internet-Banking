import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { comparePasswordHelper, hashPasswordHelper } from '@/helpers/utils';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async findById(id: string) {
    return await this.adminRepository.findOneBy({ _id: new ObjectId(id) });
  }

  async validateUser(username: string, pass: string) {
    const user = await this.adminRepository.findOneBy({
      username: username,
    });
    if (!user) return null;
    const isValidPassword = await comparePasswordHelper(pass, user.password);

    if (!user || !isValidPassword) return null;
    return user;
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    if (
      await this.adminRepository.findOneBy({
        username: createAdminDto.username,
      })
    ) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await hashPasswordHelper(createAdminDto.password);

    const newAdmin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    const savedAdmin = await this.adminRepository.save(newAdmin);

    return savedAdmin;
  }

  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  async findOne(id: string): Promise<Admin> {
    const findAdmin = await this.adminRepository.findOneBy({
      _id: new ObjectId(id),
    });
    if (!findAdmin) {
      throw new NotFoundException(`Admin not found`);
    }
    return findAdmin;
  }

  async update(id: string, updateData: Partial<Admin>): Promise<Admin> {
    await this.findOne(id);
    await this.adminRepository.update({ _id: new ObjectId(id) }, updateData);
    const updatedAdmin = await this.findOne(id);

    return updatedAdmin;
  }

  async remove(id: string): Promise<Admin> {
    const removedAdmin = await this.findOne(id);
    await this.adminRepository.delete({ _id: new ObjectId(id) });
    return removedAdmin;
  }
}
