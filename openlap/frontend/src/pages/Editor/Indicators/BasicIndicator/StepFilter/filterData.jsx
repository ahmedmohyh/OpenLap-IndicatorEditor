import {v4 as uuid4} from "uuid";

export const resultOperator = [
  {id: "$gt", name: "Greater than"},
  {id: "$gte", name: "Greater and equal than"},
  {id: "$lt", name: "Less than"},
  {id: "$lte", name: "Less and equal than"},
  {id: "$eq", name: "Equals"}
];

export const users = [
  {id: uuid4(), operatorId: "", name: "All users"},
  {id: uuid4(), operatorId: "$ne", name: "All users excluding my data"},
];