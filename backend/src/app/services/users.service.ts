import { injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import { User } from "@/app/schemas/users.schema";
import userList from "@/app/mockData/users";
import { IUsersService } from "@/app/types/interfaces";

@injectable()
export class UsersService implements IUsersService {
  public async getData(): Promise<User[]> {
    return userList;
  }

  public async getOneData(id: string): Promise<User | null> {
    const userResult = userList.find((user) => user.id === id);
    return userResult || null;
  }

  public async createOne(user: User): Promise<User> {
    user.id = uuidv4();
    const { id, ...restOfData } = user;
    userList.push({ id, ...restOfData });
    return userList[userList.length - 1];
  }
}