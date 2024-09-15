import { User } from "../src/schemas/users.schema.js";
const userList: User[] = [
  {
    id: "cb8e7129-ce80-4cc1-8351-11a2d7350cd3",
    name: "Vic",
    lastName: "Lop",
    email: "some@example.com",
    birthDate: new Date("2024-12-12"),
  },
  {
    id: "d771d052-f565-4424-a741-b4bb46081d6c",
    name: "jos",
    lastName: "Lop",
    email: "some2@example.com",
    birthDate: new Date("2024-11-11"),
  },
];

export default userList;
