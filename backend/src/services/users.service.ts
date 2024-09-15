import { v4 as uuidv4 } from "uuid";
import { User } from "../schemas/users.schema.js";
import userList from "../../mockData/users.js";

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

export function updateOne(id: string, userToUpdate: User): Promise<Result> {
  return new Promise((resolve) => {
    const userIndex = userList.findIndex((user) => user.id === id);
    if (userIndex < 0) {
      return resolve({ data: null });
    }
    userToUpdate.id = id;
    const { id: idToUpdate, ...restOfData } = userToUpdate;
    userList[userIndex] = { id: idToUpdate, ...restOfData };
    return resolve({ data: userList[userIndex] });
  });
}

export function deleteOne(id: string): Promise<Result> {
  return new Promise((resolve) => {
    const userIndex = userList.findIndex((user) => user.id === id);
    if (userIndex < 0) {
      return resolve({ data: null });
    }
    userList.splice(userIndex, 1);
    return resolve({ data: "Removed" });
  });
}

export const UsersServices = {
  getData,
  getOneData,
  createOne,
  updateOne,
  deleteOne,
};
