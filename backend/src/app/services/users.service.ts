import { v4 as uuidv4 } from "uuid";
import { User } from "../schemas/users.schema";
import userList from "../mockData/users";

interface Result {
  data: User[] | User | string | null;
}

export function getData(): Promise<Result> {
  return new Promise((resolve) => {
    return resolve({ data: userList });
  });
}

export function getOneData(id: string): Promise<Result> {
  return new Promise((resolve) => {
    const userResult = userList.find((user) => user.id === id);
    return resolve({ data: !userResult ? null : userResult });
  });
}

export function createOne(user: User): Promise<Result> {
  return new Promise((resolve) => {
    user.id = uuidv4();
    const { id, ...restOfData } = user;
    userList.push({ id, ...restOfData });
    return resolve({ data: userList[userList.length - 1] });
  });
}


export const UsersServices = {
  getData,
  getOneData,
  createOne,
};
